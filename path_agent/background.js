const ADDRESS = '0x32Be343B94f860124dC4fEe278FDCBD38C102D88';
// Should be implemented in a different way, IE using Flux as this is mutable
// and should be an immutable object with update functions
let status = true;
let submissions = 0;
let accepted = 0;

const getJob = () => fetch(`https://api.path.network/?wallet_address=${ADDRESS}`);

// A note on .then vs .always: we want the "check" request implemented using
// always to ensure that even if the request fails, the result is submitted.
function pathMain() {
  if (!status) return false;

  getJob().then(({ data }) =>
    fetch(data).always(res => {
      submissions += 1;
      $.post('https://api.path.network/', {
        wallet_address: ADDRESS,
        result: res.status
      });
    })
  );
}

document.addEventListener('DOMContentLoaded', () =>
  statusself.setInterval(pathMain, 2000)
);

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
