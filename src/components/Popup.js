export default class Popup
{
  constructor(popupSelector)
  {
    this._popup = document.querySelector(popupSelector);
    this._closeButton = this._popup.querySelector('.popup__btn-close');
    this._handleEscCloseBound = this._handleEscClose.bind(this);
    this._handleClickCloseBound = this._handleClickClose.bind(this);
  }


  open()
  {
    this.setEventListeners();
    this._popup.classList.add('popup_opened');
  }


  close()
  {
    this.removeEventListeners()
    this._popup.classList.remove('popup_opened');
  }


  removeEventListeners()
  {
    this._popup.removeEventListener('mousedown', this._handleClickCloseBound);
    document.removeEventListener('keydown', this._handleEscCloseBound);
  }


  setEventListeners()
  {
    this._popup.addEventListener('mousedown', this._handleClickCloseBound);
    document.addEventListener('keydown', this._handleEscCloseBound);
  }


  _handleClickClose(event)
  {
    if (event.target === this._popup || event.target === this._closeButton)
        this.close();
  }


  _handleEscClose(event)
  {
    if (event.key === 'Escape')
      this.close();
  }
}
