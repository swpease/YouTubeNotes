
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
var loadMoreButtonArray = document.getElementsByClassName("yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more browse-items-load-more-button");
var loadMoreButton = loadMoreButtonArray[0];  // add in assert statement?
console.log("button: ", loadMoreButton);
loadMoreButton.addEventListener("click", timedoutthing, false);
