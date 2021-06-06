/**
 * A routeable element. Has a URL attribute that specifies its absolute route.
 * A single, top level <router-element> should contain all <route-element>s.
 * 
 * @example
 * <router-element nav="#nav1, #nav2">
 *     <route-element url="/"></route-element>
 *     <route-element url="/users/login"></route-element>
 *     <route-element url="/users/register"></route-element>
 *     <route-element url="/users/account/settings"></route-element>
 *     <route-element url="/movies"></route-element>
 *     <route-element url="/games"></route-element>
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
         * Whether the route has been initailized.
         * Initialization is an optional implementation.
         * @type {Boolean}
         */
        this.is_initialized = false;

        // Add a mutation observer to watch for url and nav attribute changes.
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                switch(mutation.type){
                    case 'attributes':
                        // Emit an event on url change
                        if(mutation.attributeName === 'url'){
                            const event = new CustomEvent('urlchanged', {
                                detail: mutation.oldValue,
                                bubbles: true
                            });
                            this.dispatchEvent(event);
                        }
                        // Emit an event on nav change
                        else if(mutation.attributeName === 'nav'){
                            this.findNavs();
                        }
                    break;
                }
            });
        });
        observer.observe(this, {
            attributes: true, 
            attributeOldValue: true, 
            attributeFilter: ['url', 'nav']
        });
    }
    
    /**
     * Initialize the element 
     */
    init(){
        if(this.is_initialized){
            return;
        }
        this.is_initialized = true;
        this.initialize();
    }    

    /**
     * Initialize callback. Optional.
     */
    initialize(){

    }

    /**
     * Toggle the display to hidden or not hidden.
     */
    toggle(state){
        const display = this.getAttribute('display') || 'block';
        this.style.display = state ? display : 'none';
    }
}
customElements.define('route-element', RouteElement);