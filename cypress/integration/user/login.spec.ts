import { userFixture } from '../../fixtures/user';
/// <reference types="cypress" />


context('Actions', () => {
  describe('Login page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:9000/login');
    });

    it('Should start in login page', () => {
      cy.location('pathname').should('eq', '/login');
    });

    it('Should show login button', () => {
      cy.dataCy('submit').should('have.length', 1);
    });

    it('Should show error if name field its not filled', () => {
      cy.dataCy('submit').click();

      cy.dataCy('userField').find('.Mui-error').contains('Usuário é obrigatório');
    });

    it('Should redirect to register page', () => {
        cy.dataCy('registerButton').click();
        cy.location('pathname').should('eq', '/account/register');
      });

    it('Should submit form and redirect to my products page', () => {
      cy.dataCy('userField').find('input').type(userFixture.login);
      cy.dataCy('passwordField').find('input').type(userFixture.password);
      cy.dataCy('submit').click();
      cy.location('pathname').should('eq', '/');
    });
  });
});
