export default class API {
  constructor({baseUrl, headers}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _fetch({method = 'GET', urlPart, payload }) {
    const url =  this._baseUrl + urlPart;
    const requestOptions = Object.assign({}, {headers: this._headers}, {method}, payload ? {body: JSON.stringify(payload)} : undefined );
    return fetch(url, requestOptions)
      .then((res) => res.ok ? res.json() : Promise.reject(`Server respond with ${res.status}`))
      .catch((err) => {console.error(`Something went wrong`, err); return Promise.reject(err)});
  }

  getInitialCards() {
    return this._fetch({
      urlPart: '/cards'
    });
  }

  sendCard({name, link}) {
    return this._fetch({
      method: 'POST',
      urlPart: '/cards',
      payload: {name, link}
    });
  }

  deleteCard(cardId) {
    return this._fetch({
      method: 'DELETE',
      urlPart: `/cards/${cardId}`
    });
  }

  likeCard(cardId) {
    return this._fetch({
      method: 'PUT',
      urlPart: `/cards/likes/${cardId}`
    });
  }

  dislikeCard(cardId) {
    return this._fetch({
      method: 'DELETE',
      urlPart: `/cards/likes/${cardId}`
    });
  }

  getMe() {
    return this._fetch({
      urlPart: `/users/me`
    });
  }

  updateMe({name, about}) {
    return this._fetch({
      method: 'PATCH',
      urlPart: `/users/me`,
      payload: {name, about}
    });
  }

  setAvatar(avatarUrl) {
    return this._fetch({
      method: 'PATCH',
      urlPart: `/users/me/avatar`,
      payload: {avatar: avatarUrl}
    });
  }
}
