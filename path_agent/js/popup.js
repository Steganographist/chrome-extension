function jobs(e) {
  chrome.runtime.sendMessage({greeting: "getSubmitted"}, function(response) {
    $("#jobs").text(response.submitted);
  });
  chrome.runtime.sendMessage({greeting: "getStatus"}, function(response) {
    $("#status").text(response.running);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  self.setInterval(jobs, 500);
});

document.getElementById("statusToggle").addEventListener("click", function(){
  chrome.runtime.sendMessage({greeting: "toggleStatus"}, function(response) {
    $("#status").text(response.running);
  });
});
