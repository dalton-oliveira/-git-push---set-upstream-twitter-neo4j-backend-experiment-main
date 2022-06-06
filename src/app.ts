import express, { json } from 'express'
import profile from './controllers/user/profile'
import listAll from './controllers/posterr/listAll'
import search from './controllers/posterr/search'
import list from './controllers/posterr/list'
import get from './controllers/posterr/get'
import post from './controllers/posterr/post'
import repost from './controllers/posterr/repost'
import quote from './controllers/posterr/quote'
import follow from './controllers/user/follow'
import unfollow from './controllers/user/unfollow'

import {
  userExists,
  bodyUserExists,
  postExists,
  textLength,
  maxPostsFrequency,
  cantFollowYourself,
  returnError,
} from './controllers/posterr/validations'
export const postValidations = [userExists, textLength, maxPostsFrequency, returnError]

const app = express()
app.use(json())

app.get('/profile/:username', profile)
app.get('/posts/:username', list)
app.get('/home/:username', listAll)
app.get('/post/:postId', get)
app.get('/search/:text', search)
app.post('/post/:username', ...postValidations, post)
app.post('/repost/:username', postExists, ...postValidations, repost)
app.post('/quote/:username', postExists, ...postValidations, quote)
app.post('/follow/:username', userExists, bodyUserExists, cantFollowYourself, returnError, follow)
app.post('/unfollow/:username', userExists, bodyUserExists, returnError, unfollow)

export default app
