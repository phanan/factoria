import { Factoria } from './types'
import { definitions } from './definitions'
import { generate } from './generate'
import { isDictionary, assertCount } from './utils'

export class Builder<T> implements Factoria.Builder<T> {
  private appliedStates: string[] = []
  private requestedCount?: number

  constructor (private readonly name: string) {
    if (!Object.prototype.hasOwnProperty.call(definitions, name)) {
      throw new Error(`factoria: Model "${name}" not found.`)
    }
  }

  state (...names: string[]): this {
    this.appliedStates.push(...names)
    return this
  }

  count (n: 1): Builder<T>
  count (n: number): Factoria.ManyBuilder<T>
  count (n: number): Builder<T> | Factoria.ManyBuilder<T> {
    assertCount(n)
    this.requestedCount = n
    // The runtime is the same instance; the cast re-types `this` as the
    // narrower public view (ManyBuilder) so subsequent .make() resolves to T[].
    return this as unknown as Factoria.ManyBuilder<T>
  }

  make (): T
  make (overrides: Factoria.Overrides<T>): T
  make (count: number): T[]
  make (overrides: Factoria.Overrides<T>, count: number): T[]
  make (overridesOrCount?: Factoria.Overrides<T> | number, count?: number): T | T[] {
    let overrides: Factoria.Overrides<T> = {}
    let n: number = this.requestedCount || 1

    if (typeof overridesOrCount === 'number' && count !== undefined) {
      throw new Error('factoria: make(): count cannot be passed twice.')
    }

    const countPassedToMake = typeof overridesOrCount === 'number' || count !== undefined
    if (this.requestedCount !== undefined && countPassedToMake) {
      console.warn(`factoria: count was already set to ${this.requestedCount} via .count(); the count passed to make() will override it.`)
    }

    if (typeof overridesOrCount === 'number') {
      assertCount(overridesOrCount)
      n = overridesOrCount
    } else if (overridesOrCount !== undefined) {
      if (!isDictionary(overridesOrCount) && typeof overridesOrCount !== 'function') {
        throw new Error('factoria: make(): overrides must be an object or a function.')
      }

      overrides = overridesOrCount
    }

    if (count !== undefined) {
      assertCount(count)
      n = count
    }

    if (n === 1) {
      return generate<T>(this.name, overrides, this.appliedStates)
    }

    return Array.from({ length: n }, () =>
      generate<T>(this.name, overrides, this.appliedStates)
    )
  }
}
