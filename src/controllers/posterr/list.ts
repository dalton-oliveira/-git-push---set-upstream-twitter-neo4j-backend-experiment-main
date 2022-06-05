import { Request, Response } from 'express'
import { list } from '../../services/posterr'

export default async (req: Request, res: Response) => {
  const { username } = req.params
  const { skip } = req.query
  const userPosts = await list(username, Number(skip ?? 0))
  if (!userPosts.length) return res.status(404).json({ error: 'No matching posts' })
  res.json(userPosts)
}
