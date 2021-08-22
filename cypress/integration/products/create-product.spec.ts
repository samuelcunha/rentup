/// <reference types="cypress" />

import { productFixture } from "../../fixtures/product";

context('Actions', () => {
  describe('Create product page', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('http://localhost:9000/products/create');
    });

    it('Should start in create product page', () => {
      cy.location('pathname').should('eq', '/products/create');
    });

    it('Should show submit button', () => {
      cy.dataCy('submit').should('have.length', 1);
    });

    it('Should show error if name field its not filled', () => {
      cy.dataCy('submit').click();

      cy.dataCy('nameField').find('.Mui-error').contains('Nome é obrigatório');
    });

    it('Should submit form and redirect to my products page', () => {
      cy.intercept(
        {
          method: 'POST',
          url: '**/products',
        },
        []
      );

      cy.dataCy('nameField').find('input').type(productFixture.name);
      cy.dataCy('priceBaseField').find('input').type(productFixture.priceBase);
      cy.dataCy('descriptionField').find('[name="description"]').type(productFixture.description);
      cy.dataCy('categoryField').click();
      cy.get(`[data-value="${productFixture.category}"]`).click();

      cy.dataCy('submit').click();
      cy.location('pathname').should('eq', '/products/user');
    });
  });
});
