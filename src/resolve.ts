import { faker } from '@faker-js/faker'
import { Factoria } from './types'
import { Builder } from './builder'
import { isDictionary } from './utils'

export const resolveAttributes = <T> (attrs: Factoria.Overrides<T> | Factoria.Attributes): Record<string, any> => {
  if (attrs instanceof Function) {
    attrs = attrs(faker)
  }

  const props: Factoria.Attributes = Object.assign({}, attrs)

  for (const key in props) {
    if (!Object.prototype.hasOwnProperty.call(props, key)) {
      continue
    }

    if (props[key] instanceof Builder) {
      props[key] = props[key].make()
    } else if (props[key] instanceof Function) {
      props[key] = props[key].call(this, faker)
    } else if (isDictionary(props[key])) {
      props[key] = resolveAttributes(props[key])
    }
  }

  return props
}
