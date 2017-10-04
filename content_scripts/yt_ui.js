//Global.
var videoId;
var videoTitle;
//Needed in noteInput and savedNotes sections.
var notesSection;
var savedNotesWrapper;  // should de-globalize

// Raw HTML. Taken and modded from YouTube.
// main wrapper
var notesSection_raw = '<ytd-comments id="notes-wrapper" class="style-scope ytd-watch"></ytd-comments>';

// BEGIN HEADER STUFF
// Contains the components that let you create new notes.
var noteHeaderRenderer_raw = '<ytd-comments-header-renderer class="style-scope ytd-item-section-renderer"></ytd-comments-header-renderer>';
// Same as above, except for title.
var noteSimpleboxRenderer_raw = '<ytd-comment-simplebox-renderer id="notes-input-wrapper" class="style-scope ytd-comments-header-renderer"></ytd-comment-simplebox-renderer>';
// The element displayed when you click to make a new note.
var commentDialogRenderer_raw = '<ytd-comment-dialog-renderer class="style-scope ytd-comment-simplebox-renderer"></ytd-comment-dialog-renderer>'
// Btn for commentDialogRenderer
var cancelBtnContents_raw = '<a is="yt-endpoint" tabindex="-1" class="style-scope ytd-button-renderer">' +
                            '<paper-button role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" id="button" class="style-scope ytd-button-renderer">' +
                            '<span id="text" class="style-scope ytd-button-renderer">Cancel</span>' +
                            '<paper-ripple class="style-scope paper-button">' +
                            '<div id="background" class="style-scope paper-ripple" style="opacity: 0;"></div><div id="waves" class="style-scope paper-ripple"></div>' +
                            '</paper-ripple></paper-button></a>';
// Btn for commentDialogRenderer
var submitBtnContents_raw = '<a is="yt-endpoint" tabindex="-1" class="style-scope ytd-button-renderer">' +
                            '<paper-button role="button" tabindex="-1" animated="" aria-disabled="true" elevation="0" id="button" class="style-scope ytd-button-renderer style-primary" aria-label="Note" disabled="">' +
                            '<span id="text" class="style-scope ytd-button-renderer style-primary">Note</span>' +
                            '</paper-button></a>';
// END HEADER STUFF


// Displays a single saved note.
var noteThreadRenderer_raw = '<ytd-comment-thread-renderer class="style-scope ytd-item-section-renderer"></ytd-comment-thread-renderer>'
// To replace the yt-formatted-string.
var noteTextElement_raw = '<span id="content-text" split-lines="" tabindex="0" class="style-scope ytd-comment-renderer"></span>';
//
var editNoteBtnContents_raw = '<a is="yt-endpoint" tabindex="-1" class="style-scope ytd-button-renderer">' +
                              '<paper-button role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" id="button" class="style-scope ytd-button-renderer style-text">' +
                              '<span id="text" class="style-scope ytd-button-renderer style-text">Edit</span>' +
                              '</paper-button></a>';

var deleteNoteBtnContents_raw = '<a is="yt-endpoint" tabindex="-1" class="style-scope ytd-button-renderer">' +
                                '<paper-button role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" id="button" class="style-scope ytd-button-renderer style-text">' +
                                '<span id="text" class="style-scope ytd-button-renderer style-text">Delete</span>' +
                                '</paper-button></a>';
// Inject at #edit-dialog when user clicks to edit a note.
var editCommentDialogRenderer_raw = '<ytd-comment-dialog-renderer class="style-scope ytd-comment-renderer"></ytd-comment-dialog-renderer>';

var editNoteSaveBtn_raw = '<a is="yt-endpoint" tabindex="-1" class="style-scope ytd-button-renderer">' +
                          '<paper-button role="button" tabindex="-1" animated="" aria-disabled="true" elevation="0" id="button" class="style-scope ytd-button-renderer" style="pointer-events: none;" disabled="">' +
                          '<span id="text" class="style-scope ytd-button-renderer">Save</span>' +
                          '<paper-ripple class="style-scope paper-button">' +
                          '<div id="background" class="style-scope paper-ripple" style="opacity: 0;"></div><div id="waves" class="style-scope paper-ripple"></div>' +
                          '</paper-ripple></paper-button></a>';

