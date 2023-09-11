'use strict';
class Router {
    sideBar;
    constructor() {
        this.sideBar = document.querySelector('#sidebar');
        this.sideBar.addEventListener('click', this.#onClickHandler.bind(this));
    }

    #onClickHandler(e) {
        const { target } = e;
        if (!target.matches(".nav-link")) return;
        e.preventDefault();
        this.urlRoute();
    }

    #urlRoutes = {
        404: {
            template: "/pages/404.html",
            title: "404 | Page not found !"
        },
        "/": {
            template: "/pages/review.html",
            title: "Review"
        },
        "/add-card": {
            template: "/pages/add-card.html",
            title: "Add new Card"
        },
        "/progressbar": {
            template: "/pages/progressbar.html",
            title: "Your progress in learning !"
        },
        "/info": {
            template: "/pages/info.html",
            title: "Application information"
        }
    }

    urlRoute(event) {
        event = event || window.event;
        event.preventDefault();
        window.history.pushState({}, "", event.target.href);
        this.urlLocationHandler();
    }

    async urlLocationHandler() {
        const location = window.location.pathname;
        if (location.length == 0) {
            location = "/";
        }
        const { title } = this.#urlRoutes[location] || this.#urlRoutes[404];
        const html = PAGES[location];
        document.getElementById("main").innerHTML = html;

        if (location == "/") {
            app.initReview();
        } else if (location == "/add-card") {
            app.initAddCard();
        }
    }
}
