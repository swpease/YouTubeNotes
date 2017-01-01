// Note: cannot differentiate b/w your own and someone else's liked page. Oh well.
// Note: was thinking of how to ONLY get stuff to display on liked videos,
// but maybe I just want to leave it as is?


function insertNotes() {
  /*
  Currently a placeholder that inserts a p at every video in the liked videos
  section on youtube. Inserts the p after the views and dates line (i.e.
  the last line of text for the liked video).
  Side-effect: updates the observer for the layout (grid vs list).
  */

  var viewsAndDates = document.getElementsByClassName("yt-lockup-meta-info");

  for (let i = 0; i < viewsAndDates.length; i++) {
    var data = document.createElement("p");
    data.textContent = "My first p!";
    data.setAttribute("class", "yt-lockup-notes");

    var priorNode = viewsAndDates[i];
    priorNode.parentNode.insertBefore(data, priorNode.nextSibling);
  }

  updateLayoutObserver();
}

function updateLayoutObserver() {
  // update layoutObserver's target
  likedVideosContainer = document.getElementById("channels-browse-content-grid") || document.getElementById("browse-items-primary");
  layoutObserver.disconnect();
  layoutObserver.observe(likedVideosContainer, { childList: true });
}

function checkVideoContainer() {
  /*
  Callback for pageObserver.
  If there isn't a liked videos container, disconnects the page from pageObserver.
  If there IS, calls insertNotes.
  */
  let likedVideosContainer = document.getElementById("channels-browse-content-grid") || document.getElementById("browse-items-primary");
  likedVideosContainer == null ? pageObserver.disconnect() : insertNotes();
}

var page = document.getElementById("page");
var pageObserver = new MutationObserver(checkVideoContainer);
pageObserver.observe(page, { attributes: true });  // Don't understand why "attributes" is what works.

var likedVideosContainer = document.getElementById("channels-browse-content-grid") || document.getElementById("browse-items-primary");  // Grid vs List view options.
var layoutObserver = new MutationObserver(insertNotes);
layoutObserver.observe(likedVideosContainer, { childList: true });

insertNotes()
