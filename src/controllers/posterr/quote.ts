import { Request, Response } from 'express'
import { quote } from '../../services/posterr'

export default async (req: Request, res: Response) => {
  const { username } = req.params
  const { postId, text } = req.body
  res.json(await quote(username, postId, text))
}
