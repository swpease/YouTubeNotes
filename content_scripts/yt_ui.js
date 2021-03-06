//Global.
var VIDEO_ID;
var VIDEO_TITLE;

// Raw HTML. Taken and modded from YouTube.
// main wrapper
var notesSection_raw = '<ytd-comments id="notes-wrapper" class="style-scope ytd-watch"></ytd-comments>';

// BEGIN HEADER STUFF
// Contains the components that let you create new notes.
var noteHeaderRenderer_raw = '<ytd-comments-header-renderer class="style-scope ytd-item-section-renderer"></ytd-comments-header-renderer>';
// Same as above, except for title.
var noteSimpleboxRenderer_raw = '<ytd-comment-simplebox-renderer id="notes-input-wrapper" class="style-scope ytd-comments-header-renderer"></ytd-comment-simplebox-renderer>';
// The element displayed when you click to make a new note.
var commentDialogRenderer_raw = '<ytd-comment-dialog-renderer class="style-scope ytd-comment-simplebox-renderer"></ytd-comment-dialog-renderer>';
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
var noteThreadRenderer_raw = '<ytd-comment-thread-renderer class="style-scope ytd-item-section-renderer"></ytd-comment-thread-renderer>';
// To replace the yt-formatted-string.
var noteTextElement_raw = '<span id="content-text" split-lines="" tabindex="-1" class="style-scope ytd-comment-renderer"></span>';
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

/* Takes a string and converts it to a HTML element.
 * @param {string} input: thing to convert to HTML element
 * @return {DOM element}
 */
function makeHTML(input){
  var dummy = document.createElement('div');
  dummy.innerHTML = input;
  return dummy.firstChild;
}

/* Begin the chain of creation!
 */
