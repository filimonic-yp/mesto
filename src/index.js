import './pages/index.css';

import Card from "./components/Card.js";
import FormValidator from "./utils/FormValidator.js";
import UserInfo from "./components/UserInfo.js";
import Section from "./components/Section.js";
import PopupWithImage from "./components/PopupWithImage.js";
import PopupWithForm from "./components/PopupWithForm.js";
import initialCards from './utils/initial-cards.js';

const cardContainerSelector = '.cards';
const cardTemplateSelector = '#template-card';

const profile = document.querySelector('.profile');
const buttonEditProfile = profile.querySelector('.profile__btn-edit');
const buttonAddCard = profile.querySelector('.profile__btn-add');

const userInfo = new UserInfo('.profile__display-name', '.profile__job');


// Viewer
const popupViewer = new PopupWithImage('.popup-viewer');

function handleCardImageClick(cardData)
{
  popupViewer.open(cardData)
}

// Cards
function createCardElement(cardData)
{
  const clickCallback = handleCardImageClick.bind(null, cardData);
  const card = new Card(cardData, cardTemplateSelector, clickCallback);
  return card.getElement()
}

const cardSection = new Section(
  {
    items: initialCards,
    renderer: (cardData) => {
      cardSection.addItemFirst(createCardElement(cardData));
    }
  },
  cardContainerSelector);

cardSection.renderItems();

// Add Card
const popupAddCard = new PopupWithForm('.popup-editor_image-adder', (elements) => {
  const cardData = {
    name: elements['display-name'],
    link: elements['image-url']
  }
  cardSection.addItemFirst(createCardElement(cardData));
});

// Edit User
const popupEditUser = new PopupWithForm('.popup-editor_profile', (elements) => {
  userInfo.setUserInfo({
    name: elements['display-name'],
    job: elements['job']
    })
  });

// Validation

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

// Common

buttonAddCard.addEventListener('click',() => popupAddCard.open());
buttonEditProfile.addEventListener('click',() => {
  const info = userInfo.getUserInfo()
  popupEditUser.open({
    'display-name' : info.name,
    'job' : info.job,
  })
});

