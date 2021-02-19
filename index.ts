import faker from 'faker'
import deepmerge from 'deepmerge'

type Attributes = Record<string, any>

const definitions: Record<string, (faker: Faker.FakerStatic) => Attributes> = {}
const isDictionary = (thingy: any) => Object.prototype.toString.call(thingy) === '[object Object]'

const resolveOverrides = (overrides: Attributes): Object => {
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

const factory = <T> (name: string, count: number | Attributes = 1, overrides: Attributes = {}): T | T[] => {
  if (!Object.prototype.hasOwnProperty.call(definitions, name)) {
    throw new Error(`Model \`${name}\` not found.`)
  }

  if (typeof count !== 'number') {
    return factory(name, 1, count)
  }

  const generate = (): T => deepmerge(definitions[name](faker), resolveOverrides(overrides)) as T

  return count === 1 ? generate() : Array.from(Array(count)).map(() => generate())
}

factory.define = (name: string, attributes: (faker: Faker.FakerStatic) => Attributes) => {
  definitions[name] = attributes
  return factory
}

export default factory
