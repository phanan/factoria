import test from 'ava'
import setup from './setup'
import factory from '..'

setup()

const validate = (t, user, overrides = {}) => {
	['id', 'email', 'name'].forEach(key => {
		t.truthy(Object.prototype.hasOwnProperty.call(user, key))
	})
	Object.keys(overrides).forEach(key => {
		t.true(user[key] === overrides[key])
	})
}

test('it generates a model with name', t => {
	validate(t, factory('user'))
})

test('it overrides a model\'s properties', t => {
	const user = factory('user', {email: 'foo@bar.net'})
	validate(t, user, {email: 'foo@bar.net'})
})

test('it generates several models', t => {
	const users = factory('user', 2)
	t.true(users.length === 2)
	users.forEach(user => validate(t, user))
})

test('it overrides multiple models\' properties', t => {
	const users = factory('user', 3, {email: 'foo@bar.net'})
	t.true(users.length === 3)
	users.forEach(user => validate(t, user, {email: 'foo@bar.net'}))
})

test('it throws an error if the model is not found', t => {
	const error = t.throws(() => factory('booboo'), Error)
	t.is(error.message, 'Model `booboo` not found.')
})
