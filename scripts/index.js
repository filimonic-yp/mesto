const profile = document.querySelector('.profile');
const profileTextDisplayName = profile.querySelector('.profile__display-name');
const profileTextJob = profile.querySelector('.profile__job');
const buttonEditProfile = profile.querySelector('.profile__btn-edit');
const buttonAddCard = profile.querySelector('.profile__btn-add');

const cardContainer = document.querySelector('.cards');
const cardTemplate = document.querySelector('#template-card');


// ==============
// Profile Editor

function onPrepareProfileEditor(inputs)
{
  inputs.displayName.value = profileTextDisplayName.textContent;
  inputs.job.value = profileTextJob.textContent;
}

function onSubmitProfileEditor(inputs)
{
  profileTextDisplayName.textContent = inputs.displayName.value;
  profileTextJob.textContent = inputs.job.value;
}

const profileEditorPopup = preparePopup(document.querySelector('.popup-editor_profile'), {
  inputs: [
    {
      selector: '.editor__input_display-name',
      name: 'displayName'
    },
    {
      selector: '.editor__input_job',
      name: 'job'
    },
  ],
  sumbitCallback: onSubmitProfileEditor,
  prepareCallback: onPrepareProfileEditor,
  closeCallback:  null,
  closeButtonSelector: '.editor__btn-close',
  formSelector: '.editor',
  openedClass: 'popup_opened',
  closeByEsc: true
})

// Handle profile editor
function openProfileEditor()
{
  profileEditorPopup.open();
}

buttonEditProfile.addEventListener('click',openProfileEditor);

// ==============
// Image adder

function onPrepareImageAdder(inputs)
{
  inputs.displayName.value = '';
  inputs.imageUrl.value = '';
}

function onSubmitImageAdder(inputs)
{
  const card = {
    name: inputs.displayName.value,
    link: inputs.imageUrl.value,
  }
  addCard(card, cardTemplate, cardContainer, onCardImageClick.bind(null, card))
}

const imageAdderPopup = preparePopup(document.querySelector('.popup-editor_image-adder'), {
  inputs: [
    {
      selector: '.editor__input_display-name',
      name: 'displayName'
    },
    {
      selector: '.editor__input_url',
      name: 'imageUrl'
    },
  ],
  sumbitCallback: onSubmitImageAdder,
  prepareCallback: onPrepareImageAdder,
  closeCallback:  null,
  closeButtonSelector: '.editor__btn-close',
  formSelector: '.editor',
  openedClass: 'popup_opened',
  closeByEsc: true
})

// Handle profile editor
function openImageAdder()
{
  imageAdderPopup.open();
}

buttonAddCard.addEventListener('click',openImageAdder);

// CARD VIEWER

function onPrepareImageViewer(inputs, card)
{
  inputs.image.setAttribute('src', card.link);
  inputs.image.setAttribute('alt', card.name);
  inputs.image.textContent = card.name;
}

const imageViewerPopup = preparePopup(document.querySelector('.popup-viewer'), {
  inputs: [
    {
      selector: '.viewer__image',
      name: 'image'
    },
    {
      selector: '.viewer__title',
      name: 'title'
    },
  ],
  sumbitCallback: null,
  prepareCallback: onPrepareImageViewer,
  closeCallback:  null,
  closeButtonSelector: '.viewer__btn-close',
  formSelector: null,
  openedClass: 'popup_opened',
  closeByEsc: true
})

// Card viever callback
function onCardImageClick(card)
{
  imageViewerPopup.open(card);
}

//=============
// CARDS

function addInitialCards(cardTemplate, cardContainer, onCardImageClick)
{
  initialCards.forEach(card => addCard(card, cardTemplate, cardContainer, onCardImageClick.bind(null, card)));
}

addInitialCards(cardTemplate, cardContainer, onCardImageClick);

// Event Listeners


