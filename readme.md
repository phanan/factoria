# factoria ![Main](https://github.com/phanan/factoria/workflows/Main/badge.svg) ![npm](https://img.shields.io/npm/v/factoria)

Simplistic model factory for Node/JavaScript, heavily inspired by Laravel's [Model Factories](https://laravel.com/docs/5.5/database-testing#writing-factories).

## Install

```bash
# install factoria
$ yarn add factoria -D
# install Faker as a peer dependency
$ yarn add faker -D
```

## Usage

### 1. Define a model

To define a model, import and use `define` from the module. `define` accepts two arguments:

* `name`: (string) Name of the model, e.g. `'user'`
* `(faker)` (function) A closure to return the model's attribute definition as an object. This closure will receive a [Faker](https://github.com/Marak/faker.js/) instance, which allows you to generate various random testing data.

Example:

```ts
const define = require('factoria').define

define('User', faker => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  age: faker.random.number({ min: 13, max: 99 })
}))

// TypeScript with generics
define<User>('User', faker => ({
  // A good editor/IDE should suggest properties from the User type
}))
```

### 2. Generate model objects

To generate model objects, import the factory and call it with the model's defined name. Following the previous example:

```ts
import factory from 'factoria'

// The simplest case, returns a "User" object
const user = factory('User')

// Generate a "User" object with "email" preset to "foo@bar.baz"
const userWithSetEmail = factory('User', { email: 'foo@bar.baz' })

// Generate an array of 5 "User" objects
const users = factory('User', 5)

// Generate an array of 5 "User" objects, each with "age" preset to 27
const usersWithSetAge = factory('User', 5, { age: 27 })

// Use a function as an overriding value. The function will receive a Faker instance.
const user = factory('User', {
  name: faker => {
    return faker.name.findName() + ' Jr.'
  }
})

// TypeScript with generics
const user = factory<User>('User') // `user` is of type User
const users: User[] = factory<User>('User', 3) // `users` is of type User[]
```

## Nested factories

factoria fully supports nested factories. For example, if you have a `Role` and a `User` model, the setup might look like this:

```ts
import factory from 'factoria'

factory.define('Role', faker => {
  name: faker.random.arrayElement(['user', 'manager', 'admin'])
}).define('User', faker => ({
  email: faker.internet.email(),
  role: factory('Role')
}))
```

Calling `factory('User')` will generate an object of the expected shape e.g.,

```js
{
  email: 'foo@bar.com',
  role: {
    name: 'admin'
  }
}
```

## States

States allow you to define modifications that can be applied to your model factories. To create states, add an object as the third parameter of `factory.define`, where the key being the state name and its value the state's attributes. For example, you can add an `unverified` state for a User model this way:

```ts
factory.define('User', faker => ({
  email: faker.internet.email(),
  verified: true
}), {
  unverified: {
    verified: false
  }
})
```

State attributes can also be a function with Faker as the sole argument:

```ts
factory.define('User', faker => ({
  email: faker.internet.email(),
  verified: true
}), {
  unverified: faker => ({
    verified: faker.random.arrayElement([false]) // for the sake of demonstration
  })
})
```

You can then apply the state by calling the method `states()` with the state name, which returns the factoria instance itself:

```ts
const unverifiedUser = factory.states('unverified')('User')
```

You can also apply multiple states:

```ts
const fourUnverifiedPoorSouls = factory.states('job:engineer', 'unverified')('User', 4)
```

## Test setup tips

Often, you want to set up all model definitions before running the tests. One way to do so is to have one entry point for the factories during test setup. For example, you can have this `test` script defined in `package.json`:

```json
{
  "test": "mocha-webpack --require test/setup.js tests/**/*.spec.js"
}
```

Or, if [Jest](https://facebook.github.io/jest/) is your cup of tea:

```json
{
  "jest": {
    "setupFilesAfterEnv": [
      "<rootDir>/test/setup.js"
    ]
  }
}
```

Then in `test/setup.js` you can import `factoria` and add the model definitions there.

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

factoria itself uses this approach for its tests.

## License

MIT © [Phan An](https://phanan.net)
