/// <reference types="Cypress" />

context('Product detail', function () {
  beforeEach(function () {
    cy.visit('/')
    cy.wait(5000)
  })

  it('load product', function () {
    cy.get('#category-card-0').click()
    cy.wait(2000)
    cy.get('#product-card-compare-0').click()
    cy.wait(2000)
    cy.get('#no-product').should('not.be.visible')
    cy.reload(true)
    cy.wait(2000)
    cy.get('#no-product').should('not.be.visible')
  })

  it('not load product', function () {
    cy.visit('/#!?productId=notExistsId')
    cy.wait(2000)
    cy.get('#no-product').should('be.visible')
  })

  it('shop link', function () {
    cy.get('#category-card-0').click()
    cy.wait(2000)
    cy.get('#product-card-compare-0').click()
    cy.wait(2000)

    cy.get('#shop-link-0').should('have.attr', 'target', '_blank')
    cy.get('#shop-link-0').should('have.attr', 'rel', 'noopener')
    cy.get('#shop-link-0').should('not.have.attr', 'href', '')
    cy.get('#shop-link-0').click()
  })

  it('back through breadcrumb - first link', function () {
    cy.get('#category-card-0').click()
    cy.wait(2000)
    cy.get('#product-card-compare-0').click()
    cy.wait(2000)
    cy.get('.product-detail .breadcrumb .breadcrumb-item:nth-child(1)').click()
    cy.wait(2000)
    cy.hash().should('eq', '#')
  })

  it('back through breadcrumb - second link', function () {
    cy.get('#category-card-0').click()
    cy.wait(2000)
    cy.get('#product-card-compare-0').click()
    cy.wait(2000)
    cy.get('.product-detail .breadcrumb .breadcrumb-item:nth-child(2)').click()
    cy.wait(2000)
    cy.hash().should('match', /categoryId=[0-9]+$/)
  })

})
