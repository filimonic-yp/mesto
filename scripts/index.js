let profile = {rootEl: document.querySelector('.profile')}
  profile.TxtDisplayNameEl = profile.rootEl.querySelector('.profile__display-name');
  profile.TxtJobEl         = profile.rootEl.querySelector('.profile__job');
  profile.BtnEditEl        = profile.rootEl.querySelector('.profile__btn-edit');

let popup = {rootEl: document.querySelector('.popup')}
  popup.InputDisplayNameEl  = popup.rootEl.querySelector('.profile-editor__input[name="display-name"]');
  popup.InputJobEl          = popup.rootEl.querySelector('.profile-editor__input[name="job-name"]');
  popup.BtnCloseEl          = popup.rootEl.querySelector('.profile-editor__btn-close');
  popup.FormProfileEditorEl = popup.rootEl.querySelector('.profile-editor');

function showPopup() {
  popup.InputDisplayNameEl.value = profile.TxtDisplayNameEl.textContent;
  popup.InputJobEl.value = profile.TxtJobEl.textContent;
  popup.rootEl.classList.add('popup_opened');
  popup.InputDisplayNameEl.focus();
}

function closePopup(doSave) {
  if (doSave) {
    profile.TxtDisplayNameEl.textContent = popup.InputDisplayNameEl.value;
    profile.TxtJobEl.textContent = popup.InputJobEl.value;
  }
  popup.rootEl.classList.remove('popup_opened');
  profile.BtnEditEl.focus();
}

profile.BtnEditEl.addEventListener('click', showPopup);
popup.FormProfileEditorEl.addEventListener('submit', function(e) {e.preventDefault(); closePopup(true)});
popup.BtnCloseEl.addEventListener('click', function() {closePopup(false)});
