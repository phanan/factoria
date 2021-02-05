import factory from '..'

factory.define('user', (faker): User => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email()
})).define('company', (faker): Company => ({
  id: faker.random.uuid(),
  manager: factory<User>('user')
}))
