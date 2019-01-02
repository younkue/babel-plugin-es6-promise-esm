# babel-plugin-es6-promise-esm

Babel plugin that rewrites Promise references to [`es6-promise`], but only if
necessary. Support ES Module, Rollup.


Forked from https://github.com/novemberborn/babel-plugin-es6-promise.


## Installation

```console
$ npm install --save-dev babel-plugin-es6-promise-esm
```

Then add `es6-promise` to your Babel config, like:

```json
{
  "plugins": ["es6-promise-esm"]
}
```

**[`es6-promise`] must be installed separately.**

## Behavior

This plugin rewrites files that reference the `Promise` built-in. It inserts the
following code at the top of each file:

```js
import _ESPromise from "es6-promise";

var _Promise = typeof Promise === 'undefined'
  ? _ESPromise.Promise
  : Promise
```

This means [`es6-promise`] is only loaded when there is no `Promise` built-in
available. Each `Promise` reference is rewritten to `_Promise`.

Note that `require()` is used rather than a ES2015 module import. This may make
it difficult to do further import transforms.

Also note that the `_Promise` variable name in this example is determined by
Babel and may differ depending on your code.

[`es6-promise`]: https://github.com/stefanpenner/es6-promise
