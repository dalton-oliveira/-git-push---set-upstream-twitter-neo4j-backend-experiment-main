import express from 'express'
import profile from './routes/profile'
import { initDriver } from './neo4j'
import errorMiddleware from './middleware/error.middleware'

const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env

if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
  console.error('Missing NEO4J_URI, NEO4J_USERNAME or NEO4J_PASSWORD')
  process.exit(1)
}

initDriver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)

const app = express()

app.get('/profile/:username', profile)
app.use(errorMiddleware)

export default app
