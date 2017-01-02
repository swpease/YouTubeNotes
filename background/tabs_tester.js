browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.match(/^.*:\/\/.*\.youtube\..*\/watch.*/)) {
    browser.pageAction.show(tab.id);
  }
  else {
    browser.pageAction.hide(tab.id);
  }
});
