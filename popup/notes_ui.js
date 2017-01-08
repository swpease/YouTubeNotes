function setData(message) {
  /* Handles the video data sent from the video_data_getter content script.
    Message is a JSON object with pauseTime, videoUrl, and videoTitle.
  */
  var pauseTime = message.pauseTimeKey;
  var pauseElement = document.getElementById("pauseTime");
  pauseElement.textContent = pauseTime;

}

browser.runtime.onMessage.addListener(setData);

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("finish")) {
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {tab: tabs[0]});
    });
    // window.close();
  }
});

browser.tabs.executeScript(null, { file: "/content_scripts/video_data_getter.js" });
browser.tabs.executeScript(null, { file: "/content_scripts/video_unpauser.js" });

// var myTitle = message.tab.title;
// var shortTitle = myTitle.substring(0, myTitle.length - 10);
// console.log(shortTitle);
