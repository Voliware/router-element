# What
Two simple elements, `<router-element>` and `<route-element>` that manage your page's view state and address bar history. You can use one or both of these elements to create an SPA or just a simple element with many nested views.

## Example

```html
<router-element>
    <route-element url="/">
        Home Page
    </route-element>
    <route-element url="/users">
        <route-element url="/users/account">
            <route-element url="/users/account/settings">
                Account Settings
            </route-element>
            <route-element url="/users/account/profile">
                Profile
            </route-element>
        </route-element>
        <route-element url="/users/friends">
            Friends list
        </route-element>
    </route-element>
</router-element>
```
This is an example of a simple SPA. At the top is a `<router-element>` which will manage the address bar and history. The rest of the elements are `<route-element>`s which organize views by URL.

The only function call needed is `route(url)`. This can be called from any `<route-element>`. In this example we would capture the main `<router-element>` like

```js
const router = document.querySelector('router-element');
router.route('/users/account/profile');
```

In this case, the following three elements with matching URLs will be revealed
1. `/users`
2. `/users/account`
3. `/users/account/profile`

Any irrelevant ones are hidden. The `<router-element>` is optional and can be avoided for non-SPA apps or if another system is in place. Note that `<router-element>` is also a `<route-element>` and has the same functionality so it does work as a top level route if desired. However it is not hidden by default.

## Options
You can set the `display` attribute for `<route-element>` to change what `display` style it uses when it is revealed

```html
<!-- When this route is displayed, it will use the flex style -->
<route-element url="/users/stats" display="flex"></route-element>
```

You can set some attributes for `<router-element>` for some minor behaviour differences

`<router-element auto="false">` will prevent setting the route based on the address bar on page load. Note that auto should be set to false if your routes are added dynamically, ie they are not all there on the page's initial load. If you need to wait, you can set auto to false and at any point call `init()` on the `<router-element>`.

```js
const router = document.querySelector('router-element');
// Wait until all <route-element>s have been added
router.init();
```

`<router-element back="false">` will prevent intercepting the back navigation action from changing the current route.

`<router-element history="false">` will prevent routing from updating the address bar. 

## More
`findRoutes()` is an internal function that looks through child elements to find all `<route-element>`s.

1. Adding routes dynamically will trigger the `findRoutes()` function which will recapture all nested `<route-elements>`
2. Extended elements are also added as `findRoutes()` checks each child to be an `instanceof RouteElement`
3. Changing `url` attributes also triggers a call to `findRoutes()`

## Extending Elements
If you wish to extend `RouteElement` or `RouterElement` you should add `style="display:none;"` to the appropriate elements, otherwise they may pop in and then out of view on page load. This is an unfortuante aspect of custom elements in that extended elements will not inherit their styles. In this case, both `<route-element>` and `<router-element>` have a default `display` style of `none` which will not be inherited by extended elements.

```html
<my-custom-route-element style="display:none;"></my-custom-route-element>
```

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
Fragmented `<route-element>`s that aren't all organized in the HTML in a nested fashion. This would be useful for HTML that resides in one final and has become very nested.
