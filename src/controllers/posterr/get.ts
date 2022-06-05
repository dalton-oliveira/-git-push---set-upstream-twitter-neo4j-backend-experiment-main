import { Request, Response } from 'express'
import { get } from '../../services/posterr'
export default async (req: Request, res: Response) => {
  const { postId } = req.params
  const post = await get(postId)
  if (!post) return res.status(404).json({ error: 'No matching post' })
  res.json(post)
}
