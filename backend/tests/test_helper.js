const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        "title": "Test",
        "author": "Test Author",
        "url": "www.test.com",
        "likes": 10
    },
    {
        "title": "Test 2",
        "author": "Test Author 2",
        "url": "www.test2.com",
        "likes": 20
    },
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const initialUsers = [
    {
        "username": "example",
        "password": "password",
        "name": "John Doe" 
    },
    {
        "username": "example_2",
        "password": "1234",
        "name": "Eli Smith"
    }
        
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, initialUsers, usersInDb
}