  function setupExistingNotes() {
  var gettingSavedNotes = browser.storage.local.get();
  gettingSavedNotes.then((result) => {
    if (Array.isArray(result)) {  // If Firefox version less than 52.
      result = result[0];
    }

    var videoIds = Object.keys(result);
    var videoNotesContainer = document.querySelector('.video-notes-container');

    if (videoIds.length == 0) {
      return;
    }

    for (var videoId of videoIds) {
      const baseUrl = "https://www.youtube.com/watch?v=" + videoId;

      var videoNotes = document.createElement('div');
      videoNotes.setAttribute('class', 'video-notes');
      videoNotesContainer.appendChild(videoNotes);

      var videoTitle = result[videoId]["title"];
      var titleEl = document.createElement('h2');
      titleEl.textContent = videoTitle;
      titleEl.addEventListener('click', function() {
          browser.tabs.update({url: baseUrl});
          window.close();
      })
      videoNotes.appendChild(titleEl);

      var savedNotes = result[videoId]["notes"];
      for (let noteTime of Object.keys(savedNotes)) {
        const noteUrl = baseUrl + "&t=" + Math.floor(noteTime) + "s";
        var noteText = savedNotes[noteTime];

        var note = document.createElement('div');
        note.setAttribute('class', 'note');
        note.innerHTML = noteText;
        note.addEventListener('click', function() {
          browser.tabs.update({url: noteUrl});
          window.close();
        })
        videoNotes.appendChild(note);
      }
    }
  });
}

setupExistingNotes();
