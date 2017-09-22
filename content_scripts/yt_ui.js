//Global.
var videoId;
var videoTitle;
//Needed in noteInput and savedNotes sections.
var notesSection;
var savedNotesWrapper;  // should de-globalize

// Raw HTML. Taken and modded from YouTube.
// main wrapper
var notesSection_raw = '<ytd-comments id="notes-wrapper" class="style-scope ytd-watch"></ytd-comments>';
// second-tier wrapper in 9/2017 YT update
// var notesSectionRenderer_raw = '<ytd-item-section-renderer id="notes-wrapper-renderer" class="style-scope ytd-comments"></ytd-item-section-renderer>';

// Sections for making a new note:
// equivalent to #header on YT
// var noteHeaderWrapper_raw = '<div class="style-scope ytd-item-section-renderer"></div>';
// second-tier wrapper in 9/2017 YT update
var noteHeaderWrapperRenderer_raw = '<ytd-comments-header-renderer class="style-scope ytd-item-section-renderer"></ytd-comments-header-renderer>';
// title
var notesSectionTitle_raw = '<div class="style-scope ytd-comments-header-renderer">' +
                             '<h2 class="style-scope ytd-comments-header-renderer">' +
                             '<yt-formatted-string class="count-text style-scope ytd-comments-header-renderer">Notes</yt-formatted-string></h2></div>';
// new create notes wrapper (tier 1); probably want to call noteInputWrapper_raw's wrapper
var noteInputWrapperWrapper_raw = '<div class="style-scope ytd-comments-header-renderer"></div>';
// new notes wrapper for acting upon later
var noteInputWrapper_raw = '<ytd-comment-simplebox-renderer id="notes-input-wrapper" class="style-scope ytd-comments-header-renderer"></ytd-comment-simplebox-renderer>';
// The default "make a new note" section.
var noteInputDefault_raw = '<div class="style-scope ytd-comment-simplebox-renderer">' +
                           '<yt-formatted-string role="textbox" tabindex="0" class="style-scope ytd-comment-simplebox-renderer">Add a private note...</yt-formatted-string></div>';
// The element displayed when you click to make a new note.
var commentDialogRenderer_raw = '<ytd-comment-dialog-renderer class="style-scope ytd-comment-simplebox-renderer"></ytd-comment-dialog-renderer>'

var noteInput_raw = '<div id="note-simplebox-create-note" class="style-scope ytd-comment-simplebox-renderer">' +
                    '<ytd-comment-dialog-renderer class="style-scope ytd-comment-simplebox-renderer">' +
                    '<ytd-commentbox class="style-scope ytd-comment-dialog-renderer" added-attachment="no attachment">' +
                    '<div class="style-scope ytd-commentbox">' + // #main
                    // content
                    '<div id="note-creation-box" class="not-focused style-scope ytd-commentbox">' + // to toggle on focus 1/3
                    '<paper-input-container id="input-container" no-label-float="" class="style-scope ytd-commentbox">' +
                    '<template is="dom-if" class="style-scope paper-input-container"></template>' + // what is this?
                    '<div class="input-content style-scope paper-input-container">' +
                    '<div id="labelAndInputContainer" class="label-and-input-container style-scope paper-input-container">' +
                    '<label id="placeholder" aria-hidden="true" slot="input" class="style-scope ytd-commentbox">Add a public comment...</label>' +
                    '<iron-autogrow-textarea id="note-textarea" class="paper-input-input style-scope ytd-commentbox" maxlength="10000" required="true" slot="input" aria-disabled="false" aria-label="Add a public comment...">' + // toggle 2/3
                    '<div id="mirror" class="mirror-text style-scope iron-autogrow-textarea" aria-hidden="true"></div>' +
                    '<div class="textarea-container fit style-scope iron-autogrow-textarea">' +
                    '<textarea id="textarea" class="style-scope iron-autogrow-textarea" rows="1" autocomplete="off" required="" maxlength="10000"></textarea>' +
                    '</div>' +
                    '</iron-autogrow-textarea></div></div>' +
                    '<div id="note-underline" class="underline style-scope paper-input-container"><div class="unfocused-line style-scope paper-input-container"></div><div class="focused-line style-scope paper-input-container"></div></div>' + // to toggle on focus 3/3
                    '</paper-input-container></div>' +
                    // footer
                    '<div class="style-scope ytd-commentbox">' +
                    // cancel btn
                    '<ytd-button-renderer class="style-scope ytd-commentbox" button-renderer="" is-paper-button="">' +
                    '<a is="yt-endpoint" tabindex="-1" class="style-scope ytd-button-renderer">' +
                    '<paper-button role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" id="button" class="style-scope ytd-button-renderer">' +
                    '<yt-formatted-string id="text" class="style-scope ytd-button-renderer">Cancel</yt-formatted-string>' +
                    '<paper-ripple class="style-scope paper-button"><div id="background" class="style-scope paper-ripple" style="opacity: 0;"></div><div id="waves" class="style-scope paper-ripple"></div></paper-ripple>' +
                    '</paper-button></a></ytd-button-renderer>' +
                    // save btn
                    '<ytd-button-renderer class="style-scope ytd-commentbox style-primary" button-renderer="" is-paper-button="">' +
                    '<a is="yt-endpoint" tabindex="-1" class="style-scope ytd-button-renderer">' +
                    '<paper-button id="button" role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" class="style-scope ytd-button-renderer style-primary">' +
                    '<yt-formatted-string class="style-scope ytd-button-renderer style-primary">Comment</yt-formatted-string>' +
                    '</paper-button></a></ytd-button-renderer>' +
                    '</div>' +
                    // end footer
                    '</div></ytd-commentbox></ytd-comment-dialog-renderer></div>';
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

