import factory from '..'

factory.define('user', (faker: Faker.FakerStatic): Object => ({
  id: faker.random.number(),
  name: faker.name.findName(),
  email: faker.internet.email()
}))
