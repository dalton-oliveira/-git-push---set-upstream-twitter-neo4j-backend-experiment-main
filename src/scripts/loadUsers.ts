import 'dotenv/config'
import { one } from '../neo4j'
import Profile from '../types/profile'

const users: Array<Profile> = Array(10)
  .fill(null)
  .map(
    (_, i): Profile => ({
      username: `user${i + 1}`,
      joinedAt: new Date().toISOString(),
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
    }),
  )

const run = async () => {
  await one(`
    CREATE CONSTRAINT UsernameUnique IF NOT EXISTS FOR (u:User) REQUIRE u.username IS UNIQUE
  `)
  for (let user of users) {
    console.log(user)
    await one(
      `
      MERGE (u:User {username:$user.username})
      SET u = $user
      `,
      { user },
    )
  }
}

void run()
