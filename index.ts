import { Faker, faker } from '@faker-js/faker'
import deepmerge from 'deepmerge'
import { Factoria } from './types'

const definitions: Record<string, {
  attributes: (faker: Faker) => Factoria.Attributes,
  states: Record<string, Factoria.StateDefinition>
}> = {}

const isDictionary = (thingy: any) => Object.prototype.toString.call(thingy) === '[object Object]'

let appliedStates: string[] = []

const resolveOverrides = <T> (overrides: Factoria.Overrides<T>): Record<string, any> => {
  const props: Factoria.Attributes = Object.assign({}, overrides)

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

const generate = <T>(name: string, overrides: Factoria.Overrides<T> = {}, states: string[]): T => {
  // back up the global applied states so that they won't tamper the recursive calls to sub-models (if any)
  const statesBackup = appliedStates
  appliedStates = []

  let stateAttributes = {}

  states.forEach(state => {
    if (!Object.prototype.hasOwnProperty.call(definitions[name].states, state)) {
      throw new Error(`Model "${name}" has no "${state}" state.`)
    }

    const stateDescriptor = definitions[name].states[state]

    stateAttributes = deepmerge(
      stateAttributes,
      stateDescriptor instanceof Function ? stateDescriptor.call(this, faker) : stateDescriptor
    )
  })

  const result = deepmerge.all([
    definitions[name].attributes(faker),
    stateAttributes,
    resolveOverrides<T>(overrides)
  ]) as unknown as T

  appliedStates = statesBackup

  return result
}

// @ts-ignore
const factory: Factoria.Factoria = <T> (
  name: string,
  count: number | Factoria.Overrides<T> = 1,
  overrides: Factoria.Overrides<T> = {}
): T | T[] => {
  if (!Object.prototype.hasOwnProperty.call(definitions, name)) {
    throw new Error(`Model "${name}" not found.`)
  }

  if (typeof count !== 'number') {
    return factory(name, 1, count)
  }

  const generated = count === 1
    ? generate(name, overrides, appliedStates)
    : Array.from(Array(count)).map(() => generate(name, overrides, appliedStates))

  // Reset the currently applied states so that the next factory() call won't be tampered
  appliedStates = []

  return generated
}

factory.states = (...states) => {
  appliedStates = states
  return factory
}

factory.define = <T> (
  name: string,
  attributes: (faker: Faker) => Factoria.Overrides<T>,
  states: Record<string, Factoria.StateDefinition> = {}
) => {
  definitions[name] = { attributes, states }
  return factory
}

export default factory
