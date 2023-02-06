export interface Project {
  id: string
  title: string
  description: string
  created: {
    seconds: number
    nanoseconds: number
  }
  owner: string
  members: string[]
}

export interface User {
  id: string
  uid: string
  name: string
  email: string
  createdAt: string
}
