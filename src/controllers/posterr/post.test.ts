import app from '../../app'
import request from 'supertest' // eslint-disable-line node/no-unpublished-import
import { validPostLimit, checkUserExists } from '../../services/validations'
import { MAX_POST_LENGTH } from '../../controllers/posterr/validations'
jest.mock('../../services/user')
jest.mock('../../services/validations')

describe('create post', () => {
  test('should validate user exists', async () => {
    jest.mocked(checkUserExists).mockResolvedValue(false)
    const response = await request(app)
      .post('/post/blabla')
      .send({ text: '' })
      .expect('Content-Type', /json/)
      .expect(400)
    const { errors } = JSON.parse(response.text)
    const [userNotFound] = errors
    expect(userNotFound).toStrictEqual({
      value: 'blabla',
      msg: 'User not found',
      param: 'username',
      location: 'params',
    })
  })

  test('should validate exeeds post limit', async () => {
    jest.mocked(checkUserExists).mockResolvedValue(true)
    jest.mocked(validPostLimit).mockResolvedValue(false)
    const response = await request(app)
      .post('/post/blabla')
      .send({ text: '' })
      .expect('Content-Type', /json/)
      .expect(400)
    const { errors } = JSON.parse(response.text)
    const [exceeded] = errors
    expect(exceeded).toStrictEqual({
      value: 'blabla',
      msg: 'exceded maximum posts frequency',
      param: 'username',
      location: 'params',
    })
  })

  test('should validate text length', async () => {
    jest.mocked(checkUserExists).mockResolvedValue(true)
    jest.mocked(validPostLimit).mockResolvedValue(true)
    const text = Array(MAX_POST_LENGTH + 1)
      .fill('0')
      .join('')
    const response = await request(app).post('/post/blabla').send({ text }).expect('Content-Type', /json/).expect(400)
    const { errors } = JSON.parse(response.text)
    const [exceeded] = errors
    expect(exceeded).toStrictEqual({
      value: text,
      msg: 'exceded maximum post length',
      param: 'text',
      location: 'body',
    })
  })
})
