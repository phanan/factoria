import { Faker, faker } from '@faker-js/faker'
import { Factoria } from './types'
import { Builder } from './builder'
import { definitions } from './definitions'

export type { Factoria } from './types'

const factory: Factoria.Factoria = <T> (name: string) => new Builder<T>(name)

factory.define = <T> (
  name: string,
  attributes: (faker: Faker) => Factoria.Overrides<T>,
  states: Record<string, Factoria.StateDefinition> = {}
) => {
  definitions[name] = { attributes, states }
  return factory
}

factory.seed = (value?: number | number[]) => {
  faker.seed(value)
  return factory
}

export default factory
