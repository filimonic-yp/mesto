function isElementValid(validatedElement)
{
  return validatedElement.validity.valid;
}

function areAllElementsValid(validatedElementList)
{
  return validatedElementList.every((el) => isElementValid(el));
}

function setSumbitButtonState(sumbitButtonElement, enabled, options)
{
  if (enabled === true)
  {
    sumbitButtonElement.removeAttribute('disabled');
    if (options.inactiveButtonClass)
      sumbitButtonElement.classList.add(options.inactiveButtonClass);

  }
  else
  {
    sumbitButtonElement.setAttribute('disabled', true);
    if (options.inactiveButtonClass)
      sumbitButtonElement.classList.remove(options.inactiveButtonClass);

  }
}

function getErrorElementForValidatedElement(inputElement, options)
{
  // Specifying error element's id inside HTML element is better than gettin it by ID manipulation I think
  const errorElementId = inputElement.dataset[options.inputErrorIdAttributeName];
  if (errorElementId)
    return document.getElementById(errorElementId);
  return undefined;
}

function hideErrorForElement(validatedElement, options)
{
  const errorElement = getErrorElementForValidatedElement(validatedElement, options);
  validatedElement.classList.remove(options.inputErrorClass);
  if (!errorElement) return;
  errorElement.classList.add(options.errorClass);
  errorElement.textContent = '';
}

function showErrorForElement(validatedElement, options)
{
  const errorElement = getErrorElementForValidatedElement(validatedElement, options);
  validatedElement.classList.add(options.inputErrorClass);
  if (!errorElement) return;
  errorElement.classList.remove(options.errorClass);
  errorElement.textContent = validatedElement.validationMessage;
}

function validateElement(validatedElement, options)
{
  if (isElementValid(validatedElement))
    hideErrorForElement(validatedElement, options);
  else
    showErrorForElement(validatedElement, options);
}

function enableSingleFormValidation(formElement, options)
{
  const formValidatedInputs = Array.from(formElement.querySelectorAll(options.inputSelector));
  const formSubmitButton = formElement.querySelector(options.submitButtonSelector);
  setSumbitButtonState(formSubmitButton, areAllElementsValid(formValidatedInputs), options);
  formValidatedInputs.forEach(validatedElement => validatedElement.addEventListener('input', function(evt)
  {
    validateElement(evt.target, options);
    setSumbitButtonState(formSubmitButton, areAllElementsValid(formValidatedInputs), options);
  }));
  // Form itself never knows if we programmatically changed values.
  // We should dispatch afterReset event to make form process programmatically changed values.
  // This also hides all errors, no avoid displaying errors initially when form is being reset.
  formElement.addEventListener('afterReset', function(evt)
  {
    formValidatedInputs.forEach(el => hideErrorForElement(el, options));
    setSumbitButtonState(formSubmitButton, areAllElementsValid(formValidatedInputs), options);
  })

  formElement.addEventListener('submit', function(evt)
  {
    if (!areAllElementsValid(formValidatedInputs))
      evt.stopImmediatePropagation();
  })
}

function enableFormValidation(options)
{
  const validatedFormList = Array.from(document.querySelectorAll(options.formSelector));
  validatedFormList.forEach(validatedForm => enableSingleFormValidation(
    validatedForm,
    options
    ));
}

enableFormValidation({
  formSelector: '.editor',
  inputSelector: '.editor__input',
  submitButtonSelector: '.editor__btn-submit',
  inputErrorClass: 'editor__input_invalid',
  inactiveButtonClass: 'editor__btn-submit_disabled', // Не используется в css, у нас есть прекрасный встроенный :disabled.
  errorClass: 'editor__error_hidden',
  inputErrorIdAttributeName: 'errorElementId',  //Зачем мне танцы с конкатенацией ID, когда я явно могу указать ID элемента-ошибки в самой разметке в data-атрибуте.
                                                // Вдруг я хочу выводить все ошибки в одном и том же элемегнте.
})
