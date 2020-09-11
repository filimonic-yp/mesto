

/**
 * Create Mesto Card instance
 * @param {object} cardData Card infromation with `name` and `link` attributes
 * @param {string} cardTemplateSelector selector string for card template
 * @param {function} openCallback called when user clicks image
*/
class Card
{
  constructor(cardData, cardTemplateSelector, imageClickCallback)
  {
    this._cardData = cardData;
    this._cardTemplateSelector = cardTemplateSelector;
    this._imageClickCallback = imageClickCallback;
    this._isLiked = cardData.isLiked || false;
    this._prepareCardElement();
    this._setupEventListeners();
  }

  _prepareCardElement()
  {
    const templateCopy = document.querySelector(this._cardTemplateSelector).content.cloneNode(true);
    this._card = templateCopy.querySelector('.card');
    this._cardImage = this._card.querySelector('.card__image');
    this._cardCaption = this._card.querySelector('.card__caption');
    this._cardButtonLike = this._card.querySelector('.card__btn-like');
    this._cardButtonRemove = this._card.querySelector('.card__btn-remove');

    this._cardImage.setAttribute('src', this._cardData.link);
    this._cardImage.setAttribute('alt', this._cardData.name);

    this._cardCaption.textContent = this._cardData.name;
  }

  _setupEventListeners()
  {
    this._cardButtonRemove.addEventListener('click', (event) => {this._removeButtonHandler();});
    this._cardButtonLike.addEventListener('click', () => {this._likeButtonHandler();});
    this._cardImage.addEventListener('click', () => {this._imageClickHandler();} )
  }

  _updateLikeButton()
  {
    const likeClassName = 'card__btn-like_liked';
    if (this._isLiked)
    {
      this._cardButtonLike.classList.add(likeClassName);
    }
    else
    {
      this._cardButtonLike.classList.remove(likeClassName);
    }
  }

  // Handlers
  _likeButtonHandler()
  {
    this._isLiked = !this._isLiked;
    this._updateLikeButton();
  }

  _removeButtonHandler()
  {
    this._card.remove();
  }

  _imageClickHandler()
  {
    if (this._imageClickCallback)
    {
      this._imageClickCallback(this);
    }
  }

  getData()
  {
    return Object.assign({}, this._cardData, {isLiked : this._isLiked});
  }

  getElement()
  {
    return this._card;
  }
}


export default Card;
