interface UserRequest {
  avatar: string
  name: string
  email: string
  password: string
  role: string
  cloudinaryUrl: string
}

interface UserQuery {
  page: number
  limit: number
  email: string
}