/// <reference path=".d.ts"/>
import faker from 'faker'

const definitions: ModelDefinition = {}

const factory = (model: string, count: number | Overrides = 1, overrides: Overrides = {}): Model | Model[] => {
  if (!(model in definitions)) {
    throw new Error(`Model \`${model}\` not found.`)
  }

  if (typeof count !== 'number') {
    return factory(model, 1, count)
  }

  const resolveOverrides = (): Object => {
    const props = Object.assign({}, overrides)

    for (let prop in props) {
      props[prop] = props[prop] instanceof Function ? props[prop].call(this, faker) : props[prop]
    }

    return props
  }

  const generateModel = (): Model => {
    return Object.assign(definitions[model](faker), resolveOverrides())
  }

  if (count === 1) {
    return generateModel()
  }

  return [...(function * () {
    let i = 0

    while (i < count) {
      yield generateModel()
      ++i
    }
  })()]
}

factory.define = (model: string, attributes: (faker: Faker.FakerStatic) => Object) => {
  definitions[model] = attributes
  return factory
}

export default factory
