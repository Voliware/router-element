/**
 * A top level route-element with a window popstate event listener.
 * This listener will intercept the back navigation and use the
 * url in the address bar to find the appropriate route.
 * @extends {RouteElement}
 */
 class RouterElement extends RouteElement {

    /**
     * Constructor
     */
    constructor() {
        super();

        /**
         * Whether history saving is available.
         * This doesn't work on file: routes.
         * @type {Boolean}
         */
        this.history_allowed = window.location.protocol !== 'file:';
    }

    /**
     * On connection, find all route and attach the window popstate handler.
     */
    connectedCallback(){
        this.findRoutes();

        if(this.getAttribute('back') !== 'false'){
            window.addEventListener('popstate', () => {
                this.route(window.location.pathname, false);
            });
        }

        if(this.getAttribute('auto') !== 'false'){
            this.init();
        }
    }

    /**
     * Initialize by setting the current route using the current pathname.
     */
    init(){
        this.route(window.location.pathname, false);
    }

    /**
     * Route.
     * Also capture the route in history, if set and possible. 
     * @param {String} url 
     * @param {Boolean} [add_history=true]
     */
    route(url, add_history = true){
        if (add_history && this.history_allowed){
            if(this.getAttribute('history') !== 'false'){
                window.history.pushState(null, null, url);
            }
        }
        super.route(url);
    }
}
customElements.define('router-element', RouterElement);