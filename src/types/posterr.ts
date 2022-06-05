import Profile from './profile'

export interface Post {
  id: string
  createdAt: string
  author?: Profile
  text?: string
  quoted?: Post
  reposted?: Post
}
