/**
 * A routeable element. Has a URL attribute that specifies its absolute route.
 * On connection, finds all immediate <route-element> child elements and adds 
 * them to a map. It also hides itself via a the hidden class. When called upon 
 * with route(url), it will recursively search through its child <route-element>s 
 * recursively and reveal all matched routes. A single, top level <router-element> 
 * should contain all <route-element>s.
 * 
 * <route-element>s will update when child <route-element>s are added, removed, or
 * their url changes. If the currently displayed route is removed it emits 'removed'
 * or if the url attribute changes it emits 'urlchange'. Internally this is handled
 * by then setting the current url to blank, but should also be handled further.
 * 
 * @example
 * <!-- Top level should always be a <router-element> (notice the R in routeR) -->
 * <router-element>
 *     <route-element url="/">
 *         Home Page
 *     </route-element>
 *     <route-element url="/users">
 *         <route-element url="/users/account">
 *             <route-element url="/users/account/settings">
 *                 Account Settings
 *             </route-element>
 *             <route-element url="/users/account/profile">
 *                 Profile
 *             </route-element>
 *         </route-element>
 *         <route-element url="/users/friends">
 *             Friends list
 *         </route-element>
 *     </route-element>
 * </router-element>
 * @extends {HTMLElement}
 */
class RouteElement extends HTMLElement {

    /**
     * Constructor
     */
    constructor() {
        super();

        /**
         * Map of routes
         * @type {Map<String, RouteElement>}
         */
        this.routes = new Map();

        /**
         * The currently displayed route url
         * @type {String}
         */
        this.current_url = '';

        // Add a mutation observer to watch for added or removed route-elements
        // and url attribute changes. If something happens to the current route,
        // all we can do is emit an event and hope someone knows what to do about it.
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                switch(mutation.type){
                    // Watch for any direct child <route-element> adds/removes
                    case 'childList':
                        const nodes = [...mutation.addedNodes, ...mutation.removedNodes];
                        if(nodes.length){
                            for(let i = 0; i < nodes.length; i++){
                                const tagname = nodes[i].tagName;
                                if(tagname && tagname.toLowerCase() === 'route-element'){
                                    this.findRoutes();
                                    break;
                                }
                            }
                        }

                        // If the current route-element is removed, emit event, set to null.
                        if(mutation.removedNodes.length){
                            for(let i = 0; i < mutation.removedNodes.length; i++){
                                if(this.current_url === mutation.removedNodes[i].getAttribute('url')){
                                    this.current_url = '';
                                    this.dispatchEvent(new Event('removed', {bubbles: true}));
                                    break;
                                }
                            }
                        }
                    break;
                    // Emit an event on self url change
                    case 'attributes':
                        const event = new CustomEvent('urlchanged', {
                            detail: mutation.oldValue,
                            bubbles: true
                        });
                        this.dispatchEvent(event);
                        break;
                }
            });
        });
        observer.observe(this, {
            attributes: true, 
            attributeOldValue: true, 
            attributeFilter: ['url'],
            childList: true
        });
    }

    /**
     * On connection, hide the element and find all child routes
     */
    connectedCallback(){
        this.classList.toggle('hidden', true);
        this.findRoutes();
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
                
                // When the url changes, and it was the current route, set to null
                element.addEventListener('urlchanged', ({detail}) => {
                    if(this.current_url === detail){
                        this.current_url = '';
                    }
                });
            }
        }
    }

    /**
     * Display a route-element and any of its matching decendants
     * based on the provided URL.
     * @param {String} url 
     * @example
     * // This will reveal route-elements with attribute
     * // url="/users"
     * // url="/users/account"
     * element.route('/users/account')
     */
    route(url) {
		for(const [route_url, route] of this.routes){
			if(url.includes(route_url)){
                this.setRoute(route_url)
				route.route(url);
			}
		}
	}

    /**
     * Reveal a route-element based on the provided url.
     * Hide the previously revealed route.
     * Add the url to the window history.
     * @param {String} url 
     */
    setRoute(url){
        const route = this.routes.get(url);
        if (!route) {
            return;
        }
		
        // Hide the current route
        if (this.current_url !== '') {
            const current_route = this.routes.get(this.current_url);
            current_route.classList.toggle('hidden', true);
        }

        this.current_url = url;
        route.classList.toggle('hidden', false);
    }
}
customElements.define('route-element', RouteElement);