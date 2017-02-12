document.body.style.border = "5px solid green";

//Global.Signed bank backgroundClick.
var videoId;
var videoTitle;

function makeHTML(input){
  var dummy = document.createElement('div');
  dummy.innerHTML = input;
  return dummy.firstChild;
}

//Converts a time in seconds to a time in format (hh):(mm):(ss) or so.
function prettifyTime(time) {
  var vidDuration = document.querySelector('.html5-main-video').duration;
  var vidHrs = Math.floor(vidDuration / 3600);
  var prettyTime = "";

  time = Math.floor(time);
  var hours = Math.floor(time / 3600);
  var rem = time % 3600;
  var mins = Math.floor(rem / 60);
  var secs = rem % 60;

  if (vidHrs > 0) {
    prettyTime += hours + ":";
    if (mins < 10) {
      prettyTime += "0" + mins + ":";
    } else {
      prettyTime += mins + ":";
    }
  } else {
    prettyTime += mins + ":";
  }
  if (secs < 10) {
    prettyTime += "0" + secs;
  } else {
    prettyTime += secs;
  }

  return prettyTime;
}


var notesSection_raw = '<div id="notes-wrapper" class="yt-card yt-card-has-padding"></div>';
var noteInputWrapper_raw = '<div id="notes-input-wrapper" class="comment-simplebox-renderer"></div>';
var noteInputDefault_raw = '<div class="comment-simplebox-renderer-collapsed comment-simplebox-trigger" tabindex="0" role="form" aria-haspopup="true"><div class="comment-simplebox-renderer-collapsed-content">Add a private note...</div><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div></div>';
var noteInput_raw = '<div id="note-simplebox-create-note" class="comment-simplebox-content"><div class="comment-simplebox" id="note-simplebox"><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div>' +
                    '<div class="comment-simplebox-frame"><div class="comment-simplebox-prompt"></div><div class="comment-simplebox-text" role="textbox" aria-multiline="true" contenteditable="true" data-placeholder="Add a private note..."></div></div>' +
                    '<div class="comment-simplebox-controls"><div class="comment-simplebox-buttons">' +
                    '<button class="cancel-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-default comment-simplebox-cancel" type="button" onclick=";return false;"><span class="yt-uix-button-content">Cancel</span>' +
                    '</button><button class="confirm-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-primary yt-uix-button-empty" type="button" onclick=";return false;" aria-label="Make Note" disabled="">Make Note</button></div></div></div></div>';
                    // Need to add focused to id="note-simplebox" when clicked
var notesSection = makeHTML(notesSection_raw);
var noteInputWrapper = makeHTML(noteInputWrapper_raw);
var noteInputDefault = makeHTML(noteInputDefault_raw);
var noteInput = makeHTML(noteInput_raw);

var notesBox = noteInput.getElementsByClassName("comment-simplebox")[0];
var note = noteInput.getElementsByClassName("comment-simplebox-text")[0];
var cancelNoteBtn = noteInput.getElementsByClassName("cancel-note-button")[0];
var makeNoteBtn = noteInput.getElementsByClassName("confirm-note-button")[0];


notesSection.appendChild(noteInputWrapper);
noteInputWrapper.appendChild(noteInputDefault);

// BEGIN Event functionality for making a new note
function blurNote(commentSimplebox) {
  commentSimplebox.classList.remove("focus");
}

function focusNote(commentSimplebox) {
  commentSimplebox.classList.add("focus");
}

function toggleNoteButtonEnabled(commentSimpleboxText, confirmNoteButton, initialText = "") {
  commentSimpleboxText.textContent == initialText ? confirmNoteButton.disabled = true : confirmNoteButton.disabled = false;
}

function switchToNoteInput() {
  notesBox.classList.add("focus");
  noteInputWrapper.replaceChild(noteInput, noteInputDefault);
  note.focus();
}

function switchToNoteInputDefault() {
  note.textContent = "";
  notesBox.classList.remove("focus");
  noteInputWrapper.replaceChild(noteInputDefault, noteInput);
}

