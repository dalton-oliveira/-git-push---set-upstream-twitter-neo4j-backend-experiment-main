import express from 'express'
import profile from './controllers/user/profile'
import list from './controllers/posterr/list'

const app = express()

app.get('/profile/:username', profile)
app.get('/posts/:username', list)

export default app
