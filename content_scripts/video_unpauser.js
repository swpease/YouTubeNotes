/*
  Inject along with video_data_getter.js.
*/

console.log("injected unpauser")

function resumeVideo(message) {
  console.log("unpausing");
  console.log(message);
  // var myTitle = message.tab.title;
  // var shortTitle = myTitle.substring(0, myTitle.length - 10);
  // console.log(shortTitle);
  // let ytPlayer = document.getElementById("movie_player");
  // ytPlayer.playVideo();
}

browser.runtime.onMessage.addListener(resumeVideo);
