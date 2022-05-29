import 'dotenv/config'
import { getDriver, initDriver } from '../neo4j'
import Profile from '../types/profile'

const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env
if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
  console.error('Missing NEO4J_URI, NEO4J_USERNAME or NEO4J_PASSWORD')
  process.exit(1)
}
initDriver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)
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
  const session = getDriver().session()
  await session.run(`
    CREATE CONSTRAINT UsernameUnique IF NOT EXISTS FOR (u:User) REQUIRE u.username IS UNIQUE
  `)
  for (let user of users) {
    console.log(user)
    await session.run(
      `
      MERGE (u:User {username:$user.username})
      SET u = $user
      `,
      { user },
    )
  }
}

void run()
