# cuadrante-codemods

[![Known Vulnerabilities](https://snyk.io/test/github/vasco3/cuadrante-codemods/badge.svg)](https://snyk.io/test/github/vasco3/cuadrante-codemods)

Code modifiers using jscodeshift

> Thanks to Node v6 now we don't need babel to run ES2015 in our servers.
> In that case, if you don't trading off the nice ES2015 modules for good old
> commonJS, you can run this script to liberate your server from a build process.

## Requirements

- Node v6+
- npm install -g jscodeshift

## Usage

- `cd` into your project directory
- `npm install cuadrante-codemods`
- `jscodeshift -t <codemod-script> <path>`

## Example

Using `find` to loop through al the javascript files

- `find . -name '*.js' -print | xargs jscodeshift -t node_modules/cuadrante-codemods/lib/es2015modules-to-commonjs.js`

Will do the following

```diff
-import fs from 'fs'
+const fs = require('fs');

-import {getWhatever, findWhatever} from 'library'
+const {getWhatever, findWhatever} = require('library');

-import settings from './settings';
+const settings = require('./settings');

-import homeRoute from './routes/home';
+const homeRoute = require('./routes/home');

-import App from './routes/App';
+const App = require('./routes/App');

-import stockOptionsGameRoute from './routes/stock-options-game';
+const stockOptionsGameRoute = require('./routes/stock-options-game');

-export function wawa() { return 0;  }
+exports.wawa = function wawa() {
+  return 0;
+};

-export default (req, res) => { return true }
+module.exports = (req, res) => {
+  return true
+};

-export const MARKER_REMOVED_OUT = 'MARKER_REMOVED_OUT';
+exports.MARKER_REMOVED_OUT = 'MARKER_REMOVED_OUT';
```


## Explore

www.astexplorer.net
parser: Recast
transformer: jscodeshift

### AST Types

Look for the builder method

https://github.com/benjamn/ast-types
