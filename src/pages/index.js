// =======
// CSS IMPORTS

import './index.css';



// ==========
// JS IMPORTS

import API from "../utils/APIExtension.js"
import Card from "../components/Card.js";
import FormValidator from "../utils/FormValidator.js";
import UserInfo from "../components/UserInfo.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";



// ==========
// CONSTANTS

// Configurations
import formValidatorConfig from "../utils/FormValidator.config.js";
import apiConfig from "../utils/API.config.js"

// Selectors and pre-selected items
const cardContainerSelector = '.cards';
const cardTemplateSelector = '#template-card';

const profile = document.querySelector('.profile');
const buttonEditProfile = profile.querySelector('.profile__btn-edit');
const buttonAddCard = profile.querySelector('.profile__btn-add');
const buttonSetAvatar = profile.querySelector('.profile__btn-set-avatar');

// Instances
const userInfo = new UserInfo('.profile__display-name', '.profile__job', '.profile__avatar');
const api = new API(apiConfig);


// =====
// CARDS

// Callback handlers

function handleCardImageClick(cardData) {
  popupViewer.open(cardData)
}

function handleCardLikeClick(cardData, isLiked) {
  return (isLiked ? api.likeCard(cardData._id) : api.dislikeCard(cardData._id))
}

function handleCardDeleteClick(cardData, onDeleteSuccess) {
  const popupConfirmDelete = new PopupWithForm('.popup-editor_confirmer', (elements) => {
    const cardId = elements['card-id'];
    return api
      .deleteCard(cardId)
      .then(() => {onDeleteSuccess()})
  });

  popupConfirmDelete.open({
    'card-id': cardData._id
  });
}

// Cards
function createCardElement(cardData) {
  const clickCallback = handleCardImageClick.bind(null, cardData);
  const likeCardCallback = handleCardLikeClick.bind(null, cardData);
  const deleteCardCallback = handleCardDeleteClick.bind(null, cardData);
  const card = new Card(cardData, cardTemplateSelector, clickCallback, likeCardCallback, deleteCardCallback);
  return card.getElement();
}

const cardSection = new Section(
  {
    items: [],
    renderer: (cardData) => {
      cardSection.addItemFirst(createCardElement(cardData));
    }
  },
  cardContainerSelector);



// ======
// POPUPS

// Viewer
const popupViewer = new PopupWithImage('.popup-viewer');

// Add Card
const popupAddCard = new PopupWithForm('.popup-editor_image-adder', (elements) => {
  const cardData = {
    name: elements['display-name'],
    link: elements['image-url']
  };
  return api.sendCard(cardData)
    .then((serverCardData) => cardSection.addItemFirst(createCardElement(serverCardData)))
});

// Edit User
const popupEditUser = new PopupWithForm('.popup-editor_profile', (elements) => {
  const info = {
    name: elements['display-name'],
    about: elements['job']
  };
  return api.updateMe(info)
    .then((newInfo) => userInfo.setUserInfo(newInfo))
  });

// Edit avatar
const popupEditAvatar = new PopupWithForm('.popup-editor_avatar', (elements) => {
  const avatarUrl = elements['image-url'];
  return api.setAvatar(avatarUrl)
    .then((data) => userInfo.setUserInfo(data));
  });


// Common
function setupEventListeners() {
  buttonAddCard.addEventListener('click',() => popupAddCard.open());
  buttonEditProfile.addEventListener('click',() => {
    const info = userInfo.getUserInfo();
    popupEditUser.open({
      'display-name' : info.name,
      'job' : info.job,
    });
  });
  buttonSetAvatar.addEventListener('click',() => popupEditAvatar.open());

}



// ==========
// VALIDATION

// Forms Validation
function enableFormValidation(options) {
  const validatedFormList = Array.from(document.querySelectorAll(options.formSelector));
  validatedFormList.forEach(validatedForm => new FormValidator(
    options,
    validatedForm
    ).enableValidation());
}

enableFormValidation(formValidatorConfig);


// ==========
// API Startup

// API

api.getMe()
  .then(data => userInfo.setUserInfo(data))
  .then(() => api.getInitialCards())
  .then(cards => cards.forEach(card => cardSection.addItem(createCardElement(card))))
  .then(() => setupEventListeners())
  .catch((err) => console.error(`Unexpected error:`, err, `Hit refresh`));


