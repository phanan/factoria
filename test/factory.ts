import factory from '../src'

factory.define('user', faker => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  verified: true
}), {
  unverified: {
    verified: false
  },
  alwaysBob: faker => ({
    name: faker.helpers.fake('Bob the Boss')
  })
})

factory.define('company', faker => ({
  id: faker.string.uuid(),
  manager: factory('user')
}), {
  hasUnverifiedManager: faker => ({
    manager: {
      verified: faker.helpers.arrayElement([false])
    }
  })
})

export default factory
