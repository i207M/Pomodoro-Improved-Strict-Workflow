/*
  Localization
*/

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

/*
  Form interaction
*/

var form = document.getElementById('options-form'),
  siteListEl = document.getElementById('site-list'),
  whitelistEl = document.getElementById('blacklist-or-whitelist'),
  showNotificationsEl = document.getElementById('show-notifications'),
  shouldRingEl = document.getElementById('should-ring'),
  shouldBGMEl = document.getElementById('should-BGM'),
  clickRestartsEl = document.getElementById('click-restarts'),
  saveSuccessfulEl = document.getElementById('save-successful'),
  timeFormatErrorEl = document.getElementById('time-format-error'),
  goalEl = document.getElementById('goal'),
  background = chrome.extension.getBackgroundPage(),
  startCallbacks = {}, durationEls = {};

durationEls['work'] = document.getElementById('work-duration');
durationEls['break'] = document.getElementById('break-duration');
durationEls['long_break'] = document.getElementById('long-break-duration');
element_goal = document.getElementById('goal')

var TIME_REGEX = /^([0-9]+)(:([0-9]{2}))?$/;

form.onsubmit = function () {
  console.log("form submitted");
  var durations = {}, duration, durationStr, durationMatch;

  for (var key in durationEls) {
    durationStr = durationEls[key].value;
    durationMatch = durationStr.match(TIME_REGEX);
    if (durationMatch) {
      console.log(durationMatch);
      durations[key] = (60 * parseInt(durationMatch[1], 10));
      if (durationMatch[3]) {
        durations[key] += parseInt(durationMatch[3], 10);
      }
    } else {
      timeFormatErrorEl.className = 'show';
      return false;
    }
  }

  console.log(durations);

  background.setPrefs({
    siteList: siteListEl.value.split(/\r?\n/),
    durations: durations,
    showNotifications: showNotificationsEl.checked,
    shouldRing: shouldRingEl.checked,
    shouldBGM: shouldBGMEl.checked,
    clickRestarts: clickRestartsEl.checked,
    whitelist: whitelistEl.selectedIndex == 1,
    sessions: background.PREFS.sessions,
    goal: goalEl.value
  })
  saveSuccessfulEl.className = 'show';
  return false;
}

siteListEl.onfocus = formAltered;
goalEl.onfocus = formAltered;
showNotificationsEl.onchange = formAltered;
shouldRingEl.onchange = formAltered;
shouldBGMEl.onchange = formAltered;
clickRestartsEl.onchange = formAltered;
whitelistEl.onchange = formAltered;

function formAltered() {
  saveSuccessfulEl.removeAttribute('class');
  timeFormatErrorEl.removeAttribute('class');
}

siteListEl.value = background.PREFS.siteList.join("\n");
goalEl.value = background.PREFS.goal;
showNotificationsEl.checked = background.PREFS.showNotifications;
shouldRingEl.checked = background.PREFS.shouldRing;
shouldBGMEl.checked = background.PREFS.shouldBGM;
clickRestartsEl.checked = background.PREFS.clickRestarts;
whitelistEl.selectedIndex = background.PREFS.whitelist ? 1 : 0;

var duration, minutes, seconds;
for (var key in durationEls) {
  duration = background.PREFS.durations[key];
  seconds = duration % 60;
  minutes = (duration - seconds) / 60;
  if (seconds >= 10) {
    durationEls[key].value = minutes + ":" + seconds;
  } else if (seconds > 0) {
    durationEls[key].value = minutes + ":0" + seconds;
  } else {
    durationEls[key].value = minutes;
  }
  durationEls[key].onfocus = formAltered;
}

function setInputDisabled(state) {
  siteListEl.disabled = state;
  whitelistEl.disabled = state;
  for (var key in durationEls) {
    durationEls[key].disabled = state;
  }
  element_goal.disabled = state
}

startCallbacks.work = function () {
  document.body.className = 'work';
  setInputDisabled(true);
}

startCallbacks.break = function () {
  document.body.removeAttribute('class');
  setInputDisabled(false);
}

startCallbacks.long_break = function () {
  document.body.removeAttribute('class');
  setInputDisabled(false);
}

var daily_count = document.getElementById("daily_count")
var count_str = JSON.stringify(background.PREFS.sessions)
count_list = count_str.substring(1, count_str.length - 1).replace(/"/g, '').replace(/:/g, ': ').split(',').sort().join('<br>')
daily_count.innerHTML = count_list

if (background.mainPomodoro.mostRecentMode == 'work') {
  startCallbacks.work();
}
