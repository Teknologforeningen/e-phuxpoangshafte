import supertest from 'supertest'
import app from '../app'
import bcrypt from 'bcrypt'
import { multipleCategories } from './data/categories'

const api = supertest(app)

describe('Nothing pre added', () => {
  test('Adding a category', async () => {
    const response = await api
    .post('/api/categories/')
    .send(multipleCategories[0])
    .expect(201)

    expect(response.body[0]).toEqual({...multipleCategories[0], id: 1})
  })
})