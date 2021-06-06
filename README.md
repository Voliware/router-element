# What
Two simple elements, `<router-element>` and `<route-element>` that manage your page's view state and address bar history. You can use these elements to create an SPA or just a simple element with many nested views.

## Example

```html
<router-element nav="#nav1, #nav2">
    <route-element url="/" ></route-element>
    <route-element url="/users/login" display="flex"></route-element>
    <route-element url="/users/register"></route-element>
    <route-element url="/users/account/settings"></route-element>
    <route-element url="/movies"></route-element>
    <route-element url="/games"></route-element>
</router-element>
```

This is an example of a simple SPA. At the top is a `<router-element>` which will manage the routing, address bar, and history. The rest of the elements are `<route-element>`s which organize views by URL. The only function call that may be needed is `route(url)`. This can be called from `<router-element>`.

```js
const router = document.querySelector('router-element');
router.route('/users/account/settings');
```

This will reveal the `/users/account/settings` route and hide all others, which are hidden by default.

## Options
You can set the `display` attribute for `<route-element>` to change what `display` style it uses when it is revealed

```html
<!-- When this route is displayed, it will use the flex style -->
<route-element url="/users/stats" display="flex"></route-element>
```

You can set some attributes for `<router-element>` for some minor behaviour differences

`<router-element back="false">` will prevent intercepting the back navigation action from changing the current route.

`<router-element history="false">` will prevent routing from updating the address bar. 

`<router-element auto="false">` will prevent the router from routing to the window location pathname on page load. To instead do this manually, call `initialize()` whenever your application is ready.

```js
const router = document.querySelector('router-element');
router.initialize(); 
```

## Navs
The `<router-element>` can also connect to one or more simple navigation elements. For example, suppose the following navigational HTML

```html
<div id="navtop">
    <div url="/" class="route-element-nav"></div>
    <div url="/users" class="route-element-nav">
        <div url="/users/account" class="route-element-nav">
            <div url="/users/account/settings" class="route-element-nav"></div>
        </div>
    </div>
    <div url="/movies" class="route-element-nav"></div>
    <div url="/games" class="route-element-nav"></div>
</div>
```

Notice how each nav in question has a `class="route-element-nav`. This is the only attribute required to be a valid navigation element. To connect this nav to a `<route-element>` add a `nav=""` attribute with one or more ids. Multiple ids are supported in the case that there may be two identical menus in the HTML, such as a top and bottom navigation system.

```html
<router-element nav="#navtop, #navbottom"></router-element>
```

When a url is navigated to, `<router-element>` will set the appropriate nav's class to `route-element-nav-active` and remove the same class from all others. The only other step is to define a class in your stylesheet somewhere like

```css
.route-element-nav-active {
    color: white;
}
```

## Events
If you have a nested element inside a `<route-element>` and it does something that should trigger a route change, you can simply dispatch a route event with the detail set to the desired url and bubble set to true. A `<route-element>` will handle it if it has a matching URL.

```js 
const btn = document.getElementById('button');
btn.addEventListener('click', () => {
    this.dispatchEvent(new CustomEvent('route', {detail: '/users/friends', bubbles: true}));
});
```

## Don'ts!
- Don't have more than one of the same route! URLs should be unique, as designed.

## More
`findRoutes()` is an internal function that looks through child elements to find all `<route-element>`s.

1. Adding routes dynamically will trigger the `findRoutes()` function which will recapture all `<route-elements>`
2. Extended elements are also added as `findRoutes()` checks each child to be an `instanceof RouteElement`
3. Changing `url` attributes also triggers a call to `findRoutes()`

# Install or include

`npm install @voliware/router-element`

You can then build it into your own distribution file or serve it via 

`./node_modules/@voliware/router-element/dist/router-element.min.js`

`./node_modules/@voliware/router-element/dist/router-element.min.css`

Or you can use a CDN

`<script src="https://cdn.jsdelivr.net/npm/@voliware/router-element/dist/router-element.min.js"></script>`

`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@voliware/router-element/dist/router-element.min.css"/>`

Or you can simply download the files in the `/dist` folder off the repo.

# Tests
Run `npm run test`.

# Future
Fragmented `<route-element>`s that aren't all organized in the HTML as direct children. This would be useful for HTML that resides in one file and has become very nested.
