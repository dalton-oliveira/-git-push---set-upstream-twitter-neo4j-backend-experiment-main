import 'dotenv/config'
import { one } from '../neo4j'

const run = async () => {
  await one('CREATE INDEX UsernameIndex IF NOT EXISTS FOR (u: User) ON u.username')
  await one('CREATE INDEX PostIdIndex IF NOT EXISTS FOR (p: Post) ON p.id')
  await one('CREATE INDEX CreatedAtIndex IF NOT EXISTS FOR (p: Post) ON p.createdAt')
  await one('CREATE FULLTEXT INDEX TextIndex IF NOT EXISTS FOR (p: Post) ON EACH [p.text]')
}

void run()
