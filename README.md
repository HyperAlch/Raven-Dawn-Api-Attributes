# Raven Dawn Api Attributes
This project allows Wiki editors to safely access RavenDawn Api end-points via [HTML Data Attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) instead of JavaScript.

Because of MediaWiki limitations and security, allowing editors to access the API via JavaScript or the HTML `<img />` tag are both blocked. In order to get around this, users can make sandboxed requests via HTML data attributes.

## Install and use babel
In order to convert modern JavaScript to MediaWiki compatible `ECMAscript 5`, we will need babel to transpile our code. None-transpiled code will not work in common JavaScript entry points like `MediaWiki:Common.js`. Babel is also setup to strip console debug statements from the code. To install babel run the following:

**Install the needed nodejs modules**
```
npm install
```
<br>

**Then, to build the code for Wiki Deployment run `build_ES5.sh` or execute:**
```
npm run build
```

Copy and paste the code in `/build/scripts.js` into `MediaWiki:Common.js` and do a browser cache bypass to see the changes on the website instantly:

- Firefox / Safari: Hold Shift while clicking Reload, or press either Ctrl-F5 or Ctrl-R (⌘-R on a Mac)
- Google Chrome: Press Ctrl-Shift-R (⌘-Shift-R on a Mac)
- Internet Explorer / Edge: Hold Ctrl while clicking Refresh, or press Ctrl-F5
- Opera: Press Ctrl-F5.

## Loading the API into memory
API resources must be loaded into memory before use. This ensures that network requests are only sent once, and the resources returned can be used without fear of spamming api endpoints.

**Example of `data-item-api-fetch` requesting one item**
```html
<div class="pageContent" data-item-api-fetch="29974">
    <!-- Page content and API elements here -->
</div>
```
<br>

**Example of `data-item-api-fetch` requesting multiple items**
```html
<div class="pageContent" data-item-api-fetch="29974 37290 37291 47433">
    <!-- Page content and API elements here -->
</div>
```


## Changing API Endpoints
All developers make mistakes. And sometimes, we do things accidentally such as putting API fetch requests in an endless loop that gets our IP banned. That’s why `data-api-mode=”test”` was created. This switches the live API endpoint, to a fake one hosted on the IPFS network. When working on contributions to this project, please add `data-api-mode` to the element that holds the `data-item-api-fetch` attribute.

**An example of `data-api-mode` being used to enable test mode**
```html
<div class="pageContent" data-item-api-fetch="29974 37290 37291 47433" data-api-mode="test">
    <!-- Page content and API elements here -->
</div>
```

## Working with the items API endpoint
Using data attributes, you can dynamically insert the `name`, `description`, and `image` of an item using its ID number. You can find item IDs using my [Item API Lookup Tool](https://ravendawn-api-lookup.netlify.app/api/items).

### Query an item name
**Some examples of `data-item-api-name` being used to dynamically insert an items name**
```html
<div class="pageContent" data-item-api-fetch="29974">
    <h1 data-item-api-name="29974">Item name will replace this text</h1>
    <p data-item-api-name="29974">Item name will replace this text</p>
    <span data-item-api-name="29974" style="color: red;">Item name will replace this text</span>

    <div style="font-size: 20px;">
        <h2>Other content</h2>
        <span data-item-api-name="29974" style="color: red;">Item name will replace this text</span>
    </div>
</div>
```

### Query an item description
**Some examples of `data-item-api-description` being used to dynamically insert an items description**
```html
<div class="pageContent" data-item-api-fetch="29974">
    <h1 data-item-api-description="29974">The items description will replace this text</h1>
    <p data-item-api-description="29974">The items description will replace this text</p>
    <span data-item-api-description="29974" style="color: red;">The items description will replace this text</span>

    <div style="font-size: 20px;">
        <h2>Other content</h2>
        <span data-item-api-description="29974" style="color: red;">The items description will replace this text</span>
    </div>
</div>
```

### Insert an item image
There are two ways of dynamically inserting item images with `data-item-api-image`. First, you can insert an image in-place using span. This completely replaces the span element you attach the attribute to with an html img element. The second way is to put `data-item-api-image` on a div instead. This inserts an img element inside the div instead of completely replacing it, allowing you to wrap it with custom styling.

**An example of `data-item-api-image` being used to dynamically insert an image in-place**
```html
<div class="pageContent" data-item-api-fetch="29974">
    <!-- Span will be completely replaced by an Img tag -->
    <span data-item-api-image="29974"></span>
</div>
```
<br>

**An example of `data-item-api-image` being used to dynamically insert an image inside a div**
```html
<div class="pageContent" data-item-api-fetch="29974">
    <!-- The red border will persist because div isn't being replaced -->
    <div style="border: 5px solid red;" data-item-api-image="29974"></div>
</div>
```

Very often, the default size of images are not ideal. However, you cannot simply add the core HTML attributes `width` and `height` to your span or div. This is because HTML does not support those attributes on those elements. So what are we to do? Luckily we have the `data-width` and `data-height` attributes. Anything you put inside these attributes will automatically be applied to the image you want to dynamically load.

**Some examples of `data-width` and `data-height` being used to resize API images**
```html
<div class="pageContent" data-item-api-fetch="29974">
    <!-- Both Pixel (px) and Percent(%) units can be used -->
    <span data-item-api-image="29974" data-width="50px" data-height="50px"></span>
    <div data-item-api-image="29974" data-width="8%" data-height="8%"></div>
</div>
```

## Working with the skills API endpoint
***Coming soon!***