import express, { json } from 'express'
import profile from './controllers/user/profile'
import list from './controllers/posterr/list'
import get from './controllers/posterr/get'
import post from './controllers/posterr/post'
import repost from './controllers/posterr/repost'
import quote from './controllers/posterr/quote'
import {
  userExistsValidation,
  postExists,
  textLength,
  maxPostsFrequency,
  returnError,
} from './controllers/posterr/validations'
export const postValidations = [userExistsValidation, textLength, maxPostsFrequency, returnError]

const app = express()
app.use(json())

app.get('/profile/:username', profile)
app.get('/posts/:username', list)
app.get('/post/:postId', get)
app.post('/post/:username', ...postValidations, post)
app.post('/repost/:username', postExists, ...postValidations, repost)
app.post('/quote/:username', postExists, ...postValidations, quote)

export default app
