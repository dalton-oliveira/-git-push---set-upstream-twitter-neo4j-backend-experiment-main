import { Driver, driver, auth } from 'neo4j-driver'

let current: Driver

export function initDriver(uri: string, username: string, password: string) {
  current = driver(uri, auth.basic(username, password), {
    maxConnectionPoolSize: 100,
    connectionTimeout: 30_000,
    logging: {
      level: 'info',
      logger: (level, message) => console.log(level + ' ' + message),
    },
  })
}

export function getDriver() {
  return current
}

export function closeDriver() {
  return current?.close()
}
