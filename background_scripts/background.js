browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url) {
    return;
  }
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
    if (tabId == tabs[0].id) {
      if (tabs[0].url.match(/^https?:\/\/www\.youtube\.com.*$/)) {
        browser.pageAction.show(tabs[0].id);
      } else {
        browser.pageAction.hide(tabs[0].id);
      }
    }
  });
});