function getElementWhenReady(selector) {
  console.log("not ready");
  if (document.querySelector(selector)) {
    console.log("ready", document.querySelector(selector))
    return document.querySelector(selector);
  } else {
    setTimeout(getElementWhenReady, 100, selector);
  }
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

  let headerRenderer = makeHTML(noteHeaderWrapperRenderer_raw);
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

  let noteSimpleboxRenderer = makeHTML(noteInputWrapper_raw);
  create.appendChild(noteSimpleboxRenderer);
  let injectedNoteSimpleboxRenderer = create.querySelector("ytd-comment-simplebox-renderer");

  var creatorObserver = new MutationObserver(function(mutations, observer) {
    let mutation = mutations[0];
    // format the default view (#placeholder-area)
    let defaultText = create.querySelector("yt-formatted-string");
    defaultText.innerHTML = "Add a private note...";

    let placeholderArea = create.querySelector("#placeholder-area");
    let attachments = create.querySelector("#attachments");
    let commentDialog = create.querySelector("#comment-dialog");

    // swap visible elements
    placeholderArea.addEventListener('click', function() {
      placeholderArea.setAttribute("hidden", "");
      attachments.setAttribute("hidden", "");
      commentDialog.removeAttribute("hidden");
    });

    setupNoteCreateDialog(commentDialog, observer);
  });
  creatorObserver.observe(injectedNoteSimpleboxRenderer, {childList: true});
}

function setupNoteCreateDialog(commentDialog, observer) {
  observer.disconnect();

  let commentDialogRenderer = makeHTML(commentDialogRenderer_raw);
  commentDialog.appendChild(commentDialogRenderer);
  let injectedCommentDialogRenderer = commentDialog.querySelector("ytd-comment-dialog-renderer");

  var commentDialogObserver = new MutationObserver(function(mutations, observer) {
    let mutation = mutations[0];
    let defaultText = commentDialog.querySelector("#placeholder"); //TODO add aria-label to iron-autogrow-textarea
    defaultText.innerHTML = "Add a private note...";
  });
  commentDialogObserver.observe(injectedCommentDialogRenderer, {childList: true});
}


  // var noteHeaderWrapperRenderer = makeHTML(noteHeaderWrapperRenderer_raw);
  // var notesSectionTitle = makeHTML(notesSectionTitle_raw);
  // var noteInputWrapperWrapper = makeHTML(noteInputWrapperWrapper_raw);
  // var noteInputWrapper = makeHTML(noteInputWrapper_raw);
  // var noteInputDefault = makeHTML(noteInputDefault_raw);
  // var noteInput = makeHTML(noteInput_raw);

  // var noteFocus1 = noteInput.querySelector("#note-creation-box");
  // var noteFocus2 = noteInput.querySelector("#note-underline");
  // var noteFocusToggles = [noteFocus1, noteFocus2];
  // var note = noteInput.querySelector("#note-textarea"); // use x.textContent.trim() to get note's text/
  // var cancelNoteBtn = noteInput.getElementsByClassName("cancel-note-button")[0];
  // var makeNoteBtn = noteInput.getElementsByClassName("confirm-note-button")[0];

  // notesSection.appendChild(noteHeaderWrapper);
  // notesSectionRenderer.appendChild(noteHeaderWrapper);
  // noteHeaderWrapperRenderer.appendChild(notesSectionTitle);
  // noteHeaderWrapperRenderer.appendChild(noteInputWrapperWrapper);
  // noteInputWrapperWrapper.appendChild(noteInputWrapper);
  // noteInputWrapper.appendChild(noteInputDefault);

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

/* Upon clicking to add a note, displays the note and adds it to local storage.
 * @param {Element} note: Contains the note to save.
 * @param {Element} the other four: just here to be passed to subsequent fn's.
 */
function makeNote(notesBox, noteInputWrapper, note, noteInput, noteInputDefault) {
  var ytVideo = document.querySelector('.html5-main-video');
  var noteTime = ytVideo.currentTime; //Don't format until after storage. Could still accidentally overwrite, but highly unlikely.
  var noteText = note.innerHTML;

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
      currentNotes[[noteTime]] = noteText;
      var storingNote = browser.storage.local.set({ [videoId] : result[videoId] });
      storingNote.then(() => {
        displayNote(noteTime, noteText);
        switchToNoteInputDefault(notesBox, noteInputWrapper, note, noteInput, noteInputDefault);
      });
    }
  });
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
 * @param {Element} note: a noteRendererWrapper
 */
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

/* Ugh.
 * Sets up the note's Elements, extracts relevant Elements for event listening,
 * then makes the event listeners, and inserts the note into the DOM.
 * @param {string} noteTime: The video's time at the moment that "Save Note" was clicked.
 * @param {string} noteText: The note that the user wants to save.
 */
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
    console.log("finished");
    // setup existing notes.
    // setupExistingNotes();
  }
}

// Need MutationObserver b/c YouTube doesn't reload upon moving to new pages when already on YT.
// var page = document.getElementById("page");
// var pageObserver = new MutationObserver(main);
// pageObserver.observe(page, { attributes: true });

main();
