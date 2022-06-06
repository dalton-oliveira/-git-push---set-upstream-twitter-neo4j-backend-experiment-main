import { Request, Response } from 'express'
import { follow } from '../../services/user'
export default async (req: Request, res: Response) => {
  const { username: fromUser } = req.params
  const { username: toUser } = req.body
  await follow(fromUser, toUser)
  res.json({ message: 'followed' })
}
