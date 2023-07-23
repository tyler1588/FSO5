const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, item) => sum + item.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
  const reducer = (prev, current) => (prev.likes >= current.likes) ? prev : current
  return blogs.reduce(reducer)
}

module.exports = {
  dummy, 
  totalLikes,
  favoriteBlog
}