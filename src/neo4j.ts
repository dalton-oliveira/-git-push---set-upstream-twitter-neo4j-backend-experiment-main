import { auth, Driver, driver, Record } from 'neo4j-driver'
let instance: Driver

export function initDriver(uri: string, username: string, password: string) {
  instance = driver(uri, auth.basic(username, password), {
    maxConnectionPoolSize: 100,
    connectionTimeout: 30_000,
    logging: {
      level: 'info',
      logger: (level, message) => console.log(level + ' ' + message),
    },
  })
}

export async function one(query: string, parameters?: any): Promise<Record> {
  const [record] = await all(query, parameters)
  return record
}

export async function all(query: string, parameters?: any): Promise<Array<Record>> {
  const session = getDriver().session()
  try {
    const resp = await session.run(query, parameters)
    return resp.records
  } finally {
    await session.close()
  }
}

export function getDriver() {
  if (instance) return instance

  const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env
  if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
    console.error('Missing NEO4J_URI, NEO4J_USERNAME or NEO4J_PASSWORD')
    process.exit(1)
  }

  initDriver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)

  return instance
}

export function closeDriver() {
  return instance?.close()
}
