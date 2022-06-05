import { Request, Response } from 'express'
import { getProfile } from '../../services/user'
import { format } from 'date-fns'

export default async (req: Request, res: Response) => {
  const { username } = req.params
  const profile = await getProfile(username)
  if (!profile) return res.status(404).json({ error: 'User not found' })
  /**
   * Ideally this date would be formatted on the front-end
   */
  const joinedAt = format(new Date(profile.joinedAt), 'MMMM d, yyyy')
  res.json(Object.assign(profile, { joinedAt }))
}
