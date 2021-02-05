import faker from 'faker'
import deepmerge from 'deepmerge'

type Overrides = Record<string, any>

const definitions: Record<string, (faker: Faker.FakerStatic) => object> = {}

const isDictionary = (thingy: any) => thingy instanceof Object && thingy.constructor === Object

const resolveOverrides = (overrides: Overrides): Object => {
  const props = Object.assign({}, overrides)

  for (const key in props) {
    if (!Object.prototype.hasOwnProperty.call(props, key)) {
      continue
    }

    if (props[key] instanceof Function) {
      props[key] = props[key].call(this, faker)
    } else if (isDictionary(props[key])) {
      props[key] = resolveOverrides(props[key])
    }
  }

  return props
}

const factory = <T> (name: string, count: number | Overrides = 1, overrides: Overrides = {}): T | T[] => {
  if (!(name in definitions)) {
    throw new Error(`Model \`${name}\` not found.`)
  }

  if (typeof count !== 'number') {
    return factory(name, 1, count)
  }

  const generate = (): T => {
    return deepmerge(definitions[name](faker), resolveOverrides(overrides)) as T
  }

  if (count === 1) {
    return generate()
  }

  const models = []

  for (let i = 0; i < count; ++i) {
    models.push(generate())
  }

  return models
}

factory.define = (name: string, attributes: (faker: Faker.FakerStatic) => object) => {
  definitions[name] = attributes
  return factory
}

export default factory
