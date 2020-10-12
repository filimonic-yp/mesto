import API from './API.js';

/*
  ApiExtension расширяет объекты карточек:
    Добавляет карточкам атрибуты:
      likeCount - количество лайков
      isLikedByMe - отлайкана ли карточка мной
      isOwnedByMe - я ли владелец карточки

    Также в лучае отсутствия информации, класс запрашивает недостающую информацию из /users/me (например, перед получением карточки) и хранит _id пользователя
*/

export default class APIExtension extends API {
  constructor (options)
  {
    super(options);
  }

  getMe()
  {
    return super
      .getMe()
      .then((data) => {this._storeMyId(data); return data});
  }

  getInitialCards()
  {
    return (this._myId ? Promise.resolve() : this.getMe())
    .then(() => super.getInitialCards())
    .then(cards => cards.map(card => this._extendCard(card)));
  }

  likeCard(cardId)
  {
    return super
      .likeCard(cardId)
      .then((card) => (this._extendCard(card)));
  }

  dislikeCard(cardId)
  {
    return super
      .dislikeCard(cardId)
      .then((card) => (this._extendCard(card)));
  }

  sendCard(data)
  {
    return super
      .sendCard(data)
      .then((card) => (this._extendCard(card)));
  }

  _extendCard(card)
  {
    card['isOwnedByMe'] = this._isMyId(card.owner._id)
    card['likeCount']   = card.likes.length || 0;
    card['isLikedByMe'] = card.likes.some(person => this._isMyId(person._id))
    return card;
  }

  _isMyId(otherId)
  {
    return this._myId === otherId;
  }

  _storeMyId(data)
  {
    //console.log("My ID saved:", data._id);
    this._myId = data._id
  }

}
