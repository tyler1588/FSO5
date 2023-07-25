const Blog = ({blog}) => (
  <div>
    <h2>Title: {blog.title}</h2>
    <p>Content: {blog.content}</p>
    <p>Author: {blog.user.name}</p>
    <p>Likes: {blog.likes}</p>
  </div>  
)

export default Blog