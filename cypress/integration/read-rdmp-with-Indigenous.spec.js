describe('Fill RDMP', function () {
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const rdmp = Cypress.env('rdmp2');

  beforeEach(() => {
    cy.restoreLocalStorage();
  });
  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Login with CSRF and Read RDMP', function () {
    cy.visit(`/default/rdmp/user/login`);
    //cy.get('#adminLoginLink').click();
    cy.request(`/csrfToken`)
      .its('body._csrf')
      .then((_csrf) => {
        cy.loginByCSRF(_csrf, username, password)
          .then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.include('Welcome to Stash');
          });
      });
    // successful "cy.request" sets all returned cookies, thus we should
    // be able to visit the protected page - we are logged in!
    cy.visit(`/default/rdmp/researcher/home`);
    cy.wait(2000);
    cy.contains('View/Update RDMPs').click({force: true});
    cy.url().should('include', '/default/rdmp/dashboard/rdmp');
    cy.contains('RDMPs');
    cy.wait(1000);
  });
  it('shoud get first rdmp', function () {
    cy.contains(rdmp.title).first().click();
    cy.wait(1000);
    cy.contains('Edit this plan').click();
  });
  it('check ethics tab', function () {
    cy.get('a[href="#ethics"]').click().as('ethics');
    cy.get('#ethics_describe_indigenous_cultural_intelectual_property').should('be.checked');
    cy.get('#ethics_approval_no').should('be.checked');
  });
  it('should add content retention tab', function () {
    cy.get('a[href="#retention"]').click().as('retention');
    cy.get('#ethics_data_destroy_after_retention_no').should('checked');
  });
  it('should add content ownership tab',function () {
    cy.get('a[href="#ownership"]').click().as('ownership');
    cy.get('#ethics_indigenous_data_ownership').should('have.value', rdmp.ethics_indigenous_data_ownership);
    cy.get('#ethics_indigenous_data_access').should('have.value', rdmp.ethics_indigenous_data_access);

  })
});
