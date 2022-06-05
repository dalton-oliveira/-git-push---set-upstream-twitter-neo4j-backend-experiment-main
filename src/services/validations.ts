import { one } from '../neo4j'

export const day = 1_000 * 60 * 60 * 24
export const MAX_POST_PER_DAY = 5

export const userExists = async (username: string): Promise<Boolean> => {
  return one('MATCH (u:User { username: $username }) RETURN u', { username }).then((record) => !!record)
}

export const validPostLimit = async (username: string): Promise<boolean> => {
  const fromDate = new Date(Date.now() - day).toISOString()
  const record = await one(
    `
    MATCH (u:User { username: $username })-[:POSTS]->(p:Post)
    WHERE p.createdAt >= datetime($fromDate)
    RETURN COUNT(p) < $maxPosts AS allow
  `,
    { username, fromDate, maxPosts: MAX_POST_PER_DAY },
  )
  return record.get('allow') as boolean
}

export const checkPostExists = (postId: string): Promise<boolean> => {
  return one('MATCH (p:Post { id: $postId }) RETURN p', { postId }).then((record) => !!record)
}
