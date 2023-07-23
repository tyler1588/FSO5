const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (request, response, next) => {
    try {
        const users = await User.find({}).populate('blogs')
        response.json(users)
    }

    catch(exception) {
        next(exception)
    }
})

usersRouter.post('/', async (request, response, next) => {
    const {username, name, password} = request.body

    if (password.length < 3){
        return response.status(400).json({
            error: 'password must be at least 3 characters long'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    }


    catch(exception) {
        next(exception)
    }
})

usersRouter.delete('/:id', async (request, response, next) => {
    try {
        await User.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }

    catch(exception){
        next(exception)
    }
})


module.exports = usersRouter