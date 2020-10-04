import Popup from './Popup.js'

export default class PopupWithForm extends Popup
{
  constructor(popupSelector, submitCallback)
  {
    super(popupSelector);
    this._submitCallback = submitCallback;
    this._form = this._popup.querySelector('form');
    this._formSubmitBound = this._formSubmit.bind(this);
  }


  setEventListeners()
  {
    super.setEventListeners()
    this._form.addEventListener('submit', this._formSubmitBound)
  }


  removeEventListeners()
  {
    super.removeEventListeners();
    this._form.removeEventListener('submit', this._formSubmitBound)
  }


  _formSubmit(event)
  {
    event.preventDefault();
    this._submitCallback(this._getInputValues());
    this.close();
  }


  _setInputValues(values)
  {
    if (!values)
      return;
    const valueNames = Object.keys(values);
    valueNames.forEach(name => {
      const input = this._form.querySelector(`input[name='${name}']`);
      if (input && values[name])
        input.value = values[name];
     });
  }


  _getInputValues()
  {
    return Object.fromEntries(
      Array.from(this._form.querySelectorAll('input'))
        .filter(input => !!input.name)
        .map(input => [input.name, input.value]));
  }


  open(values)
  {
    super.open();
    if(values)
      this._setInputValues(values);
  }


  close()
  {
    super.close();
    this._form.reset();
  }
}
