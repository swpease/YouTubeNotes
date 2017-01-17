document.body.style.border = "5px solid green";


function makeHTML(input){
  var dummy = document.createElement('div');
  dummy.innerHTML = input;
  return dummy.firstChild;
}

var notesWrapper_raw = '<div id="notes-wrapper" class="yt-card yt-card-has-padding"></div>';
var noteInputWrapper_raw = '<div id="notes-input-wrapper" class="comment-simplebox-renderer"></div>';
var noteInputDefault_raw = '<div class="comment-simplebox-renderer-collapsed comment-simplebox-trigger" tabindex="0" role="form" aria-haspopup="true"><div class="comment-simplebox-renderer-collapsed-content">Add a private note...</div><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div></div>';

var notesWrapper = makeHTML(notesWrapper_raw);
var noteInputWrapper = makeHTML(noteInputWrapper_raw);
var noteInputDefault = makeHTML(noteInputDefault_raw);

notesWrapper.appendChild(noteInputWrapper);
noteInputWrapper.appendChild(noteInputDefault);

var commentsSection = document.getElementById('watch-discussion');

commentsSection.parentElement.insertBefore(notesWrapper, commentsSection);
