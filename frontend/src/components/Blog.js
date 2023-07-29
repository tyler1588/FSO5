const Blog = ({blog, toggleBlogVisible, addLike, user, removeBlog}) => {
  const style = {
    "display": blog.visible ? "" : "none"
  }

  const removeBtnStyle = {
    "display": user && user.id === blog.user.id ? "" : "none"
  }
  
  return (
    <div>
      <h2>Title: {blog.title} <button onClick={() => toggleBlogVisible(blog.id)}>{blog.visible ? "hide" : "show"}</button></h2>
      <div style={style}>
        <p>Content: {blog.content}</p>
        <p>Author: {blog.user.name}</p>
        <p>Likes: {blog.likes} <button onClick={() => addLike(blog.id)}>like</button></p>
        <button onClick={() => removeBlog(blog.id)} style={removeBtnStyle}>remove</button>
      </div>
    </div>  
  )
 
}

export default Blog