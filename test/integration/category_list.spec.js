/// <reference types="Cypress" />

context('Category list', function () {
  beforeEach(function () {
    cy.visit('/')
    cy.wait(5000)
  })

  it('load categories', function () {
    cy.get('#category-card-0').should('be.visible')
    cy.get('#category-item-0').should('be.visible')
    cy.get('#category-item-0 .badge-pill').should(function ($badge) {
      const text = $badge.text()
      expect(text).to.match(/[0-9]+/)
    })
  })

  it('select card category', function () {
    cy.get('#category-card-0').click()
    cy.wait(2000)
    cy.hash().should('match', /categoryId=[0-9]+$/)
  })

  it('select item category', function () {
    cy.get('#category-item-0').click()
    cy.wait(2000)
    cy.hash().should('match', /categoryId=[0-9]+$/)
  })

})
