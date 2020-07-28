let profileEl = document.querySelector('.profile');
let profileDisplaynameEl = profileEl.querySelector('.profile__displayname');
let profileJobEl = profileEl.querySelector('.profile__job');
let profileBtnEditEl = profileEl.querySelector('.profile__btn-edit');


let popupEl = document.querySelector('.popup')
let popupInputDisplaynameEl = popupEl.querySelector('.profile-editor__input[name="displayname"]');
let popupFormProfileEditorEl = popupEl.querySelector('.profile-editor');
let popupInputJobEl = popupEl.querySelector('.profile-editor__input[name="jobname"]');
let popupBtnCloseEl = popupEl.querySelector('.profile-editor__btn-close');

function setupEditor(profileData) {
    popupInputDisplaynameEl.value = profileData.displayname ;
    popupInputJobEl.value = profileData.job ;
}

function setupProfile(profileData) {
    console.log(`${getFuncName()}`);
    profileDisplaynameEl.textContent  = profileData.displayname || '';
    profileJobEl.textContent = profileData.job || '';
}

function getFuncName() {
    return getFuncName.caller.name;
}

function showPopup() {
    setupEditor( {
        displayname: profileDisplaynameEl.textContent,
        job: profileJobEl.textContent 
    });

    popupEl.classList.add('popup_opened');
    popupInputDisplaynameEl.focus();
}

function closePopup(doSave) {
    console.log(`${getFuncName()} : doSave = ${doSave}`);
    if (doSave) {
        setupProfile({
            displayname: popupInputDisplaynameEl.value,
            job: popupInputJobEl.value,
        });
    }
    popupEl.classList.remove('popup_opened');
    profileBtnEditEl.focus();
}


profileBtnEditEl.addEventListener('click', showPopup);
popupFormProfileEditorEl.addEventListener('submit', function(e) {e.preventDefault(); closePopup(true)});
popupBtnCloseEl.addEventListener('click', function() {closePopup(false)});
document.addEventListener('keydown', function(e) { if (e.key == 'Escape')  closePopup(false); });

