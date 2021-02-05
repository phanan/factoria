/* eslint-disable jest/expect-expect */
import factory from '../'

const keys = <O extends Object>(obj: O): Array<keyof O> => {
  return Object.keys(obj) as Array<keyof O>
}

const assertUser = (user: User, overrides = {}) => {
  ['id', 'email', 'name'].forEach(key => expect(Object.prototype.hasOwnProperty.call(user, key)).toBe(true))
  keys(overrides).forEach(key => expect(user[key]).toBe(overrides[key]))
}

describe('factoria', () => {
  it('generates a model with name', () => assertUser(factory<User>('user')))

  it("overrides a model's properties", () => {
    assertUser(factory<User>('user', { email: 'foo@bar.net' }), { email: 'foo@bar.net' })
  })

  it('generates several models', () => {
    const users = factory<User>('user', 2)
    expect(users).toHaveLength(2)
    users.forEach(assertUser)
  })

  it("overrides multiple models' properties", () => {
    const users = factory<User>('user', 3, { email: 'foo@bar.net' })
    expect(users).toHaveLength(3)
    users.forEach(user => assertUser(user, { email: 'foo@bar.net' }))
  })

  it('supports define chaining', () => {
    expect(factory.define('foo', faker => ({}))).toEqual(factory)
  })

  it('supports functions as property overrides', () => {
    assertUser(factory<User>('user', { email: faker => 'foo@bar.net' }) as User, { email: 'foo@bar.net' })
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
        name: faker => faker.fake('Bob the CEO')
      }
    })
    assertUser(company.manager, { name: 'Bob the CEO' })
  })
})
