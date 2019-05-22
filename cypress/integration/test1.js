Cypress.Cookies.debug(true)


describe('register User', function () {
   /*------------------------------------------------
   Before each Dashboard test, sign-in to an account
   ------------------------------------------------*/
   before(() => {
       // cy.fixture(‘/users/zadminPP’, { timeout: 3000 }).as(‘zadmin’);
       // cy.signIn({ email: this.zadmin[0].email, password: this.zadmin[0].password });
       //cy.contains(‘h1’, ‘Sign In’)
       //cy.visit("https://zadmin.partnerportal.arcticleaf.co")
       //cy.clearCookies()
   })
it('test', function(){
    cy.visit('https://zadmin.partnerportal.arcticleaf.co/register')
})

   it('checks Register form submission with correct input', function () {
       // cy.get(‘#firstName’).type(‘Arctic’);
       // cy.get(‘#lastName’).type(‘Leaf’);
       // cy.get(‘#phone’).type(‘1234567890’);
       // cy.get(‘#email’).type(‘testcustomer123324234@example.io’);
       // cy.get(‘#companyName’).type(‘Arctic Leaf’);
       //cy.visit('https://zadmin.partnerportal.arcticleaf.co/register')
       //cy.visit('https://zadmin.partnerportal.arcticleaf.co/register')
       cy.get(":nth-child(3) > .nav-link").click()
       cy.wait(2000)
       cy.get("#firstName").type("test")
       cy.get("#lastName").type("world")
           cy.get("#phone").type("6127211999")
       cy.get("#email").type("test@inbox.com")
       cy.get("#companyName").type("Hello World!")
       cy.get(".btn").click()
       //cy.get(‘#id’)
       // cy.get(‘h1’).should(‘contain’, ‘Register’)
   })
})