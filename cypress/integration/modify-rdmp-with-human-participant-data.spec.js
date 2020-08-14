const expect = require('chai').expect
import {loggable} from 'cypress-pipe'

// cypress-pipe does not retry any Cypress commands
// so we need to click on the element using
// jQuery method "$el.click()" and not "cy.click()"
let count = 0
const click = $el => {
  count += 1;
  return $el.click();
}

describe('Fill RDMP', function () {
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const rdmp = Cypress.env('rdmp');

  const dmpt_ethics_identifiable = 'Will any data or information be individually identifiable or potentially re-identifiable (i.e. include codes) at any stage of the research?';
  const dmpt_ethics_human_participant_data_individual = 'Will the data that you collect from or about individuals include';
  const dmpt_ethics_human_participant_data_severity_risk = 'Outline the potential severity and type of risk to participants from accidental disclosure of the data';
  const dmpt_ethics_identifiable_other_countries = 'If you are collecting data from residents of countries other than Australia, which countries?';
  const dmpt_ethics_identifiable_deidentify = 'Will you de-identify the data?';

  // Not needed in this spec
  // beforeEach(() => {
  //   cy.restoreLocalStorage();
  // });
  // afterEach(() => {
  //   cy.saveLocalStorage();
  // });

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
    cy.wait(500);
    cy.contains('View/Update RDMPs').click({force: true});
    cy.url().should('include', '/default/rdmp/dashboard/rdmp');
    cy.contains('RDMPs');
    cy.wait(500);
  });
  it('shoud get first rdmp', function () {
    cy.contains(rdmp.title).first().click();
    cy.wait(500);
    cy.contains('Edit this plan').click();
  });
  it('check ethics tab', function () {
    cy.get('a[href="#ethics"]').click().as('ethics');
    cy.get('#ethics_describe_human_participant_data').should('be.checked');
  });
  it('should alert a confirmation box and click NO', function () {
    cy.get('#ethics_describe_human_participant_data').click();
    cy.contains(dmpt_ethics_human_participant_data_individual);
    cy.contains(dmpt_ethics_identifiable);
    cy.wait(500);
    cy.get('#modal_ethics_describe')
      .should('be.visible')
      .contains('button', 'No')
      .pipe(click)
      .then(_ => {
        // Use count for debuging and finding out how long it took to find the element.
        cy.log(`clicked ${count} times`);
        count = 0;
      })
      .should('not.be.visible');
    cy.wait(500);
    cy.get('#ethics_human_participant_data_severity_risk').should('have.value', rdmp.ethics_human_participant_data_severity_risk);
    cy.get('#ethics_identifiable_other_countries').should('have.value', rdmp.ethics_identifiable_other_countries);
    cy.get('a[href="#dataCollection"]').click().wait(500).should('be.visible');
    cy.wait(500);
    cy.get('#ethics_identifiable_data').should('have.value', rdmp.ethics_identifiable_data);
    cy.get('#ethics_identifiable_collection_other_text').should('have.value' ,rdmp.ethics_identifiable_collection_other_text);
    cy.get('#ethics_identifiable_storage_other_text').should('have.value', rdmp.ethics_identifiable_storage_other_text);
    cy.get('#ethics_identifiable_transfered_out_yes_text').should('have.value', rdmp.ethics_identifiable_transfered_out_yes_text);
    cy.get('#ethics_identifiable_storage_other_text').should('have.value', rdmp.ethics_identifiable_storage_other_text);
    cy.get('#ethics_identifiable_deidentify_no_text').should('have.value', rdmp.ethics_identifiable_deidentify_no_text);
    // Switch back to ethics to continue
    cy.get('a[href="#ethics"]').click().wait(500).should('be.visible');
  });
  it('should alert a confirmation box and click YES', function () {
    cy.get('#ethics_human_participant_data_personal_no').click();
    cy.get('#ethics_identifiable_no').click();
    cy.wait(500);
    cy.get('#modal_ethics_identifiable')
      .should('be.visible')
      .wait(500)
      .contains('button', 'Yes')
      .pipe(click)
      .then(_ => {
        // Use count for debuging and finding out how long it took to find the element.
        cy.log(`clicked ${count} times`);
        count = 0;
      })
      .should('not.be.visible');
    cy.get('#ethics').should('not.have.value', dmpt_ethics_human_participant_data_individual);
    cy.get('#ethics').should('not.have.value', dmpt_ethics_identifiable);
    cy.get('a[href="#dataCollection"]').click().as('dataCollection');
    cy.get('#dataCollection').should('not.have.value', '#ethics_identifiable_data');
    cy.get('#dataCollection').should('not.have.value', '#ethics_identifiable_collection');
    cy.get('#dataCollection').should('not.have.value', '#ethics_identifiable_collection_other_text');
    cy.get('#dataCollection').should('not.have.value', '#ethics_identifiable_storage');
    cy.get('#dataCollection').should('not.have.value', '#ethics_identifiable_storage_other_text');
    cy.get('#dataCollection').should('not.have.value', '#ethics_identifiable_transfered_out');
    cy.get('#dataCollection').should('not.have.value', '#ethics_identifiable_transfered_out_yes_text');
    cy.get('#dataCollection').should('not.have.value', '#ethics_identifiable_storage_other_text');
    cy.get('#dataCollection').should('not.have.value', '#ethics_identifiable_deidentify');
    cy.get('#dataCollection').should('not.have.value', '#ethics_identifiable_deidentify_no_text');
    // Switch back to ethics to continue
    cy.get('a[href="#ethics"]').click().as('ethics');
  })

  it('should alert a confirmation box for ethics identifiable and click NO', function () {
    cy.get('#ethics_identifiable_yes').click();
    cy.wait(500);
    cy.get('#ethics_human_participant_data_severity_risk').type(rdmp.ethics_human_participant_data_severity_risk);
    cy.get('#ethics_identifiable_other_countries').type(rdmp.ethics_identifiable_other_countries)
    cy.wait(500);
    cy.get('#ethics_identifiable_no').click();
    cy.get('#ethics').should('not.have.value', dmpt_ethics_human_participant_data_severity_risk);
    cy.get('#ethics').should('not.have.value', dmpt_ethics_identifiable_other_countries);
    cy.wait(500);
    cy.get('#modal_ethics_identifiable')
      .should('be.visible')
      .contains('button', 'No')
      .wait(500)
      .pipe(click)
      .then(_ => {
        // Use count for debuging and finding out how long it took to find the element.
        cy.log(`clicked ${count} times`);
        count = 0;
      })
      .should('not.be.visible');
  });
  it('should alert a confirmation box for ethics identifiable and click YES', function () {
    cy.get('#ethics_identifiable_yes').should('be.checked');
    cy.contains(dmpt_ethics_human_participant_data_severity_risk);
    cy.contains(dmpt_ethics_identifiable_deidentify);
    cy.wait(500);
    cy.get('#ethics_identifiable_no').click();
    cy.get('#modal_ethics_identifiable')
      .should('be.visible')
      .wait(500)
      .contains('button', 'Yes')
      .pipe(click)
      .then(_ => {
        // Use count for debuging and finding out how long it took to find the element.
        cy.log(`clicked ${count} times`);
        count = 0;
      })
      .should('not.be.visible');
    cy.get('#ethics').should('not.have.value', dmpt_ethics_human_participant_data_severity_risk);
    cy.get('#ethics').should('not.have.value', dmpt_ethics_identifiable);
    cy.wait(500);
    cy.get('#ethics_identifiable_yes').click();
    cy.get('#ethics_human_participant_data_severity_risk').should('not.have.value');
  });
});
