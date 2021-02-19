import factory from '../index'

factory.define<User>('user', (faker: Faker.FakerStatic) => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email()
})).define<Company>('company', (faker: Faker.FakerStatic) => ({
  id: faker.random.uuid(),
  manager: factory<User>('user')
}))
