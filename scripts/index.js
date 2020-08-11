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

const editorOptions = {
  profileEditor: {
    InputLine1Options: {
      autocomplete: 'name',
      placeholder: 'Имя (не пустое)',
      required: true,
      type: 'text',
      pattern: '^.*[^\s].*$',
    },
    InputLine2Options: {
      autocomplete: 'none',
      placeholder: 'Род деятельности',
      required: null,
      type: 'text',
      pattern: '.*',
    },
    editorType: 'profileEditor',
    editorTitle: 'Редактировать профиль'
  },

  imageAdder: {
    InputLine1Options: {
      autocomplete: 'none',
      placeholder: 'Название места (не пустое)',
      required: true,
      type: 'text',
      pattern: '^.*[^\s].*$',
    },
    InputLine2Options: {
      autocomplete: 'none',
      placeholder: 'Ссылка на картинку',
      required: true,
      type: 'url',
      pattern: '.*',
    },
    editorType: 'imageAdder',
    editorTitle: 'Новое место'
  },
}

const profile = { rootEl: document.querySelector('.profile') }
  profile.TxtDisplayNameEl = profile.rootEl.querySelector('.profile__display-name');
  profile.TxtJobEl         = profile.rootEl.querySelector('.profile__job');
  profile.BtnEditEl        = profile.rootEl.querySelector('.profile__btn-edit');
  profile.BtnAddCardEl     = profile.rootEl.querySelector('.profile__btn-add');

const popupEditor = {rootEl: document.querySelector('.popup-editor')}
  popupEditor.InputLine1El = popupEditor.rootEl.querySelector('.editor__input[name="line1"]');
  popupEditor.InputLine2El = popupEditor.rootEl.querySelector('.editor__input[name="line2"]');
  popupEditor.EditorTypeEl = popupEditor.rootEl.querySelector('*[name="editorType"]');
  popupEditor.BtnCloseEl        = popupEditor.rootEl.querySelector('.editor__btn-close');
  popupEditor.FormEl            = popupEditor.rootEl.querySelector('.editor');
  popupEditor.FormTitleEl       = popupEditor.rootEl.querySelector('.editor__title');

const popupViewer = {rootEl: document.querySelector('.popup-viewer')}
  popupViewer.BtnCloseEl = popupViewer.rootEl.querySelector('.viewer__btn-close');
  popupViewer.ImageEl    = popupViewer.rootEl.querySelector('.viewer__image');
  popupViewer.Title      = popupViewer.rootEl.querySelector('.viewer__title');


const cardContainer = document.querySelector('.cards');
const cardTemplate = document.querySelector('#template-card');

function showPopupProfileEditor()
{
  popupEditor.InputLine1El.value = profile.TxtDisplayNameEl.textContent;
  popupEditor.InputLine2El.value = profile.TxtJobEl.textContent;

  showPopupEditor(editorOptions.profileEditor, popupEditor);
}

function showPopupImageAdder()
{
  popupEditor.InputLine1El.value = 'Новое Место';
  popupEditor.InputLine2El.value = 'https://images.unsplash.com/photo-1597099119865-f5b12f4d4f31?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2734&q=80';

  showPopupEditor(editorOptions.imageAdder, popupEditor);
}

function setEditorInputAttributes(inputOptions, inputElement)
{
  for (let attribute in inputOptions)
  {
    if (null === inputOptions[attribute])
    {
      inputElement.removeAttribute(attribute);
    }
    else
    {
      inputElement.setAttribute(attribute, inputOptions[attribute]);
    }
  }
}

function showPopupEditor(editorOptions, editor)
{
  setEditorInputAttributes(editorOptions.InputLine1Options, editor.InputLine1El)
  setEditorInputAttributes(editorOptions.InputLine2Options, editor.InputLine2El)

  editor.EditorTypeEl.value = editorOptions.editorType;
  editor.FormTitleEl.textContent = editorOptions.editorTitle;
  editor.rootEl.classList.add('popup_opened');
  editor.InputLine1El.focus();
}

function closePopupEditor(doSave)
{
  if (doSave)
  {
    switch (popupEditor.EditorTypeEl.value)
    {
      case editorOptions.profileEditor.editorType:
        profile.TxtDisplayNameEl.textContent = popupEditor.InputLine1El.value.trim();
        profile.TxtJobEl.textContent = popupEditor.InputLine2El.value.trim();
        break;
      case editorOptions.imageAdder.editorType:
        addCard({
          name: popupEditor.InputLine1El.value.trim(),
          link: popupEditor.InputLine2El.value.trim()
        }, cardTemplate, cardContainer, toggleCardLike, removeCard, showPopupImageViewer);
        break;
      default:
        console.error(`Unexpected editor type: [${popupEditor.EditorTypeEl.value}]`);
    }
  }
  popupEditor.rootEl.classList.remove('popup_opened');
}

function showPopupImageViewer(evt)
{
  const card = evt.target.closest('.card');
  popupViewer.ImageEl.setAttribute('src', card.querySelector('.card__image').src)
  popupViewer.Title.textContent = card.querySelector('.card__caption').textContent;
  popupViewer.ImageEl.setAttribute('alt', popupViewer.Title.textContent);
  popupViewer.rootEl.classList.add('popup_opened')
}

function closePopupImageViewer(evt)
{
  popupViewer.rootEl.classList.remove('popup_opened')
}

function toggleCardLike(evt)
{
  evt.target.classList.toggle('card__btn-like_liked');
}

function removeCard(evt)
{
  evt.target.closest('.card').remove();
}

function addCard(card = {link: 'images/card__image_noimage.png'}, cardTemplate, cardContainer, likeCb, removeCb, fullViewCb)
{
  const cardElement = cardTemplate.content.cloneNode(true);
  const cardImageElement = cardElement.querySelector('.card__image');
  cardImageElement.setAttribute('src', card.link);
  cardImageElement.setAttribute('alt', card.name);
  cardElement.querySelector('.card__caption').textContent = card.name;
  cardElement.querySelector('.card__btn-like').addEventListener('click', likeCb);
  cardElement.querySelector('.card__btn-remove').addEventListener('click', removeCb);
  cardElement.querySelector('.card__image').addEventListener('click', fullViewCb);
  cardContainer.prepend(cardElement);
}

profile.BtnEditEl.addEventListener('click', showPopupProfileEditor);
profile.BtnAddCardEl.addEventListener('click', showPopupImageAdder);
popupEditor.FormEl.addEventListener('submit', function(evt) {evt.preventDefault(); closePopupEditor(true)});
popupEditor.BtnCloseEl.addEventListener('click', function() {closePopupEditor(false)});
popupViewer.BtnCloseEl.addEventListener('click', closePopupImageViewer);


initialCards.forEach(x => addCard(x, cardTemplate, cardContainer, toggleCardLike, removeCard, showPopupImageViewer));

