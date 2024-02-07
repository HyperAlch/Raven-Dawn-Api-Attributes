# Raven Dawn Api Attributes
This project allows Wiki editors to safely access RavenDawn Api end-points via [HTML Data Attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) instead of JavaScript. 

## Install and use babel
In order to convert modern JavaScript to MediaWiki compatible `ECMAscript 5`, we will need babel to transpile our code. None-transpiled code will not work in common JavaScript entry points like `MediaWiki:Common.js`. Babel is also setup to strip console debug statements from the code. To install babel run the following:

```
npm install
```
<br>
Then, to build the code for Wiki Deployment run `build_ES5.sh` or execute:

```
npm run build
```

Copy and paste the code in `/build/scripts.js` into `MediaWiki:Common.js` and do a browser cache bypass to see the changes on the website instantly:

- Firefox / Safari: Hold Shift while clicking Reload, or press either Ctrl-F5 or Ctrl-R (⌘-R on a Mac)
- Google Chrome: Press Ctrl-Shift-R (⌘-Shift-R on a Mac)
- Internet Explorer / Edge: Hold Ctrl while clicking Refresh, or press Ctrl-F5
- Opera: Press Ctrl-F5.

## Data Attributes

### `data-api-mode`
#### Description
The mode can change things like api end-points to reduce load on the real API, among other things.

#### Options
##### `data-api-mode="test"`
Change the api end-points used to fake ones, hosted on the immutable IPFS network for security

### `data-item-api-fetch`
#### Description
Loads the listed items data into memory to be used by other elements on the page

#### Options
##### `data-item-api-fetch="00000"`
List a single item id to load into memory

##### `data-item-api-fetch="00000 00000 00000"`
List multiple item ids, seperated by spaces, to be loaded into memory

### More Attributes Coming Soon...