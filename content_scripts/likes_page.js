
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
}

function timedoutthing() {
  window.setTimeout(insertNotes, 5000);
}

insertNotes()

// TODO... does not handle changing between grid and list views.
var likedVideosContainer = document.getElementById("channels-browse-content-grid") || document.getElementById("browse-items-primary");  // Grid vs List view options.
var observer = new MutationObserver(insertNotes);
observer.observe(likedVideosContainer, { childList: true });