// var noteInput_raw = '<div id="note-simplebox-create-note" class="comment-simplebox-content"><div class="comment-simplebox" id="note-simplebox"><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div>' +
//                     '<div class="comment-simplebox-frame"><div class="comment-simplebox-prompt"></div><div class="comment-simplebox-text" role="textbox" aria-multiline="true" contenteditable="true" data-placeholder="Add a private note..."></div></div>' +
//                     '<div class="comment-simplebox-controls"><div class="comment-simplebox-buttons">' +
//                     '<button class="cancel-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-default comment-simplebox-cancel" type="button" onclick=";return false;"><span class="yt-uix-button-content">Cancel</span>' +
//                     '</button><button class="confirm-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-primary yt-uix-button-empty" type="button" onclick=";return false;" aria-label="Make Note" disabled="">Make Note</button></div></div></div></div>';

// Equivalent of the part below the horizontal bar:
// contains all the notes
var savedNotesWrapper_raw = '<div class="comment-section-renderer-items" id="saved-notes-section-renderer-items"></div>';
// wrapper for noteRenderer (To switch with noteEdit)
var noteRendererWrapper_raw = '<section class="note-renderer comment-thread-renderer"></section>'
// contains a single note. Also includes footer.
var noteRenderer_raw = '<div class="comment-renderer"><div class="comment-renderer-content"><div class="note-renderer-footer comment-renderer-footer"><div class="comment-action-buttons-toolbar"><button type="button" class="note-footer-edit-button note-footer-btn notes-footer-item yt-uix-button yt-uix-button-link">Edit</button><button type="button" class="notes-footer-item note-footer-spacer yt-uix-button yt-uix-button-link">•</button><button type="button" class="note-footer-delete-button note-footer-btn notes-footer-item yt-uix-button yt-uix-button-link">Delete</button></div></div></div></div>';
var noteHeader_raw = '<div class="comment-renderer-header"><span class="comment-author-text note-video-time" style="cursor:pointer;">Time goes here</span></div>';
var noteContent_raw = '<div class="comment-renderer-text" tabindex="0" role="article"><div class="comment-renderer-text-content expanded note-text-content">Note goes here</div></div>';
// Just like the noteInput section.
var noteEdit_raw = '<div class="comment-renderer comment-renderer-editing"><div class="comment-simplebox-edit comment-simplebox-content">' +
                   '<div class="comment-simplebox focus"><div class="comment-simplebox-arrow"><div class="arrow-inner"></div><div class="arrow-outer"></div></div>' +
                   '<div class="comment-simplebox-frame"><div class="comment-simplebox-prompt"></div><div class="note-simplebox-text comment-simplebox-text" role="textbox" aria-multiline="true" contenteditable="true"></div></div>' +
                   '<div class="comment-simplebox-controls"><div class="comment-simplebox-buttons">' +
                   '<button class="cancel-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-default comment-simplebox-cancel" type="button" onclick=";return false;"><span class="yt-uix-button-content">Cancel</span>' +
                   '</button><button class="confirm-note-button yt-uix-button yt-uix-button-size-default yt-uix-button-primary yt-uix-button-empty" type="button" onclick=";return false;" aria-label="Save" disabled="">Save</button></div></div></div></div></div>';


/* Takes a string and converts it to a HTML element.
 * @param {string} input: thing to convert to HTML element
 * @return {DOM element}
 */
function makeHTML(input){
  var dummy = document.createElement('div');
  dummy.innerHTML = input;
  return dummy.firstChild;
}

/* The equivalent in YouTube's comments section is the part where you enter in
 * your comment to post, at the top of the comments section.
 * This fn makes the Elements, extracts any additional Elements needed for
 * event handling, puts everything together, and inserts it into the global
 * notesSection (outermost) Element.
 */
