interface User {
  id: string
  name: string
  email: string
}

interface Company {
  id: string
  manager: User
}
