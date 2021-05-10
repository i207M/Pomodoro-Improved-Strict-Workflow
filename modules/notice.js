// Localize all elements with a data-i18n="message_name" attribute
var localizedElements = document.querySelectorAll("[data-i18n]"),
  el,
  message;
for (var i = 0; i < localizedElements.length; i++) {
  el = localizedElements[i];
  message = chrome.i18n.getMessage(el.getAttribute("data-i18n"));

  // Capitalize first letter if element has attribute data-i18n-caps
  if (el.hasAttribute("data-i18n-caps")) {
    message = message.charAt(0).toUpperCase() + message.substr(1);
  }

  el.innerHTML = message;
}

background = chrome.extension.getBackgroundPage();
tomatoImageEl = document.getElementById("tomato-img");
noticeContentEl = document.getElementById("notice-content");
buttonEl = document.getElementById("continue-button");
noticeTimeEl = document.getElementById("notice-time");

var nextMode = background.mainPomodoro.nextMode;
tomatoImageEl.src =
  "../icons/" + background.getIconMode(nextMode) + "_full.png";
noticeContentEl.innerHTML = chrome.i18n.getMessage(
  "timer_end_notification_body",
  chrome.i18n.getMessage(nextMode)
);
noticeTimeEl.innerHTML = new Date().toString();

function startAndClose() {
  background.startPomodoro();
  window.close();
}

buttonEl.onclick = startAndClose;

document.onkeydown = function (event) {
  var code = event.key;
  if (code == "Enter") {
    startAndClose();
  }
};

chrome.windows.getCurrent(function (window) {
  chrome.windows.update(window.id, { drawAttention: true });
});
