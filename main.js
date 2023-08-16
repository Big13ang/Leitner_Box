'use strict';

// Global variables
const $ = document;

// elements 
let saveBtn = $.querySelector('.save-card_btn');
let flipSideBtn = $.querySelector('.flip-side-card_btn');
let editorTitle = $.querySelector('.editor-title');
let simpleRadioBtn = $.querySelector('#simple-card');
let dictationRadioBtn = $.querySelector('#dictation-card');

// class Card
class Card {
    id = crypto.randomUUID();
    date = new Date();
    constructor(type, front = "", back = "", tags = []) {
        this.type = type;
        this.front = front;
        this.back = back;
        this.tags = tags;
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
// class App
class App {
    cardsList = [[], [], [], [], []];
    quill;
    editor;
    cardSide = 'Front';
    cardContent = { type: '', Front: '', Back: '' };

    constructor() {
        this.quill = new Quill('#editor-container', {
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'code-block'],
                    [{ 'align': [] },{ 'direction': 'rtl' }]
                ]
            },
            placeholder: 'Compose an epic...',
            theme: 'snow'  // or 'bubble'
        });
        this.editor = $.querySelector('.ql-editor');
        this.editor.dataset.placeholder = 'Write your content here ...'

        flipSideBtn.addEventListener('click', this.#flipCard.bind(this));
        saveBtn.addEventListener('click', this.#saveCard.bind(this));
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

        console.log(this.cardContent);
    }
}
let app = new App();








