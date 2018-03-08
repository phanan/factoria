// @flow
const faker: Faker = require('faker')

const definitions: Object = {}

const factory = (model: string, count: number | Object = 1, overrides: Object = {}) => {
  if (!(model in definitions)) {
    throw new Error(`Model \`${model}\` not found.`)
  }

  if (typeof count === 'object') {
    return factory(model, 1, count)
  }

  if (count === 1) {
    return Object.assign(definitions[model](faker), overrides)
  }

  return [...(function * () {
    let i = 0
    // $FlowFixMe
    while (i < count) {
      yield Object.assign(definitions[model](faker), overrides)
      ++i
    }
  })()]
}

factory.define = (model: string, attributes: Faker => Object): factory => {
  definitions[model] = attributes
  return factory
}

export default factory
