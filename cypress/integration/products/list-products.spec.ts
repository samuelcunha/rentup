/// <reference types="cypress" />

context('Actions', () => {
  describe('List products page', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('http://localhost:9000/products/user');
    });

    it('Should start in login page', () => {
      cy.location('pathname').should('eq', '/products/user');
    });
  });
});
