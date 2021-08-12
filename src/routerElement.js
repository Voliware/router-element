/**
 * A top level route-element with a window popstate event listener.
 * This listener will intercept the back navigation and use the
 * url in the address bar to find the appropriate route.
 * @extends {HTMLElement}
 */
 class RouterElement extends HTMLElement {

    /**
     * Dispatch a 'router.route' element which will be picked up by any higher <router-element>
     * @param {HTMLElement} element 
     * @param {String} url 
     */
    static route(element, url){
        element.dispatchEvent(new CustomEvent('router.route', {
            detail: url,
            bubbles: true
        }))
    }

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

        /**
         * Map of routes
         * @type {Map<String, RouteElement>}
         */
        this.routes = new Map();

        /**
         * The associated, optional nav controls
         * @type {Map<String, Array<HTMLElement>>}
         */
        this.navs = new Map();
        
        /**
         * The currently displayed route url
         * @type {String}
         */
         this.current_url = null;

        // Add a mutation observer to watch for removed route-elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                switch(mutation.type){
                    case 'childList':
                        if(mutation.removedNodes.length){
                            this.handleRemovedChildNode(mutation.removedNodes);
                        }
                    break;
                }
            });
        });
        observer.observe(this, {childList: true});
        
        // Add an event listener to listen for bubbled route requests via events
        this.addEventListener('router.route', event => {
            this.route(event.detail);
        });
    }

    /**
     * On connection, find all routes and attach the window popstate handler.
     */
    connectedCallback(){
        if(this.getAttribute('back') !== 'false'){
            window.addEventListener('popstate', () => {
                this.route(window.location.pathname, {add_to_history: false});
            });
        }

        this.findRoutes();
        this.findNavs();

        if(this.getAttribute('auto') !== 'false'){
            this.initialize();
        }
    }

    /**
     * Initialize by routing the location pathname.
     */
    initialize(){
        this.route(window.location.pathname, {add_to_history: false});
    }

    /**
     * Handle a removed route-element.
     * @param {Array<Node>} nodes 
     */
    handleRemovedChildNode(nodes){
        for(let i = 0; i < nodes.length; i++){
            if(this.current_url === nodes[i].getAttribute('url')){
                this.current_url = null;
                this.dispatchEvent(new Event('router.removed', {bubbles: true}));
                break;
            }
        }
    }

    /**
     * Find any optional nav elements.
     * These must be identified by class route-element-nav
     */
    findNavs(){
        this.navs.clear();
        const nav_selector = this.getAttribute('nav');
        if(!nav_selector){
            return 
        }

        const nav_elements = document.querySelectorAll(nav_selector);
        if(!nav_elements.length){
            return;
        }

        nav_elements.forEach(nav_element => {
            const navs = nav_element.querySelectorAll('.route-element-nav');
            navs.forEach(nav => {
                // Get either the href or url attribute
                const href = nav.getAttribute('href');
                const url = nav.getAttribute('url');
                const value = href || url;
                if(!value){
                    console.warn('route-element-nav is missing an href/url attribute');
                    return;
                }
                
                nav.addEventListener('click', event => {
                    event.preventDefault();
                    this.route(value);
                });

                const navs = this.navs.get(value) || [];
                navs.push(nav);
                this.navs.set(value, navs);
            });
        });
    }

    /**
     * Set the active nav
     * @param {String} url 
     */
    setNav(url){
        // Remove active class from currrent nav(s)
        const current_navs = this.navs.get(this.current_url);
        if(current_navs && current_navs.length){
            current_navs.forEach(nav => {
                nav.classList.remove('route-element-nav-active');
            });
        }

        // Add active class to matching nav(s)
        const navs = this.navs.get(url);
        if(navs && navs.length){
            navs.forEach(nav => {
                nav.classList.toggle('route-element-nav-active', true);
            });
        }
    }

    /**
     * Clear the route map and then find all immediate child route-elements.
     * Attach handlers to see if their URLs ever change.
     */
    findRoutes() {
        this.routes.clear();
        for (let i = 0; i < this.children.length; i++) {
            const element = this.children[i];
            if (element instanceof RouteElement) {
                this.routes.set(element.getAttribute('url'), element);
                
                // When the url changes, and it was the current route, set current_url to null
                element.addEventListener('route.urlchanged', ({detail}) => {
                    if(this.current_url === detail){
                        this.current_url = null;
                    }
                });
            }
        }
    }

    /**
     * Display a route-element based on the provided URL.
     * Add the url to the window history.
     * If nothing close can be found, emits "notfound" event
     * @param {String} url 
     * @param {Object} [options={}]
     * @param {Boolean} [options.add_to_history=true] - Whether to add the route to window history
     */
    route(url, {add_to_history = true} = {}) {
        // Validate url
        if(typeof url !== 'string'){
            console.warn('Invalid URL passed to route()');
            return;
        }

        // URL after passing through some modifications
        let processed_url = url;

        // Strip query params
        const params_index = processed_url.indexOf('?');
        if(params_index > -1){
            processed_url = processed_url.slice(0, params_index);
        }

        // Emit event in case someone wants to block this
        // They can set cancel to true
        const detail = {url, cancel: false};
        this.dispatchEvent(new CustomEvent('router.beforeroute', {
            detail: detail,
            bubbles: true
        }));

        if(detail.cancel){
            return;
        }

        // Add to history, use original URL
        if (add_to_history && this.history_allowed && this.getAttribute('history') !== 'false'){
            window.history.pushState(null, null, url);
        }
        
        const found_url = this.setRoute(processed_url)

        const event_name = found_url ? 'router.routed' : 'router.notfound';
        this.dispatchEvent(new CustomEvent(event_name, {
            detail: found_url ? found_url : processed_url, 
            bubbles: true
        }));
	}

    /**
     * Reveal a route-element based on the provided url.
     * If the exact route is not found, tries to find the one that matches the most.
     * Hide the previously revealed route.
     * Call the route's init() function which will call its initialize()
     * @param {String} url 
     * @returns {String} Found URL if found, blank if not found
     */
    setRoute(url){
        let route = this.routes.get(url);
        if (!route) {
            if(this.getAttribute('partial') !== 'false'){
                // Find the best match possible
                let best = '';
                this.routes.forEach((route_element, route_url) => {
                    if(url.startsWith(route_url)){
                        if(route_url.length > best.length){
                            best = route_url;
                        }
                    }
                });
                if(best){
                    url = best;
                    route = this.routes.get(url);
                }
            }
        }

        if(!route){
            return "";
        }
		
        // Hide the current route
        if (this.current_url !== null) {
            const current_route = this.routes.get(this.current_url);
            if(current_route){
                current_route.toggle(false);
            }
        }
        
        this.setNav(url);
        route.toggle(true);
        route.init();
        
        this.current_url = url;

        return this.current_url;
    }
}
customElements.define('router-element', RouterElement);