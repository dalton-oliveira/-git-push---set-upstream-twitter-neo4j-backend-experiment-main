import { Request, Response } from 'express'
import { post } from '../../services/posterr'

export default async (req: Request, res: Response) => {
  const { username } = req.params
  const { text } = req.body
  res.json(await post(username, text))
}
