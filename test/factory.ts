import { Faker } from '@faker-js/faker'
import factory from '../index'

factory.define<User>('user', (faker: Faker) => ({
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  verified: true
}), {
  unverified: {
    verified: false
  },
  alwaysBob: (faker: Faker) => ({
    name: faker.fake('Bob the Boss')
  })
})

factory.define<Company>('company', (faker: Faker) => ({
  id: faker.datatype.uuid(),
  manager: factory('user')
}), {
  hasUnverifiedManager: (faker: Faker) => ({
    manager: {
      verified: faker.random.arrayElement([false])
    }
  })
})

export default factory
