import faker from 'faker'
import deepmerge from 'deepmerge'
import { Factoria } from './types'

const definitions: Record<string, (faker: Faker.FakerStatic) => Factoria.Attributes> = {}
const isDictionary = (thingy: any) => Object.prototype.toString.call(thingy) === '[object Object]'

const resolveOverrides = (overrides: Factoria.RecursivePartial<any>): Object => {
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

function factory<T> (name: string): T
function factory<T> (name: string, count: 1): T
function factory<T> (name: string, count: number): T[]
function factory<T> (name: string, overrides: Factoria.RecursivePartial<T>): T
function factory<T> (name: string, count: 1, overrides: Factoria.RecursivePartial<T>): T
function factory<T> (name: string, count: number, overrides: Factoria.RecursivePartial<T>): T[]

function factory<T> (
  name: string,
  count: number | Factoria.RecursivePartial<T> = 1,
  overrides: Factoria.RecursivePartial<T> = {}
): T | T[] {
  if (!Object.prototype.hasOwnProperty.call(definitions, name)) {
    throw new Error(`Model \`${name}\` not found.`)
  }

  if (typeof count !== 'number') {
    return factory(name, 1, count)
  }

  const generate = (): T => deepmerge(definitions[name](faker), resolveOverrides(overrides)) as T

  return count === 1 ? generate() : Array.from(Array(count)).map(() => generate())
}

factory.define = (name: string, attributes: (faker: Faker.FakerStatic) => Factoria.Attributes) => {
  definitions[name] = attributes
  return factory
}

export default factory
