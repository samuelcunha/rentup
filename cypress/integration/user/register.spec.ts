/// <reference types="cypress" />

context('Actions', () => {
  describe('Register page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:9000/account/register');
    });

    it('Should start in login page', () => {
      cy.location('pathname').should('eq', '/account/register');
    });
  });
});
