import { Request, Response, NextFunction } from 'express'
import httpErrors from 'http-errors'
import { getProfile } from '../services/user'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params
  if (!username) return next(new httpErrors.BadRequest('username required'))
  const profile = await getProfile(username)
  if (profile) res.json(profile)
  else return next(new httpErrors.NotFound(`user ${username} not found`))
}
