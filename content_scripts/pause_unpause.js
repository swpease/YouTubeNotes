/*
Inject this upon clicking on icon.
Pauses the video, Unpauses when finished.
*/

var videos = document.getElementsByClassName("video-stream html5-main-video");
var ytPlayer = videos[0];
ytPlayer.pause();

function unpause(message) {
  ytPlayer.play();
}

browser.runtime.onMessage.addListener(unpause);
