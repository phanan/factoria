declare namespace Factoria {
  type RecursivePartial<T> = {
    [P in keyof T]?:
      T[P] extends (infer U)[] ? RecursivePartial<U>[] :
      T[P] extends object ? RecursivePartial<T[P]> :
      T[P]
  }

  type Factoria = (<T>(model: string) => T)
    & (<T>(model: string, overrides?: RecursivePartial<T>) => T)
    & (<T>(model: string, count: number, overrides?: RecursivePartial<T>) => T[])
    & {
      define: (model: string, handler: (faker: Faker.FakerStatic) => void) => Factoria
    }
}

declare const factory: Factoria.Factoria

export default factory
