// Removed param e as it is never used within fn
// Rewrote in es6
const jobs = () => {
  chrome.runtime.sendMessage({ greeting: 'getSubmitted' }, response =>
    $('#jobs').text(response.submitted)
  );
  chrome.runtime.sendMessage({ greeting: 'getStatus' }, response =>
    $('#status').text(response.running)
  );
};

document.addEventListener('DOMContentLoaded', () => self.setInterval(jobs, 500));

// Chaining on same document
document
  .getElementById('statusToggle')
  .addEventListener('click', () =>
    chrome.runtime.sendMessage({ greeting: 'toggleStatus' }, response =>
      $('#status').text(response.running)
    )
  );
