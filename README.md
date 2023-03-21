# JavaScript Botnet
Javascript based botnet for post explotation
![alt text](https://github.com/fazelastblood/ByteNET/raw/main/repo/dashboard.PNG)

## Introduction
This is a JavaScript botnet that is designed to allow remote control of multiple bots via a command and control (C2) server. It is built using Flask and supports GET route requests to communicate with the C2 server and heartbeats to keep an updated connection. The login system uses SHA256 password hashes to verify user credentials.

## Setting up the Botnet
     1. Run run.py and set a username and password.
     2. Install the required dependencies by running pip install -r requirements.txt.
     3. Run main.py.
     4. Navigate to 127.0.0.1:5000/ in your web browser.
     5. Enter your login credentials.
     6. To set the server to public, change the public variable in the Python file to True and update the server URL in main.py.
# Disclaimer
#### This project is for educational purposes only. It is not intended to be used for malicious purposes.

## Features
### Payloads
![alt text](https://github.com/fazelastblood/ByteNET/raw/main/repo/payload.PNG)

The payload tab allows users to input JavaScript code to inject into targeted machines. This can be used to execute arbitrary code, such as taking screenshots or stealing sensitive information.

## Results
![alt text](https://github.com/fazelastblood/ByteNET/raw/main/repo/results.PNG)

The results menu displays the list of connected bots and provides a way to send commands to individual bots. Users can also view the responses from the bots.

## Attack Panel
![alt text](https://github.com/fazelastblood/ByteNET/raw/main/repo/atkpanel.jpg)

The attack panel provides a range of options for attacking targeted machines, including embedding JavaScript, redirecting users to a specific website, removing bots from the network, capturing screenshots, grabbing cookies and local storage data, and tracking the location of the machine.

## Reverse Shell
![alt text](https://github.com/fazelastblood/ByteNET/raw/main/repo/reverseshell.PNG)

The reverse shell provides a popup shell for direct connection into the bot. This can be useful for direct interaction with the bot and executing custom commands.

Credits
This project was created by Matt. If you have any questions or suggestions, please contact me.
