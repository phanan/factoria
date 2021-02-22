interface User {
  id: string
  name: string
  email: string
  verified: boolean
}

interface Company {
  id: string
  manager: User
}
