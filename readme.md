# factoria [![Build Status](https://travis-ci.org/phanan/factoria.svg?branch=master)](https://travis-ci.org/phanan/factoria)

Simplistic model factory for Node/JavaScript, heavily inspired by Laravel's [Model Factories](https://laravel.com/docs/5.5/database-testing#writing-factories).


## Install

```bash
# install factoria
$ yarn add factoria -D
# install faker as a peer dependency
$ yarn add faker -D
```

> Note: If Node complains about `regeneratorRuntime` not defined, install and require [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) into your setup.


## Usage

### 1. Define a model

To define a model, import and use `define` from the module. `define` accepts two arguments:

* `name`: (string) Name of the model, e.g. `'user'`
* `(faker)` (function) A closure to return the model's attribute definition as an object. This closure will receive a [Faker](https://github.com/Marak/faker.js/) instance, which allows you to generate various random testing data.

Example:

```js
const define = require('factoria').define

define('User', faker => ({
  id: faker.random.number(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  age: faker.random.number({ min: 13, max: 99 })
}))
```

### 2. Create model objects

To create model objects, import the factory and call it on the model's defined name. Following the previous example:

```js
import factory from 'factoria'

// The simplest case, returns a "User" object
const user = factory('User')

// Generate a "User" object with "email" preset to "foo@bar.baz"
const userWithSetEmail = factory('User', { email: 'foo@bar.baz' })

// Generate an array of 5 "User" objects
const users = factory('User', 5)

// Generate an array of 5 "User" objects, each with "age" preset to 27
const usersWithSetAge = factory('User', 5, { age: 27 })

// Use a function as an overriding value. The function will receive a faker instance.
const user = factory('User', {
  name: faker => {
    return faker.name.findName() + ' Jr.'
  }
})
```

## Test setup tips

Often, you want to set up all model definitions before running the tests. One way to do so is to have one entry point for the factories during test setup. For example, you can have this `test` script defined in `package.json`:

```js
"test": "mocha-webpack --require test/setup.js tests/**/*.spec.js"
```

Or, if [Jest](https://facebook.github.io/jest/) is your cup of tea:

```js
"jest": {
  "setupFilesAfterEnv": ["<rootDir>/test/setup.js"]
}
```

Then in `test/setup.js` you can `require('factoria')` and add the model definitions there. factoria itself uses this approach for its tests.

Another approach is to have a wrapper module around factoria, have all models defined inside the module, and finally `export` factoria itself. You can then `import` the wrapper and use the imported object as a factoria instance (because it _is_ a factoria instance), with all model definitions registered:

```js
// tests/factory.js
import factory from 'factoria'

// define the models
factory.define('User', faker => ({}))
       .define('Group', faker => ({}))

// now export factoria itself
export default factory
```

```js
// tests/user.spec.js
import factory from './factory'

// `factory` is a factoria function instance
const user = factory('User')
```


###

## License

MIT © [Phan An](https://phanan.net)
