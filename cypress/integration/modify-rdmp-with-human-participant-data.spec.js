describe('Fill RDMP', function () {
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const rdmp = Cypress.env('rdmp');

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
    cy.get('#ethics_describe_human_participant_data').should('be.checked');
  });
  it('should alert a confirmation box and click NO', function () {
    cy.get('#ethics_describe_human_participant_data').click();
    cy.contains('Will the data that you collect from individuals include');
    cy.contains('Is any data or information individually identifiable or potentially re-identifiable (i.e. includes codes)?');
    cy.wait(3000);
    cy.get('#modal_ethics_describe').contains('No').click();
  });
  it('should alert a confirmation box and click YES', function () {
    cy.get('#ethics_describe_human_participant_data').click();
    cy.contains('Will the data that you collect from individuals include');
    cy.contains('Is any data or information individually identifiable or potentially re-identifiable (i.e. includes codes)?');
    cy.wait(3000);
    cy.get('#modal_ethics_describe').contains('Yes').click();
    cy.get('#ethics').should('not.have.value','Will the data that you collect from individuals include');
    cy.get('#ethics').should('not.have.value','Is any data or information individually identifiable or potentially re-identifiable (i.e. includes codes)?');
  });
  it('should alert a confirmation box for ethics identifiable and click NO', function () {
    cy.get('#ethics_describe_human_participant_data').should('not.be.checked');
    cy.wait(1000);
    cy.get('#ethics_describe_human_participant_data').click();
    cy.get('#ethics_identifiable').click();
    cy.get('#ethics_human_participant_data_severity_risk').type(rdmp.ethics_human_participant_data_severity_risk);
    cy.get('#ethics_identifiable_other_countries').type(rdmp.ethics_identifiable_other_countries)
    cy.wait(2000);
    cy.get('#ethics_identifiable').click();
    cy.get('#ethics').should('not.have.value','Outline the potential severity and type of risk to participants from accidental disclosure of the data');
    cy.get('#ethics').should('not.have.value','If you are collecting data from residents of countries other than Australia, which countries?');
    cy.wait(2000);
    cy.get('#modal_ethics_identifiable').contains('No').click();
  });
  it('should alert a confirmation box for ethics identifiable and click YES', function () {
    cy.get('#ethics_identifiable').should('be.checked');
    cy.get('#ethics_identifiable').click();
    cy.contains('Outline the potential severity and type of risk to participants from accidental disclosure of the data');
    cy.contains('Will you de-identify the data?');
    cy.wait(3000);
    cy.get('#modal_ethics_identifiable').contains('Yes').click();
    cy.get('#ethics').should('not.have.value','Outline the potential severity and type of risk to participants from accidental disclosure of the data');
    cy.get('#ethics').should('not.have.value','If you are collecting data from residents of countries other than Australia, which countries?');
    cy.wait(3000);
    cy.get('#ethics_identifiable').click();
    cy.get('#ethics_human_participant_data_severity_risk').should('not.have.value');
  });
});
