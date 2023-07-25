import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({title: '', content: '', likes: 0})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // to clear the localStorage after 1 hour
  var hours = 1; 
  var now = new Date().getTime();
  var setupTime = localStorage.getItem('setupTime');
  if (setupTime == null) {
      localStorage.setItem('setupTime', now)
  } else {
      if(now-setupTime > hours*60*60*1000) {
          localStorage.clear()
          localStorage.setItem('setupTime', now);
      }
  }

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
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      blogService.setToken(user.token)
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

  const addBlog = async event => {
    event.preventDefault()
    try {
      await blogService.create(newBlog)
      setNewBlog({title: '', content: '', likes: 0})
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    catch (exception) {
      console.log(exception)
    }
  }

  const blogForm = () => {
    return (
      <div>
        <div>{user.name} logged in <button onClick={logOut}>log out</button>
        </div>
        <form onSubmit={addBlog}>
          <div>
            title
            <input
            name="title"
            value={newBlog.title}
            onChange={({target}) => setNewBlog({...newBlog, title: target.value})}
          />
          </div>
          <div>
            content
            <input
            name="content"
            value={newBlog.content}
            onChange={({target}) => setNewBlog({...newBlog, content: target.value})}
          />
          </div>
          <button type="submit" onClick={addBlog}>save</button>
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