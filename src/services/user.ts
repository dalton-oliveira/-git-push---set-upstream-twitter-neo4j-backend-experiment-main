import { getDriver } from '../neo4j'
import Profile from '../types/profile'

export const getProfile = async (username: string): Promise<Profile | null> => {
  const session = getDriver().session()
  const result = await session.run(
    `
    MATCH (u:User { username: $username })
    return u
    `,
    { username },
  )
  const [record] = result.records
  if (!record) return null
  const { properties: profile } = record.get('u')
  return profile
}
