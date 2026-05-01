export const isDictionary = (thingy: any): boolean =>
  Object.prototype.toString.call(thingy) === '[object Object]'

export function assertCount (value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    throw new Error('factoria: count must be a positive integer.')
  }
}
