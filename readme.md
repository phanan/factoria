# factoria ![Main](https://github.com/phanan/factoria/workflows/Main/badge.svg) ![npm](https://img.shields.io/npm/v/factoria) ![bundle size](https://img.shields.io/bundlephobia/minzip/factoria?label=gzip)

A tiny model factory for Node and TypeScript — **1.07&nbsp;kB gzipped**, zero runtime deps beyond Faker. Heavily inspired by Laravel's [Model Factories](https://laravel.com/docs/master/database-testing#model-factories).

## Install

```bash
# install factoria
$ pnpm add -D factoria
# install Faker as a peer dependency
$ pnpm add -D @faker-js/faker
```

## Usage

### 1. Define a model

To define a model, import the default export and call `.define()` on it. `define` accepts two arguments:

* `name`: (string) Name of the model, e.g. `'user'`
* `(faker)` (function) A closure that returns the model's attribute definition as an object. The closure receives a [Faker](https://fakerjs.dev) instance to generate random testing data.

Example:

```ts
import factory from 'factoria'

factory.define('user', faker => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  age: faker.number.int({ min: 13, max: 99 }),
}))

// TypeScript with generics
factory.define<User>('user', faker => ({
  // A good editor/IDE will suggest properties from the User type
}))
```

### 2. Generate model objects

`factory(name)` returns a builder. Chain `state()`, `count()`, and finally `make()` to materialize the model(s):

```ts
import factory from 'factoria'

// The simplest case, returns a "User" object
const user = factory<User>('user').make()

// Generate a "User" object with "email" preset to "foo@bar.baz"
const userWithPresetEmail = factory<User>('User').make({ email: 'foo@bar.baz' })

// Generate an array of 5 "User" objects
const users = factory<User>('user').count(5).make()

// Same thing, shorter — make() also accepts a count
const moreUsers = factory<User>('user').make(5)

// Generate an array of 5 "User" objects, each with "age" preset to 27
const usersWithPresetAge = factory<User>('user').make({ age: 27 }, 5)

// Use a function as an overriding value. The function will receive a Faker instance.
const userJunior = factory<User>('user').make({
  name: faker => `${faker.person.fullName()} Jr.`
})
```

## Nested factories

factoria fully supports nested factories. For example, if you have a `role` and a `user` model, the setup might look like this:

```ts
import factory from 'factoria'

factory.define('role', faker => ({
  name: faker.helpers.arrayElement(['user', 'manager', 'admin']),
})).define('user', faker => ({
  email: faker.internet.email(),
  role: factory('role'),
}))
```

Calling `factory<User>('user').make()` will produce something like this:

```js
{
  email: 'foo@bar.com',
  role: {
    name: 'admin',
  },
}
```

You can pass a builder as an override too — useful for picking a state for the nested model:

```ts
factory('user').make({
  role: factory('role').state('admin'),
})
```

## States

States allow you to define modifications that can be applied to your model factories. To create states, add an object as the third parameter of `factory.define`, where the key being the state name and its value the state's attributes. For example, you can add an `unverified` state for a User model this way:

```ts
factory.define('user', faker => ({
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
factory.define('user', faker => ({
  email: faker.internet.email(),
  verified: true
}), {
  unverified: faker => ({
    verified: faker.helpers.arrayElement([false]) // for the sake of demonstration
  })
})
```

Apply a state by calling `state()` on the builder:

```ts
const unverifiedUser = factory<User>('user').state('unverified').make()
```

`state()` is variadic and chainable, so multiple states can be applied either way:

```ts
const fourUnverifiedPoorSouls = factory<User>('user')
  .state('job:engineer', 'unverified')
  .make(4)

// equivalent
factory<User>('user').state('job:engineer').state('unverified').make(4)
```

## Type-safe model names

By default, `factory(name)` accepts any string and you pass the model type via an explicit generic (`factory<User>('user')`).
For projects with a fixed set of models, you can opt into name-based inference by augmenting the `Factoria.ModelRegistry`
interface once. After that, names autocomplete and `make()` returns the right type without the generic.

```ts
// somewhere in your test setup, e.g. tests/factory.ts
import factory from 'factoria'

interface User { id: string; email: string; verified: boolean }
interface Company { id: string; name: string; owner: User }

declare module 'factoria' {
  namespace Factoria {
    interface ModelRegistry {
      user: User
      company: Company
    }
  }
}

factory.define('user', faker => ({       // 'user' autocompletes
  id: faker.string.uuid(),
  email: faker.internet.email(),
  verified: true
}))

const user = factory('user').make()         // User
const users = factory('user').make(3)       // User[]
factory('user').make({ verified: false })   // overrides type-checked against User
```

Unregistered names still work via the explicit-generic fallback (`factory<Foo>('foo')`), so this is purely additive —
projects don't need to register every model.

## Breaking changes in v5

### Builder API replaces the immediate-return call

`factory(name, ...)` no longer returns a model directly. It returns a builder; you finish the chain with `.make()`. State is per-builder, so the v4 module-level state leak (`factory.states(...)` bleeding into later calls) is gone.

| v4                                    | v5                                                               |
|---------------------------------------|------------------------------------------------------------------|
| `factory('user')`                     | `factory('user').make()`                                         |
| `factory('user', { name: 'Alice' })`  | `factory('user').make({ name: 'Alice' })`                        |
| `factory('user', 5)`                  | `factory('user').make(5)` _or_ `factory('user').count(5).make()` |
| `factory('user', 5, { age: 27 })`     | `factory('user').make({ age: 27 }, 5)`                           |
| `factory.states('admin')('user')`     | `factory('user').state('admin').make()`                          |
| `factory.states('a', 'b')('user', 4)` | `factory('user').state('a', 'b').make(4)`                        |

`factory.define` is unchanged.

### ESM only

The package is now `"type": "module"` and ships only an ESM build. Consumers must `import factory from 'factoria'`. `require('factoria')` is no longer supported.

## License

MIT © [Phan An](https://phanan.net)
