/*

  Popup
    Создается:
      preparePopup, возвращает объект popupInstance
      На вход:
        * Элемент DOM, который является PopUp
        * Опции
        *   openedClass: Класс, который устанавливается элементу DOM для его отображения
        *
        *   Inputs: массив объектов {selector, name}, которые нас интересуют в форме. Эти объекты будут переданы во все коллбэки в виде объекта { name1: HTMLElement1, name2: HTMLElement2, ... }
        *
        *   closeButtonSelector: Селектор кнопки "закрыть"
        *   formSelector: Селектор формы
        *   closeByEsc: Закрывать ли попап Escape-ом (bool)
        *
        *   sumbitCallback: Коллбэк, который вызовется при самбите формы. В коллбэк передается преобразованный в {name:element} массив Inputs
        *   prepareCallback: Коллбэк, который вызовется перед открытием попапа. В коллбэк передается преобразованный в {name:element} массив Inputs и значение, переданное в open()
        *   closeCallback: Коллбэк, который вызовется перед закрытием попапа ( в случае успешной отправки формы или отмены).

    Методы:
      open(arg)    : Открывает попап. Опциональный arg передается в prepareCallback
      close(event) : закрывает коллбэк. Опциональный второй параметр KeyboardEvent для детектирования ESC-клавиши для внутренних нужд
      submit()     : внутренний метод, срабатывает при отправке формы. Параметров нет.

*/




function getInputDictionary(popup, inputOptions)
{
  if (!Array.isArray(inputOptions))
  {
    return {};
  }
  inputElementsDictionary = {};
  inputOptions.forEach((options) => (inputElementsDictionary[options.name] = popup.querySelector(options.selector)));
  return inputElementsDictionary;
}

function addPopupEventListeners(popupInstance)
{
  if (popupInstance.closeButton)
  {
    popupInstance.closeButton.addEventListener('mousedown', popupInstance.close);
  }

  popupInstance.popup.addEventListener('mousedown', popupInstance.close);

  if(popupInstance.form)
  {
    popupInstance.form.addEventListener('submit', popupInstance.submit);
  }

  if (popupInstance.closeByEsc)
  {
    document.addEventListener('keydown', popupInstance.onEscape);
  }
}

function removePopupEventListeners(popupInstance)
{
  if (popupInstance.closeButton)
  {
    popupInstance.closeButton.removeEventListener('mousedown', popupInstance.close);
  }

  popupInstance.popup.removeEventListener('mousedown', popupInstance.close);

  if (popupInstance.form)
  {
    popupInstance.form.removeEventListener('submit', popupInstance.submit);
  }

  document.removeEventListener('keydown', popupInstance.onEscape);
}

function openPopup(popupInstance, prepareArgument)
{
  if(popupInstance.form)
  {
    popupInstance.form.reset();
    popupInstance.form.dispatchEvent(new Event('afterReset'));
  }

  if (popupInstance.prepareCallback)
  {
    popupInstance.prepareCallback(popupInstance.inputs,  prepareArgument);
  }

  addPopupEventListeners(popupInstance);

  popupInstance.popup.classList.add(popupInstance.openedClass);
}

function closePopupByEsc(popupInstance, event)
{
  if (event.key === 'Escape')
  {
    popupInstance.close();
  }
}

function closePopup(popupInstance, event)
{
  if ((!event) || (event.target === popupInstance.closeButton) || (event.target === popupInstance.popup))
  {
    if (popupInstance.closeCallback)
    {
      popupInstance.closeCallback(popupInstance)
    }
    popupInstance.popup.classList.remove(popupInstance.openedClass);
    removePopupEventListeners(popupInstance);

  }
}

function submitPopup(popupInstance, event)
{
  //console.log('submitPopup', arguments);
  event.preventDefault();
  popupInstance.sumbitCallback ? popupInstance.sumbitCallback(popupInstance.inputs) : true;
  popupInstance.close();
}

function preparePopup(popup, options)
{
  const popupInstance = {
    popup,
    options,
    inputs: getInputDictionary(popup, options.inputs),
    prepareCallback: options.prepareCallback,
    closeCallback: options.closeCallback,
    sumbitCallback: options.sumbitCallback,
    form: popup.querySelector(options.formSelector),
    closeButton: popup.querySelector(options.closeButtonSelector),
    openedClass: options.openedClass,
    closeByEsc: options.closeByEsc === true,
  };

  popupInstance.open = openPopup.bind(null, popupInstance);
  popupInstance.close = closePopup.bind(null, popupInstance);
  popupInstance.submit = submitPopup.bind(null, popupInstance);
  popupInstance.onEscape = closePopupByEsc.bind(null, popupInstance);
  return popupInstance;
}


