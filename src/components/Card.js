

/**
 * Create Mesto Card instance
 * @param {object} cardData Card infromation with `name` and `link` attributes
 * @param {string} cardTemplateSelector selector string for card template
 * @param {function} imageClickCallback called when user clicks image
*/
class Card
{
  constructor(cardData, cardTemplateSelector, imageClickCallback, likeCallBack, deleteCallback)
  {
    this._cardData = cardData;
    this._cardTemplateSelector = cardTemplateSelector;
    this._imageClickCallback = imageClickCallback;
    this._likeCallBack = likeCallBack;
    this._deleteCallback = deleteCallback;
    this._likeCount = cardData.likeCount;
    this._isLiked = cardData.isLikedByMe;
    this._isMy = cardData.isOwnedByMe;
    this._prepareCardElement();
    this._setupRemoveButton();
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
    this._cardLikeCounter = this._card.querySelector('.card__like-counter');

    this._cardImage.setAttribute('src', this._cardData.link);
    this._cardImage.setAttribute('alt', this._cardData.name);

    this._cardCaption.textContent = this._cardData.name;

    this._updateLikeInfo();
  }

  _setupEventListeners()
  {
    this._cardButtonLike.addEventListener('click', () => this._likeButtonHandler());
    this._cardImage.addEventListener('click', () => this._imageClickHandler());
  }

  _setupRemoveButton()
  {
    if (this._isMy) {
      this._cardButtonRemove.addEventListener('click', () => this._removeButtonHandler());
    }
    else {
      this._cardButtonRemove.classList.add('card__btn-remove_hidden');
    }
  }

  _updateLikeInfo()
  {
    const likeClassName = 'card__btn-like_liked';
    if (this._isLiked) {
      this._cardButtonLike.classList.add(likeClassName);
    }
    else {
      this._cardButtonLike.classList.remove(likeClassName);
    }
    this._cardLikeCounter.textContent = this._likeCount;
  }


  getElement()
  {
    return this._card;
  }


  // Handlers
  _likeButtonHandler()
  {
    const likesBeforeHit = this._likeCount;
    const isLikedBeforeHit = this._isLiked;

    this._likeCount += (this._isLiked ? -1 : +1)
    this._isLiked = !this._isLiked;
    this._updateLikeInfo();
    this._likeCallBack(this._isLiked)
      .then(({likeCount, isLikedByMe}) => {
        this._likeCount = likeCount;
        this._isLiked = isLikedByMe;
        this._updateLikeInfo();
      })
      .catch(() => {
        this._likeCount = likesBeforeHit;
        this._isLiked = isLikedBeforeHit;
        this._updateLikeInfo();
      })
  }


  _removeButtonHandler()
  {
    this._deleteCallback(() => {this._card.remove()});
  }


  _imageClickHandler()
  {
    if (this._imageClickCallback)
      this._imageClickCallback(this);
  }
}


export default Card;
