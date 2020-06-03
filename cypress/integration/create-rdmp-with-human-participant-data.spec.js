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
  });
  it('Should input email of CI', function () {
    cy.get('#people').find('input[formcontrolname="email"]').first().type(rdmp.ci_email, {
      force: true,
      delay: 0
    });
    cy.wait(2000);
  });
  it('Should switch tabs to ethics', function () {
    cy.get('a[href="#ethics"]').click().as('ethics');
    cy.wait(1000);
  });
  it('tick Human Participant Data', function () {
    cy.get('#ethics_describe_human_participant_data').click();
    cy.contains('Will the data that you collect from individuals include (*)');
    cy.contains('Is any data or information individually identifiable or potentially re-identifiable (i.e. includes codes)?');
  });
  it('tick Sensitive personal information ', function () {
    cy.get('#ethics_human_participant_data_individual_personal').click();
  });
  it('tick ethics_identifiable ', function () {
    cy.get('#ethics_identifiable').click();
    cy.contains('Outline the potential severity and type of risk to participants from accidental disclosure of the data');
    cy.contains('If you are collecting data from residents of countries other than Australia, which countries?');
  });
  it('Outline the potential severity and type of risk to participants from accidental disclosure of the data', function () {
    cy.get('#ethics_human_participant_data_severity_risk').type(rdmp.ethics_human_participant_data_severity_risk);
  });
  it('If you are collecting data from residents of countries other than Australia, which countries?', function () {
    cy.get('#ethics_identifiable_other_countries').type(rdmp.ethics_identifiable_other_countries);
  });
  it('Should switch tabs to ethics', function () {
    cy.get('a[href="#dataCollection"]').click();
    cy.wait(1000);
  });
  it('Please provide a brief description of your data collection methodology', function () {
    cy.get('#vivo\\:Dataset_redbox\\:DataCollectionMethodology').type('collection methodology');
  });
  it('Predominant file format(s), e.g. xls, txt (*)', function () {
    cy.get('#vivo\\:Dataset_dc_format').type('xls');
  });
  it('What platforms or tools will you use to collect or import identifiable or re-identifiable data?', function () {
    cy.get('#ethics_identifiable_collection_eresearch_store').click();
  });
  it('What platforms or tools will you use to collect or import identifiable or re-identifiable data? - others', function () {
    cy.get('#ethics_identifiable_collection_others').click();
    cy.contains('Please specify other means of collection');
  });
  it('Please specify other means of collection', function () {
    cy.get('#ethics_identifiable_collection_other_text').type(rdmp.ethics_identifiable_collection_other_text);
  });
  it('Where will identifiable or re-identifiable data be stored?', function () {
    cy.get('#ethics_identifiable_storage_onedrive').click();
  });
  it('Please specify other means of collection', function () {
    cy.get('#ethics_identifiable_storage_other').click();
    cy.contains('Please specify other means of storage');
    cy.get('#ethics_identifiable_storage_other_text').type(rdmp.ethics_identifiable_storage_other_text)
  });
  it('Will you be seeking prior informed consent to publish identifiable participant data?', function () {
    cy.get('#ethics_identifiable_informed_consent_publish_no').click();
    cy.contains('What additional security will be applied to identifiable data:');
    cy.get('#ethics_identifiable_additional_security_physical_lock').click();
  });
  it('Will identifiable data be transferred in or out of secure UTS storage (e.g. in from linkage agency, out for transcription)?', function () {
    cy.get('#ethics_identifiable_transfered_out_yes').click();
    cy.contains('Describe how you will maintain data security during transfer:');
    cy.get('#ethics_identifiable_transfered_out_yes_text').type(rdmp.ethics_identifiable_transfered_out_yes_text);
  });
  it('Will you de-identify the data?', function () {
    cy.get('#ethics_identifiable_deidentify_no').click();
    cy.contains('Explain why you will not be able to de-identify the data');
    cy.get('#ethics_identifiable_deidentify_no_text').type(rdmp.ethics_identifiable_deidentify_no_text);
  });
  it('Should switch tabs to data retention and disposal', function () {
    cy.get('a[href="#retention"]').click();
  });
  it('Minimum retention period (*)', function () {
    cy.get('#redbox\\:retentionPeriod_dc\\:date').select('5years');
  });
  it('Have you made commitments to destroy part of the data prior to end of retention period (e.g original recordings, linking/code files)? (*)', function () {
    cy.get('#ethics_data_destroy_after_retention_yes').click();
    cy.contains('Which data?');
    cy.get('#ethics_data_destroy_after_retention_what').type('code files');
    cy.contains('When should it be destroyed?').siblings('datetime').find('input').type(`${rdmp.ethics_data_destroy_after_retention_when}{enter}`, {force: true});
  });
  it('If participant data will be retained for secondary use by yourself or shared with other researchers, will you obtain:', function () {
    cy.get('#dmpt_ethics_dc_access_rights_data_retained_secondary_extended_consent').click();
  });
  it('Should switch tabs to Access and rights', function () {
    cy.get('a[href="#ownership"]').click();
    cy.wait(1000);
  });
  it('Copyright and intellectual property owners of data created in project', function () {
    cy.get('#dc\\:rightsHolder_dc\\:name').select('student');
  });
  it('Access after the project will be', function () {
    cy.get('#dc\\:accessRights_not\\ available\\ due\\ to\\ sensitivities').click();
    cy.contains('Briefly state why the data cannot be available');
    cy.get('#dmpt_ethics_dc_access_rights_not_available').type(rdmp.dmpt_ethics_dc_access_rights_not_available);
  });
  it('Are you using any secondary or third-party data?', function () {
    cy.get('#ethics_data_secondary_third_party_yes').click();
    cy.contains('Is the data:');
    cy.get('#ethics_data_secondary_third_party_held_publicly_held_commonwealth').click();
    cy.get('#ethics_data_secondary_third_party_held_publicly_held_international').click();
    cy.contains('Have the data custodian/s, if any, agreed to provide access to the data for use in the proposed research?');
    cy.get('#ethics_data_secondary_third_party_custodians_no').click();
    cy.contains('What ownership agreement governs your use of the data?');
    cy.get('#ethics_data_secondary_third_party_ownership_type_commercial_license').click();
    cy.contains('If your access & use is governed by a license or other agreement, outline any special requirements that we need to be aware of regarding:');
    cy.get('#ethics_data_secondary_third_party_security').type(rdmp.ethics_data_secondary_third_party_security);
    cy.get('#ethics_data_secondary_third_party_disposal').type(rdmp.ethics_data_secondary_third_party_disposal);
    cy.get('#ethics_data_secondary_third_party_attribution').type(rdmp.ethics_data_secondary_third_party_attribution);
    cy.get('#ethics_data_secondary_third_party_access_arrangements').type(rdmp.ethics_data_secondary_third_party_access_arrangements);
    cy.get('#ethics_data_secondary_third_party_other').type(rdmp.ethics_data_secondary_third_party_other);
  });
  it('Should save', function () {
    cy.get('save-button').contains('Save').click().then(() => {
      cy.contains('Saved successfully.');
    });
  })
});
