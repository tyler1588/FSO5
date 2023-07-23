const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blog id is correctly named', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => expect(blog.id).toBeDefined())
  })

})

describe('addition of a new blog', () => {

  test('a blog can add a blog to the database', async () => {

    const blogsAtBeginning = await helper.blogsInDb()
    const newBlog = {
      "title": "Test",
      "author": "Test Author",
      "url": "www.test.com",
      "likes": 10
    }
  
    await api.post('/api/blogs').send(newBlog)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtBeginning.length + 1)
  })

})

describe('deletion of a blog', () => {

  test('a blog can be deleted', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    const blogToDelete = blogsAtBeginning[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtBeginning.length - 1)
  })

})

describe('updating a blog', () => {

  test('a blogs likes can be increased', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    const blogToUpdate = blogsAtBeginning[0]
    const updatededBlog = {...blogToUpdate, likes: blogToUpdate.likes + 1}
  
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatededBlog)
      .expect(200)
    
    const blogsAtEnd = await helper.blogsInDb()  
    expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes + 1)
  })
  
  test('a blogs likes can be decreased', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    const blogToUpdate = blogsAtBeginning[0]
    const updatededBlog = {...blogToUpdate, likes: blogToUpdate.likes - 1}
  
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatededBlog)
      .expect(200)
    
    const blogsAtEnd = await helper.blogsInDb()  
    expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes - 1)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})