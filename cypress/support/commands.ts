declare namespace Cypress {
  interface Chainable<Subject> {
    login(): Cypress.Chainable<void>;
    logout(): Cypress.Chainable<void>;
    dataCy(value: string): Cypress.Chainable<void>;
  }
}
Cypress.Commands.add('login', () => {
  window.localStorage.setItem(
    'jhi-authenticationToken',
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTYyOTc0MDYyOH0.0OMyaIt4nq3w14wmJALj6LgfuOtHt-JCRf8lsSIGQ2dDeQeykrXyqS4PJESe5UIz3pN0XphIk80GZLqFUn5sLA'
  );
});

Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('jhi-authenticationToken');
});

Cypress.Commands.add('dataCy', value => {
  return cy.get(`[data-cy=${value}]`);
});
