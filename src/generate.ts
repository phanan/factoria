import { faker } from '@faker-js/faker'
import { merge } from 'object-deep-merge'
import { Factoria } from './types'
import { definitions } from './definitions'
import { resolveAttributes } from './resolve'

export const generate = <T> (name: string, overrides: Factoria.Overrides<T>, states: string[]): T => {
  let stateAttributes = {}

  states.forEach(state => {
    if (!Object.prototype.hasOwnProperty.call(definitions[name].states, state)) {
      throw new Error(`factoria: Model "${name}" has no "${state}" state.`)
    }

    const stateDescriptor = definitions[name].states[state]

    stateAttributes = merge(
      stateAttributes,
      stateDescriptor instanceof Function ? stateDescriptor.call(this, faker) : stateDescriptor
    )
  })

  return merge(
    resolveAttributes(definitions[name].attributes(faker)),
    resolveAttributes(stateAttributes),
    resolveAttributes<T>(overrides)
  ) as unknown as T
}
