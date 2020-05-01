interface Model extends Object {}

interface ModelDefinition extends Object {
  [model: string]: Function
}

interface Overrides extends Object {
  [attribute: string]: any
}
