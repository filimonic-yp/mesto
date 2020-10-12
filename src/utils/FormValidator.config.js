export default {
  formSelector: '.editor',
  inputSelector: '.editor__input',
  submitButtonSelector: '.editor__btn-submit',
  inputErrorClass: 'editor__input_invalid',
  inactiveButtonClass: 'editor__btn-submit_disabled', // Не используется в css, у нас есть прекрасный встроенный :disabled.
  errorClass: 'editor__error_hidden',
  inputErrorIdAttributeName: 'errorElementId',  //Зачем мне танцы с конкатенацией ID, когда я явно могу указать ID элемента-ошибки в самой разметке в data-атрибуте.
                                                // Вдруг я хочу выводить все ошибки в одном и том же элемегнте.
};
