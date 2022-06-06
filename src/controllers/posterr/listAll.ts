import { Request, Response } from 'express'
import { listAll, listFollowing } from '../../services/posterr'

export default async (req: Request, res: Response) => {
  const { username } = req.params
  const { skip, following } = req.query
  console.log({ following })
  const allPosts = await (following ? listFollowing(username, Number(skip ?? 0)) : listAll(Number(skip ?? 0)))
  if (!allPosts.length) return res.status(404).json({ error: 'No matching posts' })
  res.json(allPosts)
}
