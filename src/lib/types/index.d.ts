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
