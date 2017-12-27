# factoria [![Build Status](https://travis-ci.org/phanan/factoria.svg?branch=master)](https://travis-ci.org/phanan/factoria)

Simplistic model factory for JavaScript, heavily inspired by Laravel's [Model Factories](https://laravel.com/docs/5.5/database-testing#writing-factories).


## Install

```bash
$ yarn add factoria --dev
```


## Usage

### 1. Define a model

To define a model, import and use `define` from the module. `define` accepts two arguments:

* `name`: (string) Name of the model, e.g. `'user'`
* `(faker)` (function) A closure to return the model's attribute definition as an object. This closure will receive an instance of the [Faker](https://github.com/Marak/faker.js/) JavaScript library, which allows you to generate various random testing data.

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

// The simplest case, returns a "user" object
const user = factory('User')

// Generate a "user" object with "email" preset to "foo@bar.baz"
const userWithSetEmail = factory('User', { email: 'foo@bar.baz' })

// Generate an array of 5 "user" objects
const users = factory('User', 5)

// Generate an array of 5 "user" objects, each with "age" preset to 27
const usersWithSetAge = factory('User', 5, { age: 27 })
```


## Test setup tips

Often, you want to set up all model definitions before running the tests. One way to do so is to have one entry point for the factories during test setup. For example, you can have this `test` script defined in `package.json`:

```js
"test": "mocha-webpack --require tests/setup.js tests/**/*.spec.js"
```

Then in `tests/setup.js` you can `require('factoria')` and add the model definitions there.

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
