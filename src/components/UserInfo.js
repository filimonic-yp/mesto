export default class UserInfo
{
  constructor(nameSelector, jobSelector, avatarSelector)
  {
    this._name = document.querySelector(nameSelector);
    this._job = document.querySelector(jobSelector);
    this._avatar = document.querySelector(avatarSelector);
  }


  getUserInfo()
  {
    return {
      name: this._name.textContent,
      job:  this._job.textContent,
      avatar: this._avatar.getAttribute('src')
    }
  }


  setUserInfo({name, about, avatar})
  {
    this._name.textContent = name;
    this._job.textContent = about;
    this._avatar.setAttribute('src', avatar);
    this._avatar.setAttribute('alt', `${name}, ${about}`);
  }
}
