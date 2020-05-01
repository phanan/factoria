import factory from '..'

const keys = <O extends Object>(obj: O): Array<keyof O> => {
  return Object.keys(obj) as Array<keyof O>
}

const validate = (user: Model, overrides = {}): void => {
  ['id', 'email', 'name'].forEach(key => expect(Object.prototype.hasOwnProperty.call(user, key)).toBe(true))
  keys(overrides).forEach(key => expect(user[key]).toBe(overrides[key]))
}

describe('factoria', (): void => {
  it('generates a model with name', (): void => validate(factory('user')))

  it("overrides a model's properties", () => {
    validate(factory('user', { email: 'foo@bar.net' }), { email: 'foo@bar.net' })
  })

  it('generates several models', (): void => {
    const users = factory('user', 2) as Model[]
    expect(users).toHaveLength(2)
    users.forEach(validate)
  })

  it("overrides multiple models' properties", (): void => {
    const users = factory('user', 3, { email: 'foo@bar.net' }) as Model[]
    expect(users).toHaveLength(3)
    users.forEach(user => validate(user, { email: 'foo@bar.net' }))
  })

  it('supports define chaining', (): void => {
    expect(factory.define('foo', faker => ({}))).toEqual(factory)
  })

  it('supports functions as property overrides', (): void => {
    validate(factory('user', { email: () => 'foo@bar.net' }), { email: 'foo@bar.net' })
  })
})
