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
    cy.get('#ethics_human_participant_data_individual_personal').should('be.checked');
    cy.get('#ethics_human_participant_data_severity_risk').should('have.value', rdmp.ethics_human_participant_data_severity_risk);
    cy.get('#ethics_identifiable_other_countries').should('have.value', rdmp.ethics_identifiable_other_countries);
    cy.get('#ethics_approval_yes').should('be.checked');
  });
  it('should add content ethics tab', function () {
    cy.get('a[href="#dataCollection"]').click().as('dataCollection');
    //What is the identifiable data
    cy.get('#ethics_identifiable_data').type(rdmp.ethics_identifiable_data);
    cy.get('#ethics_identifiable_collection_other_text').should('have.value', rdmp.ethics_identifiable_collection_other_text);
    cy.get('#ethics_identifiable_transfered_out_yes_text').should('have.value', rdmp.ethics_identifiable_transfered_out_yes_text);
    cy.get('#ethics_identifiable_deidentify_no_text').should('have.value',rdmp.ethics_identifiable_deidentify_no_text);
  });
  it('should add content retention tab', function () {
    cy.get('a[href="#retention"]').click().as('retention');
    cy.get('#ethics_data_destroy_after_retention_what').should('have.value', rdmp.ethics_data_destroy_after_retention_what);
    cy.contains('When should it be destroyed?').siblings('datetime').find('input').should('have.value','01/01/2021');
  });
  it('should add content ownership tab',function () {
    cy.get('a[href="#ownership"]').click().as('ownership');
    cy.get('#dmpt_ethics_dc_access_rights_not_available').should('have.value', rdmp.dmpt_ethics_dc_access_rights_not_available);
    cy.get('#ethics_data_secondary_third_party_yes').should('be.checked');
    cy.get('#ethics_data_secondary_third_party_held_publicly_held_commonwealth').should('be.checked');
    cy.get('#ethics_data_secondary_third_party_held_publicly_held_international').should('be.checked');
    cy.get('#ethics_data_secondary_third_party_custodians_no').should('be.checked');
    cy.get('#ethics_data_secondary_third_party_ownership_type_commercial_license').should('be.checked');
    cy.get('#ethics_data_secondary_third_party_security').should('have.value', rdmp.ethics_data_secondary_third_party_security);
    cy.get('#ethics_data_secondary_third_party_disposal').should('have.value', rdmp.ethics_data_secondary_third_party_disposal);
    cy.get('#ethics_data_secondary_third_party_attribution').should('have.value', rdmp.ethics_data_secondary_third_party_attribution);
    cy.get('#ethics_data_secondary_third_party_access_arrangements').should('have.value', rdmp.ethics_data_secondary_third_party_access_arrangements);
    cy.get('#ethics_data_secondary_third_party_other').should('have.value', rdmp.ethics_data_secondary_third_party_other);
  })
});
