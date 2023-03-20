import hashlib

required_packages = [
    "Flask==2.1.0",
    "Flask-Cors==3.0.10",
    "geopy==2.2.0",
]

with open("requirements.txt", "w") as f:
    for package in required_packages:
        f.write(package + "\n")

with open("config.json", "w") as f:
    f.close()

username = input("Enter A Username: ")
password = input("Enter A PassWord: ")

import json


def load_config():
    try:
        with open('config.json', 'r') as f:
            if f.read(1):
                f.seek(0)
                config = json.load(f)
            else:
                config = {}
    except FileNotFoundError:
        config = {}
    return config

def save_user(username, password):
    config = load_config()
    config[username] = password
    with open('config.json', 'w') as f:
        json.dump(config, f)

# Example usage:
save_user(username, hashlib.sha256(bytes(password, "utf-8")).hexdigest())