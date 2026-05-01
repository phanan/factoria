import { describe, it, expect, vi } from 'vitest'
import factory from './factory'
import { Faker } from '@faker-js/faker'

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

  it('generates a model with name', () => assertUser(factory('user').make()))

  it('overrides a model\'s properties', () => {
    assertUser(factory('user').make({ email: 'foo@bar.net' }), { email: 'foo@bar.net' })
  })

  it('generates several models via count()', () => {
    const users = factory('user').count(2).make()
    expect(users).toHaveLength(2)
    users.forEach(assertUser)
  })

  it('generates several models via make(count)', () => {
    const users = factory('user').make(2)
    expect(users).toHaveLength(2)
    users.forEach(assertUser)
  })

  it('overrides multiple models\' properties via count()', () => {
    const users = factory('user').count(3).make({ email: 'foo@bar.net' })
    expect(users).toHaveLength(3)
    users.forEach(user => assertUser(user, { email: 'foo@bar.net' }))
  })

  it('overrides multiple models\' properties via make(overrides, count)', () => {
    const users = factory('user').make({ email: 'foo@bar.net' }, 3)
    expect(users).toHaveLength(3)
    users.forEach(user => assertUser(user, { email: 'foo@bar.net' }))
  })

  it('warns when count is passed to make() after .count() was called', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      // @ts-expect-error — types already block this; warning is a runtime safety net for JS / casts
      const users = factory('user').count(2).make(3)
      expect(users).toHaveLength(3)
      expect(warn).toHaveBeenCalledOnce()
      expect(warn.mock.calls[0][0]).toMatch(/count was already set to 2/)
    } finally {
      warn.mockRestore()
    }
  })

  it('does not warn when only .count() is used', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      factory('user').count(2).make()
      factory('user').count(2).make({ email: 'foo@bar.net' })
      expect(warn).not.toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
  })

  it('does not warn when only make(count) is used', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      factory('user').make(2)
      factory('user').make({ email: 'foo@bar.net' }, 2)
      expect(warn).not.toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
  })

  it('throws if count is passed both as first and second argument', () => {
    // @ts-expect-error — runtime guard for misuse
    expect(() => factory('user').make(2, 3)).toThrow('count cannot be passed twice')
  })

  it('throws if overrides is not an object or function', () => {
    // @ts-expect-error — runtime guard for misuse
    expect(() => factory('user').make('nope')).toThrow('overrides must be an object or a function')
  })

  it('throws if count is not a positive integer', () => {
    // @ts-expect-error — runtime guard for misuse
    expect(() => factory('user').make({}, 'nope')).toThrow('count must be a positive integer.')
    expect(() => factory('user').make(0)).toThrow('count must be a positive integer.')
    expect(() => factory('user').make(-1)).toThrow('count must be a positive integer.')
    expect(() => factory('user').make(1.5)).toThrow('count must be a positive integer.')
    expect(() => factory('user').make(NaN)).toThrow('count must be a positive integer.')
    expect(() => factory('user').count(0)).toThrow('count must be a positive integer.')
    expect(() => factory('user').count(-2)).toThrow('count must be a positive integer.')
  })

  it('factory.seed makes output deterministic', () => {
    factory.seed(42)
    const a = factory('user').make()
    factory.seed(42)
    const b = factory('user').make()
    expect(a).toEqual(b)
    factory.seed() // reset to non-deterministic for other tests
  })

  it('factory.seed returns factory for chaining', () => {
    expect(factory.seed(1)).toBe(factory)
    factory.seed()
  })

  it('supports define chaining', () => {
    expect(factory.define('foo', faker => ({}))).toEqual(factory)
  })

  it('supports functions as property overrides', () => {
    assertUser(factory('user').make({ email: (faker: Faker) => 'foo@bar.net' }), {
      email: 'foo@bar.net'
    })
  })

  it('supports nested attributes', () => {
    assertUser(factory('company').make().manager)
  })

  it('supports nested attributes with overrides', () => {
    const company = factory('company').make({
      manager: {
        name: 'Bob the CEO'
      }
    })
    assertUser(company.manager, { name: 'Bob the CEO' })
  })

  it('supports nested attributes with function overrides', () => {
    const company = factory('company').make({
      manager: {
        name: (faker: Faker) => faker.helpers.fake('Bob the CEO')
      }
    })
    assertUser(company.manager, { name: 'Bob the CEO' })
  })

  it('materializes Builder values in attribute trees', () => {
    // The 'company' definition uses `manager: factory('user')` (a Builder, not a materialized user).
    // factoria should call .make() on it during generation.
    const company = factory('company').make()
    assertUser(company.manager)
    expect(typeof company.manager.id).toBe('string')
  })

  it('produces fresh nested instances per top-level make', () => {
    const [a, b] = factory('company').make(2)
    expect(a.manager.id).not.toBe(b.manager.id)
  })

  it('accepts Builder as override value', () => {
    const company = factory('company').make({
      manager: factory('user').state('unverified')
    })
    assertUser(company.manager, { verified: false })
  })
})

describe('state support', () => {
  it('throws an error if state is not found', () => {
    expect(() => factory('user').state('whoops').make()).toThrow('Model "user" has no "whoops" state.')
  })

  it('supports states as object attributes', () => {
    assertUser(factory('user').state('unverified').make(), { verified: false })
  })

  it('supports states as function', () => {
    assertUser(factory('user').state('alwaysBob').make(), { name: 'Bob the Boss' })
  })

  it('supports states when generating a collection', () => {
    factory('user').state('alwaysBob').count(2).make()
      .forEach(user => assertUser(user, { name: 'Bob the Boss' }))
  })

  it('supports multiple states via variadic state()', () => {
    assertUser(factory('user').state('unverified', 'alwaysBob').make(), {
      verified: false,
      name: 'Bob the Boss'
    })
  })

  it('supports multiple states via chained state()', () => {
    assertUser(factory('user').state('unverified').state('alwaysBob').make(), {
      verified: false,
      name: 'Bob the Boss'
    })
  })

  it('supports multiple states when generating a collection', () => {
    factory('user').state('unverified', 'alwaysBob').make(2).forEach(user => assertUser(user, {
      verified: false,
      name: 'Bob the Boss'
    }))
  })

  it('supports states with deep attributes', () => {
    assertUser(factory('company').state('hasUnverifiedManager').make().manager, { verified: false })
  })

  it('supports states with deep attributes when generating a collection', () => {
    factory('company').state('hasUnverifiedManager').make(2).forEach(company => {
      assertUser(company.manager, { verified: false })
    })
  })

  it('does not leak state across builder instances', () => {
    factory('user').state('unverified')
    assertUser(factory('user').make(), { verified: true })
  })
})
