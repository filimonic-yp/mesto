import Card from "./card.js";
import FormValidator from "./form-validator.js";
import initialCards from "./initial-cards.js";
import Popup from "./popup.js";


const profile = document.querySelector('.profile');
const profileTextDisplayName = profile.querySelector('.profile__display-name');
const profileTextJob = profile.querySelector('.profile__job');
const buttonEditProfile = profile.querySelector('.profile__btn-edit');
const buttonAddCard = profile.querySelector('.profile__btn-add');

const cardContainer = document.querySelector('.cards');
const cardTemplate = '#template-card';


// ==============
// Profile Editor Popup

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

const profileEditorPopup = new Popup(document.querySelector('.popup-editor_profile'), {
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

// ==============
// Image adder popup

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
  addCard(card, cardTemplate, cardContainer, cardImageClickHandler)
}

const imageAdderPopup =  new Popup(document.querySelector('.popup-editor_image-adder'), {
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

// ==============
// Image viewer popup

function onPrepareImageViewer(inputs, card)
{
  console.log(card);
  inputs.image.setAttribute('src', card.link);
  inputs.image.setAttribute('alt', card.name);
  inputs.image.textContent = card.name;
}

const imageViewerPopup =  new Popup(document.querySelector('.popup-viewer'), {
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


//=============
// CARDS

function cardImageClickHandler(card)
{
  imageViewerPopup.open(card.getData());
}

function addCardToCardContainer(cardContainer, cardElement)
{
  cardContainer.prepend(cardElement);
}

function addCard(card, cardTemplate, cardContainer, cardImageClickCallback)
{
  addCardToCardContainer(
    cardContainer,
    new Card(
      card,
      cardTemplate,
      cardImageClickCallback).getElement());
}

function addInitialCards(cardTemplate, cardContainer, cardImageClickCallback)
{
  initialCards.forEach(card => addCard(card, cardTemplate, cardContainer, cardImageClickCallback));
}

addInitialCards(cardTemplate, cardContainer, cardImageClickHandler);

//==========
// Enable form validation

function enableFormValidation(options)
{
  const validatedFormList = Array.from(document.querySelectorAll(options.formSelector));
  validatedFormList.forEach(validatedForm => new FormValidator(
    options,
    validatedForm
    ).enableValidation());
}

enableFormValidation({
  formSelector: '.editor',
  inputSelector: '.editor__input',
  submitButtonSelector: '.editor__btn-submit',
  inputErrorClass: 'editor__input_invalid',
  inactiveButtonClass: 'editor__btn-submit_disabled', // Не используется в css, у нас есть прекрасный встроенный :disabled.
  errorClass: 'editor__error_hidden',
  inputErrorIdAttributeName: 'errorElementId',  //Зачем мне танцы с конкатенацией ID, когда я явно могу указать ID элемента-ошибки в самой разметке в data-атрибуте.
                                                // Вдруг я хочу выводить все ошибки в одном и том же элемегнте.
})

//==========
// Setup profile buttons

// Handle profile editor
function openProfileEditor()
{
  profileEditorPopup.open();
}

buttonEditProfile.addEventListener('click',openProfileEditor);

// Handle image adder
function openImageAdder()
{
  imageAdderPopup.open();
}

buttonAddCard.addEventListener('click',openImageAdder);
