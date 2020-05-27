describe('Fill RDMP', function () {
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const rdmp = Cypress.env('rdmp_iscs');

  beforeEach(() => {
    cy.restoreLocalStorage();
  });
  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Login with CSRF and Click Create RDMP', function () {
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
    cy.wait(3000);
  });
  it('Select and edit project', function () {
    cy.contains(rdmp.title).first().click();
    cy.wait(1000);
    cy.contains('Edit this plan').click();
    cy.get('#title').should('have.value', rdmp.title);
  });
  it('Should switch tabs to ethics', function () {
    cy.get('a[href="#ethics"]').click().as('ethics');
    cy.wait(1000);
  });
  it('Tick describe on ethics to test iscs set', function () {
    cy.get('#dmpt_ethics_iscs').should('have.value', rdmp.iscs_confidential);
    cy.get('#ethics_describe_animal_use').should('be.checked');
    cy.get('#ethics_describe_other_sensitive').should('be.checked');
    cy.get('#ethics_describe_clinical_trials').should('be.checked');
    cy.get('#ethics_describe_indigenous_cultural_intelectual_property').should('be.checked');
    cy.wait(5000);
  });
  it('ethics approval no', function () {
    cy.get('#ethics_approval_no').click();
  })
  it('Tick Indigenous cultural and intellectual property', function () {
    cy.get('#ethics_indigenous_data_ownership').should('have.value', rdmp.ethics_indigenous_data_ownership);
    cy.get('#ethics_indigenous_data_access').should('have.value', rdmp.ethics_indigenous_data_access);
  });

});
