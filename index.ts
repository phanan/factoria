import faker from 'faker'
import deepmerge from 'deepmerge'
import { Factoria } from './types'

const definitions: Record<string, (faker: Faker.FakerStatic) => Factoria.Attributes> = {}
const isDictionary = (thingy: any) => Object.prototype.toString.call(thingy) === '[object Object]'

const resolveOverrides = <T> (overrides: Factoria.Overrides<T>): Object => {
  const props = Object.assign({}, overrides) as Factoria.Attributes

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

// @ts-ignore
const factory: Factoria.Factoria = <T> (
  name: string,
  count: number | Factoria.Overrides<T> = 1,
  overrides: Factoria.Overrides<T> = {}
): T | T[] => {
  if (!Object.prototype.hasOwnProperty.call(definitions, name)) {
    throw new Error(`Model \`${name}\` not found.`)
  }

  if (typeof count !== 'number') {
    return factory(name, 1, count)
  }

  const generate = (): T => deepmerge(definitions[name](faker), resolveOverrides<T>(overrides)) as T

  return count === 1 ? generate() : Array.from(Array(count)).map(() => generate())
}

factory.define = <T> (name: string, attributes: (faker: Faker.FakerStatic) => Factoria.Overrides<T>) => {
  definitions[name] = attributes
  return factory
}

export default factory
