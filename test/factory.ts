import factory from '../index'

factory.define<User>('user', faker => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  verified: true
}), {
  unverified: {
    verified: false
  },
  alwaysBob: faker => ({
    name: faker.fake('Bob the Boss')
  })
})

factory.define<Company>('company', faker => ({
  id: faker.random.uuid(),
  manager: factory('user')
}), {
  hasUnverifiedManager: faker => ({
    manager: {
      verified: faker.random.arrayElement([false])
    }
  })
})

export default factory
