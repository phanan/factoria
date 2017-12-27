# factoria [![Build Status](https://travis-ci.org/phanan/factoria.svg?branch=master)](https://travis-ci.org/phanan/factoria)

Simplistic model factory for JavaScript, heavily inspired by Laravel's [Model Factories](https://laravel.com/docs/5.5/database-testing#writing-factories).


## Install

```
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

define('user', faker => ({
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
const user = factory('user')

// Generate a "user" object with "email" preset to "foo@bar.baz"
const userWithSetEmail = factory('user', { email: 'foo@bar.baz' })

// Generate an array of 5 "user" objects
const users = factory('user', 5)

// Generate an array of 5 "user" objects, each with "age" preset to 27
const usersWithSetAge = factory('user', 5, { age: 27 })
```

## License

MIT © [An Phan](https://phanan.net)
