let sideBar = document.querySelector('#sidebar');

sideBar.addEventListener('click', (e) => {
    const { target } = e;
    if (!target.matches(".nav-link")) return;
    e.preventDefault();
    
    urlRoute();
});

const urlRoutes = {
    404: {
        template: "/pages/404.html",
        title: "404 | Page not found !"
    },
    "/": {
        template: "/pages/overview.html",
        title: "Overview"
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

const urlRoute = event => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    urlLocationHandler();
}

const urlLocationHandler = async () => {
    const location = window.location.pathname;
    if (location.length == 0) {
        location = "/";
    }

    const route = urlRoutes[location] || urlRoutes[404];
    const html = await fetch(route.template).then(response => response.text());
    document.getElementById("main").innerHTML = html;
}
window.onpopstate = urlLocationHandler;
window.route = urlRoute;

urlLocationHandler();