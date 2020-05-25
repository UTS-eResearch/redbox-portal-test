### redbox-portal end to end testing using Cypress.io framework

Used with config-uts-feature-ethics test the creation of data management plans using cypress

### How to run:

- install 
```
npm install
```
- open cypress
```
export cypress_username=USERNAME cypress_password=PASSWORD && npm run cypress:open
```
(use set cypress_username=USERNAME cypress_password=PASSWORD) for windows

- run headless
```
npm run cypress:run --env cypress_username=USERNAME,cypress_password=PASSWORD
```

This will open cypress app and list specs run

- config

cypress.json

base url app:
```json
{
  "baseUrl": "http://localhost:1500"
}
```
cypress/support/index.js
White list sails.sid csrf cookie
```js
Cypress.Cookies.defaults({
    whitelist: 'sails.sid'
});
```
Use restore and save local storage:
```js
beforeEach(() => {
    cy.restoreLocalStorage();
});
afterEach(() => {
    cy.saveLocalStorage();
});
```

Login with CSRF with command added to cypress/support/commands; Example:
```js
cy.loginByCSRF(_csrf, username, password)
    .then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.include('Welcome to Stash');
    });
```
