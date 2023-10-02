'use strict';
// Global variables
const $ = document;
let sideBarElement = $.querySelector('#sidebar');
let appContainer = $.querySelector('.container');

// elements 
let authType = "login";
let authTitle;
let authUserInput;
let authPassInput;
let authBtn;
let authNoticeParent;
let authNoticeText;
let saveBtn;
let flipSideBtn;
let editorTitle;
let simpleTypeBtn;
let dictationTypeBtn;
let radioBtnGroup;
let logOutBtn;
let navLinks = $.querySelectorAll('.nav-link');

// Review
let cardbackSide, cardfrontSide, frontSideEditor, backSideEditor, reviewForgotBtn, reviewDelBtn, reviewRememberBtn;

class User {
    static async create(user, pass) {
        const newUser = { user, pass };
        const url = "http://127.0.0.1:3000/api/users";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const createdUser = await response.json();
            return createdUser;
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }
    static async get(user, pass) {
        const url = 'http://localhost:3000/api/users';

        try {
            const response = await fetch(`${url}?user=${user}&pass=${pass}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch data from the server. Status: ${response.status}`);
            }

            const userObj = await response.json();
            return userObj;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    static async getCards(currentUserId) {
        const url = `http://localhost:3000/api/users/${currentUserId}/cards`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch data from the server. Status: ${response.status}`);
            }

            const userCards = await response.json();
            return userCards;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

class Card {
    date;
    constructor(type, front = "", back = "", tags = [], interval = 0, repetitions = 0) {
        this.type = type;
        this.front = front;
        this.back = back;
        this.tags = tags;
        this.interval = interval;
        this.repetitions = repetitions;
        this.date = new Date().toISOString();
    }

    static async SaveToDB(card, currentUserId) {
        const url = `http://localhost:3000/api/users/${currentUserId}/cards`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(card),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const newCard = await response.json();
            return newCard;
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }

    static async UpdateCard(cardId, currentUserId, newData) {
        const url = `http://localhost:3000/api/users/${currentUserId}/cards/${cardId}`; // Assuming you have cardId
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedCard = await response.json();
            return updatedCard;
        } catch (error) {
            console.error("Error updating card:", error);
        }
    }

    static async DeleteCard(cardId, currentUserId) {
        const url = `http://localhost:3000/api/users/${currentUserId}/cards/${cardId}`;
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const deletedCard = await response.json();
            return deletedCard;
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    }
}

class SimpleCard extends Card {
    constructor(front, back, tags) {
        super('Simple', front, back, tags);
    }
}

class DictationCard extends Card {
    constructor(front, back, tags) {
        super('Dictation', front, back, tags);
    }
}

class App {
    cardsList;
    quill;
    editor;
    cardSide = 'front';
    currentCard;
    currentUser;

    constructor() {
        this.#resetCardContent();
        this.cardsList = this.#getFromStorage('cardsList') || [];
        this.currentUser = this.#getFromStorage('currentUser') || {};
        if (Object.keys(this.currentUser).length === 0) {
            this.#isNotLoggedIn();
        }
    }
    #UTCToMS = (dateUTC) => new Date(dateUTC).getTime();
    #currentTimeMS = () => new Date().getTime();
    #currentTimeUTC = () => new Date().toISOString();

