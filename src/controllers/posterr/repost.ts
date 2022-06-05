import { Request, Response } from 'express'
import { repost } from '../../services/posterr'
export default async (req: Request, res: Response) => {
  const { username, postId } = req.params
  res.json(await repost(username, postId))
}
