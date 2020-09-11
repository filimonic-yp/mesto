/*

  Popup
    Создается:
      preparePopup, возвращает объект popupInstance
      На вход:
        * Элемент DOM, который является PopUp
        * Опции
        *   openedClass: Класс, который устанавливается элементу DOM для его отображения
        *
        *   inputs: массив объектов {selector, name}, которые нас интересуют в форме. Эти объекты будут переданы во все коллбэки в виде объекта { name1: HTMLElement1, name2: HTMLElement2, ... }
        *
        *   closeButtonSelector: Селектор кнопки "закрыть"
        *   formSelector: Селектор формы
        *   closeByEsc: Закрывать ли попап Escape-ом (bool)
        *
        *   sumbitCallback: Коллбэк, который вызовется при самбите формы. В коллбэк передается преобразованный в {name:element} массив Inputs
        *   prepareCallback: Коллбэк, который вызовется перед открытием попапа. В коллбэк передается преобразованный в {name:element} массив Inputs и значение, переданное в open()
        *   closeCallback: Коллбэк, который вызовется перед закрытием попапа ( в случае успешной отправки формы или отмены).

    Методы popupInstance:
      open(arg)    : Открывает попап. Опциональный arg передается в prepareCallback

*/


class Popup
{
  constructor(popup, options)
  {
    this._popup = popup;
    this._options = Object.assign({}, options);
    this._form = this._popup.querySelector(this._options.formSelector);
    this._closeButton = this._popup.querySelector(this._options.closeButtonSelector);
    this._inputs = this._getInputDictionary(popup, this._options.inputs);

    this._closeBind = this._close.bind(this);
    this._submitBind = this._submit.bind(this);
    this._onEscapeKeyBind = this._onEscapeKey.bind(this);
  }

  _getInputDictionary(popup, inputOptions)
  {
    if (!Array.isArray(inputOptions))
    {
      return {};
    }
    const inputElementsDictionary = {};
    inputOptions.forEach((options) => (inputElementsDictionary[options.name] = popup.querySelector(options.selector)));
    return inputElementsDictionary;
  }

  _setEventListeners()
  {
    if (this._closeButton)
    {
      this._closeButton.addEventListener('mousedown', this._closeBind)
    }

    this._popup.addEventListener('mousedown', this._closeBind)

    if(this._form)
    {
      this._form.addEventListener('submit', this._submitBind);
    }

    if (this._options.closeByEsc)
    {
      document.addEventListener('keydown', this._onEscapeKeyBind);
    }
  }

  _removeEventListeners()
  {
    if (this._closeButton)
    {
      this._closeButton.removeEventListener('mousedown', this._closeBind);
    }

    this._popup.removeEventListener('mousedown', this._closeBind);

    if(this._form)
    {
      this._form.removeEventListener('submit', this._submitBind);
    }

    document.removeEventListener('keydown', this._onEscapeKeyBind);
  }

  open(prepareArgument)
  {
    if(this._form)
    {
      this._form.reset();
    }

    if (this._options.prepareCallback)
    {
      this._options.prepareCallback(this._inputs, prepareArgument);
    }

    this._setEventListeners();

    this._popup.classList.add(this._options.openedClass);
  }

  _onEscapeKey(event)
  {
    if (event.key === 'Escape')
    {
      this._close();
    }
  }

  _close(event)
  {
    if ((!event) || (event.target === this._closeButton) || (event.target === this._popup))
    {
      if (this._options.closeCallback)
      {
        this._options.closeCallback(this);
      }

      this._popup.classList.remove(this._options.openedClass);
      this._removeEventListeners();
    }
  }

  _submit(event)
  {
    event.preventDefault();
    if (this._options.sumbitCallback)
    {
      this._options.sumbitCallback(this._inputs)
    }
    this._close();
  }
}


export default Popup
