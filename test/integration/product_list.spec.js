/// <reference types="Cypress" />

context('Product list', function () {
  beforeEach(function () {
    cy.visit('/')
    cy.wait(5000)
  })

  it('load products', function () {
    cy.get('#category-card-0').click()
    cy.wait(2000)
    cy.get('#product-card-0').should('be.visible')
    cy.reload(true)
    cy.wait(2000)
    cy.get('#product-card-0').should('be.visible')
  })

  it('not load products', function () {
    cy.visit('/#!?categoryId=notExistsId')
    cy.wait(2000)
    cy.get('#product-card-0').should('not.exist')
    cy.get('#no-products').should('be.visible')
  })

  it('select compare product', function () {
    cy.get('#category-card-0').click()
    cy.wait(2000)
    cy.get('#product-card-compare-0').click()
    cy.wait(2000)
    cy.hash().should('match', /productId=[0-9]+$/)
  })

  it('back through breadcrumb', function () {
    cy.get('#category-card-0').click()
    cy.wait(2000)
    cy.get('.product-list .breadcrumb .breadcrumb-item:first-child').click()
    cy.wait(2000)
    cy.hash().should('eq', '#')
  })

})
