// Localize all elements with a data-i18n="message_name" attribute
var localizedElements = document.querySelectorAll('[data-i18n]'), el, message;
for (var i = 0; i < localizedElements.length; i++) {
    el = localizedElements[i];
    message = chrome.i18n.getMessage(el.getAttribute('data-i18n'));

    // Capitalize first letter if element has attribute data-i18n-caps
    if (el.hasAttribute('data-i18n-caps')) {
        message = message.charAt(0).toUpperCase() + message.substr(1);
    }

    el.innerHTML = message;
}

background = chrome.extension.getBackgroundPage();
tomatoImageEl = document.getElementById('tomato-img');
tomatoImageEl.src = "../icons/" + background.getIconMode(background.mainPomodoro.nextMode) + "_full.png";

chrome.windows.getCurrent(function (window) {
    chrome.windows.update(window.id, { drawAttention: true })
});


