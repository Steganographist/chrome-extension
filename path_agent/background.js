var submissions = 0;
var accepted = 0;
var status = 'Enabled';
var address = '0x32Be343B94f860124dC4fEe278FDCBD38C102D88';

function pathMain(e) {
  var data;
  if(status == 'Enabled') {
    $.get( 'https://api.path.network/?wallet_address=' + address ).done(function(data, status, xhr) {
      var start_time = new Date().getTime();
      $.get( data ).always(function(data, status, xhr) {
        var request_time = new Date().getTime() - start_time;
        submissions += 1;
        $.post('https://api.path.network/', { wallet_address: address, result: xhr.status }).done(function(data, status, xhr) {
          accepted += 1;
        });
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  self.setInterval(pathMain, 2000);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "getSubmitted") {
      sendResponse({submitted: submissions});
    }
    if (request.greeting == "toggleStatus") {
      if(status == 'Enabled') {
        status = 'Disabled';
      } else {
        status = 'Enabled';
      }
      sendResponse({running: status});
    }
    if (request.greeting == "getStatus") {
      sendResponse({running: status});
    }
});
