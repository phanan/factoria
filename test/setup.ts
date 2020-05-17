import factory from '..'

factory.define('user', (faker: Faker.FakerStatic): User => ({
  id: faker.random.number(),
  name: faker.name.findName(),
  email: faker.internet.email()
}))
