# `eventemitter.ts`

A typesafe event emitter for TypeScript

## Usage

```ts
import { EventEmitter } from 'eventemitter.ts';

const ee = new EventEmitter<{ someString: string; someNumber: number }>();

ee.emit('someString', 'string'); // autocompletes `someString`, and ensures the value is a string
ee.emit('someNumber', 42); // autocompletes `someNumber`, and ensures the value is a number

ee.emit('problem', 'will fail'); // <- this will fail in compile time (no such event name 'problem')
ee.emit('someString', {}); // <- this will fail in compile time (expected string)
ee.emit('someNumber', {}); // <- this will fail in compile time (expected string)

(async () => {
  const someString = await ee.waitFor('someString'); // you can get one with a Promise API. Types are inferred based on the event name

  ee.once('someString', value => {
    // you can run things only once, without a Promise API
    // types are inferred correctly based on the event name
  });

  const unsubscribe = ee.addListener('someString', value => {
    // you can add listeners for events
    // types are inferred correctly based on the event name
  });

  unsubscribe(); // you can easily unsubscribe by using the return value
})();
```

## Local Development

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for you convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

<img src="https://user-images.githubusercontent.com/4060187/52168303-574d3a00-26f6-11e9-9f3b-71dbec9ebfcb.gif" width="600" />

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

<img src="https://user-images.githubusercontent.com/4060187/52168322-a98e5b00-26f6-11e9-8cf6-222d716b75ef.gif" width="600" />

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.
