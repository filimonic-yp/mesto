class FormValidator
{
  constructor(options, formElement)
  {
    this._options = Object.assign({}, options);
    this._formElement = formElement;
  }

  enableValidation()
  {
    this._formValidatedInputs = Array.from(this._formElement.querySelectorAll(this._options.inputSelector));
    this._formSubmitButton = this._formElement.querySelector(this._options.submitButtonSelector);

    this._updateSubmitButtonState();

    // Добавляем слушателей на инпуты
    this._formValidatedInputs.forEach(validatedElement => validatedElement.addEventListener('input', (evt) =>
    {
      this._validateElement(evt.target);
      this._updateSubmitButtonState();
    }));

    // По событию ресета формы мы должны скрыть все ошибки и выполнить ревалидацию статуса кнопки.
    // Но предполагается что сразу после ресета, скрипт может забить данные в форму.
    // Так что скрытие и ревалидацию статуса кнопки мы проводим после того, как итерация Js выполнится полностью ( благодяря setTimeout)
    this._formElement.addEventListener('reset', () =>setTimeout(() => this._formAfterResetHandler(), 0));

    // Добавляем слушателя на самбит
    this._formElement.addEventListener('submit', (evt) =>
    {
      if (!this._areAllElementsValid(this._formValidatedInputs))
        evt.stopImmediatePropagation();
    });
  }

  _formAfterResetHandler()
  {
    this._hideAllErrors()
    this._updateSubmitButtonState();
  }

  _updateSubmitButtonState()
  {
    this._setSumbitButtonState(this._areAllElementsValid(this._formValidatedInputs));
  }

  _hideAllErrors()
  {
    this._formValidatedInputs.forEach(el => this._hideErrorForElement(el));
  }

  _isElementValid(validatedElement)
  {
    return validatedElement.validity.valid;
  }

  _areAllElementsValid()
  {
    return this._formValidatedInputs.every((el) => this._isElementValid(el));
  }

  _setSumbitButtonState(enabled)
  {
    if (enabled === true)
    {
      this._formSubmitButton.removeAttribute('disabled');
      if (this._options.inactiveButtonClass)
      {
        this._formSubmitButton.classList.add(this._options.inactiveButtonClass);
      }
    }
    else
    {
      this._formSubmitButton.setAttribute('disabled', true);
      if (this._options.inactiveButtonClass)
      this._formSubmitButton.classList.remove(this._options.inactiveButtonClass);
    }
  }

  _getErrorElementForValidatedElement(inputElement)
  {
    // Specifying error element's id inside HTML element is better than gettin it by ID manipulation I think
    const errorElementId = inputElement.dataset[this._options.inputErrorIdAttributeName];
    return errorElementId
      ? document.getElementById(errorElementId)
      : undefined;
  }


  _hideErrorForElement(validatedElement)
  {
    const errorElement = this._getErrorElementForValidatedElement(validatedElement);
    validatedElement.classList.remove(this._options.inputErrorClass);
    if (!errorElement) return;
    errorElement.classList.add(this._options.errorClass);
    errorElement.textContent = '';
  }

  _showErrorForElement(validatedElement)
  {
    const errorElement = this._getErrorElementForValidatedElement(validatedElement);
    validatedElement.classList.add(this._options.inputErrorClass);
    if (!errorElement) return;
    errorElement.classList.remove(this._options.errorClass);
    errorElement.textContent = validatedElement.validationMessage;
  }

  _validateElement(validatedElement)
  {
    this._isElementValid(validatedElement)
      ? this._hideErrorForElement(validatedElement)
      : this._showErrorForElement(validatedElement);
  }


}

export default FormValidator;
