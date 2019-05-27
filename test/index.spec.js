import '@babel/polyfill'
import factory from '..'

const validate = (user, overrides = {}) => {
  ['id', 'email', 'name'].forEach(key => expect(Object.prototype.hasOwnProperty.call(user, key)).toBe(true))
  Object.keys(overrides).forEach(key => expect(user[key]).toBe(overrides[key]))
}

describe('floria', () => {
  it('generates a model with name', () => validate(factory('user')))

  it("overrides a model's properties", () => {
    validate(factory('user', { email: 'foo@bar.net' }), { email: 'foo@bar.net' })
  })

  it('generates several models', () => {
    const users = factory('user', 2)
    expect(users).toHaveLength(2)
    users.forEach(validate)
  })

  it("overrides multiple models' properties", () => {
    const users = factory('user', 3, { email: 'foo@bar.net' })
    expect(users).toHaveLength(3)
    users.forEach(user => validate(user, { email: 'foo@bar.net' }))
  })

  it('supports define chaining', () => {
    expect(factory.define('foo', () => {})).toEqual(factory)
  })

  it('support functions as property overrides', () => {
    validate(factory('user', { email: () => 'foo@bar.net' }), { email: 'foo@bar.net' })
  })
})
