chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId === 0) {
    const data = await chrome.storage.local.get([`tz_${details.tabId}`, 'tz_global']);
    const targetTz = data[`tz_${details.tabId}`] || data['tz_global'];

    if (targetTz) {
      // Set the extension icon badge
      chrome.action.setBadgeText({ text: 'ON', tabId: details.tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId: details.tabId });

      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        world: "MAIN",
        injectImmediately: true,
        func: (timezone) => {
          const OriginalDateTimeFormat = Intl.DateTimeFormat;
          Intl.DateTimeFormat = function(locales, options) {
            options = options || {};
            if (!options.timeZone) {
              options.timeZone = timezone;
            }
            return new OriginalDateTimeFormat(locales, options);
          };
          Intl.DateTimeFormat.prototype = OriginalDateTimeFormat.prototype;
          Intl.DateTimeFormat.supportedLocalesOf = OriginalDateTimeFormat.supportedLocalesOf;

          const originalDate = Date;
          class MockDate extends originalDate {
            constructor(...args) {
              super(...args);
            }
            toString() {
              return new OriginalDateTimeFormat('en-US', {
                timeZone: timezone,
                timeZoneName: 'longOffset',
                weekday: 'short', year: 'numeric', month: 'short', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
              }).format(this);
            }
          }
          
          Object.getOwnPropertyNames(originalDate).forEach(prop => {
            if (typeof originalDate[prop] === 'function') {
              MockDate[prop] = originalDate[prop];
            }
          });

          MockDate.prototype.getTimezoneOffset = function() {
            const offsetStr = new OriginalDateTimeFormat('en-US', {
              timeZone: timezone,
              timeZoneName: 'shortOffset'
            }).format(this);
            
            const match = offsetStr.match(/GMT([+-])?(\d{1,2})?:?(\d{2})?/);
            if (match && match[0] !== 'GMT') {
              const sign = match[1] === '+' ? -1 : 1;
              const hours = parseInt(match[2] || 0, 10);
              const mins = parseInt(match[3] || 0, 10);
              return sign * ((hours * 60) + mins);
            }
            return 0; 
          };

          window.Date = MockDate;

          // Inject Visual Tab Modifications
          const applyTitle = () => {
            if (document.title && !document.title.startsWith(`[ZoneDrift: ${timezone}]`)) {
              document.title = `[ZoneDrift: ${timezone}] ` + document.title.replace(/\[ZoneDrift: .*?\] /, '');
            }
          };

          const setupObserver = () => {
            applyTitle();
            const target = document.querySelector('title') || document.head;
            if (target) {
              new MutationObserver(applyTitle).observe(target, { childList: true, characterData: true, subtree: true });
            }
          };

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupObserver);
          } else {
            setupObserver();
          }
        },
        args: [targetTz]
      }).catch(err => console.error('ZoneDrift injection error:', err));
    } else {
      // Clear the extension icon badge
      chrome.action.setBadgeText({ text: '', tabId: details.tabId });
    }
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  await chrome.storage.local.remove(`tz_${tabId}`);
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'https://webbrowsertools.com/timezone/' });
  }
});
