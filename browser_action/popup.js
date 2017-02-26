var addBtn = document.querySelector('.add');
addBtn.addEventListener('click', function() {
  browser.tabs.update({url: 'https://developer.mozilla.org'});
})
