/* eslint-disable no-undef */
describe('Blog app login', function() {
  beforeEach(function(){
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('blogs')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })
  it('login succeeds with correct credentials', function(){
    cy.contains('login').click()
    cy.get('#username').type('coolguy123')
    cy.get('#password').type('password')
    cy.get('#login-button').click()
    cy.contains('Steven logged in')
  })
  it('login fails with incorrect credentials', function(){
    cy.contains('login').click()
    cy.get('#username').type('coolguy123')
    cy.get('#password').type('passwor')
    cy.get('#login-button').click()
    cy.contains('Invalid Credentials')
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('coolguy123')
      cy.get('#password').type('password')
      cy.get('#login-button').click()
      cy.contains('Steven logged in')
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#blog-title').type('test title')
      cy.get('#blog-content').type('test content')
      cy.get('#blog-save').click()
      cy.contains('Title: test title')
    })

    it('A blog can be liked', function() {
      cy.contains('Title: test title').find('button').click()
      cy.contains('Title: test title').parent().contains('like').click()
      cy.contains('Title: test title').parent().contains('Likes: 1')
    })

    it('A blog can be liked a second time', function() {
      cy.contains('Title: test title').find('button').click()
      cy.contains('Title: test title').parent().contains('like').click()
      cy.contains('Title: test title').parent().contains('Likes: 2')
    })

    it('A blog can be deleted', function() {
      cy.contains('Title: test title').find('button').click()
      cy.contains('Title: test title').parent().contains('remove').click()
      cy.contains('Title: test title').should('not.exist')
    })
  })
})