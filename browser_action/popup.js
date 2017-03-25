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


var searchElWrapper = document.querySelector('.search');
var searchEl = document.querySelector('input');
var searchText = ""
searchEl.addEventListener('keyup', function() {
  var newText = searchEl.value.toLocaleLowerCase();

  if (newText == searchText) {
    return;
  } else {
    searchText = newText;
  }

  let allVideoNotes = document.getElementsByClassName('video-notes');
  for (let videoNotes of allVideoNotes) {
    let title = videoNotes.querySelector('h2');
    let titleText = title.textContent.toLocaleLowerCase();
    let notes = videoNotes.getElementsByClassName('note');
    let anyNotesMatch = false;

    for (let note of notes) {
      let noteText = note.textContent.toLocaleLowerCase();
      if (noteText.includes(searchText)) {
        note.style.display = 'block';
        anyNotesMatch = true;
      } else {
        note.style.display = 'none';
      }
    }

    if (!titleText.includes(searchText) && !anyNotesMatch) {
      videoNotes.style.display = 'none';
    } else {
      videoNotes.style.display = 'block';
    }
  }
})

searchEl.addEventListener('focus', function() {
  searchElWrapper.classList.add('search-focused');
})
searchEl.addEventListener('blur', function() {
  searchElWrapper.classList.remove('search-focused');
})
