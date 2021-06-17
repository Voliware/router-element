const assert = chai.assert;
describe("route-element", function() {
    before(function (){
        this.router = document.querySelector('router-element');
        this.route_root = document.querySelector('route-element[url="/"]');
        this.route_users_login = document.querySelector('route-element[url="/users/login"]');
        this.route_users_register = document.querySelector('route-element[url="/users/register"]');
        this.route_users_account_settings = document.querySelector('route-element[url="/users/account/settings"]');
        this.route_movies = document.querySelector('route-element[url="/movies"]');
        this.route_games = document.querySelector('route-element[url="/games"]');

        this.nav_root = document.querySelectorAll('.route-element-nav[url="/"]');
        this.nav_users_login = document.querySelectorAll('.route-element-nav[url="/users/login"]');
        this.nav_users_register = document.querySelectorAll('.route-element-nav[url="/users/register"]');
        this.nav_users_account_settings = document.querySelectorAll('.route-element-nav[url="/users/account/settings"]');
        this.nav_movies = document.querySelectorAll('.route-element-nav[url="/movies"]');
        this.nav_games = document.querySelectorAll('.route-element-nav[url="/games"]');
    });

    it("finds all child route-elements", function() {
        assert.strictEqual(this.router.routes.size, 6);
    });

    it("reveals route with matching url", function() {
        this.router.route('/movies');
        assert.strictEqual(this.route_movies.style.display, 'block');
    });

    it("reveals route with matching url using display attribute", function() {
        this.router.route('/users/login');
        assert.strictEqual(this.route_users_login.style.display, 'flex');
    });

    it("hides other routes if a new route is set", function() {
        this.router.route('/games');
        assert.strictEqual(window.getComputedStyle(this.route_root).display, 'none');
        assert.strictEqual(window.getComputedStyle(this.route_users_login).display, 'none');
        assert.strictEqual(window.getComputedStyle(this.route_users_register).display, 'none');
        assert.strictEqual(window.getComputedStyle(this.route_users_account_settings).display, 'none');
        assert.strictEqual(window.getComputedStyle(this.route_movies).display, 'none');
        assert.strictEqual(this.route_games.style.display, 'block');
    });

    it("adds the active navs classes", function() {
        this.router.route('/users/account/settings');
        assert.strictEqual(this.nav_users_account_settings[0].classList.contains('route-element-nav-active'), true);
        assert.strictEqual(this.nav_users_account_settings[1].classList.contains('route-element-nav-active'), true);
    });

    it("removes the active navs classes", function() {
        this.router.route('/');
        assert.strictEqual(this.nav_root[0].classList.contains('route-element-nav-active'), true);
        assert.strictEqual(this.nav_root[1].classList.contains('route-element-nav-active'), true);
        assert.strictEqual(this.nav_users_login[0].classList.contains('route-element-nav-active'), false);
        assert.strictEqual(this.nav_users_login[1].classList.contains('route-element-nav-active'), false);
        assert.strictEqual(this.nav_users_register[0].classList.contains('route-element-nav-active'), false);
        assert.strictEqual(this.nav_users_register[1].classList.contains('route-element-nav-active'), false);
        assert.strictEqual(this.nav_users_account_settings[0].classList.contains('route-element-nav-active'), false);
        assert.strictEqual(this.nav_users_account_settings[1].classList.contains('route-element-nav-active'), false);
        assert.strictEqual(this.nav_movies[0].classList.contains('route-element-nav-active'), false);
        assert.strictEqual(this.nav_movies[1].classList.contains('route-element-nav-active'), false);
        assert.strictEqual(this.nav_games[0].classList.contains('route-element-nav-active'), false);
        assert.strictEqual(this.nav_games[1].classList.contains('route-element-nav-active'), false);
    });

    it("routes when nav is clicked", function() {
        this.nav_users_login[0].click();
        assert.strictEqual(this.route_users_login.style.display, 'flex');
    });

    it("updates the navigation bar", function() {
        this.router.route('/users/account/settings');
        assert.strictEqual('/users/account/settings', window.location.pathname);
    });

    it("handles query strings", function() {
        this.router.route('/users/login?a=b&c=d');
        assert.strictEqual(this.route_users_login.style.display, 'flex');
    });

    it("handles slugs", function() {
        this.router.route('/users/account/settings/this-is-a-slug');
        assert.strictEqual(this.route_users_account_settings.style.display, 'block');
    });
    
    it("emits an event when the current route's url changes", async function() {
        const promise = new Promise((resolve, reject) => {
            this.router.addEventListener('urlchanged', event => {
                resolve(true);
            });
        })
        this.router.route('/movies');
        this.route_movies.setAttribute('url', '/notmovies');
        const result = await promise;
        assert.strictEqual(result, true);
    });

    it("emits an event when the current route is removed", async function() {
        const promise = new Promise((resolve, reject) => {
            this.router.addEventListener('removed', event => {
                resolve(true);
            });
        })
        this.router.route('/users/login');
        this.route_users_login.remove();
        const result = await promise;
        assert.strictEqual(result, true);
    });

    it("emits an event when it calls route()", async function() {
        const promise = new Promise((resolve, reject) => {
            this.router.addEventListener('routed', event => {
                resolve(event.detail === '/users/login');
            });
        })
        this.router.route('/users/login');
        const result = await promise;
        assert.strictEqual(result, true);
    });

    it("emits a notfound event when url is not found", async function() {
        const promise = new Promise((resolve, reject) => {
            this.router.addEventListener('notfound', () => {
                resolve(true);
            });
        })
        this.router.route('/users/login/fake');
        const result = await promise;
        assert.strictEqual(result, true);
    });

    it("handles a bubbling route event", function() {
        this.route_games.dispatchEvent(new CustomEvent('route', {detail: '/movies', bubbles: true}))
        assert.strictEqual(this.route_movies.style.display, 'block');
    });
});