    #saveToStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    #getFromStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }
    #resetCardContent() {
        this.cardContent = {
            type: "simple",
            front: "",
            back: "",
            date: ""
        };
    }
    #showCard() {
        this.currentCard = this.cardContent;
        frontSideEditor.innerHTML = this.currentCard.front;
        backSideEditor.innerHTML = this.currentCard.back;
    }

    // Update Card
    #updateReviewCardUI() {
        this.cardsList.shift();
        if (this.cardsList[0]) {
            this.cardContent = this.cardsList[0];
        } else {
            this.#resetCardContent();
        }
        this.#showCard();
    }

    async #forgotCard() {
        const updatedCard = await Card.UpdateCard(
            this.currentCard._id,
            this.currentUser._id,
            {
                date: this.#currentTimeUTC(),
                interval: 0,
                repetitions: 0
            }
        );
        this.cardsList.push(updatedCard);
        // update review card UI
        this.#updateReviewCardUI();
    }
    async #reviewDeleteCard() {
        if (!window.confirm('You wanna to delete card ?')) return;
        const deletedCard = await Card.DeleteCard(
            this.currentCard._id,
            this.currentUser._id
        );
        this.#updateReviewCardUI();
        console.log(Object.keys(deletedCard).length === 0);
    }
    async #rememberCard() {
        // Calc interval
        let newInterval;
        switch (this.currentCard.repetitions) {
            case 0:
                newInterval = 1;
                break;
            case 1:
                newInterval = 3;
                break;
            case 2:
                newInterval = 7;
                break;
            case 3:
                newInterval = 14;
                break;
            case 4:
                newInterval = 30;
                break;
        }
        // calc the next review time
        let newDate = new Date(new Date().getTime() + newInterval * 24 * 60 * 60 * 1000).toISOString();

        await Card.UpdateCard(
            this.currentCard._id,
            this.currentUser._id,
            {
                date: newDate,
                interval: newInterval,
                repetitions: + Math.min(this.currentCard.repetitions + 1, 4)
            }
        );
        // update review card UI
        this.#updateReviewCardUI();
    }
    // --------------
    #isNotLoggedIn() {
        sideBarElement.classList.add('d-none');
        appContainer.classList.add("grid-temp-col-1");
    }
    initAuth() {
        const findCardElements = () => {
            authTitle = $.querySelector('.form_title');
            authUserInput = $.querySelector('.form_user-input');
            authPassInput = $.querySelector('.form_pass-input');
            authBtn = $.querySelector('#form_btn');
            authNoticeParent = $.querySelector('.form_notice');
            authNoticeText = $.querySelector('.form_notice-text');
            logOutBtn = $.querySelector('.form_logout-btn');
        }
        findCardElements();

        // change auth type
        authNoticeParent.addEventListener('click', this.#changeAuthType.bind(this));

        // register and login
        authBtn.addEventListener('click', this.#auth.bind(this));
        if (this.currentCard !== "") {
            this.#isLogin();
        }

        logOutBtn.addEventListener('click', this.#logOut);
    }
    #resetAuthForm() {
        authPassInput.value = authUserInput.value = "";
    }
    #getReverseAuthType() {
        return authType === 'login' ? 'register' : 'login';
    }
    #changeAuthType() {
        authType = this.#getReverseAuthType();
        authTitle.textContent = authType;
        authBtn.textContent = authType;
        authNoticeText.textContent = this.#getReverseAuthType();
    }
    #isLogin() {
        if (Object.keys(this.currentUser).length === 0) return;
        authTitle.textContent = `Hi ${this.currentUser.user}!`;

        // logout 

        logOutBtn.classList.remove('d-none');
        authUserInput.parentNode.innerHTML = '';
        authPassInput.parentNode.innerHTML = '';
        authBtn.parentNode.removeChild(authBtn);
        authNoticeParent.parentNode.removeChild(authNoticeParent);
        authNoticeText.parentNode.removeChild(authNoticeText);

    }
    #logOut() {
        localStorage.clear();
        location.reload();
    }
    async #auth(event) {
        event.preventDefault();
        if (authType === 'register') {
            const newUser = await User.create(authUserInput.value, authPassInput.value);
            this.#resetAuthForm();
            alert(`New user has created`);
            return;
        }
        if (authType === 'login') {
            const currentUser = await User.get(authUserInput.value, authPassInput.value);
            if (currentUser[0] == null) return alert('User or password is wrong || User not found');
            this.#saveToStorage('currentUser', currentUser[0]);
            this.currentUser = this.#getFromStorage('currentUser');
            this.#resetAuthForm();
            alert(`Your logged in successfully 
            User: ${currentUser[0].user}`);
            sideBarElement.classList.remove('d-none');
            appContainer.classList.remove("grid-temp-col-1");
            this.#isLogin();
            return;
        }
    }
    async initReview() {
        this.#resetCardContent();
        // Find Elements
        const findCardElements = () => {
            cardbackSide = $.querySelector('#flip-card_front');
            cardfrontSide = $.querySelector('#flip-card_back');
            reviewForgotBtn = $.querySelector('.review-btn_forgot');
            reviewDelBtn = $.querySelector('.review-btn_del');
            reviewRememberBtn = $.querySelector('.review-btn_remember');
        }
        findCardElements();
        // Add Quill editor to page
        this.quill = new Quill('#flip-card_front', {
            "modules": {
                "toolbar": false
            },
            placeholder: '',
            theme: 'snow'  // or 'bubble'
        });
        this.quill = new Quill('#flip-card_back', {
            "modules": {
                "toolbar": false
            },
            placeholder: '',
            theme: 'snow'  // or 'bubble'
        });
        this.quill.enable(false);
        frontSideEditor = $.querySelector('#flip-card_front').querySelector('.ql-editor');
        backSideEditor = $.querySelector('#flip-card_back').querySelector('.ql-editor');

        //? Show cards you should review today
        this.cardsList = await this.#getUserCards();
        this.cardContent = this.cardsList[0] || { type: 'simple', front: '', back: '', date: "" };

        this.#showCard();

        // Set Events
        reviewForgotBtn.addEventListener('click', this.#forgotCard.bind(this));
        reviewDelBtn.addEventListener('click', this.#reviewDeleteCard.bind(this));
        reviewRememberBtn.addEventListener('click', this.#rememberCard.bind(this));
    }

    async #getUserCards() {
        const cards = await User.getCards(this.currentUser._id);
        // Cards should review today or days before today
        // if card Date < current date time --> you should review it ! 
        const cardsShouldReviewToday = cards.filter(card => this.#UTCToMS(card.date) < this.#currentTimeMS());
        return cardsShouldReviewToday;
    }
    initAddCard() {
        this.#resetCardContent();
        // Find Elements
        const findCardElements = () => {
            saveBtn = $.querySelector('.save-card_btn');
            flipSideBtn = $.querySelector('.flip-side-card_btn');
            editorTitle = $.querySelector('.editor-title');
            simpleTypeBtn = $.querySelector('#simple-card');
            dictationTypeBtn = $.querySelector('#dictation-card');
            radioBtnGroup = $.querySelector('.type-radio-group');
        }
        findCardElements();
        // Add Quill editor to page
        this.quill = new Quill('#editor-container', {
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'code-block', 'link'],
                    [{ 'align': [] }, { 'direction': 'rtl' }]
                ]
            },
            placeholder: 'Write your content here ...',
            theme: 'snow'  // or 'bubble'
        });
        this.editor = $.querySelector('.ql-editor');

        // Set Events
        flipSideBtn.addEventListener('click', this.#flipCard.bind(this));
        saveBtn.addEventListener('click', this.#saveCard.bind(this));
        radioBtnGroup.addEventListener('click', this.#setCardType.bind(this));
        sideBarElement.addEventListener('click', this.#changeActiveLink.bind(this));
    }
    #setCardType() {
        if (
            this.cardSide.toLowerCase() == 'back'
            &&
            dictationTypeBtn.checked
        ) {
            simpleTypeBtn.checked = true;
            return alert('Dictation Card only has front Side ! || please switch to simple');
        } if (dictationTypeBtn.checked) {
            this.cardContent.type = dictationTypeBtn.value;
        } else if (simpleTypeBtn.checked) {
            this.cardContent.type = simpleTypeBtn.value;
        }
    }
    #saveContent() {
        if (this.editor.innerHTML === '<p><br></p>') return;
        this.cardContent[this.cardSide] = this.quill.root.innerHTML;
    }
    #clearEditor() {
        this.editor.innerHTML = '';
    }
    #renderContent() {
        this.#clearEditor();
        this.editor.innerHTML = this.cardContent[this.cardSide];
    }
    #flipCard() {
        if (this.cardContent.type.toLowerCase() === "dictation" && this.cardSide == 'front') return alert('Dictation card just has front !');
        this.#saveContent();
        this.cardSide === 'front' ? this.cardSide = 'back' : this.cardSide = 'front';
        editorTitle.textContent = `${this.cardSide} Side`;
        editorTitle.classList.toggle('back');
        if (this.cardContent[this.cardSide] != '') {
            this.#renderContent();
        } else {
            this.#clearEditor();
        }
    }
    async #saveCard() {
        this.#saveContent();
        if (
            !this.cardContent.back
            || !this.cardContent.front
            || this.cardContent.back.length === 0
            || this.cardContent.front.length === 0
        ) return window.alert('one side of the card is empty fill it !!!');

        let newCard;
        if (this.cardContent.type.toLowerCase() === 'simple') {
            newCard = new SimpleCard(this.cardContent.front, this.cardContent.back);
        } else if (this.cardContent.type.toLowerCase() === 'dictation') {
            if (
                this.cardContent.front.includes("<img") ||
                this.cardContent.back.includes("<img")
            ) {
                return alert('Only text allowed in Dictation Type !!!');
            }
            newCard = new DictationCard(this.cardContent.front, this.cardContent.back);
        }
        newCard = await Card.SaveToDB(newCard, this.currentUser._id);
        this.#clearEditor();
        this.#resetCardContent();
    }
    #changeActiveLink(e) {
        const { target } = e;
        if (!target.matches(".nav-link")) return;
        e.preventDefault()
        navLinks.forEach(link => link.classList.remove('nav-link__active'));
        target.classList.add('nav-link__active');
    }
}

let app = new App();

let router = new Router();
window.onpopstate = router.urlLocationHandler;
window.route = router.urlRoute;
router.urlLocationHandler();