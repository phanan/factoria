import { Faker } from '@faker-js/faker'

export declare namespace Factoria {
  type Attributes = Record<string, any>
  type Overrides<T> = Partial<{ [P in keyof T]: Overrides<T[P]> | null }> | ((faker: Faker) => any)
  type StateDefinition = ((faker: Faker) => Factoria.Attributes) | Attributes

  type Factoria = {
    <T> (name: string, overrides?: Factoria.Overrides<T>): T
    <T> (name: string, count: 1, overrides?: Factoria.Overrides<T>): T
    <T> (name: string, count: number, overrides?: Factoria.Overrides<T>): T[]
    define<T> (
      model: string,
      handler: (faker: Faker) => Overrides<T>,
      states?: Record<string, StateDefinition>
    ): Factoria
    states (...states: string[]): Factoria
  }
}

declare const factory: Factoria.Factoria

export default factory
