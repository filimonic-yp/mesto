// Cards
function toggleCardLike(evt)
{
  evt.target.classList.toggle('card__btn-like_liked');
}

function removeCard(evt)
{
  evt.target.closest('.card').remove();
}

function createCard(card, cardTemplate, imageClickCb, likeClickCb, removeClickCb)
{
  const cardElement = cardTemplate.content.cloneNode(true);
  const cardImageElement = cardElement.querySelector('.card__image');
  cardImageElement.addEventListener('click', function(){imageClickCb(card)});
  cardImageElement.setAttribute('src', card.link);
  cardImageElement.setAttribute('alt', card.name);
  cardElement.querySelector('.card__btn-like').addEventListener('click', likeClickCb);
  cardElement.querySelector('.card__btn-remove').addEventListener('click', removeClickCb);
  cardElement.querySelector('.card__caption').textContent = card.name;
  return cardElement;
}

function addCardToCardContainer(cardContainer, cardElement)
{
  cardContainer.prepend(cardElement);
}

// Когда потребуется вставлять другой тип карточек,
// то в этой функции можно будет делать селектор между createCardWith(Image)Element и createCardWith(Video)Element
// на основе, например, полей card.
function addCard(card, cardTemplate, cardContainer, cardImageClickCallback)
{
  addCardToCardContainer(
    cardContainer,
    createCard(
      card,
      cardTemplate,
      cardImageClickCallback,
      toggleCardLike,
      removeCard));
}