function setupNoteInputSection() {
  notesSection = makeHTML(notesSection_raw);

  // YT makes stuff here.
  var detailsSection = document.querySelector("#meta");
  detailsSection.parentElement.insertBefore(notesSection, detailsSection.nextSibling);
  var injectedNotesSection = document.querySelector("#notes-wrapper");

  var notesObserver = new MutationObserver(function(mutations, observer) {
    let mutation = mutations[0];
    let ytdItemSectionRenderer = mutation.addedNodes[1];
    let header = ytdItemSectionRenderer.childNodes[1];
    setupNoteHeader(header, observer);
  });
  notesObserver.observe(injectedNotesSection, {childList: true});
}

function setupNoteHeader(header, observer) {
  observer.disconnect();

  let headerRenderer = makeHTML(noteHeaderRenderer_raw);
  header.appendChild(headerRenderer);
  var injectedHeaderRenderer = header.querySelector("ytd-comments-header-renderer");

  var headerObserver = new MutationObserver(function(mutations, observer) {
    let mutation = mutations[0];
    // console.log(mutation.addedNodes);
    for (let node of mutation.addedNodes) {
      if (node.id == "title") {
        let headerName = node.querySelector(".count-text");
        headerName.innerHTML = "Notes";
      } else if (node.id == "create") {
        // console.log(node);
        setupNoteCreate(node, observer);
      }
    }
  });
  headerObserver.observe(injectedHeaderRenderer, {childList: true});
}

// Contents of #create
function setupNoteCreate(create, observer) {
  observer.disconnect();

  let noteSimpleboxRenderer = makeHTML(noteSimpleboxRenderer_raw);
  create.appendChild(noteSimpleboxRenderer);
  let injectedNoteSimpleboxRenderer = create.querySelector("ytd-comment-simplebox-renderer");

  var creatorObserver = new MutationObserver(function(mutations, observer) {
    let mutation = mutations[0];
    // format the default view (#placeholder-area)
    let defaultText = create.querySelector("yt-formatted-string");
    defaultText.innerHTML = "Add a private note...";

    let placeholderArea = create.querySelector("#placeholder-area");
    let commentDialog = create.querySelector("#comment-dialog");

    /* get to actual note input
     *
     */
    placeholderArea.addEventListener('click', function() {
      placeholderArea.setAttribute("hidden", "");
      let attachments = create.querySelector("#attachments");
      attachments.setAttribute("hidden", "");
      commentDialog.removeAttribute("hidden");
      // Focus on text area.
      let textArea = commentDialog.querySelector("#labelAndInputContainer textarea#textarea");
      textArea.focus();
    });

    setupNoteCreateDialog(commentDialog, observer);
  });
  creatorObserver.observe(injectedNoteSimpleboxRenderer, {childList: true});
}

// The UI that pops up when you click to Add a private note...
function setupNoteCreateDialog(commentDialog, observer) {
  observer.disconnect();

  let commentDialogRenderer = makeHTML(commentDialogRenderer_raw);
  commentDialog.appendChild(commentDialogRenderer);
  let injectedCommentDialogRenderer = commentDialog.querySelector("ytd-comment-dialog-renderer");

  var commentDialogObserver = new MutationObserver(function(mutations, observer) {
    let mutation = mutations[0];
    let defaultText = commentDialog.querySelector("#placeholder"); //TODO add aria-label to iron-autogrow-textarea
    defaultText.innerHTML = "Add a private note...";

    let avatar = commentDialog.querySelector("#author-thumbnail");
    avatar.remove();

    let btnWrapper = commentDialog.querySelector("#buttons");
    // Move to next fn if possible
    let btns = btnWrapper.querySelectorAll("ytd-button-renderer");
    for (let btn of btns) {
      btn.setAttribute("is-paper-button", "");
    }
    setupCreateNoteButtons(btnWrapper, observer);
  });
  commentDialogObserver.observe(injectedCommentDialogRenderer, {childList: true});
}

