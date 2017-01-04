/*
Inject this upon clicking on icon.
Pauses the video, then retrieves:
  - current time
  - video name
  - url
Sends to popup's js, then resumes video.
  -- ACTUALLY, WANT TO PUT THIS IN A SECOND SCRIPT
*/

var ytPlayer = document.getElementById("movie_player");
ytPlayer.pauseVideo();

var pauseTime = Math.floor(ytPlayer.getCurrentTime());
var videoUrl = ytPlayer.getVideoUrl();
var videoTitle = ytPlayer.getVideoData().title;

browser.runtime.sendMessage({ "pauseTime": pauseTime, "videoUrl": videoUrl, "videoTitle": videoTitle });

// ytPlayer.playVideo();
