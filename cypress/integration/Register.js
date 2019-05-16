
describe('Register Checklist', function() {
    /*--------------------------------------------
    Verify Account/Sign In link are available in header 
    before any test else the whole test will fail.
    --------------------------------------------*/
    before (() => {
        //visit BaseURL from Json file
        cy.clearCookie('SHOP_SESSION_TOKEN')
        cy.visit("")
        // Check header for the login link 
        cy.wait(1500)
        cy.get('body').then(($a) => { 
            if ($a.text().includes('Sign In')) {
                cy.contains('Sign In')
                .click({force:true})
                .wait(1000)
            } else if ($a.text().includes('Account')) { 
                cy.contains('Account')
                .click({force:true})  
                .wait(1000)
            } else {
                cy.get('.navUser-item--account .navUser-action').click({force:true})
            }
        })    

    });
    /*--------------------------------------------
    Before each test retrieve data from fixture 
    --------------------------------------------*/
    beforeEach(() => {
        cy.fixture("login").as("login");
        
        
    });

    /*--------------------------------------------
    Verify Create Account/ Register is visible with 
    'login.php?action=create_account' and click it 
    --------------------------------------------*/
    it.skip('Verify Create Account/Register is accessible', function() {
        cy.get('div.new-customer a')
        .should('have.attr', 'href','/login.php?action=create_account')
        .should('be.visible')
        .click()
        cy.wait(1500)
    });

    /*--------------------------------------------
    Verify First Name Field is required 
    --------------------------------------------*/
    it('Verify First Name Field is required ', function() {
        cy.get('#FormField_4_input').then(($el) => { 
            if ($el.attr('aria-required')==='true') {
            cy.get("#FormField_4_input").should('have.attr','aria-required', 'true')
            cy.get('#FormField_4')
            .contains('*')
            .should('be.visible')
            
            }
        })
    });

    /*--------------------------------------------
    Verify Last Name Field is required 
    --------------------------------------------*/
    it('Verify Last Name Field is required ', function() {
        cy.get('#FormField_5_input').then(($el) => { 
            if ($el.attr('aria-required')==='true') {
            cy.get("#FormField_5_input").should('have.attr','aria-required', 'true')
            cy.get('#FormField_5')
            .contains('*')
            .should('be.visible')
            
            }
        })
    });

    /*--------------------------------------------
    Verify Email Field is required 
    --------------------------------------------*/
    it('Verify Email Name Field is required ', function() {
        cy.get('#FormField_1_input').then(($el) => { 
            if ($el.attr('aria-required')==='true') {
            cy.get("#FormField_1_input").should('have.attr','aria-required', 'true')
            cy.get('#FormField_1')
            .contains('*')
            .should('be.visible')
            
            }
        })
    });

    /*--------------------------------------------
    Verify Password Field is required 
    --------------------------------------------*/
    it('Verify Password Field is required ', function() {
        cy.get('#FormField_2_input').then(($el) => { 
            if ($el.attr('aria-required')==='true') {
            cy.get("#FormField_2_input").should('have.attr','aria-required', 'true')
            cy.get('#FormField_2')
            .contains('*')
            .should('be.visible')
            
            }
        })
    });

    /*--------------------------------------------
    Verify Confirm Password Field is required 
    --------------------------------------------*/
    it('Verify Confirm password Field is required ', function() {
        cy.get('#FormField_3_input').then(($el) => { 
            if ($el.attr('aria-required')==='true') {
            cy.get("#FormField_3_input").should('have.attr','aria-required', 'true')
            cy.get('#FormField_3')
            .contains('*')
            .should('be.visible')
            
            }
        })
    });

    /*--------------------------------------------
    Verify Address line 1 Field is required 
    --------------------------------------------*/
    it('Verify Address line 1 Field is required ', function() {
        cy.get('#FormField_8_input').then(($el) => { 
            if ($el.attr('aria-required')==='true') {
            cy.get("#FormField_8_input").should('have.attr','aria-required', 'true')
            cy.get('#FormField_8')
            .contains('*')
            .should('be.visible')
            
            }
        })
    });

    /*--------------------------------------------
    Verify Suburb/City Field is required 
    --------------------------------------------*/
    it('Verify Suburb/City Field is required ', function() {
        cy.get('#FormField_10_input').then(($el) => { 
            if ($el.attr('aria-required')==='true') {
            cy.get("#FormField_10_input").should('have.attr','aria-required', 'true')
            cy.get('#FormField_10')
            .contains('*')
            .should('be.visible')
            
            }
        })
    });   
    /*--------------------------------------------
    Verify Country Field is required 
    --------------------------------------------*/
    it('Verify Country Field is required ', function() {
        cy.get('#FormField_11_select').then(($el) => { 
            if ($el.attr('aria-required')==='true') {
            cy.get("#FormField_11_select").should('have.attr','aria-required', 'true')
            .select(this.login[0].address.country) 
            cy.get('#FormField_11')
            .contains('*')
            .should('be.visible')
            
            }
        })
    });    


    /*--------------------------------------------
    Verify STATE/PROVINCE Select Field is required 
    --------------------------------------------*/
    it('Verify STATE/PROVINCE Select Field is required ', function() {
        
        cy.get('#FormField_12 .form-select').then(($el) => { 
            if ($el.attr('aria-required')==='true') {
            cy.get(".form-select").should('have.attr','aria-required', 'true')
            cy.get('#FormField_12 label')
            .contains('*')
            .should('be.visible')
            }
        })
        
    }); 
    /*--------------------------------------------
    Verify Zip/Postcode Field is required 
    --------------------------------------------*/
    it('Verify Zip/Postcode Field is required ', function() {

        cy.get('#FormField_13_input').then(($el) => { 
            if ($el.attr('aria-required')==='true') {
            cy.get("#FormField_13_input").should('have.attr','aria-required', 'true')
            cy.get('#FormField_13')
            .contains('*')
            .should('be.visible')

            }
        })
    });

    /*--------------------------------------------
    Verify Phone Number Field if required or not 
    --------------------------------------------*/
    it('Verify Phone Number Field IF required or NOT', function() {
        cy.get('#FormField_7_input').then(($el) => { 
            if ($el.attr('aria-required')==='true') {
                cy.get('#FormField_7_input').should('have.attr','aria-required', 'true')
                cy.get('#FormField_7')
                .contains('*')
                .should('be.visible')
                cy.task('log','Mandatory')
            } else  {
                cy.get('#FormField_7_input').should('have.attr','aria-required', 'false')
                cy.task('log','Phone Number field is Not Mandatory')
            }
        })
    });



    /*--------------------------------------------
    Password should have a minimum character limit
    There should be a field to confirm the password. 
    The system should verify that the two passwords entered, match. 
    --------------------------------------------*/
    it('Password & Confirm Password fields verifications', function() {
        
        //Verify error message if only numeric entered
        cy.get('#FormField_2_input')
        .clear()
        .type('123456789')
        cy.get('#FormField_2 .form-inlineMessage')
        .contains('Passwords must be at least 7 characters and contain both alphabetic and numeric characters.')
        .should('be.visible')
        cy.task('log','Verify error message if only numeric entered')

        //Verify error message if only alphabetic entered
        cy.get('#FormField_2_input')
        .clear()
        .type('qwertyasd')
        cy.get('#FormField_2 .form-inlineMessage')
        .contains('Passwords must be at least 7 characters and contain both alphabetic and numeric characters.')
        .should('be.visible')
        cy.task('log','Verify error message if only alphabetic entered')

        //Verify error message if less than 7 characters entered
        cy.get('#FormField_2_input')
        .clear()
        .type('qwer12')
        cy.get('#FormField_2 .form-inlineMessage')
        .contains('Passwords must be at least 7 characters and contain both alphabetic and numeric characters.')
        .should('be.visible')
        cy.task('log','Verify error message if less than 7 characters entered')

        //Verify password doesn't match
        cy.get('#FormField_2_input')
        .clear()
        .type('qwer12345')
        cy.get('#FormField_3_input')
        .clear()
        .type('qwer123')
        cy.get('#FormField_3 .form-inlineMessage')
        .contains('Your passwords do not match.')
        .should('be.visible')
        cy.task('log','Verify error message if confirm password doesn\'t match password field')

        //Verify password field & Confirm Password fields Match
        cy.get('#FormField_2_input')
        .clear()
        .type('qwer12345')
        cy.get('#FormField_3_input')
        .clear()
        .type('qwer12345')

        cy.get('#FormField_2_input').invoke('val').then(fstElement => {
            cy.get('#FormField_3_input').should('have.value', fstElement)
        })
        cy.get('#FormField_2_input').clear()
        cy.get('#FormField_3_input').clear()
        cy.task('log','Verify no error message when confirm password field matchs password field')

    });

    /*--------------------------------------------
    Verify Phone Number format 
    --------------------------------------------*/
    it('Verify Phone Number format', function() {
        cy.get('#FormField_7_input')
        .clear()
        .type('131-223-1231')
        cy.get('#FormField_7_input')
        .invoke('val')
        .should('match', /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/)
    });

    /*--------------------------------------------
    Verify email format 
    --------------------------------------------*/
    it('Verify email format', function() {
        cy.get('#FormField_1_input')
        .clear()
        .type('test')
        //cy.wait(500)
        cy.get('#FormField_1 .form-inlineMessage', {requestTimeout: 2000})
        .should('be.visible')

        cy.get('#FormField_1_input')
        .clear()
        .type('test@.')
        //cy.wait(500)
        cy.get('#FormField_1 .form-inlineMessage', {requestTimeout: 2000})
        .should('be.visible')

        cy.get('#FormField_1_input')
        .clear()
        .type('test@dsfs.cdf')
        //cy.wait(500)
        cy.get('#FormField_1_input', {requestTimeout: 2000})
        .invoke('val')
        .should('match', /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)

    });

    /*--------------------------------------------
    Registering with already exist user
    --------------------------------------------*/
    it('Register with existing user', function() {
        cy.reload()
        //First Name
        cy.get('#FormField_4_input')
        .clear()
        .type(this.login[0].firstName)

        //Last Name
        cy.get('#FormField_5_input')
        .clear()
        .type(this.login[0].lastName)
        
        //email
        cy.get('#FormField_1_input')
        .clear()
        .type(this.login[0].email)

        //Password
        cy.get('#FormField_2_input')
        .clear()
        .type(this.login[0].password)  

        //Confirm Password 
        cy.get('#FormField_3_input')
        .clear()
        .type(this.login[0].password) 

        //address line 1
        cy.get('#FormField_8_input')
        .clear()
        .type(this.login[0].address.suite + ' ' + this.login[0].address.street)

        //address line 2
        cy.get('#FormField_9_input')
        .clear()
        .type(this.login[0].address.address2)

        //City
        cy.get('#FormField_10_input')
        .clear()
        .type(this.login[0].address.city) 

        //Country
        cy.get('#FormField_11_select')
        .select(this.login[0].address.country)
        cy.wait(2000)

        //state
        cy.get('#FormField_12 .form-select')
        .select(this.login[0].address.state) 

        //postal code
        cy.get('#FormField_13_input')
        .clear()
        .type(this.login[0].address.postalcode) 

        //phone number
        cy.get('#FormField_7_input')
        .clear()
        .type(this.login[0].phone) 

        //Company
        cy.get('#FormField_6_input')
        .clear()
        .type(this.login[0].company.name) 

        cy.get('form')
        .contains('Create Account')
        .click()
        //cy.wait(1000)
        cy.get('.alertBox--error .alertBox-message', {requestTimeout: 2000}).should('be.visible')

    });

    /*--------------------------------------------
    Registering with New  user
    --------------------------------------------*/
    it('Register New user', function() {

        var arr = this.login.length
        var i = arr - 1

        //First Name
        cy.get('#FormField_4_input')
        .clear()
        .type(this.login[i].firstName)

        //Last Name
        cy.get('#FormField_5_input')
        .clear()
        .type(this.login[i].lastName)
        
        //email
        cy.get('#FormField_1_input')
        .clear()
        .type(this.login[i].email)

        //Password
        cy.get('#FormField_2_input')
        .clear()
        .type(this.login[i].password)  

        //Confirm Password 
        cy.get('#FormField_3_input')
        .clear()
        .type(this.login[i].password) 

        //address line 1
        cy.get('#FormField_8_input')
        .clear()
        .type(this.login[i].address.suite + ' ' + this.login[i].address.street)

        //address line 2
        cy.get('#FormField_9_input')
        .clear()
        .type(this.login[i].address.address2)

        //City
        cy.get('#FormField_10_input')
        .clear()
        .type(this.login[i].address.city) 

        //Country
        cy.get('#FormField_11_select')
        .select(this.login[i].address.country)
        cy.wait(2000)

        //state
        cy.get('#FormField_12 .form-select')
        .select(this.login[i].address.state) 

        //postal code
        cy.get('#FormField_13_input')
        .clear()
        .type(this.login[i].address.postalcode) 

        //phone number
        cy.get('#FormField_7_input')
        .clear()
        .type(this.login[i].phone) 

        //Company
        cy.get('#FormField_6_input')
        .clear()
        .type(this.login[i].company.name) 

        cy.get('form')
        .contains('Create Account')
        .click()
        //cy.wait({requestTimeout: 2000})
        cy.url({requestTimeout: 10000}).should('include', '/login.php?action=account_created')

    });
   
    /*--------------------------------------------
    Logging with New user Credentials 
    --------------------------------------------*/
    it('Logging with New user Credentials', function() {
        
        cy.loginPage()

        var arr = this.login.length
        var i = arr - 1

        cy.get('#login_email')
        .clear()
        .type(this.login[i].email)
        //.type('test@examplecom')
        cy.get('#login_pass')
        .clear()
        .type(this.login[i].password)
        cy.get('.login-form').submit()

        cy.get('ul.navBar-section').should('be.visible')

    });

    /*--------------------------------------------
    Verify recaptcha iframe is visible 
    --------------------------------------------
    it('Verify if iframe reCaptcha is available', function() {
        cy.get("iframe").should('be.visible')
    });*/


})