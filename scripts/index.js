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

const popupEditorProfileEl                 = document.querySelector('.popup-editor_profile');
const popupEditorProfileInputDisplayNameEl = popupEditorProfileEl.querySelector('.editor__input[name="display-name"]');
const popupEditorProfileInputJobEl         = popupEditorProfileEl.querySelector('.editor__input[name="job"]');
const popupEditorProfileBtnCloseEl         = popupEditorProfileEl.querySelector('.editor__btn-close');
const popupEditorProfileFormEl             = popupEditorProfileEl.querySelector('.editor');

const popupEditorImageAdderEl          = document.querySelector('.popup-editor_image-adder');
const popupEditorImageAdderInputNameEl = popupEditorImageAdderEl.querySelector('.editor__input[name="display-name"]');
const popupEditorImageAdderInputUrlEl  = popupEditorImageAdderEl.querySelector('.editor__input[name="image-url"]');
const popupEditorImageAdderBtnCloseEl  = popupEditorImageAdderEl.querySelector('.editor__btn-close');
const popupEditorImageAdderFormEl      = popupEditorImageAdderEl.querySelector('.editor');

const popupViewerEl         = document.querySelector('.popup-viewer')
const popupViewerBtnCloseEl = popupViewerEl.querySelector('.viewer__btn-close');
const popupViewerImageEl    = popupViewerEl.querySelector('.viewer__image');
const popupViewerTitle      = popupViewerEl.querySelector('.viewer__title');

const cardContainer = document.querySelector('.cards');
const cardTemplate = document.querySelector('#template-card');

// Helpers

function handlePopupKeypress(evt)
{
  if (evt.key === 'Escape') closePopup();
}

function showPopupHelper(popupEl)
{
  // Add close popup on Escabe button press
  document.addEventListener('keyup', handlePopupKeypress)
  popupEl.classList.add('popup_opened');
}

function closePopupHelper(popupEl)
{
  document.removeEventListener('keyup', handlePopupKeypress)
  popupEl.classList.remove('popup_opened');
}


// Show
function showPopupEditorProfile()
{
  popupEditorProfileInputDisplayNameEl.value = profileTxtDisplayNameEl.textContent;
  popupEditorProfileInputJobEl.value = profileTxtJobEl.textContent;
  popupEditorProfileFormEl.dispatchEvent(new Event('afterReset'));
  showPopupHelper(popupEditorProfileEl);
  popupEditorProfileInputDisplayNameEl.focus();
}

function showPopupEditorImageAdder()
{
  popupEditorImageAdderFormEl.reset();
  popupEditorImageAdderFormEl.dispatchEvent(new Event('afterReset'));
  showPopupHelper(popupEditorImageAdderEl);
  popupEditorImageAdderInputNameEl.focus();
}

function showPopupImageViewer(caption, image)
{
  popupViewerImageEl.setAttribute('src', image);
  popupViewerImageEl.setAttribute('alt', caption);
  popupViewerTitle.textContent = caption;
  showPopupHelper(popupViewerEl);
  popupViewerBtnCloseEl.focus();
}

// Hide, universal
function closePopup()
{
  closePopupHelper(popupEditorImageAdderEl);
  closePopupHelper(popupViewerEl);
  closePopupHelper(popupEditorProfileEl);
}

function closePopupIfClickedOnElement(element1, element2)
{

  if (element1 === element2) closePopup()
}

// Process form

function sumbitFormImageAdder()
{
  addCard({
    link: popupEditorImageAdderInputUrlEl.value,
    name: popupEditorImageAdderInputNameEl.value
  });
}

function sumbitFormProfileEditor()
{
  profileTxtDisplayNameEl.textContent = popupEditorProfileInputDisplayNameEl.value;
  profileTxtJobEl.textContent = popupEditorProfileInputJobEl.value;
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

function createCardWithImageElement(card, imageClickCb, likeClickCb, removeClickCb)
{
  const cardElement = cardTemplate.content.cloneNode(true);
  const cardImageElement = cardElement.querySelector('.card__image');
  cardImageElement.addEventListener('click', imageClickCb);
  cardImageElement.setAttribute('src', card.link);
  cardImageElement.setAttribute('alt', card.name);
  cardElement.querySelector('.card__btn-like').addEventListener('click', likeClickCb);
  cardElement.querySelector('.card__btn-remove').addEventListener('click', removeClickCb);
  cardElement.querySelector('.card__caption').textContent = card.name;
  return cardElement;
}

function addCardToCardContainer(cardElement)
{
  cardContainer.prepend(cardElement);
}

// Когда потребуется вставлять другой тип карточек,
// то в этой функции можно будет делать селектор между createCardWith(Image)Element и createCardWith(Video)Element
// на основе, например, полей card.
function addCard(card)
{
  addCardToCardContainer(
      createCardWithImageElement(
        card,
        function(){showPopupImageViewer(card.name, card.link);},
        toggleCardLike,
        removeCard));
}

// Initial cards
function addInitialCards()
{
  initialCards.forEach(card => addCard(card));
}

// Event Listeners

profileBtnEditEl.addEventListener('click',showPopupEditorProfile);
profileBtnAddCardEl.addEventListener('click',showPopupEditorImageAdder);

// Add close for popup overlays and close buttons
[popupViewerBtnCloseEl, popupEditorProfileBtnCloseEl, popupEditorImageAdderBtnCloseEl,
  popupViewerEl, popupEditorProfileEl, popupEditorImageAdderEl].forEach(element => {
    // Why MouseDown, not Click?
    // Because when you select text text input using mouse, and release mouse outside editor div,
    // browser generates click on overlay.
    element.addEventListener('mousedown', evt => {
      closePopupIfClickedOnElement(element, evt.target)})

  });



// enableSingleFormValidation(popupEditorProfileFormEl);
// enableSingleFormValidation(popupEditorImageAdderFormEl);


popupEditorProfileFormEl.addEventListener('submit',function(evt) {
  evt.preventDefault();
  sumbitFormProfileEditor();
  closePopup();
});

popupEditorImageAdderFormEl.addEventListener('submit',function(evt) {
  evt.preventDefault();
  sumbitFormImageAdder();
  closePopup();
});

addInitialCards();
