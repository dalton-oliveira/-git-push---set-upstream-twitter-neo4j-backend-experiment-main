import { Post } from '../types/posterr'

export const list = async (username: string, skip: number): Promise<Array<Post>> => {
  console.log(username, skip)
  return []
}
