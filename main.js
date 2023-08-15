let quill;
let editor;
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
        this.#front = content;
    }

    get front() {
        return this.#front;
    }


    set back(content) {
        this.#back = content;
    }

    get back() {
        return this.#back;
    }


    set tags(tagArray) {
        this.#tags = tagArray;
    }

    get tags() {
        return this.#tags;
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

// class App
class App {
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
        editor = document.querySelector('.ql-editor');
    }
}
// class Progress
// class Simple_Card
// class Dictation_Card


let text = '';

let saveBtn = document.querySelector('.save-card_btn');
let flipSideBtn = document.querySelector('.flip-side-card_btn');

editor.dataset.placeholder = 'Write your content here ...'

btn.addEventListener('click', () => {
    text = editor.innerHTML;
})


