import factory from '..'

factory.define('user', faker => ({
  id: faker.random.number(),
  name: faker.name.findName(),
  email: faker.internet.email()
}))
