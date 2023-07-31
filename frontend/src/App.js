import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import notification from './components/notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({title: '', content: '', likes: 0})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

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
      setBlogs( blogs.map(blog => ({...blog, visible: false})) )
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
      setBlogs(blogs.map(blog => ({...blog, visible: false})))
      setMessage({text: `Added ${newBlog.title}`, colour: "green"})
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    catch (exception) {
      console.log(exception)
    }
  }

  const toggleBlogVisible = id => {
    setBlogs(blogs.map(blog => blog.id !== id ? blog : {...blog, visible: !blog.visible}))
  }

  const addLike = async id => {
    const toUpdate = blogs.filter(blog => blog.id === id)[0]
    const updatedBlog = {
      id: toUpdate.id,
      content: toUpdate.content,
      title: toUpdate.title,
      likes: toUpdate.likes + 1,
      user: toUpdate.user.id
    }
    try {
      await blogService.update(updatedBlog) 
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    catch (exception) {
      console.log(exception)
    } 
  }

  const removeBlog = async id => {
    const toDelete = blogs.filter(blog => blog.id === id)[0]
    if (window.confirm(`Remove ${toDelete.title} by ${user.name}?`)){
      try {
        await blogService.remove(id)
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      }
      catch (exception) {
        console.log(exception)
      } 
    }
  }

  const displayBlogs = () => {
    const sorted = blogs.sort((a,b) => b.likes - a.likes)
    return (
      <>
        <h1>blogs</h1>
        {sorted.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog} 
          toggleBlogVisible={toggleBlogVisible} 
          addLike={addLike} 
          user={user} 
          removeBlog={removeBlog}/> 
        )}
      </>
    )
  }

  return (
    <div>
      {notification(message)}
      {!user &&
      <Togglable buttonLabel='login'>
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </Togglable>}
      {user &&
      <>
        <div>{user.name} logged in <button onClick={logOut}>log out</button></div>
        <Togglable buttonLabel='new blog'>
          <BlogForm
            user={user}
            logOut={logOut}
            addBlog={addBlog}
            newBlog={newBlog}
            setNewBlog={setNewBlog}
          />
        </Togglable>
      </>} 
      {displayBlogs()}
    </div>
  )
}

export default App