function setupCreateNoteButtons(btnWrapper, observer) {
  observer.disconnect();

  let cancelBtnContents = makeHTML(cancelBtnContents_raw);
  let cancelBtn = btnWrapper.querySelector('#cancel-button');
  cancelBtn.appendChild(cancelBtnContents);

  let submitBtnContents = makeHTML(submitBtnContents_raw);
  let submitBtn = btnWrapper.querySelector('#submit-button');
  submitBtn.classList.add("style-primary");
  submitBtn.setAttribute("disabled", "");
  submitBtn.appendChild(submitBtnContents);
  // Fix "Note" button attrs.
  let submitBtnObserver = new MutationObserver(function () {
    let paperBtn = submitBtn.querySelector("#button");
    if (!submitBtn.hasAttribute("disabled")) {
      paperBtn.removeAttribute("aria-disabled");
      paperBtn.removeAttribute("disabled");
      paperBtn.setAttribute("style", "cursor: pointer;");
      paperBtn.setAttribute("tabindex", 0);
    }
    if (submitBtn.hasAttribute("disabled")) {
      paperBtn.setAttribute("aria-disabled", "");
      paperBtn.setAttribute("disabled", "");
      paperBtn.setAttribute("tabindex", -1);
    }
  });
  submitBtnObserver.observe(submitBtn, {attributes: true});

  cancelBtn.addEventListener('click', revertToDefaultView);
  submitBtn.addEventListener('click', makeNote);
}

/* Changes the view from the editable note creation section to just
 * the default view that you click on to switch to the editable version.
 */
function revertToDefaultView() {
  let notesSection = document.querySelector("#notes-wrapper");
  let placeholderArea = notesSection.querySelector("#placeholder-area");
  let attachments = notesSection.querySelector("#attachments");
  let commentDialog = notesSection.querySelector("#comment-dialog");
  commentDialog.setAttribute("hidden", "");
  placeholderArea.removeAttribute("hidden");
  attachments.removeAttribute("hidden");
}

function makeNote() {
  let notesSection = document.querySelector("#notes-wrapper");
  let textMirror = notesSection.querySelector("#mirror");

  var ytVideo = document.querySelector('.html5-main-video');
  var noteTime = ytVideo.currentTime; //Don't format until after storage. Could still accidentally overwrite, but highly unlikely.
  var noteText = textMirror.innerHTML.substring(0, textMirror.innerHTML.length - 6); // Removes trailing %nbsp;

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
        newDisplayNote(noteTime, noteText);
        // Not sure why this works but calling revertToDefaultView doesnt...
        let cancelBtn = notesSection.querySelector("ytd-button-renderer#cancel-button");
        cancelBtn.click();
      });
    } else {
      var currentNotes = result[videoId]["notes"];  // Object
      currentNotes[[noteTime]] = noteText;
      var storingNote = browser.storage.local.set({ [videoId] : result[videoId] });
      storingNote.then(() => {
        newDisplayNote(noteTime, noteText);
        let cancelBtn = notesSection.querySelector("ytd-button-renderer#cancel-button");
        cancelBtn.click();
      });
    }
  });
}

  // noteInputDefault.addEventListener('click', function() { switchToNoteInput(noteFocusToggles, noteInputWrapper, note, noteInput, noteInputDefault) });
  // cancelNoteBtn.addEventListener('click', function() { switchToNoteInputDefault(noteFocusToggles, noteInputWrapper, note, noteInput, noteInputDefault) });
  // makeNoteBtn.addEventListener('click', function() { makeNote(noteFocusToggles, noteInputWrapper, note, noteInput, noteInputDefault) });
  // note.addEventListener('focus', function () { focusNote(noteFocusToggles) });
  // note.addEventListener('blur', function () { blurNote(noteFocusToggles) });
  // note.addEventListener('keyup', function () { toggleNoteButtonEnabled(note, makeNoteBtn) });


