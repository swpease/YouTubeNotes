document.body.style.border = "5px solid green";


function makeHTML(input){
  var dummy = document.createElement('div');
  dummy.innerHTML = input;
  return dummy.firstChild;
}

var notesWrapper_raw = '<div id="notes-wrapper" class="yt-card yt-card-has-padding"></div>';
var noteInputWrapper_raw = '<div id="notes-input-wrapper" class="comment-simplebox-renderer"></div>';
var noteInputDefault_raw = '<div class="comment-simplebox-renderer-collapsed comment-simplebox-trigger" tabindex="0" role="form" aria-haspopup="true"><div class="comment-simplebox-renderer-collapsed-content">Add a private note...</div><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div></div>';
var noteInput_raw = '<div id="note-simplebox-create-note" class="comment-simplebox-content"><div class="comment-simplebox" id="note-simplebox"><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div>' +
                    '<div class="comment-simplebox-frame"><div class="comment-simplebox-prompt"></div><div class="comment-simplebox-text" role="textbox" aria-multiline="true" contenteditable="true" data-placeholder="Add a private note..."></div></div>' +
                    '<div class="comment-simplebox-controls"><div class="comment-simplebox-buttons">' +
                    '<button class="cancel-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-default comment-simplebox-cancel" type="button" onclick=";return false;"><span class="yt-uix-button-content">Cancel</span>' +
                    '</button><button class="make-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-primary yt-uix-button-empty" type="button" onclick=";return false;" aria-label="Make Note" disabled="">Make Note</button></div></div></div></div>';
                    // Need to add focused to id="note-simplebox" when clicked
var notesWrapper = makeHTML(notesWrapper_raw);
var noteInputWrapper = makeHTML(noteInputWrapper_raw);
var noteInputDefault = makeHTML(noteInputDefault_raw);
var noteInput = makeHTML(noteInput_raw);

var notesBox = noteInput.getElementsByClassName("comment-simplebox")[0];
var note = noteInput.getElementsByClassName("comment-simplebox-text")[0];
var cancelNoteBtn = noteInput.getElementsByClassName("cancel-note-button")[0];
var makeNoteBtn = noteInput.getElementsByClassName("make-note-button")[0];


notesWrapper.appendChild(noteInputWrapper);
noteInputWrapper.appendChild(noteInputDefault);

function blurNote() {
  notesBox.classList.remove("focus");
}

function focusNote() {
  notesBox.classList.add("focus");
}

function switchToNoteInput() {
  notesBox.classList.add("focus"); //remove
  noteInputWrapper.replaceChild(noteInput, noteInputDefault);
  note.focus();
}

function switchToNoteInputDefault() {
  notesBox.classList.remove("focus");
  noteInputWrapper.replaceChild(noteInputDefault, noteInput);
}

noteInputDefault.addEventListener('click', switchToNoteInput);
cancelNoteBtn.addEventListener('click', switchToNoteInputDefault);
note.addEventListener('focus', focusNote);
note.addEventListener('blur', blurNote);

var commentsSection = document.getElementById('watch-discussion');

commentsSection.parentElement.insertBefore(notesWrapper, commentsSection);
