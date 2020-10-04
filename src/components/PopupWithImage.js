import Popup from './Popup.js'

export default class PopupWithImage extends Popup
{
  constructor(popupSelector)
  {
    super(popupSelector)
    this._image = this._popup.querySelector('.viewer__image')
    this._caption = this._popup.querySelector('.viewer__title')
  }


  open({name, link})
  {
    this._image.setAttribute('src', link);
    this._image.setAttribute('alt', name);
    this._caption.textContent = name;
    super.open();
  }
}
