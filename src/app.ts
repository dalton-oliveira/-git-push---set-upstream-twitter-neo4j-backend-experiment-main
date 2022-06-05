import express from 'express'
import profile from './controllers/user/profile'

const app = express()

app.get('/profile/:username', profile)

export default app
