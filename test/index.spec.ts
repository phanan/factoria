/* eslint-disable jest/expect-expect */
import factory from '..'

const keys = <O extends Object>(obj: O): Array<keyof O> => {
  return Object.keys(obj) as Array<keyof O>
}

const validate = (user: User, overrides = {}): void => {
  ['id', 'email', 'name'].forEach(key => expect(Object.prototype.hasOwnProperty.call(user, key)).toBe(true))
  keys(overrides).forEach(key => expect(user[key]).toBe(overrides[key]))
}

describe('factoria', (): void => {
  it('generates a model with name', (): void => validate(factory<User>('user') as User))

  it("overrides a model's properties", () => {
    validate(factory<User>('user', { email: 'foo@bar.net' }) as User, { email: 'foo@bar.net' })
  })

  it('generates several models', (): void => {
    const users = factory<User>('user', 2) as User[]
    expect(users).toHaveLength(2)
    users.forEach(validate)
  })

  it("overrides multiple models' properties", (): void => {
    const users = factory<User>('user', 3, { email: 'foo@bar.net' }) as User[]
    expect(users).toHaveLength(3)
    users.forEach(user => validate(user, { email: 'foo@bar.net' }))
  })

  it('supports define chaining', (): void => {
    expect(factory.define('foo', faker => ({}))).toEqual(factory)
  })

  it('supports functions as property overrides', (): void => {
    validate(factory<User>('user', { email: () => 'foo@bar.net' }) as User, { email: 'foo@bar.net' })
  })
})
