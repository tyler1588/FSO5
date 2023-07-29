import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token}
  }

  try {
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
  }

  catch (exception) {
    console.log(exception)
  }
}

const update = async newObject => {
  try {
    const response = await axios.put(baseUrl + '/' + newObject.id, newObject)
    return response.data
  }

  catch (exception) {
    console.log(exception)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, setToken, update }