import { one } from '../neo4j'
import Profile from '../types/profile'

export const getProfile = async (username: string): Promise<Profile | null> => {
  const record = await one('MATCH (u:User { username: $username }) return u', { username })
  return record ? record.get('u').properties : null
}

export const follow = async (fromUser: string, toUser: string) => {
  return one(
    `
    MATCH (from:User { username: $fromUser }), (to:User { username: $toUser })
    MERGE (from)-[:FOLLOWS]->(to)
    ON CREATE 
      SET from.followingCount = from.followingCount + 1, to.followersCount = to.followersCount + 1
  `,
    { fromUser, toUser },
  )
}

export const unfollow = async (fromUser: string, toUser: string) => {
  return one(
    `
      MATCH (from:User { username: $fromUser })-[f:FOLLOWS]->(to:User { username: $toUser })
      WITH f, from, to
        DELETE f
        SET from.followingCount = from.followingCount - 1, to.followersCount = to.followersCount - 1
      `,
    { fromUser, toUser },
  )
}
