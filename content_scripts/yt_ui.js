//Global.
var videoId;
var videoTitle;
var formerVideoId;
//Needed in noteInput and savedNotes sections.
var notesSection;
var savedNotesWrapper;  // should de-globalize

// Raw HTML. Taken and modded from YouTube.
// main wrapper
var notesSection_raw = '<div id="notes-wrapper" class="yt-card yt-card-has-padding"></div>';
var notesSectionHeader_raw = '<h2 class="comment-section-header-renderer" tabindex="0"><b>Notes</b></h2>';
// Sections for making a new note.
var noteInputWrapper_raw = '<div id="notes-input-wrapper" class="comment-simplebox-renderer"></div>';
var noteInputDefault_raw = '<div class="comment-simplebox-renderer-collapsed comment-simplebox-trigger" tabindex="0" role="form" aria-haspopup="true"><div class="comment-simplebox-renderer-collapsed-content">Add a private note...</div><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div></div>';
var noteInput_raw = '<div id="note-simplebox-create-note" class="comment-simplebox-content"><div class="comment-simplebox" id="note-simplebox"><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div>' +
                    '<div class="comment-simplebox-frame"><div class="comment-simplebox-prompt"></div><div class="comment-simplebox-text" role="textbox" aria-multiline="true" contenteditable="true" data-placeholder="Add a private note..."></div></div>' +
                    '<div class="comment-simplebox-controls"><div class="comment-simplebox-buttons">' +
                    '<button class="cancel-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-default comment-simplebox-cancel" type="button" onclick=";return false;"><span class="yt-uix-button-content">Cancel</span>' +
                    '</button><button class="confirm-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-primary yt-uix-button-empty" type="button" onclick=";return false;" aria-label="Make Note" disabled="">Make Note</button></div></div></div></div>';

// Equivalent of the part below the horizontal bar:
// contains all the notes
var savedNotesWrapper_raw = '<div class="comment-section-renderer-items" id="saved-notes-section-renderer-items"></div>';
// wrapper for noteRenderer (To switch with the edit textbox)
var noteRendererWrapper_raw = '<section class="note-renderer comment-thread-renderer"></section>'
// contains a single note. Also includes footer.
var noteRenderer_raw = '<div class="comment-renderer"><div class="comment-renderer-content"><div class="note-renderer-footer comment-renderer-footer"><div class="comment-action-buttons-toolbar"><button type="button" class="note-footer-edit-button note-footer-btn notes-footer-item yt-uix-button yt-uix-button-link">Edit</button><button type="button" class="notes-footer-item note-footer-spacer yt-uix-button yt-uix-button-link">•</button><button type="button" class="note-footer-delete-button note-footer-btn notes-footer-item yt-uix-button yt-uix-button-link">Delete</button></div></div></div></div>';
var noteHeader_raw = '<div class="comment-renderer-header"><span class="comment-author-text note-video-time" style="cursor:pointer;">Time goes here</span></div>';
var noteContent_raw = '<div class="comment-renderer-text" tabindex="0" role="article"><div class="comment-renderer-text-content note-text-content">Note goes here</div></div>';
// Just like the noteInput section.
var noteEdit_raw = '<div class="comment-renderer comment-renderer-editing"><div class="comment-simplebox-edit comment-simplebox-content">' +
                   '<div class="comment-simplebox focus"><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div>' +
                   '<div class="comment-simplebox-frame"><div class="comment-simplebox-prompt"></div><div class="note-simplebox-text comment-simplebox-text" role="textbox" aria-multiline="true" contenteditable="true"></div></div>' +
                   '<div class="comment-simplebox-controls"><div class="comment-simplebox-buttons">' +
                   '<button class="cancel-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-default comment-simplebox-cancel" type="button" onclick=";return false;"><span class="yt-uix-button-content">Cancel</span>' +
                   '</button><button class="confirm-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-primary yt-uix-button-empty" type="button" onclick=";return false;" aria-label="Save" disabled="">Save</button></div></div></div></div></div>';



function makeHTML(input){
  var dummy = document.createElement('div');
  dummy.innerHTML = input;
  return dummy.firstChild;
}


function setupNoteInputSection() {
  notesSection = makeHTML(notesSection_raw);
  var notesSectionHeader = makeHTML(notesSectionHeader_raw);
  var noteInputWrapper = makeHTML(noteInputWrapper_raw);
  var noteInputDefault = makeHTML(noteInputDefault_raw);
  var noteInput = makeHTML(noteInput_raw);

  var notesBox = noteInput.getElementsByClassName("comment-simplebox")[0];
  var note = noteInput.getElementsByClassName("comment-simplebox-text")[0];
  var cancelNoteBtn = noteInput.getElementsByClassName("cancel-note-button")[0];
  var makeNoteBtn = noteInput.getElementsByClassName("confirm-note-button")[0];


  notesSection.appendChild(noteInputWrapper);
  noteInputWrapper.appendChild(noteInputDefault);
  notesSection.insertBefore(notesSectionHeader, noteInputWrapper);


  noteInputDefault.addEventListener('click', function() { switchToNoteInput(notesBox, noteInputWrapper, note, noteInput, noteInputDefault) });
  cancelNoteBtn.addEventListener('click', function() { switchToNoteInputDefault(notesBox, noteInputWrapper, note, noteInput, noteInputDefault) });
  makeNoteBtn.addEventListener('click', function() { makeNote(notesBox, noteInputWrapper, note, noteInput, noteInputDefault) });
  note.addEventListener('focus', function () { focusNote(notesBox) });
  note.addEventListener('blur', function () { blurNote(notesBox) });
  note.addEventListener('keyup', function () { toggleNoteButtonEnabled(note, makeNoteBtn) });
}

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

