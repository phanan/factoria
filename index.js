const faker = require('faker')

const definitions = []

const factory = (model, count = 1, overrides = {}) => {
	if (!(model in definitions)) {
		throw new Error(`Model \`${model}\` not found.`)
	}

	if (typeof (count) === 'object') {
		return factory(model, 1, count)
	}

	if (count === 1) {
		return Object.assign(definitions[model](faker), overrides)
	}

	return [...(function * () {
		let i = 0
		while (i < count) {
			yield Object.assign(definitions[model](faker), overrides)
			++i
		}
	})()]

	function define(model, attributes) { // eslint-disable-line no-unused-vars
		definitions[model] = attributes
		return this
	}
}

export default factory
