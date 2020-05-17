import faker from 'faker'

interface ModelDefinition {
  [model: string]: (faker: Faker.FakerStatic) => object
}

interface Overrides extends Object {
  [attribute: string]: any
}

const definitions: ModelDefinition = {}

const factory = <T>(model: string, count: number | Overrides = 1, overrides: Overrides = {}): T | T[] => {
  if (!(model in definitions)) {
    throw new Error(`Model \`${model}\` not found.`)
  }

  if (typeof count !== 'number') {
    return factory(model, 1, count)
  }

  const resolveOverrides = (): Object => {
    const props = Object.assign({}, overrides)

    for (const prop in props) {
      props[prop] = props[prop] instanceof Function ? props[prop].call(this, faker) : props[prop]
    }

    return props
  }

  const generateModel = (): T => {
    return Object.assign(definitions[model](faker), resolveOverrides()) as T
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

factory.define = (model: string, attributes: (faker: Faker.FakerStatic) => object) => {
  definitions[model] = attributes
  return factory
}

export default factory
