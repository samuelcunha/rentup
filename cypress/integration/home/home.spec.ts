context('Actions', () => {
  describe('Home not authenticated', () => {
    beforeEach(() => {
      cy.visit('http://localhost:9000');
    });

    it('Should show login button', () => {
      cy.dataCy('loginButton').should('have.length', 1);
    });
    
    it('Should show register button', () => {
      cy.dataCy('registerButton').should('have.length', 1);
    });

    it('Should not show header', () => {
      cy.dataCy('header').should('not.exist');
    });

    it('Should redirect to login page', () => {
      cy.dataCy('loginButton').click();
      cy.location('pathname').should('eq', '/login');
    });

    it('Should redirect to register page', () => {
      cy.dataCy('registerButton').click();
      cy.location('pathname').should('eq', '/account/register');
    });
  });

  describe('Home authenticated', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('http://localhost:9000');
      cy.wait(500);
    });

    it('Should show add product button', () => {
      cy.dataCy('addProductButton').should('have.length', 1);
    });

    it('Should show search field', () => {
      cy.dataCy('searchField').should('have.length', 1);
    });

    it('Should show header', () => {
      cy.dataCy('header').should('have.length', 1);
    });

    it('Should redirect to add product page', () => {
      cy.dataCy('addProductButton').click();
      cy.location('pathname').should('eq', '/products/create');
    });

    it('Should redirect to search page', () => {
      cy.dataCy('searchField').click();
      cy.location('pathname').should('eq', '/products/search');
    });
  });
});
