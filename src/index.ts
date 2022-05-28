import 'dotenv/config'
import app from './app'

const { APP_PORT = 3000 } = process.env

const initApp = async () => {
  app.listen(APP_PORT, () => {})
}

void initApp()
