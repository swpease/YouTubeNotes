// execute the script now so it can listen to the messages sent by the code below
// browser.tabs.executeScript(null, { file: "/content_scripts/video_data_getter.js" });
browser.tabs.executeScript(null, { allFrames: true, runAt: "document_end", file: "/content_scripts/yt_api_test.js" });
browser.tabs.executeScript(null, { file: "/content_scripts/video_unpauser.js" });

function setData(message) {
  /* Handles the video data sent from the video_data_getter content script.
    Message is a JSON object with pauseTime, videoUrl, and videoTitle.
  */
  var pauseTime = message.pauseTime;
  var pauseElement = document.getElementById("pause-time");
  pauseElement.textContent(pauseTime);

}


browser.runtime.onMessage.addListener(setData);

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("finish")) {
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {tab: tabs[0]});  // can I just use {}? Do I want to pass something?
    });
  }
});
