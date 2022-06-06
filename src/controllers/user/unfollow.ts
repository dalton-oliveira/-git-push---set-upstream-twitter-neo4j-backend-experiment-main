import { Request, Response } from 'express'
import { unfollow } from '../../services/user'
export default async (req: Request, res: Response) => {
  const { fromUser: fromUser, toUser: toUser } = req.params
  await unfollow(fromUser, toUser)
  res.json({ message: 'unfollowed' })
}
