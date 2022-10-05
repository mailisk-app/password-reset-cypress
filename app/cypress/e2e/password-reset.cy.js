describe("Test password reset", () => {
  let resetLink;
  const testEmailAddress = `test.${new Date().getTime()}@${Cypress.env("MAILISK_NAMESPACE")}.mailisk.net`;

  it("Should sign up a new user", () => {
    cy.visit("http://localhost:3000/register");
    cy.get("#email").type(testEmailAddress);
    cy.get("#password").type("password");
    cy.get("form").submit();
    // if the register was successful we should be redirected to the login screen
    cy.location("pathname").should("eq", "/");
  });

  it("Should login as user", () => {
    cy.get("#email").type(testEmailAddress);
    cy.get("#password").type("password");
    cy.get("form").submit();
    // if the login was successful we should be redirected to the dashboard screen
    cy.location("pathname").should("eq", "/dashboard");
  });

  it("Should reset password", () => {
    cy.visit("http://localhost:3000/forgot");
    cy.get("#email").type(testEmailAddress);
    cy.get("form").submit();
    // this will send an email with a reset link to the provided email address

    // we need to wait for the email to arrive
    // mailiskSearchInbox will automatically keep retrying until an email matching the prefix arrives
    // by default it also has a from_timestamp that prevents older emails from being returned by accident
    // find out more here: https://docs.mailisk.com/guides/cypress.html#usage
    cy.mailiskSearchInbox(Cypress.env("MAILISK_NAMESPACE"), { to_addr_prefix: testEmailAddress }).then((response) => {
      const emails = response.data;
      const email = emails[0];
      resetLink = email.text.match(/.*\[(http:\/\/localhost:3000\/.*)\].*/)[1];
      expect(resetLink).to.not.be.undefined;
    });
  });

  it("Should visit reset link and set new password", () => {
    cy.visit(resetLink);
    cy.get("#new-password").type("newpassword");
    cy.get("form").submit();
    // if the reset was successful we should be redirected to the login screen
    cy.location("pathname").should("eq", "/");
  });

  it("Should login as user with new password", () => {
    cy.get("#email").type(testEmailAddress);
    cy.get("#password").type("newpassword");
    cy.get("form").submit();
    // if the login was successful we should be redirected to the dashboard screen
    cy.location("pathname").should("eq", "/dashboard");
  });
});
