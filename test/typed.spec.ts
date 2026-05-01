import { describe, it, expectTypeOf } from 'vitest'
import factory from '../src'

declare module '../src' {
  namespace Factoria {
    interface ModelRegistry {
      user: User
      company: Company
    }
  }
}

factory.define('user', faker => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  verified: true
}))

factory.define('company', faker => ({
  id: faker.string.uuid(),
  manager: factory('user').make()
}))

describe('registry-based type inference', () => {
  it('factory(name) infers the right model type', () => {
    expectTypeOf(factory('user').make()).toEqualTypeOf<User>()
    expectTypeOf(factory('company').make()).toEqualTypeOf<Company>()
  })

  it('count() flips return type to array', () => {
    expectTypeOf(factory('user').count(3).make()).toEqualTypeOf<User[]>()
    expectTypeOf(factory('user').make(3)).toEqualTypeOf<User[]>()
  })

  it('overrides are typed against the registered model', () => {
    factory('user').make({ email: 'a@b.c' })
    factory('user').make({ verified: false }, 2)

    // @ts-expect-error — unknown property must error
    factory('user').make({ wrongField: true })

    // @ts-expect-error — wrong value type must error
    factory('user').make({ verified: 'not a boolean' })
  })

  it('explicit generic still works for unregistered names', () => {
    interface Custom { x: number }
    factory.define<Custom>('custom', () => ({ x: 1 }))
    expectTypeOf(factory<Custom>('custom').make()).toEqualTypeOf<Custom>()
  })
})
