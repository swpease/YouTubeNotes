/*console.log("stuff happened!");
// want to insert after <div class="yt-lockup-meta">
// insert another div
var data = document.createElement("div")
*/

console.log("what is this?");

var data = document.createElement("div");
data.textContent = "My first div!";
data.setAttribute("class", "yt-lockup-annotations");

var viewsAndDates = document.getElementsByClassName("yt-lockup-meta-info");
console.log(viewsAndDates);
for (var i = 0; i < viewsAndDates.length; i++) {
  var priorNode = viewsAndDates[i];
  priorNode.parentNode.insertBefore(data, priorNode);
}
