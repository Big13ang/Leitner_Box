'use strict';

// Global variables
const $ = document;

// elements 
let saveBtn = $.querySelector('.save-card_btn');
let flipSideBtn = $.querySelector('.flip-side-card_btn');
let editorTitle = $.querySelector('.editor-title');
let simpleTypeBtn = $.querySelector('#simple-card');
let dictationTypeBtn = $.querySelector('#dictation-card');
let radioBtnGroup = $.querySelector('.type-radio-group');
let sideBarElement = $.querySelector('#sidebar');
let navLinks = $.querySelectorAll('.nav-link');

class Card {
    id = crypto.randomUUID();
    date = new Date();
    constructor(type, front = "", back = "", tags = [], interval = 1, repetitions = 0) {
        this.type = type;
        this.front = front;
        this.back = back;
        this.tags = tags;
        this.interval = interval;
        this.repetitions = repetitions;
    }

    set front(content) {
        this._front = content;
    }

    get front() {
        return this._front;
    }


    set back(content) {
        this._back = content;
    }

    get back() {
        return this._back;
    }


    set tags(tagArray) {
        this._tags = tagArray;
    }

    get tags() {
        return this._tags;
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
// class Progress
// class Progress {

// }



class App {
    cardsList = [[], [], [], [], []];
    quill;
    editor;
    cardSide = 'Front';
    cardContent = { type: 'simple', Front: '', Back: '' };

    constructor() {
    }

    initAddCard() {
        console.log($.querySelector('#editor-container'));
        this.quill = new Quill('#editor-container', {
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'code-block', 'link'],
                    [{ 'align': [] }, { 'direction': 'rtl' }]
                ]
            },
            placeholder: 'Compose an epic...',
            theme: 'snow'  // or 'bubble'
        });
        this.editor = $.querySelector('.ql-editor');
        this.editor.dataset.placeholder = 'Write your content here ...'
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
        this.cardContent[this.cardSide] = this.editor.innerHTML;
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
        this.cardsList[newCard.repetitions].push(newCard);

        console.log(this.cardsList);
        this.#clearEditor();
        this.cardContent = { type: 'simple', Front: '', Back: '' };
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