import { Request, Response, NextFunction } from 'express'
import { param, body, validationResult } from 'express-validator'
import { validPostLimit, checkUserExists, checkPostExists } from '../../services/validations'

export const MAX_POST_LENGTH = 777

export const userExists = param('username').custom(async (username) => {
  if (!(await checkUserExists(username))) throw new Error('User not found')
  return true
})

export const bodyUserExists = body('username').custom(async (username) => {
  if (!(await checkUserExists(username))) throw new Error('User not found')
  return true
})

export const cantFollowYourself = param('username').custom((username: string, { req }) => {
  const toUsername = req.body.username as string
  console.log(toUsername, username, toUsername != username)
  if (toUsername === username) throw new Error("You can't follow yourself")
  return true
})

export const postExists = body('postId').custom(async (postId) => {
  if (!(await checkPostExists(postId))) throw new Error('Post not found')
  return true
})

export const textLength = body('text').isLength({ max: MAX_POST_LENGTH }).withMessage('exceded maximum post length')

export const maxPostsFrequency = param('username').custom(async (username) => {
  if (!(await validPostLimit(username))) throw new Error('exceded maximum posts frequency')
  return true
})

export const returnError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
  } else next()
}
