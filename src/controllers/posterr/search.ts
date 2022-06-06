import { Request, Response } from 'express'
import { search } from '../../services/posterr'
export default async (req: Request, res: Response) => {
  const { text } = req.params
  const posts = await search(text)
  if (!posts.length) return res.status(404).json({ error: 'No matching posts' })
  res.json(posts)
}
