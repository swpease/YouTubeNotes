/*
overall flow:
- user clicks icon, which starts this script
- script injects video_data_getter, which yields the video time

*/

// browser.runtime.onMessage.addListener(setVideoTime);

// add event listeners specific to the items (see quicknotes.js)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("cancel")) {
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {action: "cancel"});
      window.close();
    });
  }
  if (e.target.classList.contains("add")) {
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {action: "add"});  // unpause
      window.close();
    });
  }
});

browser.tabs.executeScript(null, { file: "/content_scripts/pause_unpause.js" });
