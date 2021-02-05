/* eslint-disable jest/expect-expect */
import factory from '..'

const keys = <O extends Object>(obj: O): Array<keyof O> => {
  return Object.keys(obj) as Array<keyof O>
}

const assert = (user: User, overrides = {}): void => {
  ['id', 'email', 'name'].forEach(key => expect(Object.prototype.hasOwnProperty.call(user, key)).toBe(true))
  keys(overrides).forEach(key => expect(user[key]).toBe(overrides[key]))
}

describe('factoria', (): void => {
  it('generates a model with name', (): void => assert(factory<User>('user')))

  it("overrides a model's properties", () => {
    assert(factory<User>('user', { email: 'foo@bar.net' }), { email: 'foo@bar.net' })
  })

  it('generates several models', (): void => {
    const users = factory<User>('user', 2)
    expect(users).toHaveLength(2)
    users.forEach(assert)
  })

  it("overrides multiple models' properties", (): void => {
    const users = factory<User>('user', 3, { email: 'foo@bar.net' })
    expect(users).toHaveLength(3)
    users.forEach(user => assert(user, { email: 'foo@bar.net' }))
  })

  it('supports define chaining', (): void => {
    expect(factory.define('foo', faker => ({}))).toEqual(factory)
  })

  it('supports functions as property overrides', (): void => {
    assert(factory<User>('user', { email: () => 'foo@bar.net' }) as User, { email: 'foo@bar.net' })
  })
})
