/* eslint-disable jest/expect-expect */
import factory from './factory'

const keys = <O extends Object> (obj: O): Array<keyof O> => {
  return Object.keys(obj) as Array<keyof O>
}

const assertUser = (user: User, overrides = {}) => {
  ['id', 'email', 'name', 'verified'].forEach(key => expect(Object.prototype.hasOwnProperty.call(user, key)).toBe(true))
  keys(overrides).forEach(key => expect(user[key]).toBe(overrides[key]))
}

describe('basic functionalities', () => {
  it('throws an error if model is not found', () => {
    expect(() => factory('whoops')).toThrow('Model "whoops" not found.')
  })

  it('generates a model with name', () => assertUser(factory<User>('user')))

  it('overrides a model\'s properties', () => {
    assertUser(factory<User>('user', { email: 'foo@bar.net' }), { email: 'foo@bar.net' })
  })

  it('generates several models', () => {
    const users = factory<User>('user', 2)
    expect(users).toHaveLength(2)
    users.forEach(assertUser)
  })

  it('overrides multiple models\' properties', () => {
    const users = factory<User>('user', 3, { email: 'foo@bar.net' })
    expect(users).toHaveLength(3)
    users.forEach(user => assertUser(user, { email: 'foo@bar.net' }))
  })

  it('supports define chaining', () => {
    expect(factory.define('foo', faker => ({}))).toEqual(factory)
  })

  it('supports functions as property overrides', () => {
    assertUser(factory<User>('user', { email: (faker: Faker.FakerStatic) => 'foo@bar.net' }), {
      email: 'foo@bar.net'
    })
  })

  it('supports nested attributes', () => {
    assertUser(factory<Company>('company').manager)
  })

  it('supports nested attributes with overrides', () => {
    const company = factory<Company>('company', {
      manager: {
        name: 'Bob the CEO'
      }
    })
    assertUser(company.manager, { name: 'Bob the CEO' })
  })

  it('supports nested attributes with function overrides', () => {
    const company = factory<Company>('company', {
      manager: {
        name: (faker: Faker.FakerStatic) => faker.fake('Bob the CEO')
      }
    })
    assertUser(company.manager, { name: 'Bob the CEO' })
  })
})

describe('state support', () => {
  it('throws an error if state is not found', () => {
    expect(() => factory.states('whoops')('user')).toThrow('Model "user" has no "whoops" state.')
  })

  it('supports states as array attributes', () => {
    assertUser(factory.states('unverified')<User>('user'), { verified: false })
  })

  it('supports states as function', () => {
    assertUser(factory.states('alwaysBob')<User>('user'), { name: 'Bob the Boss' })
  })

  it('supports states when generate collection', () => {
    factory.states('alwaysBob')<User>('user', 2).forEach(user => assertUser(user, { name: 'Bob the Boss' }))
  })

  it('supports multiple states', () => {
    assertUser(factory.states('unverified', 'alwaysBob')<User>('user'), {
      verified: false,
      name: 'Bob the Boss'
    })
  })

  it('supports multiple states when generate collection', () => {
    factory.states('unverified', 'alwaysBob')<User>('user', 2).forEach(user => assertUser(user, {
      verified: false,
      name: 'Bob the Boss'
    }))
  })

  it('supports states with deep attributes', () => {
    assertUser(factory.states('hasUnverifiedManager')<Company>('company').manager, { verified: false })
  })

  it('supports states with deep attributes when generate collection', () => {
    factory.states('hasUnverifiedManager')<Company>('company', 2).forEach(company => {
      assertUser(company.manager, { verified: false })
    })
  })
})
