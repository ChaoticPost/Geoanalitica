export interface User {
  id: number
  email: string
  fullName: string
  isActive: boolean
}

export interface UserCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
} 