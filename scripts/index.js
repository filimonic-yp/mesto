const initialCards = [
  {
      name: 'Архыз',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
  },
  {
      name: 'Челябинская область',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
  },
  {
      name: 'Иваново',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
  },
  {
      name: 'Камчатка',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
  },
  {
      name: 'Холмогорский район',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
  },
  {
      name: 'Байкал',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
  }
];


const profileEl               = document.querySelector('.profile')
const profileTxtDisplayNameEl = profileEl.querySelector('.profile__display-name');
const profileTxtJobEl         = profileEl.querySelector('.profile__job');
const profileBtnEditEl        = profileEl.querySelector('.profile__btn-edit');
const profileBtnAddCardEl     = profileEl.querySelector('.profile__btn-add');

const popupEditorProfileEl           = document.querySelector('.popup-editor_profile');
const popupEditorProfileInputDisplayNameEl = popupEditorProfileEl.querySelector('.editor__input[name="display-name"]');
const popupEditorProfileInputJobEl         = popupEditorProfileEl.querySelector('.editor__input[name="job"]');
const popupEditorProfileBtnCloseEl         = popupEditorProfileEl.querySelector('.editor__btn-close');
const popupEditorProfileFormEl             = popupEditorProfileEl.querySelector('.editor');

const popupEditorImageAdderEl        = document.querySelector('.popup-editor_image-adder');
const popupEditorImageAdderInputNameEl     = popupEditorImageAdderEl.querySelector('.editor__input[name="display-name"]');
const popupEditorImageAdderInputUrlEl      = popupEditorImageAdderEl.querySelector('.editor__input[name="image-url"]');
const popupEditorImageAdderBtnCloseEl      = popupEditorImageAdderEl.querySelector('.editor__btn-close');
const popupEditorImageAdderFormEl          = popupEditorImageAdderEl.querySelector('.editor');

const popupViewerEl = document.querySelector('.popup-viewer')
const popupViewerBtnCloseEl = popupViewerEl.querySelector('.viewer__btn-close');
const popupViewerImageEl    = popupViewerEl.querySelector('.viewer__image');
const popupViewerTitle      = popupViewerEl.querySelector('.viewer__title');

const cardContainer = document.querySelector('.cards');
const cardTemplate = document.querySelector('#template-card');

// Show
function showPopupEditorProfile()
{
  popupEditorProfileInputDisplayNameEl.value = profileTxtDisplayNameEl.textContent;
  popupEditorProfileInputJobEl.value = profileTxtJobEl.textContent;
  popupEditorProfileEl.classList.add('popup_opened');
  popupEditorProfileInputDisplayNameEl.focus();
}

function showPopupEditorImageAdder()
{
  popupEditorImageAdderInputNameEl.value = '';
  popupEditorImageAdderInputUrlEl.value = '';
  popupEditorImageAdderEl.classList.add('popup_opened');
  popupEditorImageAdderInputNameEl.focus();
}

function showPopupViewer(card)
{
  popupViewerImageEl.setAttribute('src', card.link);
  popupViewerImageEl.setAttribute('alt', card.name);
  popupViewerTitle.textContent = card.name
  popupViewerEl.classList.add('popup_opened');
  popupViewerBtnCloseEl.focus();
}

// Hide, universal
function closePopup()
{
  popupEditorImageAdderEl.classList.remove('popup_opened');
  popupViewerEl.classList.remove('popup_opened');
  popupEditorProfileEl.classList.remove('popup_opened');
}

// Process form
function sumbitForm(event)
{
  switch (event.target)
  {
    case popupEditorImageAdderFormEl:
      addCard({
        link: popupEditorImageAdderInputUrlEl.value,
        name: popupEditorImageAdderInputNameEl.value
      });
      break;
    case popupEditorProfileFormEl:
      profileTxtDisplayNameEl.textContent = popupEditorProfileInputDisplayNameEl.value;
      profileTxtJobEl.textContent = popupEditorProfileInputJobEl.value;
      break;
  }
}

// Cards

function toggleCardLike(evt)
{
  evt.target.classList.toggle('card__btn-like_liked');
}

function removeCard(evt)
{
  evt.target.closest('.card').remove();
}

function addCard(card = {link: 'images/card__image_noimage.png'})
{
  const cardElement = cardTemplate.content.cloneNode(true);
  const cardImageElement = cardElement.querySelector('.card__image');
  cardImageElement.setAttribute('src', card.link);
  cardImageElement.setAttribute('alt', card.name);
  cardImageElement.addEventListener('click', function(){showPopupViewer(card);});
  cardElement.querySelector('.card__caption').textContent = card.name;
  cardElement.querySelector('.card__btn-like').addEventListener('click', toggleCardLike);
  cardElement.querySelector('.card__btn-remove').addEventListener('click', removeCard);
  cardContainer.prepend(cardElement);
}

// Event Listeners

profileBtnEditEl.addEventListener('click',showPopupEditorProfile);
profileBtnAddCardEl.addEventListener('click',showPopupEditorImageAdder);

popupViewerBtnCloseEl.addEventListener('click', closePopup);
popupEditorProfileBtnCloseEl.addEventListener('click', closePopup);
popupEditorImageAdderBtnCloseEl.addEventListener('click', closePopup);

popupEditorProfileFormEl.addEventListener('submit', function(evt) {
  evt.preventDefault();
  sumbitForm(evt);
  closePopup();
});

popupEditorImageAdderFormEl.addEventListener('submit', function(evt) {
  evt.preventDefault();
  sumbitForm(evt);
  closePopup();
});

// Init cards

initialCards.forEach(card => addCard(card));

