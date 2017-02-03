document.body.style.border = "5px solid green";


function makeHTML(input){
  var dummy = document.createElement('div');
  dummy.innerHTML = input;
  return dummy.firstChild;
}

var notesSection_raw = '<div id="notes-wrapper" class="yt-card yt-card-has-padding"></div>';
var noteInputWrapper_raw = '<div id="notes-input-wrapper" class="comment-simplebox-renderer"></div>';
var noteInputDefault_raw = '<div class="comment-simplebox-renderer-collapsed comment-simplebox-trigger" tabindex="0" role="form" aria-haspopup="true"><div class="comment-simplebox-renderer-collapsed-content">Add a private note...</div><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div></div>';
var noteInput_raw = '<div id="note-simplebox-create-note" class="comment-simplebox-content"><div class="comment-simplebox" id="note-simplebox"><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div>' +
                    '<div class="comment-simplebox-frame"><div class="comment-simplebox-prompt"></div><div class="comment-simplebox-text" role="textbox" aria-multiline="true" contenteditable="true" data-placeholder="Add a private note..."></div></div>' +
                    '<div class="comment-simplebox-controls"><div class="comment-simplebox-buttons">' +
                    '<button class="cancel-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-default comment-simplebox-cancel" type="button" onclick=";return false;"><span class="yt-uix-button-content">Cancel</span>' +
                    '</button><button class="make-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-primary yt-uix-button-empty" type="button" onclick=";return false;" aria-label="Make Note" disabled="">Make Note</button></div></div></div></div>';
                    // Need to add focused to id="note-simplebox" when clicked
var notesSection = makeHTML(notesSection_raw);
var noteInputWrapper = makeHTML(noteInputWrapper_raw);
var noteInputDefault = makeHTML(noteInputDefault_raw);
var noteInput = makeHTML(noteInput_raw);

var notesBox = noteInput.getElementsByClassName("comment-simplebox")[0];
var note = noteInput.getElementsByClassName("comment-simplebox-text")[0];
var cancelNoteBtn = noteInput.getElementsByClassName("cancel-note-button")[0];
var makeNoteBtn = noteInput.getElementsByClassName("make-note-button")[0];


notesSection.appendChild(noteInputWrapper);
noteInputWrapper.appendChild(noteInputDefault);

// BEGIN Event functionality for making a new note
function blurNote() {
  notesBox.classList.remove("focus");
}

function focusNote() {
  notesBox.classList.add("focus");
}

function toggleNoteButtonEnabled() {
  note.textContent == "" ? makeNoteBtn.disabled = true : makeNoteBtn.disabled = false;
}

function switchToNoteInput() {
  notesBox.classList.add("focus");
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
note.addEventListener('keyup', toggleNoteButtonEnabled);
// END Event functionalityFor making a new note

// Begin UI for dispalying saved notes
// contains all the notes
var savedNotesWrapper_raw = '<div class="comment-section-renderer-items" id="saved-notes-section-renderer-items"></div>';
// contains a single note. Also includes footer container (two outer layers). Also includes button for Edit/Delete popup.
var noteRenderer_raw = '<section class="comment-thread-renderer"><div class="comment-renderer"><div class="comment-renderer-content"><div class="note-renderer-footer comment-renderer-footer"><div class="comment-action-buttons-toolbar"><button type="button" class="note-footer-edit-button">Edit</button><button type="button" class="note-footer-delete-button">Delete</button><div class="yt-uix-menu-container comment-renderer-action-menu yt-section-hover-container"><div class="yt-uix-menu yt-uix-menu-flipped"><button class="note-footer-button yt-uix-button yt-uix-button-size-default yt-uix-button-action-menu yt-uix-button-empty yt-uix-button-has-icon no-icon-markup yt-uix-menu-trigger yt-uix-menu-trigger-selected yt-uix-button-toggled" type="button" role="button" aria-pressed="false" aria-haspopup="true" aria-label="Action menu."></button></div></div></div></div></div></div></section>';
// header. To add: a fn to set the currentTime = [text] and the text for the <span>. Added my own class 'note-video-time' for future use... Modded <a> to <span>
var noteHeader_raw = '<div class="comment-renderer-header"><span class="comment-author-text note-video-time" style="cursor:pointer;">Time goes here</span></div>';
// text content. To add: the text content. Added my own class 'note-text-content' for future use...
var noteContent_raw = '<div class="comment-renderer-text" tabindex="0" role="article"><div class="comment-renderer-text-content note-text-content">Note goes here</div></div>';
// footer. Contains the Edit and Delete functionality.
var noteFooterPopup_raw = '<div class="yt-uix-menu-content yt-ui-menu-content yt-uix-kbd-nav" role="menu" aria-expanded="true" style="min-width: 18px; position: absolute; right: 0; top: 20;"><ul tabindex="0" class="yt-uix-kbd-nav yt-uix-kbd-nav-list"><li role="menuitem"><div class="service-endpoint-action-container hid"></div><button type="button" class="yt-ui-menu-item yt-uix-menu-close-on-select  comment-renderer-edit" data-simplebox-label="Save"><span class="yt-ui-menu-item-label">Edit</span></button></li><li role="menuitem" class=""><div class="service-endpoint-action-container hid"></div><button type="button" class="yt-ui-menu-item yt-uix-menu-close-on-select  comment-renderer-action-button"><span class="yt-ui-menu-item-label">Delete</span></button></li></ul></div>';

var savedNotesWrapper = makeHTML(savedNotesWrapper_raw);
notesSection.appendChild(savedNotesWrapper);

function test() {
  console.log("hello");
}

function displayFooterPopup() {
  footerBtn.classList.add("yt-uix-menu-trigger-selected");
  footerBtn.classList.add("yt-uix-button-toggled");

  document.addEventListener('click', hideFooterPopup);
  footerBtn.removeEventListener('click', displayFooterPopup);

  footerBtn.parentElement.insertBefore(noteFooterPopup, footerBtn);
}

function hideFooterPopup() {
  footerBtn.classList.remove("yt-uix-menu-trigger-selected");
  footerBtn.classList.remove("yt-uix-button-toggled");

  footerBtn.addEventListener('click', displayFooterPopup);
}

function displayNote() {
  var noteRenderer = makeHTML(noteRenderer_raw);
  var noteHeader = makeHTML(noteHeader_raw);
  var noteContent = makeHTML(noteContent_raw);
  var noteFooterPopup = makeHTML(noteFooterPopup_raw)

  savedNotesWrapper.appendChild(noteRenderer);
  var noteFooter = noteRenderer.getElementsByClassName('note-renderer-footer')[0];
  noteFooter.parentElement.insertBefore(noteHeader, noteFooter);
  noteFooter.parentElement.insertBefore(noteContent, noteFooter);
  // var footerBtn = noteRenderer.getElementsByClassName('note-footer-button')[0];
  // footerBtn.addEventListener('click', displayFooterPopup);
  var footerEditBtn = noteRenderer.querySelector('.note-footer-edit-button');
  footerEditBtn.addEventListener('click', test);

}

//GettingURLHey infoVideo ID andTitle.
function handleResponse(message) {
  console.log(`Message from the background script:  ${message.id}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

browser.runtime.onMessage.addListener(handleResponse);
browser.runtime.sendMessage({});
//And back transcript interaction

var commentsSection = document.getElementById('watch-discussion');
commentsSection.parentElement.insertBefore(notesSection, commentsSection);
