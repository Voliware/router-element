const assert = chai.assert;
describe("route-element", function() {
    before(function (){
        this.router = document.createElement('router-element');
        this.route1 = document.createElement('route-element');
        this.route2 = document.createElement('route-element');
        this.route3a = document.createElement('route-element');
        this.route3b = document.createElement('route-element');

        this.route1.setAttribute('url', '/');
        this.route2.setAttribute('url', '/movies');
        this.route3a.setAttribute('url', '/users');
        this.route3b.setAttribute('url', '/users/account');

        this.router.appendChild(this.route1);
        this.router.appendChild(this.route2);
        this.router.appendChild(this.route3a);
        this.route3a.appendChild(this.route3b);

        document.body.appendChild(this.router);
    });

    it("finds all child route-elements", function() {
        assert.strictEqual(this.router.routes.size, 3);
        assert.strictEqual(this.route1.routes.size, 0);
        assert.strictEqual(this.route2.routes.size, 0);
        assert.strictEqual(this.route3a.routes.size, 1);
        assert.strictEqual(this.route3b.routes.size, 0);
    });

    it("reveals route with matching url", function() {
        this.router.route('/movies');
        assert.strictEqual(this.route2.style.display, 'block');
    });

    it("reveals route with matching url using display attribute", function() {
        this.route2.setAttribute('display', 'flex');
        this.router.route('/movies');
        assert.strictEqual(this.route2.style.display, 'flex');
    });

    it("reveals nested routes with matching url", function() {
        this.router.route('/users/account');
        const hidden = this.route3a.style.display === 'none'
            && this.route3b.style.display === 'none';
        assert.strictEqual(hidden, false);
    });

    it("updates the navigation bar", function() {
        this.router.route('/users/account');
        assert.strictEqual('/users/account', window.location.pathname);
    });

    it("hides other routes if a new route is set", function() {
        this.router.route('/users/account');
        assert.strictEqual(this.route2.style.display, 'none');
    });

    it("emits an event when the current route's url changes", async function() {
        const promise = new Promise((resolve, reject) => {
            this.router.addEventListener('urlchanged', event => {
                resolve(true);
            });
        })
        this.router.route('/movies');
        this.route2.setAttribute('url', '/notmovies');
        const result = await promise;
        assert.strictEqual(result, true);
    });

    it("emits an event when the current route is removed", async function() {
        const promise = new Promise((resolve, reject) => {
            this.router.addEventListener('removed', event => {
                resolve(true);
            });
        })
        this.router.route('/users');
        this.route3a.remove();
        const result = await promise;
        assert.strictEqual(result, true);
    });
});