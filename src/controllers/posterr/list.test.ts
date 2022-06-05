import app from '../../app'
import request from 'supertest' // eslint-disable-line node/no-unpublished-import
import { list } from '../../services/posterr'
jest.mock('../../services/posterr')

describe('list posts', () => {
  test('should return not found on empty result list', async () => {
    const listMocked = jest.mocked(list)
    listMocked.mockResolvedValue([])
    const response = await request(app).get('/posts/blabla').expect('Content-Type', /json/).expect(404)
    const result = JSON.parse(response.text)
    expect(result).toStrictEqual({ error: 'No matching posts' })
  })

  test('should return the list and forward skip query parameter', async () => {
    const listMocked = jest.mocked(list)
    const mockedResults = [{ id: '1', createdAt: '2022-01-01' }]
    listMocked.mockResolvedValue(mockedResults)
    const response = await request(app).get('/posts/blabla?skip=10').expect('Content-Type', /json/).expect(200)
    const result = JSON.parse(response.text)
    expect(result).toStrictEqual(mockedResults)
    expect(listMocked).toHaveBeenCalledWith('blabla', 10)
  })
})
