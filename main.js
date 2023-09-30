'use strict';
// Global variables
const $ = document;

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
let sideBarElement = $.querySelector('#sidebar');
let navLinks = $.querySelectorAll('.nav-link');

// Review
let cardBackSide, cardFrontSide, frontSideEditor, backSideEditor, reviewForgotBtn, reviewRememberBtn;

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
            console.log("User created successfully:", createdUser);
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
}

class Card {
    id = crypto.randomUUID();
    date = new Date();
    constructor(type, front = "", back = "", tags = [], interval = 0, repetitions = 0) {
        this.type = type;
        this.front = front;
        this.back = back;
        this.tags = tags;
        this.interval = interval;
        this.repetitions = repetitions;
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
    cardSide = 'Front';
    currentCard;
    currentUser;

    constructor() {
        this.cardsList = this.#getFromStorage('cardsList') || [];
        this.currentCard = this.#getFromStorage('currentUser') || "";
        if (this.currentCard === "") this.#isNotLoggedIn.bind(this);
    }


    #saveToStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    #getFromStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    #showCard() {
        this.currentCard = this.cardContent;
        frontSideEditor.innerHTML = this.currentCard.Front;
        backSideEditor.innerHTML = this.currentCard.Back;
    }

    #forgotCard() {

    }

    #rememberCard() {

    }

    #isNotLoggedIn() {
        sideBarElement.classList.add('d-none');
        $.querySelector('container').classList.add("grid-temp-col-1");
    }

    initAuth() {
        const findCardElements = () => {
            authTitle = $.querySelector('.form_title');
            authUserInput = $.querySelector('.form_user-input');
            authPassInput = $.querySelector('.form_pass-input');
            authBtn = $.querySelector('#form_btn');
            authNoticeParent = $.querySelector('.form_notice');
            authNoticeText = $.querySelector('.form_notice-text');
        }
        findCardElements();

        // change auth type
        authNoticeParent.addEventListener('click', this.#changeAuthType.bind(this));

        // register and login
        authBtn.addEventListener('click', this.#auth.bind(this));
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
            this.#saveToStorage('currentUser', currentUser[0]._id);
            this.#resetAuthForm();
            alert(`Your logged in successfully 
            User: ${currentUser[0].user}`);
            sideBarElement.classList.remove('d-none');
            $.querySelector('container').classList.remove("grid-temp-col-1");
            return;
        }
    }

    initReview() {
        // Find Elements
        const findCardElements = () => {
            cardBackSide = $.querySelector('#flip-card_front');
            cardFrontSide = $.querySelector('#flip-card_back');
            reviewForgotBtn = $.querySelector('#flip-card_front');
            reviewRememberBtn = $.querySelector('#flip-card_back');
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

        this.currentCard = this.cardsList[0];
        this.#showCard();
        // Set Events
        reviewForgotBtn.addEventListener('click', this.#forgotCard.bind(this));
        reviewForgotBtn.addEventListener('click', this.#rememberCard.bind(this));
    }

    initAddCard() {
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
        if (dictationTypeBtn.checked) {
            this.cardContent.type = dictationTypeBtn.value;
        } else if (simpleTypeBtn.checked) {
            this.cardContent.type = simpleTypeBtn.value;
        }
    }
    #saveContent() {
        if (this.editor.innerHTML === '<p><br></p>') return;

        // let delta = this.quill.getContents();
        // let text = this.quill.getText();
        // let justHtml = this.quill.root.innerHTML;
        // console.log(JSON.stringify(delta));
        // console.log(text);
        // console.log(justHtml);

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
        this.#saveContent();
        this.cardSide === 'Front' ? this.cardSide = 'Back' : this.cardSide = 'Front';
        editorTitle.textContent = `${this.cardSide} Side`;
        editorTitle.classList.toggle('back');
        if (this.cardContent[this.cardSide] != '') {
            this.#renderContent();
        } else {
            this.#clearEditor();
        }
    }
    #saveCard() {
        this.#saveContent();
        if (
            !this.cardContent.Back
            || !this.cardContent.Front
            || this.cardContent.Back.length === 0
            || this.cardContent.Front.length === 0
        ) return window.alert('one side of the card is empty fill it !!!');

        let newCard;
        if (this.cardContent.type === 'simple') {
            newCard = new SimpleCard(this.cardContent.Front, this.cardContent.Back);
        } else if (this.cardContent.type === 'dictation') {
            newCard = new DictationCard(this.cardContent.Front, this.cardContent.Back);
        }

        this.cardsList.push(newCard);
        localStorage.setItem('cardsList', JSON.stringify(this.cardsList));

        this.#clearEditor();
        this.cardContent = { type: 'simple', Front: '', Back: '' };

        console.log(JSON.parse(localStorage.getItem('cardsList')));
        console.log(this.cardsList);
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