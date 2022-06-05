import { one } from '../neo4j'
import Profile from '../types/profile'

export const getProfile = async (username: string): Promise<Profile | null> => {
  const record = await one(
    `
    MATCH (u:User { username: $username })
    return u
  `,
    { username },
  )
  return record ? record.get('u').properties : null
}
