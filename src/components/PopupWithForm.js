import Popup from './Popup.js'

export default class PopupWithForm extends Popup
{
  constructor(popupSelector, submitCallback)
  {
    super(popupSelector);
    this._submitCallback = submitCallback;
    this._form = this._popup.querySelector('form');
    this._submitButton = this._form.querySelector('input[type="submit"], button[type="submit"]')
    if (this._submitButton)
    {
      this._submitButtonNormalText = this._submitButton.dataset.normalText || 'I Confirm';
      this._submitButtonProgressText = this._submitButton.dataset.progressText || 'Saving...';
    }
    this._formSubmitBound = this._formSubmit.bind(this);
  }


  setEventListeners()
  {
    super.setEventListeners();
    this._form.addEventListener('submit', this._formSubmitBound);
  }


  removeEventListeners()
  {
    super.removeEventListeners();
    this._form.removeEventListener('submit', this._formSubmitBound);
  }


  _lock()
  {
    Array.from(this._form.elements).forEach(element => element.setAttribute('disabled','disabled'));
    if (this._submitButton) {
      this._submitButton.classList.add('editor__btn-submit_processing');
      this._submitButton.textContent = this._submitButtonProgressText;
    }
  }


  _unlock()
  {
    Array.from(this._form.elements).forEach(element => element.removeAttribute('disabled'));
    if (this._submitButton) {
      this._submitButton.classList.remove('editor__btn-submit_processing');
      this._submitButton.textContent = this._submitButtonNormalText;
    }
  }


  _formSubmit(event)
  {
    event.preventDefault();
    this._lock();
    return this._submitCallback(this._getInputValues())
      .then(() => {this.close();})
      .catch(() => {this._unlock()});
  }


  _setInputValues(values)
  {
    if (!values) {
      return;
    }
    const valueNames = Object.keys(values);
    valueNames.forEach(name => {
      const input = this._form.querySelector(`input[name='${name}']`);
      if (input && values[name]) {
        input.value = values[name];
      }
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
    if(values) {
      this._setInputValues(values);
    }
    this._unlock();
  }


  close()
  {
    super.close();
    this._form.reset();
  }
}
