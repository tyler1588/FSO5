import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Test Blog',
    content: 'Component testing is done with react-testing-library',
    user: {
        name: 'Test Name'
    },
    likes: 0,
    visible: false
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Content: Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})