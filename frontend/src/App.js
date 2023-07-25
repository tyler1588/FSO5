import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user)) 

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log("wrong credentials")
    }
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type="text" value={username} name="Username" onChange={({target}) => setUsername(target.value)}/>
          password
          <input type="password" value={password} name="Password" onChange={({target}) => setPassword(target.value)}/>
        </div>
        <button type="submit">login</button>
    </form>
    )
  }

  const logOut = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = event => {
    event.preventDefault()
    console.log("blog",   newBlog)
    console.log("username", username)
    console.log("password", password)
  }

  const blogForm = () => {
    return (
      <div>
        <div>{user.name} logged in <button onClick={logOut}>log out</button>
        </div>
        <form onSubmit={addBlog}>
          <input
            value={newBlog}
            onChange={({target}) => setNewBlog(target.value)}
          />
          <button type="submit">save</button>
        </form>  
      </div>
      
    )
  }

  const display = () => {
    if (user === null) {
      return (
        <>
          <h2>Log in to application</h2>
          {loginForm()}
        </>
      )
    }
    return (
      <>
        <h2>blogs</h2>
        {blogForm()}
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
        )}
      </>
    )
  }

  return (
    <div>
      {display()}     
    </div>
  )
}

export default App