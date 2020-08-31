/*
  > Для полей ввода обоих форм, присуствующих в проекте, используются один и те же классы. Это некорректно.
  > Следует исправить классы таким образом, чтобы по названию было понятно какой именно инпут мы имеем.
  Добавил классы соответствующие типам инпутов.

  > Функция должна быть сначала объявлена и только потом её можно будет использовать.
  > В коде есть места где это не так. Следует исправить.
  Не нашел таких мест.


*/



const profile = document.querySelector('.profile');
const profileTextDisplayName = profile.querySelector('.profile__display-name');
const profileTextJob = profile.querySelector('.profile__job');
const buttonEditProfile = profile.querySelector('.profile__btn-edit');
const buttonAddCard = profile.querySelector('.profile__btn-add');

const profileEditorPopup = document.querySelector('.popup-editor_profile');
const profileEditorDisplayNameInput = profileEditorPopup.querySelector('.editor__input[name="display-name"]');
const profileEditorJobInput = profileEditorPopup.querySelector('.editor__input[name="job"]');
const profileEditorCloseButton = profileEditorPopup.querySelector('.editor__btn-close');
const profileEditorForm = profileEditorPopup.querySelector('.editor');

const imageAdderPopup = document.querySelector('.popup-editor_image-adder');
const imageAdderNameInput = imageAdderPopup.querySelector('.editor__input[name="display-name"]');
const imageAdderUrlInput = imageAdderPopup.querySelector('.editor__input[name="image-url"]');
const imageAdderCloseButton = imageAdderPopup.querySelector('.editor__btn-close');
const imageAdderForm = imageAdderPopup.querySelector('.editor');

const imageViewerPopup = document.querySelector('.popup-viewer');
const imageViewerCloseButton = imageViewerPopup.querySelector('.viewer__btn-close');
const imageViewerPicture = imageViewerPopup.querySelector('.viewer__image');
const imageViewerTitle = imageViewerPopup.querySelector('.viewer__title');

const cardContainer = document.querySelector('.cards');
const cardTemplate = document.querySelector('#template-card');

// Keep current opened popup to remove event listeners.
let currentOpenedPopup = undefined;
let currentOpenedPopupCloseButton = undefined;


function closePopupByEsc(evt)
{
  if (evt.key === 'Escape') { closeCurrentPopup(); }
}

function closePopupByMouseDown(evt)
{
  if (evt.target === evt.currentTarget) { closeCurrentPopup(); }
}

function showPopup(popup, closeButton)
{
  currentOpenedPopup = popup;
  currentOpenedPopupCloseButton = closeButton;
  document.addEventListener('keyup', closePopupByEsc);
  popup.addEventListener('mousedown', closePopupByMouseDown);
  closeButton.addEventListener('mousedown', closePopupByMouseDown);
  popup.classList.add('popup_opened');
}

function closePopup(popup, closeButton)
{
  currentOpenedPopup = undefined;
  currentOpenedPopupCloseButton = undefined;
  document.removeEventListener('keyup', closePopupByEsc);
  popup.removeEventListener('mousedown', closePopupByMouseDown);
  closeButton.removeEventListener('mousedown', closePopupByMouseDown);
  popup.classList.remove('popup_opened');
}

function closeCurrentPopup()
{
  closePopup(currentOpenedPopup, currentOpenedPopupCloseButton);
}

// Show
function showPopupEditorProfile()
{
  profileEditorDisplayNameInput.value = profileTextDisplayName.textContent;
  profileEditorJobInput.value = profileTextJob.textContent;
  profileEditorForm.dispatchEvent(new Event('afterReset'));
  showPopup(profileEditorPopup, profileEditorCloseButton);
  profileEditorDisplayNameInput.focus();
}

function showPopupEditorImageAdder()
{
  imageAdderForm.reset();
  imageAdderForm.dispatchEvent(new Event('afterReset'));
  showPopup(imageAdderPopup, profileEditorCloseButton);
  imageAdderNameInput.focus();
}

function showPopupImageViewer(card)
{
  imageViewerPicture.setAttribute('src', card.link);
  imageViewerPicture.setAttribute('alt', card.name);
  imageViewerTitle.textContent = card.name;
  showPopup(imageViewerPopup, imageViewerCloseButton);
  imageViewerCloseButton.focus();
}

// Form, submitters
function sumbitFormImageAdder()
{
  addCard({
    link: imageAdderUrlInput.value,
    name: imageAdderNameInput.value
  },
  cardTemplate,
  cardContainer,
  showPopupImageViewer
  );
}

function sumbitFormProfileEditor()
{
  profileTextDisplayName.textContent = profileEditorDisplayNameInput.value;
  profileTextJob.textContent = profileEditorJobInput.value;
}

profileEditorForm.addEventListener('submit',function(evt) {
  evt.preventDefault();
  sumbitFormProfileEditor();
  closeCurrentPopup();
});

imageAdderForm.addEventListener('submit',function(evt) {
  evt.preventDefault();
  sumbitFormImageAdder();
  closeCurrentPopup();
});

// Initial cards

function addInitialCards(cardTemplate, cardContainer, cardImageClickCallback)
{
  initialCards.forEach(card => addCard(card, cardTemplate, cardContainer, cardImageClickCallback));
}

addInitialCards(cardTemplate, cardContainer, showPopupImageViewer);

// Event Listeners

buttonEditProfile.addEventListener('click',showPopupEditorProfile);
buttonAddCard.addEventListener('click',showPopupEditorImageAdder);
