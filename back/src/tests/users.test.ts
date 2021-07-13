import supertest from 'supertest'
import app from '../app'
import bcrypt from 'bcrypt'
import { basicUser, adminUser} from './data/users'

const api = supertest(app)

console.log("Env: ", process.env.NODE_ENV)
describe('Nothing pre added', () => {
  test('Adding a user and fecthing it (post+get)', async () => {
    const response = await api
    .post('/api/users/')
    .send(basicUser)
    .expect(201)
    console.log(response)
    expect(response.body[0].email).toEqual({...basicUser, events: [], id: 1})
  })
  test('Fecthing from db', async () => {
    const users = await api.get('/api/users/')
    expect(users[0]).toEqual({...basicUser, events: [], id: 1})
  })
})