import { Request, Response } from 'express'
import { unfollow } from '../../services/user'
export default async (req: Request, res: Response) => {
  const { username: fromUser } = req.params
  const { username: toUser } = req.body
  await unfollow(fromUser, toUser)
  res.json({ message: 'unfollowed' })
}
