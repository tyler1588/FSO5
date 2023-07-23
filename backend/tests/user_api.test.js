const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
})

describe('when there is initially some users saved', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await helper.usersInDb()
    expect(response).toHaveLength(helper.initialUsers.length)
  })

  test('user id is correctly named', async () => {
    const response = await helper.usersInDb()
    response.forEach(user => expect(user.id).toBeDefined())
  })

})

describe('addition of a new user', () => {

    test('a user can add a blog to the database', async () => {
  
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        "username": "New User",
        "password": "A strong phrase",
        "name": "Example one",
      }
    
      await api.post('/api/users').send(newUser).expect(201)
    
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    })

    test('a user with a non unique username cannot be added to database', async () => {
  
        const newUser = {
          "username": "New User",
          "password": "A strong phrase",
          "name": "Example one",
        }
      
        await api.post('/api/users').send(newUser)
        const usersAtStart = await helper.usersInDb()

        await api.post('/api/users').send(newUser).expect(400)
      
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })

      test('a user with a username shorter than 3 characters cannot be added', async () => {
  
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          "username": "Ne",
          "password": "A strong phrase",
          "name": "Example one",
        }
      
        await api.post('/api/users').send(newUser).expect(400)
      
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })

      test('a user with a password shorter than 3 characters cannot be added', async () => {
  
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          "username": "Unique User",
          "password": "af",
          "name": "Example one",
        }
      
        await api.post('/api/users').send(newUser).expect(400)
      
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
  
  })




afterAll(async () => {
  await mongoose.connection.close()
})