//UponClicking to add a note,Displays the note belowAnd and sit to local storage
function makeNote() {
  var ytVideo = document.querySelector('.html5-main-video');
  var noteTime = ytVideo.currentTime; //Don't forage until after storage.Could you accidentally overwriteStill,But highly unlikely
  var noteText = note.textContent;

  var gettingItem = browser.storage.local.get(videoId);
  gettingItem.then((result) => {
    if (Array.isArray(result)) {  // If Firefox version less than 52.
      result = result[0];
    }
    var objTest = Object.keys(result);

    if(!objTest.includes(videoId)) {
      var storingNote = browser.storage.local.set({ [videoId] : { "title" : videoTitle,
                                                                "notes" : { [noteTime] : noteText }
                                                              }
                                                  });
      storingNote.then(() => {
        displayNote(noteTime, noteText);
        switchToNoteInputDefault();
      });
    } else {
      var currentNotes = result[videoId]["notes"];  // Object
      // console.log(currentNotes);
      currentNotes[[noteTime]] = noteText;
      var storingNote = browser.storage.local.set({ [videoId] : result[videoId] });
      storingNote.then(() => {
        displayNote(noteTime, noteText);
        switchToNoteInputDefault();
      });
    }
  });
}

noteInputDefault.addEventListener('click', switchToNoteInput);
cancelNoteBtn.addEventListener('click', switchToNoteInputDefault);
makeNoteBtn.addEventListener('click', makeNote);
note.addEventListener('focus', function () { focusNote(notesBox) });
note.addEventListener('blur', function () { blurNote(notesBox) });
note.addEventListener('keyup', function () { toggleNoteButtonEnabled(note, makeNoteBtn) });
// END Event functionalityFor making a new note

// Begin UI for dispalying saved notes
// contains all the notes
var savedNotesWrapper_raw = '<div class="comment-section-renderer-items" id="saved-notes-section-renderer-items"></div>';
// wrapper for noteRenderer (To switch with the edit textbox)
var noteRendererWrapper_raw = '<section class="note-renderer comment-thread-renderer"></section>'
// contains a single note. Also includes footer container (two outer layers). Also includes button for Edit/Delete popup.
var noteRenderer_raw = '<div class="comment-renderer"><div class="comment-renderer-content"><div class="note-renderer-footer comment-renderer-footer"><div class="comment-action-buttons-toolbar"><button type="button" class="note-footer-edit-button note-footer-btn notes-footer-item yt-uix-button yt-uix-button-link">Edit</button><button type="button" class="notes-footer-item note-footer-spacer yt-uix-button yt-uix-button-link">•</button><button type="button" class="note-footer-delete-button note-footer-btn notes-footer-item yt-uix-button yt-uix-button-link">Delete</button><div class="yt-uix-menu-container comment-renderer-action-menu yt-section-hover-container"><div class="yt-uix-menu yt-uix-menu-flipped"><button class="note-footer-button yt-uix-button yt-uix-button-size-default yt-uix-button-action-menu yt-uix-button-empty yt-uix-button-has-icon no-icon-markup yt-uix-menu-trigger" type="button" role="button" aria-pressed="false" aria-haspopup="true" aria-label="Action menu."></button></div></div></div></div></div></div>';
// header. To add: a fn to set the currentTime = [text] and the text for the <span>. Added my own class 'note-video-time' for future use... Modded <a> to <span>
var noteHeader_raw = '<div class="comment-renderer-header"><span class="comment-author-text note-video-time" style="cursor:pointer;">Time goes here</span></div>';
// text content. To add: the text content. Added my own class 'note-text-content' for future use...
var noteContent_raw = '<div class="comment-renderer-text" tabindex="0" role="article"><div class="comment-renderer-text-content note-text-content">Note goes here</div></div>';
// footer. Contains the Edit and Delete functionality. Insert after the button in noteRenderer.
var noteFooterPopup_raw = '<div class="yt-uix-menu-content yt-ui-menu-content yt-uix-menu-content-hidden" role="menu"><ul tabindex="0" class="yt-uix-kbd-nav yt-uix-kbd-nav-list"><li role="menuitem"><div class="service-endpoint-action-container hid"></div><button type="button" class="yt-ui-menu-item yt-uix-menu-close-on-select  comment-renderer-edit" data-simplebox-label="Save"><span class="yt-ui-menu-item-label">Edit</span></button></li><li role="menuitem" class=""><div class="service-endpoint-action-container hid"></div><button type="button" class="yt-ui-menu-item yt-uix-menu-close-on-select  comment-renderer-action-button"><span class="yt-ui-menu-item-label">Delete</span></button></li></ul></div>';
// style="min-width: 18px; position: absolute; right: 0; top: 20;"