// BEGIN Event functionality for making a new note. First three fn's also used in note editing.
function blurNote(noteFocusToggles) {
  noteFocusToggles[0].classList.replace("focused", "not-focused");
  noteFocusToggles[1].classList.remove("is-highlighted");
  // commentSimplebox.classList.remove("focus");
}

function focusNote(noteFocusToggles) {
  noteFocusToggles[0].classList.replace("not-focused", "focused");
  noteFocusToggles[1].classList.add("is-highlighted");
  // commentSimplebox.classList.add("focus");
}

function toggleNoteButtonEnabled(commentSimpleboxText, confirmNoteButton, initialText = "") {
  commentSimpleboxText.innerHTML == initialText ? confirmNoteButton.disabled = true : confirmNoteButton.disabled = false;
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

// Dispalying saved notes:

/* Converts a time in seconds to a time in YouTube format: ((h)h):(mm):ss (ish).
 * @param {string} time: A float representing the video time in seconds.
 * @return {string}: formatted hh:mm:ss
 */
function prettifyTime(time) {
  var vidDuration = document.querySelector('.html5-main-video').duration;
  var vidHrs = Math.floor(vidDuration / 3600);
  var prettyTime = "";

  time = Math.floor(time);
  var hours = Math.floor(time / 3600);
  var rem = time % 3600;
  var mins = Math.floor(rem / 60);
  var secs = rem % 60;

  if (vidHrs > 0 || hours > 0) {
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

/* Called by displayNote so that you know they are displayed in order by time.
 * @param {Element} contents: #contents. Contains all of the saved notes.
 * @param {Element} note: a noteThreadRenderer
 */
function insertByTime(contents, note) {
  var displayedNotes = contents.querySelectorAll("ytd-comment-thread-renderer");

  if (displayedNotes.length > 0) {
    for (var displayedNote of displayedNotes) {
      if (Number(note.dataset.noteTime) < Number(displayedNote.dataset.noteTime)) {
        contents.insertBefore(note, displayedNote);
        return;
      }
    }
  }
  contents.appendChild(note);
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

/* Ugh.
 * Sets up the note's Elements, extracts relevant Elements for event listening,
 * then makes the event listeners, and inserts the note into the DOM.
 * @param {string} noteTime: The video's time at the moment that "Save Note" was clicked.
 * @param {string} noteText: The note that the user wants to save.
 */
function newDisplayNote(noteTime, noteText) {
  let contents = document.querySelector("#notes-wrapper #contents");

  let noteThreadRenderer = makeHTML(noteThreadRenderer_raw);
  noteThreadRenderer.setAttribute('data-note-time', noteTime);
  insertByTime(contents, noteThreadRenderer);
  let injectedNoteThreadRenderer = contents.querySelector('ytd-comment-thread-renderer[data-note-time="' + noteTime + '"]');

  let noteThreadObserver = new MutationObserver(function(mutations, observer) {
    // Add note time
    let displayedNoteTime = injectedNoteThreadRenderer.querySelector("#author-text span");
    displayedNoteTime.innerHTML = prettifyTime(noteTime);
    // injectedNoteThreadRenderer.setAttribute('data-note-time', noteTime);
    // displayedNoteTime.setAttribute('data-note-time', noteTime); // put in injectedNoteThreadRenderer?
    // Add note text
    let content = injectedNoteThreadRenderer.querySelector("#content");
    let oldNoteTextElement = content.querySelector("#content-text");
    let noteTextElement = makeHTML(noteTextElement_raw);
    noteTextElement.innerHTML = noteText;
    content.replaceChild(noteTextElement, oldNoteTextElement);
    // Setup btns:
    setupSavedNoteButtons(injectedNoteThreadRenderer, observer);
  });
  noteThreadObserver.observe(injectedNoteThreadRenderer, {childList: true});

}
/*******SHOULD I BE PUTTING THE OBSERVERS BEFORE THE INJECTEDELEMENT RETRIEVALS?********/

/*
 * Sets up the note's buttons: [Edit] and [Delete]
 * @param {Element} note: A single "note" unit: ytd-comment-thread-renderer
 * @param {MutationObserver} observer: The observer that triggered this fn. To disconnect.
 */
function setupSavedNoteButtons(note, observer) {
  observer.disconnect();
  // Create btns
  let editBtn = note.querySelector("#reply-button");
  editBtn.setAttribute("is-paper-button", "");
  let editNoteBtnContents = makeHTML(editNoteBtnContents_raw);
  editBtn.appendChild(editNoteBtnContents);

  let btnContainer = note.querySelector("#toolbar");
  let deleteBtn = btnContainer.querySelector("#like-button"); // To turn into a delete button.
  let deleteNoteBtnContents = makeHTML(deleteNoteBtnContents_raw);
  deleteBtn.appendChild(deleteNoteBtnContents);

  let voteCount = btnContainer.querySelector("#vote-count");
  voteCount.remove();

  // Functionality
  let noteTime = note.dataset.noteTime;

  // Edit Note
  editBtn.addEventListener('click', function () {
    let body = note.querySelector("#body"); // The regular view.
    let editDialog = note.querySelector("#edit-dialog");
    let editDialogContents = makeHTML(editCommentDialogRenderer_raw);
    editDialog.appendChild(editDialogContents);
    body.setAttribute("hidden", "");
    editDialog.removeAttribute("hidden");
    let injectedEditDialogContents = editDialog.firstChild;

    var editDialogObserver = new MutationObserver(function(mutations, observer) {
      let noteText = body.querySelector("#content-text").innerHTML;
      let editableTextArea = editDialog.querySelector("#labelAndInputContainer textarea#textarea");
      editableTextArea.textContent = noteText;
      editableTextArea.focus();
      setupEditNoteButtons(body, editDialog, observer);
    });
    editDialogObserver.observe(injectedEditDialogContents, {childList: true});

  })

  // Delete Note
  deleteBtn.addEventListener('click', function () {
    var gettingItem = browser.storage.local.get(videoId);
    gettingItem.then((result) => {
      if (Array.isArray(result)) {  // If Firefox version less than 52.
        result = result[0];
      }

      var currentNotes = result[videoId]["notes"];  // Object
      delete currentNotes[[noteTime]];
      if (Object.keys(currentNotes).length == 0) {
        browser.storage.local.remove(videoId);
        note.remove();
      } else {
        var storingNote = browser.storage.local.set({ [videoId] : result[videoId] });
        storingNote.then(() => {
          note.remove();
        });
      }
    });
  });

}

/* The [Cancel] and [Save] buttons that are below the edit widget for a note.
 * @param {Element} body: Default view. To switch with editDialog upon btn click.
 * @param {Element} editDialog: Edit view.
 * @param {MutationObserver} observer: To disconnect.
 */
function setupEditNoteButtons(body, editDialog, observer) {
  observer.disconnect();

  let buttons = editDialog.querySelector("#footer #buttons");
  let cancelBtn = buttons.querySelector("#cancel-button");
  let submitBtn = buttons.querySelector("#submit-button");
  let cancelBtnContents = makeHTML(cancelBtnContents_raw);
  let submitBtnContents = makeHTML(editNoteSaveBtn_raw);

  cancelBtn.appendChild(cancelBtnContents);
  submitBtn.appendChild(submitBtnContents);

  cancelBtn.setAttribute("is-paper-button", "");
  submitBtn.setAttribute("is-paper-button", "");

  cancelBtn.addEventListener('click', function () {
    editDialog.setAttribute("hidden", "");
    body.removeAttribute("hidden");
    editDialog.firstChild.remove();
  });

  submitBtn.addEventListener('click', function () {
    var textMirror = editDialog.querySelector("#mirror");
    var editedText = textMirror.innerHTML.substring(0, textMirror.innerHTML.length - 6); // Removes trailing %nbsp;

    var noteRenderer = editDialog.closest("ytd-comment-thread-renderer");
    var noteTime = noteRenderer.dataset.noteTime;

    var gettingItem = browser.storage.local.get(videoId);
    gettingItem.then((result) => {
      if (Array.isArray(result)) {  // If Firefox version less than 52.
        result = result[0];
      }

      var currentNotes = result[videoId]["notes"];  // Object
      currentNotes[[noteTime]] = editedText;
      var storingNote = browser.storage.local.set({ [videoId] : result[videoId] });
      storingNote.then(() => {
        body.querySelector("span#content-text").innerHTML = editedText;

        editDialog.setAttribute("hidden", "");
        body.removeAttribute("hidden");
        editDialog.firstChild.remove();
      });
    });
  });
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


  noteContent.querySelector('.note-text-content').innerHTML = noteText;
  noteTimeElement.textContent = prettifyTime(noteTime);
  noteRendererWrapper.setAttribute('data-note-time', noteTime);

  noteRendererWrapper.appendChild(noteRenderer);
  noteFooter.parentElement.insertBefore(noteHeader, noteFooter);
  noteFooter.parentElement.insertBefore(noteContent, noteFooter);

  // Edit note.
  footerEditBtn.addEventListener('click', function () {
    var noteKeyTime = noteRendererWrapper.dataset.noteTime;  // For lookup by makeEditBtn click

    var noteEdit = makeHTML(noteEdit_raw);
    noteEdit.querySelector('.note-simplebox-text').innerHTML = noteContent.querySelector('.note-text-content').innerHTML;

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
      var editedText = noteEdit.querySelector('.note-simplebox-text').innerHTML;

      var gettingItem = browser.storage.local.get(videoId);
      gettingItem.then((result) => {
        if (Array.isArray(result)) {  // If Firefox version less than 52.
          result = result[0];
        }

        var currentNotes = result[videoId]["notes"];  // Object
        currentNotes[[noteKeyTime]] = editedText;
        var storingNote = browser.storage.local.set({ [videoId] : result[videoId] });
        storingNote.then(() => {
          noteContent.querySelector('.note-text-content').innerHTML = editedText;
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


// Initialization stuff:

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
      var noteText = savedNotes[noteTime];
      displayNote(noteTime, noteText);
    }
  });
}

/* Gets YT video ID.
 * @return {null or string}: The video's ID, if it exists, else null.
 */
function getVideoId() {
  var href = window.location.href;
  var vidSplit = href.split("v=");

  if (vidSplit.length == 1) {
    return null;
  }

  var vidHalf = vidSplit[1];

  return vidHalf.split("&")[0];
}

/* Gets YT video title.
 * @return {null or string}: The video's title, if it exists, else null.
 */
function getVideoTitle() {
  var titleEl = document.querySelector('#container > h1');
  if (titleEl != null) {
    return titleEl.innerHTML;
  } else {
    return null;
  }
}

function main() {
  videoId = getVideoId();
  videoTitle = getVideoTitle();
  var injectedContent = document.getElementById('notes-wrapper');
  if (videoId != null && videoTitle != null && injectedContent == null) {
    //setup UI
    setupNoteInputSection();
    // savedNotesWrapper = makeHTML(savedNotesWrapper_raw); // could pass to insertByTime or query in insertByTime;
    // notesSection.appendChild(savedNotesWrapper);
    // inject UI onto page
    // var detailsSection = document.querySelector("#meta");
    // detailsSection.parentElement.insertBefore(notesSection, detailsSection.nextSibling);
    // console.log("finished");
    // setup existing notes.
    // setupExistingNotes();
  }
}

// Need MutationObserver b/c YouTube doesn't reload upon moving to new pages when already on YT.
// var page = document.getElementById("page");
// var pageObserver = new MutationObserver(main);
// pageObserver.observe(page, { attributes: true });

main();
