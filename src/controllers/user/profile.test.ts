import app from '../../app'
import { format } from 'date-fns'
import { getProfile } from '../../services/user'
import request from 'supertest' // eslint-disable-line node/no-unpublished-import

jest.mock('../../services/user')

describe('profile', () => {
  test('user profile not exists', async () => {
    const profMocked = jest.mocked(getProfile)
    const profile = null
    profMocked.mockResolvedValue(profile)
    const response = await request(app).get('/profile/blabla').expect('Content-Type', /json/).expect(404)
    const result = JSON.parse(response.text)
    expect(result).toStrictEqual({ error: 'User not found' })
    expect(profMocked).toHaveBeenCalledWith('blabla')
  })

  test('user profile exists', async () => {
    const profMocked = jest.mocked(getProfile)
    const profile = {
      username: 'test',
      joinedAt: '2022-01-01T00:00:00.000Z',
      followingCount: 0,
      followersCount: 0,
      postsCount: 0,
    }
    profMocked.mockResolvedValue(profile)
    const response = await request(app).get('/profile/blabla').expect('Content-Type', /json/).expect(200)
    const result = JSON.parse(response.text)
    const joinedAt = format(new Date(profile.joinedAt), 'MMMM d, yyyy')
    expect(result).toStrictEqual({ ...profile, joinedAt })
  })
})
