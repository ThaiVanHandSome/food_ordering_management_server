interface UserRequest {
  avatar: string
  name: string
  email: string
  password: string
  role: string
  isActive: boolean
  cloudinaryUrl: string
}

interface UserQuery {
  page: number
  limit: number
  email: string
}

interface UpdateMe {
  name: string
  avatar: string
  cloudinaryUrl: string
}

interface ChangePassword {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
