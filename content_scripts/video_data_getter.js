/*
Inject this upon clicking on icon.
Pauses the video, then retrieves current time.
Sends to popup's js.
Unpauses when finished.
*/

var videos = document.getElementsByClassName("video-stream html5-main-video");
var ytPlayer = videos[0];

function getVideoCurrentTime() {
  ytPlayer.pause();
  var pauseTime = Math.floor(ytPlayer.currentTime);

  browser.runtime.sendMessage({ pauseTimeKey: pauseTime });
}

function resumeVideo(message) {
  ytPlayer.play();
}


browser.runtime.onMessage.addListener(resumeVideo);

getVideoCurrentTime();