// For the editing notes.Note to that YouTubeAs a single element that day Switcheroo and as needed.Not sure if faster.
//Me
var noteEdit_raw = '<div class="comment-renderer comment-renderer-editing"><div class="comment-simplebox-edit comment-simplebox-content">' +
                   '<div class="comment-simplebox focus"><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div>' +
                   '<div class="comment-simplebox-frame"><div class="comment-simplebox-prompt"></div><div class="note-simplebox-text comment-simplebox-text" role="textbox" aria-multiline="true" contenteditable="true"></div></div>' +
                   '<div class="comment-simplebox-controls"><div class="comment-simplebox-buttons">' +
                   '<button class="cancel-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-default comment-simplebox-cancel" type="button" onclick=";return false;"><span class="yt-uix-button-content">Cancel</span>' +
                   '</button><button class="confirm-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-primary yt-uix-button-empty" type="button" onclick=";return false;" aria-label="Save" disabled="">Save</button></div></div></div></div></div>';


var savedNotesWrapper = makeHTML(savedNotesWrapper_raw);
notesSection.appendChild(savedNotesWrapper);


function displayFooterPopup(noteFooterPopup, footerBtn) {
  footerBtn.classList.add("yt-uix-menu-trigger-selected");
  footerBtn.classList.add("yt-uix-button-toggled");
  noteFooterPopup.classList.remove("yt-uix-menu-content-hidden");

  document.addEventListener('click', function() { hideFooterPopup(footerBtn) });
  // footerBtn.removeEventListener('click', displayFooterPopup);

  footerBtn.parentElement.insertBefore(noteFooterPopup, footerBtn.nextSibling);
}

function hideFooterPopup(footerBtn) {
  footerBtn.classList.remove("yt-uix-menu-trigger-selected");
  footerBtn.classList.remove("yt-uix-button-toggled");
  noteFooterPopup.classList.add("yt-uix-menu-content-hidden");
  // footerBtn.addEventListener('click', displayFooterPopup);
}

// Call find display nodeSo that you know it's areDisplayIn order Vaitai
function insertByTime(note) {
  var displayedNotes = savedNotesWrapper.getElementsByClassName('note-renderer');

  if (displayedNotes.length > 0) {
    for (var displayedNote of displayedNotes) {
      if (Number(note.dataset.noteTime) < Number(displayedNote.dataset.noteTime)) {
        savedNotesWrapper.insertBefore(note, displayedNote);
        return;
      }
    }
  }
  savedNotesWrapper.appendChild(note);
}

//source: http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

