const ADDRESS = '0x32Be343B94f860124dC4fEe278FDCBD38C102D88';

// Socket.IO features
var socket = io(`http://nodejs.nyc.path.network:3000` + '/path');
var start = new Date();

// Should be implemented in a different way, IE using Flux as this is mutable
// and should be an immutable object with update functions
let storage = chrome.storage.sync;
let status = true;
let submissions = 0;
let accepted = 0;
let uuid = '';

// Array
let dns = {};

const getJob = () => $.get(`https://api.path.network/miner/jobs`);
const getUuid = () => $.get(`https://api.path.network/miner/uuid`);

// Socket.IO Logic
socket.on('connect', function () {
    var index = socket.io.engine.upgrade ? 1 : 0;
    console.log(socket.io.engine.transports[index] + '.');
});

socket.on('message-all', function (data) {
    console.log(data);
});

socket.on('message-room', function (data) {
    console.log(data);
    httpCheck(data);
});

// Event Handler to Launch
document.addEventListener('DOMContentLoaded', () => {
    pathInit();
    // Perform DNS health check every 60 seconds
    setInterval(dnsSubmit, 600000);
  }
);

// Local Message Passing
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.greeting === 'getSubmitted') {
    sendResponse({ submitted: submissions });
  }

  if (request.greeting === 'toggleStatus') {
    status = !status;
    sendResponse({ running: status ? 'Enabled' : 'Disabled' });
  }

  if (request.greeting === 'getStatus') {
    sendResponse({ running: status ? 'Enabled' : 'Disabled' });
  }
});

// Snag Headers to detect DNS Anomalies (Poisoning, Hijacking, etc)
chrome.webRequest.onCompleted.addListener(
  function(details) {
    var host = /^(?:(\w+):)?\/\/([^\/\?#]+)/.exec(details["url"]);
    if(details["ip"]) {
      if(dns[host[2]]) {
        if(dns[host[2]].includes(details["ip"])) {
          return 1;
        } else {
          dns[host[2]] = details["ip"] + ", " + dns[host[2]];
        }
      } else {
        dns[host[2]] = details["ip"];
      }
    }
  },
  {urls: ["<all_urls>"]},
  []
);

// Read UUID from storage, return it if it exists.
function pathInit() {
  storage.get(['uuid', 'key'], function(items) {
    if(items['uuid']) {
      uuid = items['uuid'];
      $.post('https://api.path.network/miner/uuid', {
        uuid: uuid
      });
      return 1;
    } else {
      getUuid().done(function(data, status, xhr) {
        uuid = data;
        storage.set({'uuid': uuid}, function(result) {
          if(result) {
            console.log(result);
          }
          return 1;
        });
      });
    }
  });
}

function dnsSubmit() {
  $.post('https://api.path.network/miner/dns', { dnsData: dns }).done(function(data, status, xhr) {
    return 1;
  });
}

// A note on .then vs .always: we want the "check" request implemented using
// always to ensure that even if the request fails, the result is submitted.
function httpCheck(target) {
  if (!status) return false;
  getJob().done(function(data, status, xhr) {
    var start_time = new Date().getTime();
    $.get( data ).always(function(data, status, xhr) {
      var request_time = new Date().getTime() - start_time;
      submissions += 1;
      $.post('https://api.path.network/', { wallet_address: ADDRESS, result: xhr.status }).done(function(data, status, xhr) {
        accepted += 1;
      });
    });
  });
}

// Utilities
function str2ab(str) {
  var buf = new Int8Array(str.length);

  for (var i=0, strLen=str.length; i < strLen; i++) {
    buf[i] = str.charCodeAt(i);
  }

  return buf.buffer;
}
