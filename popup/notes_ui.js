function setData(message) {
  /* Handles the video data sent from the video_data_getter content script.
    Message is a JSON object with pauseTime.
  */
  var pauseTime = message.pauseTimeKey;
  var pauseElement = document.getElementById("pauseTime");
  pauseElement.textContent = pauseTime;

}

function getTitleAndVideoId() {
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
    var tab = tabs[0];

    var browserTitle = tab.title;
    var videoTitle = browserTitle.substring(0, browserTitle.length - 10);  // removes " - YouTube"

    var url = tab.url;
    var suffix = url.split("?v=")[1];
    var videoId = suffix.split("&")[0];
    // return the vals
  });
}

browser.runtime.onMessage.addListener(setData);

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("finish")) {
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {tab: tabs[0]});
      window.close();
    });
  }
});

browser.tabs.executeScript(null, { file: "/content_scripts/video_data_getter.js" });
browser.tabs.executeScript(null, { file: "/content_scripts/video_unpauser.js" });
