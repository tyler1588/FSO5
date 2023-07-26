import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import notification from './components/notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({title: '', content: '', likes: 0})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogFormVisible, setBlogFormVisible] = useState(false)

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
        console.log('ran')
      setMessage({text: 'Invalid Credentials', colour: "red"})
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
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
      setMessage({text: `Added ${newBlog.title}`, colour: "green"})
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    catch (exception) {
      console.log(exception)
    }
  }

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

    return (
      <div>
        <h1>blogs</h1>
        <div>{user.name} logged in <button onClick={logOut}>log out</button></div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>add blog</button>
        </div>
        <div style={showWhenVisible}>
          <h2>create new</h2>
          <BlogForm
            user={user}
            logOut={logOut}
            addBlog={addBlog}
            newBlog={newBlog}
            setNewBlog={setNewBlog}
          />
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
        <h2>Log in to application</h2>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const displayBlogs = () => {
    return (
      <>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
        )}
      </>
    )
  }

  return (
    <div>
      {notification(message)}
      {user === null ? loginForm() : blogForm()}     
      {displayBlogs()}
    </div>
  )
}

export default App