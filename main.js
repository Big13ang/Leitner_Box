'use strict';

// Global variables
const $ = document;

// elements 
let saveBtn = $.querySelector('.save-card_btn');
let flipSideBtn = $.querySelector('.flip-side-card_btn');
let editorTitle = $.querySelector('.editor-title');

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
    quill;
    editor;
    CardSide = 'Front';
    frontContent = '';
    backContent = '';

    constructor() {
        quill = new Quill('#editor-container', {
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'code-block']
                ]
            },
            placeholder: 'Compose an epic...',
            theme: 'snow'  // or 'bubble'
        });
        editor = $.querySelector('.ql-editor');

        flipSideBtn.addEventListener('click', this.#flipCard);

        saveBtn.addEventListener('click', this.#saveCard);
    }

    #flipCard() {
        CardSide === 'Front' ? CardSide = 'Back' : CardSide = 'Front';
    }

    #saveCard() {
        this.CardSide == 'Front' ? frontContent = editor.innerHTML : backContent = editor.innerHTML;
        console.log(frontContent);
    }
}
let app = new App();



editor.dataset.placeholder = 'Write your content here ...'




