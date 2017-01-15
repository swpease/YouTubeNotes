function getVideoId() {
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
    var tab = tabs[0];

    var url = tab.url;
    var suffix = url.split("?v=")[1];
    var videoId = suffix.split("&")[0];

    return videoId;
  });
}

function getVideoTitle() {
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
    var tab = tabs[0];

    var browserTitle = tab.title;
    var videoTitle = browserTitle.substring(0, browserTitle.length - 10);  // removes " - YouTube"

    return videoTitle;
  });
}

// inject page action, yt_notes, send over id adn title
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.match(/^.*:\/\/.*\.youtube\..*\/watch.*/)) {
    browser.pageAction.show(tab.id);
    browser.tabs.executeScript(null, { file: "/content_scripts/yt_notes.js" });

    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      var videoId = getVideoId();
      var videoTitle = getVideoTitle();
      browser.tabs.sendMessage(tabs[0].id, {id: videoId, title: videoTitle});
    });

  }
  else {
    browser.pageAction.hide(tab.id);
  }
});