function setupNoteInputSection() {
  let notesSection = makeHTML(notesSection_raw);

  var detailsSection = document.querySelector("ytd-page-manager ytd-watch #main #meta");
  detailsSection.parentElement.insertBefore(notesSection, detailsSection.nextSibling);
  var injectedNotesSection = document.querySelector("#notes-wrapper");

  var notesObserver = new MutationObserver(function(mutations, observer) {
    setupExistingNotes();

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
    for (let node of mutation.addedNodes) {
      if (node.id == "title") {
        let headerName = node.querySelector(".count-text");
        headerName.textContent = "Notes";
      } else if (node.id == "create") {
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
    // format the default view (#placeholder-area)
    let defaultText = create.querySelector("yt-formatted-string");
    defaultText.textContent = "Add a private note...";

    let placeholderArea = create.querySelector("#placeholder-area");
    let commentDialog = create.querySelector("#comment-dialog");

    // Gets you to the actual note input view.
    placeholderArea.addEventListener('click', function() {
      placeholderArea.setAttribute("hidden", "");
      let attachments = create.querySelector("#attachments");
      attachments.setAttribute("hidden", "");
      commentDialog.removeAttribute("hidden");

      let textArea = commentDialog.querySelector("#labelAndInputContainer textarea#textarea");
      textArea.focus();
    });
    //Tabbability
    placeholderArea.setAttribute("tabindex", "0");
    placeholderArea.addEventListener('keyup', function (e) {
      if (e.key == "Enter") {
        placeholderArea.click();
      }
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
    let defaultText = commentDialog.querySelector("#placeholder");
    defaultText.textContent = "Add a private note...";

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
    changeBtnAttrs(submitBtn);
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

/* Handles "submit" / "Save" button attributes upon btn enabling / disabling
 */
function changeBtnAttrs(btnWrapper) {
  let paperBtn = btnWrapper.querySelector("#button");
  if (!btnWrapper.hasAttribute("disabled")) {
    paperBtn.removeAttribute("aria-disabled");
    paperBtn.removeAttribute("disabled");
    paperBtn.setAttribute("style", "cursor: pointer;");
    paperBtn.setAttribute("tabindex", 0);
  }
  if (btnWrapper.hasAttribute("disabled")) {
    paperBtn.setAttribute("aria-disabled", "");
    paperBtn.setAttribute("disabled", "");
    paperBtn.setAttribute("tabindex", -1);
  }
}

function makeNote() {
  let notesSection = document.querySelector("#notes-wrapper");
  let textMirror = notesSection.querySelector("#mirror");

  var ytVideo = document.querySelector('.html5-main-video');
  var noteTime = ytVideo.currentTime; //Don't format until after storage. Could still accidentally overwrite, but highly unlikely.
  var noteText = textMirror.innerHTML.substring(0, textMirror.innerHTML.length - 6); // Removes trailing %nbsp;

  var gettingItem = browser.storage.local.get(VIDEO_ID);
  gettingItem.then((result) => {
    if (Array.isArray(result)) {  // If Firefox version less than 52.
      result = result[0];
    }
    var objTest = Object.keys(result);

    if(!objTest.includes(VIDEO_ID)) {
      let storingNote = browser.storage.local.set({ [VIDEO_ID] : { "title" : VIDEO_TITLE,
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
      var currentNotes = result[VIDEO_ID]["notes"];  // Object
      currentNotes[[noteTime]] = noteText;
      let storingNote = browser.storage.local.set({ [VIDEO_ID] : result[VIDEO_ID] });
      storingNote.then(() => {
        newDisplayNote(noteTime, noteText);
        let cancelBtn = notesSection.querySelector("ytd-button-renderer#cancel-button");
        cancelBtn.click();
      });
    }
  });
}

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
    displayedNoteTime.textContent = prettifyTime(noteTime);
    displayedNoteTime.setAttribute("tabindex", "0");
    displayedNoteTime.addEventListener('keyup', function (e) {
      if (e.key == "Enter") {
        displayedNoteTime.click();
      }
    });
    // Add note text
    let content = injectedNoteThreadRenderer.querySelector("#content");
    let oldNoteTextElement = content.querySelector("#content-text");
    let noteTextElement = makeHTML(noteTextElement_raw);

    let formattedNoteText = noteText.replace(/<br>/g, '\n');
    noteTextElement.innerText = formattedNoteText;
    content.replaceChild(noteTextElement, oldNoteTextElement);
    // Untab pointlessly tabbable element
    let uselessTextElement = content.querySelector("#voted-option");
    uselessTextElement.setAttribute("tabindex", "-1");

    // Misc layout details:
    let expander = injectedNoteThreadRenderer.querySelector("#body #expander");
    expander.removeAttribute("collapsed");
    let randomDot = injectedNoteThreadRenderer.querySelector("#body #main #header #moderation-reason-divider");
    randomDot.remove();
    let invisibleImg = injectedNoteThreadRenderer.querySelector("#body #author-thumbnail a.yt-simple-endpoint");
    invisibleImg.setAttribute("style", "cursor: default;");

    // Note time fnality:
    displayedNoteTime.addEventListener('click', function () {
      var ytVideo = document.querySelector('.html5-main-video');
      ytVideo.currentTime = noteTime;
    });

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
      let formattedNoteText = noteText.replace(/<br>/g, '\n');
      editableTextArea.innerHTML = formattedNoteText;
      editableTextArea.focus();
      editableTextArea.setSelectionRange(noteText.length, noteText.length);

      setupEditNoteButtons(body, editDialog, observer);
    });
    editDialogObserver.observe(injectedEditDialogContents, {childList: true});

  });

  // Delete Note
  deleteBtn.addEventListener('click', function () {
    var gettingItem = browser.storage.local.get(VIDEO_ID);
    gettingItem.then((result) => {
      if (Array.isArray(result)) {  // If Firefox version less than 52.
        result = result[0];
      }

      var currentNotes = result[VIDEO_ID]["notes"];  // Object
      delete currentNotes[[noteTime]];
      if (Object.keys(currentNotes).length == 0) {
        browser.storage.local.remove(VIDEO_ID);
        note.remove();
      } else {
        var storingNote = browser.storage.local.set({ [VIDEO_ID] : result[VIDEO_ID] });
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
  changeBtnAttrs(submitBtn);

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

    var gettingItem = browser.storage.local.get(VIDEO_ID);
    gettingItem.then((result) => {
      if (Array.isArray(result)) {  // If Firefox version less than 52.
        result = result[0];
      }

      var currentNotes = result[VIDEO_ID]["notes"];  // Object
      currentNotes[[noteTime]] = editedText;
      var storingNote = browser.storage.local.set({ [VIDEO_ID] : result[VIDEO_ID] });
      storingNote.then(() => {
        let formattedEditedText = editedText.replace(/<br>/g, '\n');
        body.querySelector("span#content-text").innerText = formattedEditedText;

        editDialog.setAttribute("hidden", "");
        body.removeAttribute("hidden");
        editDialog.firstChild.remove();
      });
    });
  });

  let submitEditBtnObserver = new MutationObserver(function () {
    changeBtnAttrs(submitBtn);
  });
  submitEditBtnObserver.observe(submitBtn, {attributes: true});

}

// Initialization stuff:

function setupExistingNotes() {
  var gettingSavedNotes = browser.storage.local.get(VIDEO_ID);
  gettingSavedNotes.then((result) => {
    if (Array.isArray(result)) {  // If Firefox version less than 52.
      result = result[0];
    }

    if (Object.keys(result).length == 0) {
      return;
    }

    var savedNotes = result[VIDEO_ID]["notes"];
    for (var noteTime of Object.keys(savedNotes)) {
      var noteText = savedNotes[noteTime];
      newDisplayNote(noteTime, noteText);
    }
  });
}

// TODO could use ytd-watch video-id maybe?
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
  VIDEO_ID = getVideoId();
  VIDEO_TITLE = getVideoTitle();
  var injectedContent = document.getElementById('notes-wrapper');
  if (VIDEO_ID != null && VIDEO_TITLE != null) {
    if (!injectedContent) {
      setupNoteInputSection();
    } else {
      let priorVideoNotes = injectedContent.querySelectorAll("ytd-comment-thread-renderer");
      for (let note of priorVideoNotes) {
        note.remove();
      }
      setupExistingNotes();
    }
  }
}

var pageTitle = document.querySelector("title");
var pageObserver = new MutationObserver(main);
pageObserver.observe(pageTitle, { childList: true });

main();
