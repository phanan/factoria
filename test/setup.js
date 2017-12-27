import factory from '..'

export default () => {
	factory.define('user', faker => ({
		id: faker.random.number(),
		name: faker.name.findName(),
		email: faker.internet.email()
	}))
}