function displayNote(noteTime, noteText) {
  var noteRendererWrapper = makeHTML(noteRendererWrapper_raw);
  var noteRenderer = makeHTML(noteRenderer_raw);
  var noteHeader = makeHTML(noteHeader_raw);
  var noteContent = makeHTML(noteContent_raw);
  var noteFooterPopup = makeHTML(noteFooterPopup_raw)

  var noteTimeElement = noteHeader.querySelector('.note-video-time');
  var footerEditBtn = noteRenderer.querySelector('.note-footer-edit-button');
  var footerDelBtn = noteRenderer.querySelector('.note-footer-delete-button');
  var noteFooter = noteRenderer.getElementsByClassName('note-renderer-footer')[0];
  var footerBtn = noteRenderer.getElementsByClassName('note-footer-button')[0];


  noteContent.querySelector('.note-text-content').textContent = noteText;
  noteTimeElement.textContent = prettifyTime(noteTime);
  noteRendererWrapper.setAttribute('data-note-time', noteTime);

  noteRendererWrapper.appendChild(noteRenderer);
  noteFooter.parentElement.insertBefore(noteHeader, noteFooter);
  noteFooter.parentElement.insertBefore(noteContent, noteFooter);
  footerBtn.parentElement.insertBefore(noteFooterPopup, footerBtn.nextSibling);


  footerBtn.addEventListener('click', function() {
    footerBtn.classList.add("yt-uix-menu-trigger-selected");
    footerBtn.classList.add("yt-uix-button-toggled");
    console.log("footerbtn: ", footerBtn.classList);

    console.log(noteFooterPopup.classList);
    noteFooterPopup.classList.remove("yt-uix-menu-content-hidden");
    console.log(noteFooterPopup.classList);
  });

  footerEditBtn.addEventListener('click', function () {
    var noteKeyTime = noteRendererWrapper.dataset.noteTime;  // For lookup by makeEditBtn click

    var noteEdit = makeHTML(noteEdit_raw);
    noteEdit.querySelector('.note-simplebox-text').textContent = noteText;

    var editBox = noteEdit.getElementsByClassName("comment-simplebox")[0];
    var edit = noteEdit.getElementsByClassName("comment-simplebox-text")[0];
    var cancelEditBtn = noteEdit.getElementsByClassName("cancel-note-button")[0];
    var makeEditBtn = noteEdit.getElementsByClassName("confirm-note-button")[0];

    cancelEditBtn.addEventListener('click', function () {
      noteEdit.parentElement.replaceChild(noteRenderer, noteEdit);
      noteEdit.remove();
    });
    edit.addEventListener('focus', function () { focusNote(editBox) });
    edit.addEventListener('blur', function () { blurNote(editBox) });
    edit.addEventListener('keyup', function () { toggleNoteButtonEnabled(edit, makeEditBtn, noteText) });
    makeEditBtn.addEventListener('click', function () {
      var editedText = noteEdit.querySelector('.note-simplebox-text').textContent;

      var gettingItem = browser.storage.local.get(videoId);
      gettingItem.then((result) => {
        if (Array.isArray(result)) {  // If Firefox version less than 52.
          result = result[0];
        }

        var currentNotes = result[videoId]["notes"];  // Object
        currentNotes[[noteKeyTime]] = editedText;
        var storingNote = browser.storage.local.set({ [videoId] : result[videoId] });
        storingNote.then(() => {
          noteContent.querySelector('.note-text-content').textContent = editedText;
          noteEdit.parentElement.replaceChild(noteRenderer, noteEdit);
          noteEdit.remove();
        });
      });
    })
    noteRenderer.parentElement.replaceChild(noteEdit, noteRenderer);
    placeCaretAtEnd(edit);
  });

  //DeleteNote
  footerDelBtn.addEventListener('click', function () {
    var gettingItem = browser.storage.local.get(videoId);
    gettingItem.then((result) => {
      if (Array.isArray(result)) {  // If Firefox version less than 52.
        result = result[0];
      }
      var objTest = Object.keys(result);

      var currentNotes = result[videoId]["notes"];  // Object
      delete currentNotes[[noteTime]];
      if (Object.keys(currentNotes).length == 0) {
        browser.storage.local.remove(videoId);
        noteRendererWrapper.remove();
      } else {
        var storingNote = browser.storage.local.set({ [videoId] : result[videoId] });
        storingNote.then(() => {
          noteRendererWrapper.remove();
        });
      }
    });
  });
  noteTimeElement.addEventListener('click', function() { document.querySelector('.html5-main-video').currentTime = noteTime; });

  insertByTime(noteRendererWrapper);
}

//GettingURLHey infoVideo ID andTitle.
function initialize(message) {
  videoId = message.id;
  videoTitle = message.title;

  var gettingSavedNotes = browser.storage.local.get(videoId);
  gettingSavedNotes.then((result) => {
    if (Array.isArray(result)) {  // If Firefox version less than 52.
      result = result[0];
    }

    if (Object.keys(result).length == 0) {
      return;
    }

    var savedNotes = result[videoId]["notes"];
    for (var noteTime of Object.keys(savedNotes)) {
      // console.log(noteTime, savedNotes[noteTime]);
      var noteText = savedNotes[noteTime];
      displayNote(noteTime, noteText);
    }
  });
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

browser.runtime.onMessage.addListener(initialize);
browser.runtime.sendMessage({});
//And back transcript interaction

var commentsSection = document.getElementById('watch-discussion');
commentsSection.parentElement.insertBefore(notesSection, commentsSection);
