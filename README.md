# What
Two simple elements, `<router-element>` and `<route-element>` that manage your page's view state and address bar history. You can use one or both of these elements to create an SPA or just a simple element with many nested views.

# Example

```html
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
```
This is an example of a simple SPA. At the top is a `<router-element>` which will manage the address bar and history. The rest of the elements are `<route-element>`s which organize views by URL. `<route-element>`s are hidden by a class called `hidden`. If we navigate in some way to `/users/account/profile`, the following three elements with matching URLs will be revealed
1. `/users`
2. `/users/account`
3. `/users/account/profile`

Any irrelevant ones are hidden. 

The `<router-element>` is optional and can be avoided for non-SPA apps or if another system is in place. Note that `<router-element>` is also a `<route-element>` and has the same functionality so it does work as a top level route if desired. However it is not hidden by default.

# Options
If you don't want `<router-element>` to save navigation history, you can set the `history` attribute to "false". If you don't want `<router-element>` to change the view as the address bar changes, you can set the `auto` attribute to "false".

```html
<router-element auto="false" history="false">
  <!-- insert routes here -->
</router-element>
```

# Install or include

`npm install @voliware/router-element`

You can then build it into your own distribution file or serve it via 

`./node_modules/@voliware/router-element/dist/router-element.min.js`

`./node_modules/@voliware/router-element/dist/router-element.min.css`

Or you can use a CDN

`<script src="https://cdn.jsdelivr.net/npm/@voliware/router-element/dist/router-element.min.js"></script>`

Or you can simply download the files in the `/dist` folder off the repo.

# Tests
Simply open the `test.html` file.

# Future
Fragmented `<route-element>`s that aren't all organized in the HTML in a nested fashion. This would be useful for HTML that resides in one final and has become very nested.
