import factory from '../index'

factory.define('user', (faker: Faker.FakerStatic): User => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email()
})).define('company', (faker: Faker.FakerStatic): Company => ({
  id: faker.random.uuid(),
  manager: factory<User>('user')
}))
