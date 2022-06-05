import { all, one } from '../neo4j'
import { Post } from '../types/posterr'
import Profile from '../types/profile'
import { int, Node, Record } from 'neo4j-driver'

const buildAuthor = ({ properties }: Node): Profile => ({
  username: properties.username,
  joinedAt: properties.joinedAt,
  followersCount: properties.followersCount,
  followingCount: properties.followersCount,
  postsCount: properties.postsCount,
})

const baseBuild = ({ properties: { id, createdAt, text } }: Node, author?: Node): Post => ({
  id,
  createdAt: createdAt.toString(),
  text,
  ...(author && { author: buildAuthor(author) }),
})

const build = (r: Record): Post => {
  const post = baseBuild(r.get('p'))
  if (r.get('reposted')) post.reposted = baseBuild(r.get('reposted'), r.get('repostedUser'))
  if (r.get('quoted')) post.quoted = baseBuild(r.get('quoted'), r.get('quotedUser'))
  post.author = r.get('author').properties as Profile
  return post
}
const buildList = (records: Record[]): Post[] => records.map(build)

export const post = async (username: string, text: string): Promise<Post> => {
  const record = await one(
    `
    MATCH (user:User { username: $username })
    CREATE (user)-[:POSTS]->(p:Post { text: $text, createdAt: datetime(), id: apoc.create.uuid() })
    SET user.postsCount = user.postsCount + 1
    return p
  `,
    { username, text },
  )
  return baseBuild(record.get('p'))
}

export const repost = async (username: string, postId: string): Promise<Post> => {
  const record = await one(
    `
    MATCH (user:User { username: $username }), (post:Post)
    WHERE post.id = $postId
    CREATE (user)-[:POSTS]->(repost:Post { createdAt: datetime(), id: apoc.create.uuid() })-[:REPOSTS]->(post)
    SET user.postsCount = user.postsCount + 1
    RETURN p
  `,
    { username, postId },
  )
  return baseBuild(record.get('p'))
}

export const quote = async (username: string, postId: string, text: string): Promise<Post> => {
  const record = await one(
    `
    MATCH (user:User { username: $username }), (quotedPost:Post)
    WHERE quotedPost.id = $postId
    CREATE (user)-[:POSTS]->(p:Post { text: $text, createdAt: datetime(), id: apoc.create.uuid() })-[:QUOTES]->(quotedPost)
    SET user.postsCount = user.postsCount + 1
    RETURN p
  `,
    { username, postId, text },
  )
  return baseBuild(record.get('p'))
}

export const list = async (username: string, skip: number): Promise<Array<Post>> => {
  const records = await all(
    `
    MATCH (:User { username: $username })-[:POSTS]->(p:Post)
    OPTIONAL MATCH (p)-[:REPOST]->(reposted:Post)<-[:POSTS]-(repostedUser:User)
    OPTIONAL MATCH (p)-[:QUOTES]->(quoted:Post)<-[:POSTS]-(quotedUser:User)
    RETURN p, reposted, quoted, repostedUser, quotedUser
    ORDER BY p.createdAt DESC
    SKIP $skip
    LIMIT 5
  `,
    { username, skip: int(skip) },
  )
  return records.map((r) => {
    const node = r.get('p')

    const post = baseBuild(node)
    if (r.get('reposted')) post.reposted = baseBuild(r.get('reposted'), r.get('repostedUser'))
    if (r.get('quoted')) post.quoted = baseBuild(r.get('quoted'), r.get('quotedUser'))
    return post
  })
}

export const listFollowing = async (username: string, skip: number): Promise<Array<Post>> => {
  const records = await all(
    `
    MATCH (:User {username: $username})-[:FOLLOWS]->(:User)-[:POSTS]->(p:Post) 
    OPTIONAL MATCH (p)-[:REPOST]->(reposted:Post)<-[:POSTS]-(repostedUser:User)
    OPTIONAL MATCH (p)-[:QUOTES]->(quoted:Post)<-[:POSTS]-(quotedUser:User)
    RETURN p, reposted, quoted, repostedUser, quotedUser
    SKIP $skip
    LIMIT 10
  `,
    { username, skip: int(skip) },
  )
  return buildList(records)
}

export const get = async (postId: string): Promise<Post | undefined> => {
  const r = await one(
    `
    MATCH (author:User)-[:POSTS]->(p:Post)
    OPTIONAL MATCH (p)-[:REPOST]->(reposted:Post)<-[:POSTS]-(repostedUser:User)
    OPTIONAL MATCH (p)-[:QUOTES]->(quoted:Post)<-[:POSTS]-(quotedUser:User)
    WHERE p.id = $postId
    RETURN author, p, reposted, quoted, repostedUser, quotedUser
  `,
    { postId: Number(postId) },
  )
  return r ? build(r) : undefined
}
