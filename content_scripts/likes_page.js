
function insertNotes() {

  var viewsAndDates = document.getElementsByClassName("yt-lockup-meta-info");
  console.log("insertNotes called, yielding length: ", viewsAndDates.length);

  for (let i = 0; i < viewsAndDates.length; i++) {
    var data = document.createElement("p");
    data.textContent = "My first p!";
    data.setAttribute("class", "yt-lockup-notes");

    var priorNode = viewsAndDates[i];
    priorNode.parentNode.insertBefore(data, priorNode.nextSibling);
  }

  // update orientationObserver's target
  likedVideosContainer = document.getElementById("channels-browse-content-grid") || document.getElementById("browse-items-primary");
  orientationObserver.disconnect();
  orientationObserver.observe(likedVideosContainer, { childList: true });
}

// function timedoutthing() {
//   window.setTimeout(insertNotes, 5000);
// }

// ITS A DIFFERENT OBJECT!!
// function testToggleStuff() {
//   var reloadedTVA = document.getElementsByClassName("subnav-flow-menu yt-uix-button yt-uix-button-default yt-uix-button-size-default");
//   var reloadedTV = reloadedTVA[0];
//   console.log("toggle view:", toggleView);
//   console.log("reloaded toggle view:", reloadedTV);
//   console.log("same object: ", toggleView === reloadedTV);
// }

// window.setInterval(insertNotes, 4000);  // SO, IT'S STILL THERE, JUST NEED TO CALL IT PROPERLY!
// window.setInterval(testToggleStuff, 4000);

// TODO... does not handle changing between grid and list views.
// var toggleViewArray = document.getElementsByClassName("subnav-flow-menu yt-uix-button yt-uix-button-default yt-uix-button-size-default");
// var toggleView = toggleViewArray[0]; //.firstChild
// console.log("toggle item:", toggleView);  // coudl compare THIS item; put in instertNotes
// var toggleViewObserver = new MutationObserver(insertNotes);
// var testobserver = new MutationObserver(function(mutations) {
//   mutations.forEach(function(mutation) {
//     console.log(mutation.type);
//   });
// });
// var config = { attributes: true, childList: true, characterData: true, characterDataOldValue: true };
// testobserver.observe(toggleView, config);

function preCheck() {
  let likedVideosContainer = document.getElementById("channels-browse-content-grid") || document.getElementById("browse-items-primary");
  if (likedVideosContainer == null) {
    pageObserver.disconnect();
    console.log("disconnected!")
  }
  else {
    console.log("calling insertNotes");
    insertNotes();
  }
}

var page = document.getElementById("page");
var pageObserver = new MutationObserver(preCheck);  // seems to work, but:
// 1. needs to reupdate grid vs list listener
var pageConfig = { attributes: true, childList: true, characterData: true }
pageObserver.observe(page, pageConfig);
console.log("connected!");

var likedVideosContainer = document.getElementById("channels-browse-content-grid") || document.getElementById("browse-items-primary");  // Grid vs List view options.
var orientationObserver = new MutationObserver(insertNotes);
orientationObserver.observe(likedVideosContainer, { childList: true });  // cannot reassign the first argument object...

insertNotes()
