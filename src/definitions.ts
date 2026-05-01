import { Faker } from '@faker-js/faker'
import { Factoria } from './types'

export interface Definition {
  attributes: (faker: Faker) => Factoria.Attributes
  states: Record<string, Factoria.StateDefinition>
}

export const definitions: Record<string, Definition> = {}
