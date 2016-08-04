// IP
function getIP() {
  return document.getElementById("editIP").value;
}

function setIP(ip) {
  document.getElementById("editIP").value = ip;
}

// Port
function getPort() {
  return document.getElementById("editPort").value;
}

function setPort(port) {
  document.getElementById("editPort").value = port;
}

// TimeInterval
function updateSlider(time) {
  var text = "";

  var value = time * 15;

  var h = value / 3600;
  var min = (value % 3600) / 60;
  var sec = value % 60;

  if(sec >= 1) {
    text = text + Math.floor(sec) + "s";
  }
  if(min >= 1) {
    text = Math.floor(min) + "m " + text;
  }
  if(h >= 1) {
    text = text + Math.floor(h) + "h";
  }

  document.getElementById("chosenTime").innerHTML = text;
}

function setSlider(value) {
  document.getElementById("slTime").value = value;
}

// Level
function getLevel() {
  return document.getElementById("level").value;
}

function setLevel(level) {
  document.getElementById("level").value = level;
}

function createURL() {
  var https = "https://";
  var ref = "/checkForAuthToken?level=";
  var refHMAC = "?hmac=";

  var url = https + getIP() + ":" + getPort() + ref + getLevel().substring(getLevel().length -1, getLevel().length);
  if(getLevel() == "lvl3") {
    url += url + refHMAC + getHMAC();
  }

  console.log("[create URL]: " + url);
  return url;
}

// HMAC
function getHMAC() {
  return document.getElementById("editHmac").value;
}

function setHMAC(hmac) {
  document.getElementById("editHmac").value = hmac;
}

// validation
function checkIP() {
  var ip = getIP();
  if(ip.length == 0) {
    return false;
  } else if(ip == "localhost") {
    return true;
  } else {
    if(/^(([01]?\d\d?|2[0-4]\d|25[0-5])\.){3}([01]?\d\d?|2[0-4]\d|25[0-5])$/.test(ip)) {
      return true;
    } else {
      return false;
    }
  }
}

function checkPort() {
  var port = getPort();
  if(port.length == 0) {
    return false;
  } else {
    if(/^[0-9]+$/.test(port)) {
      return true;
    } else {
      return false;
    }
  }
}


self.port.on("validate", function() {
  console.log("(panel) validate");
  validateAPIInfo();
});

// TODO url is not being sent back to "index.js"
// SHOULD have a 'addon' global object, which allows to send msgs
// possible fix: http://stackoverflow.com/questions/26487451/addon-is-undefined-in-panel-firefox-addon

function validateAPIInfo() {
  console.log("[validateAPIInfo]");
  if(getLevel() == "lvl1" || getLevel() == "lvl2") {
    if(checkIP() && checkPort()) {
      console.log(" - SUCCESS");
      self.port.emit("validated", createURL());
      console.log("(panel -> index) - validated");
    } else {
      console.log(" - FAIL")
      self.port.emit("failed", "wrong ip/port");
      console.log("(panel -> index) - validated");
    }
  } else if(getLevel() == "lvl3") {
    if(getHMAC().length != 0) {
      if(checkIP() && checkPort()) {
        console.log(" - SUCCESS")
        self.port.emit("validated", createURL());
        console.log("(panel -> index) - validated");
      } else {
        console.log(" - FAIL")
        self.port.emit("failed", "wrong ip/port");
        console.log("(panel -> index) - validated");
      }
    } else {
      console.log(" - FAIL")
      self.port.emit("failed", "HMAC missing");
      console.log("(panel -> index) - validated");
      // return false;
    }
  } else {
    console.log(" - FAIL")
    self.port.emit("failed", "sth. went wrong! :o");
    console.log("(panel -> index) - validated");
    // return false;
  }
}