function switchToNoteInput(notesBox, noteInputWrapper, note, noteInput, noteInputDefault) {
  notesBox.classList.add("focus");
  noteInputWrapper.replaceChild(noteInput, noteInputDefault);
  note.focus();
}

function switchToNoteInputDefault(notesBox, noteInputWrapper, note, noteInput, noteInputDefault) {
  note.textContent = "";
  notesBox.classList.remove("focus");
  noteInputWrapper.replaceChild(noteInputDefault, noteInput);
}

//UponClicking to add a note,Displays the note belowAnd adds it to local storage
function makeNote(notesBox, noteInputWrapper, note, noteInput, noteInputDefault) {
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
        switchToNoteInputDefault(notesBox, noteInputWrapper, note, noteInput, noteInputDefault);
      });
    } else {
      var currentNotes = result[videoId]["notes"];  // Object
      // console.log(currentNotes);
      currentNotes[[noteTime]] = noteText;
      var storingNote = browser.storage.local.set({ [videoId] : result[videoId] });
      storingNote.then(() => {
        displayNote(noteTime, noteText);
        switchToNoteInputDefault(notesBox, noteInputWrapper, note, noteInput, noteInputDefault);
      });
    }
  });
}


// Begin UI for dispalying saved notes

//Converts a time in seconds to a time in format (hh):(mm):(ss) (ish).
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

  var noteTimeElement = noteHeader.querySelector('.note-video-time');
  var footerEditBtn = noteRenderer.querySelector('.note-footer-edit-button');
  var footerDelBtn = noteRenderer.querySelector('.note-footer-delete-button');
  var noteFooter = noteRenderer.getElementsByClassName('note-renderer-footer')[0];


  noteContent.querySelector('.note-text-content').textContent = noteText;
  noteTimeElement.textContent = prettifyTime(noteTime);
  noteRendererWrapper.setAttribute('data-note-time', noteTime);

  noteRendererWrapper.appendChild(noteRenderer);
  noteFooter.parentElement.insertBefore(noteHeader, noteFooter);
  noteFooter.parentElement.insertBefore(noteContent, noteFooter);

  // Edit note.
  footerEditBtn.addEventListener('click', function () {
    var noteKeyTime = noteRendererWrapper.dataset.noteTime;  // For lookup by makeEditBtn click

    var noteEdit = makeHTML(noteEdit_raw);
    noteEdit.querySelector('.note-simplebox-text').textContent = noteContent.querySelector('.note-text-content').textContent;

    var editBox = noteEdit.getElementsByClassName("comment-simplebox")[0];
    var edit = noteEdit.getElementsByClassName("comment-simplebox-text")[0];
    var cancelEditBtn = noteEdit.getElementsByClassName("cancel-note-button")[0];
    var makeEditBtn = noteEdit.getElementsByClassName("confirm-note-button")[0];

    edit.addEventListener('focus', function () { focusNote(editBox) });
    edit.addEventListener('blur', function () { blurNote(editBox) });
    edit.addEventListener('keyup', function () { toggleNoteButtonEnabled(edit, makeEditBtn, noteText) });

    cancelEditBtn.addEventListener('click', function () {
      noteEdit.parentElement.replaceChild(noteRenderer, noteEdit);
      noteEdit.remove();
    });

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

    // Display
    noteRenderer.parentElement.replaceChild(noteEdit, noteRenderer);
    placeCaretAtEnd(edit);
  });

  // Delete Note
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

  // Seek to note's time.
  noteTimeElement.addEventListener('click', function() { document.querySelector('.html5-main-video').currentTime = noteTime; });

  insertByTime(noteRendererWrapper);
}

// Getting background info: Video ID and Title.
function setupExistingNotes() {
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

function getVideoId() {
  var page = document.getElementById('page');

  if (page == null) {
    return null;
  }

  for (let cl of page.classList) {
    if (cl.startsWith('video-')) {
      return cl.substring(6);
    }
  }

  return null;
}

function getVideoTitle() {
  var titleEl = document.getElementById('eow-title');
  if (titleEl != null) {
    return titleEl.getAttribute('title');
  } else {
    return null;
  }
}

function main() {
  console.log("main fn called!");
  videoId = getVideoId();
  videoTitle = getVideoTitle();
  console.log('new id: ', videoId);
  console.log('old id: ', formerVideoId);
  console.log(videoTitle);
  if (videoId != null && videoTitle != null && videoId != formerVideoId) {
    console.log("main fn executed!");
    formerVideoId = videoId;  // prevents double injections
    //setup UI
//Me to check30If it already exists
    setupNoteInputSection();
    savedNotesWrapper = makeHTML(savedNotesWrapper_raw); // could pass to insertByTime or query in insertByTime;
    notesSection.appendChild(savedNotesWrapper);
    // inject UI onto page
    var detailsSection = document.getElementById('action-panel-details');
    detailsSection.parentElement.insertBefore(notesSection, detailsSection.nextSibling);
    // setup existing notes.
    setupExistingNotes()
  }
}


var page = document.getElementById("page");
var pageObserver = new MutationObserver(main);
pageObserver.observe(page, { attributes: true });

main();
