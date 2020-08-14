describe('Fill RDMP', function () {
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const rdmp = Cypress.env('rdmp2');

  const dmpt_ethics_identifiable = 'Will any data or information be individually identifiable or potentially re-identifiable (i.e. include codes) at any stage of the research?';
  const ethics_human_participant_data_personal = 'Will the data that you collect from or about individuals include personal information';

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
    cy.contains('Create RDMP').click({force: true});
    cy.url().should('include', '/default/rdmp/record/rdmp/edit');
    cy.contains('People');
    cy.wait(3000);
  });

  it('Should fill project', function () {
    cy.get('#title').type(rdmp.title, {release: true});
  });
  it('Should fill identifier', function () {
    cy.get('#dc\\:identifier').type(rdmp.id, {release: true, force: true});
  });
  it('Should fill description', function () {
    cy.get('#description').type(rdmp.description, {release: true});
  });
  it('Should switch tabs to people', function () {
    cy.get('a[href="#people"]').click();
    cy.wait(1000);
  });
  it('Should input a CI', function () {
    cy.get('#people').find('input').first().type(rdmp.ci_name, {
      force: true,
      delay: 0,
      log: true
    });
    cy.get('#people')
      .find('div.completer-dropdown')
      .should('include.text', rdmp.ci_name).click();
    cy.wait(2000);
  });
  it('Should switch tabs to ethics', function () {
    cy.get('a[href="#ethics"]').click().as('ethics');
    cy.wait(1000);
  });
  it('Tick Indigenous cultural and intellectual property', function () {
    cy.get('#ethics_describe_indigenous_cultural_intelectual_property').click();
    cy.get('#ethics_describe_other').click();
  });
  it('tick Human Participant Data', function () {
    cy.get('#ethics_describe_human_participant_data').click();
    cy.contains(dmpt_ethics_identifiable);
    cy.contains(ethics_human_participant_data_personal);
    cy.get('#ethics_identifiable_yes').click();
    cy.get('#ethics_human_participant_data_personal_yes').click();
    cy.get('#ethics_human_participant_data_sensitive_personal_no').click();
    cy.get('#ethics_human_participant_data_health_no').click();
    cy.get('#ethics_human_participant_data_severity_risk').type('None');
  });
  it('ethics approval no', function () {
    cy.get('#ethics_approval_no').click();
  })
  it('Should switch tabs to ethics', function () {
    cy.get('a[href="#dataCollection"]').click();
    cy.wait(1000);
    cy.get('#vivo\\:Dataset_redbox\\:DataCollectionMethodology').type('collection methodology');
    cy.get('#vivo\\:Dataset_dc_format').type('xls');
    cy.get('#ethics_identifiable_data').type('excel files');
    cy.get('#ethics_identifiable_collection_eresearch_store').click();
    cy.get('#ethics_identifiable_collection_others').click();
    cy.contains('Please specify other means of collection');
    cy.get('#ethics_identifiable_informed_consent_publish_no').click();
    cy.get('#ethics_identifiable_transfered_out_no').click();
    cy.get('#ethics_identifiable_deidentify_no').click();
    cy.get('#ethics_identifiable_deidentify_no_text').type('De identify no text');
  });
  it('Should switch tabs to data retention and disposal', function () {
    cy.get('a[href="#retention"]').click();
  });
  it('Minimum retention period (*)', function () {
    cy.get('#redbox\\:retentionPeriod_dc\\:date').select('5years');
  });
  it('Have you made commitments to destroy part of the data prior to end of retention period (e.g original recordings, linking/code files)? (*)', function () {
    cy.get('#ethics_data_destroy_after_retention_no').click();
  });
  it('Should switch tabs to Access and rights', function () {
    cy.get('a[href="#ownership"]').click();
    cy.wait(1000);
  });
  it('Access after the project will be', function () {
    cy.get('#dc\\:accessRights_Open\\ access\\ under\\ license').click();
  });
  it('Copyright and intellectual property owners of data created in project', function () {
    cy.get('#dc\\:rightsHolder_dc\\:name').select('student');
  });
  it('Tick Indigenous cultural and intellectual property', function () {
    cy.get('#ethics_indigenous_data_ownership').type(rdmp.ethics_indigenous_data_ownership);
    cy.get('#ethics_indigenous_data_access').type(rdmp.ethics_indigenous_data_access);
  });

  it('Should save', function () {
    cy.get('save-button').contains('Save').click().then(() => {
      cy.contains('Saved successfully.');
    });
  })
});
