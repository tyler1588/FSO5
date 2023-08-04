const BlogForm = ({
    user,
    logOut,
    addBlog,
    newBlog,
    setNewBlog
}) => {
    return (
        <div>
          <form onSubmit={addBlog}>
            <div>
              title
              <input
              id="blog-title"
              name="title"
              value={newBlog.title}
              onChange={({target}) => setNewBlog({...newBlog, title: target.value})}
            />
            </div>
            <div>
              content
              <input
              id="blog-content"
              name="content"
              value={newBlog.content}
              onChange={({target}) => setNewBlog({...newBlog, content: target.value})}
            />
            </div>
            <button id="blog-save" type="submit" onClick={addBlog}>save</button>
          </form>  
        </div>
      )
}

export default BlogForm