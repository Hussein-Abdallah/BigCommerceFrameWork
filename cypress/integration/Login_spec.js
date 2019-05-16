describe('Login.php Functionality Automation Tests - Login, Logout, Reset, Register', function() {

    before (() => {
        cy.visit("", {timeout: 60000})
        cy.accessAccountPage();
        cy.fixture("BaseElements/loginElements", {timeout: 30000}).as("loginElements");
        cy.fixture("BaseElements/forgetPasswordElements", {timeout: 30000}).as("forgetPasswordElements");
        cy.fixture("BaseElements/myAccountElements", {timeout: 30000}).as("myAccountElements");
        cy.fixture("BaseElements/registerElements", {timeout: 30000}).as("registerElements");
        cy.fixture("Data/loginData", {timeout: 30000}).as("loginData");
        cy.fixture("Data/forgetPasswordData", {timeout: 30000}).as("forgetPasswordData");
        cy.fixture("Data/registerData", {timeout: 30000}).as("registerData");
        cy.fixture("Data/myAccountData", {timeout: 30000}).as("myAccountData");
        cy.fixture("Data/users", {timeout: 30000}).as("users")

    });
    context.skip('Forget Password Form Functionality', () => {

        it('Access the login Page', function() {
            cy.accessAccountPage();
            cy.url().should('include', 'login.php')
            verifyTextContent(this.loginElements.loginPageHeading, this.loginData.loginPageHeading)
        })

        it('Check if the link is Visible', function() {
            cy.get(this.loginElements.forgetPasswordLink,{timeout: 6000})
            .should('be.visible') 
            .should('have.attr', 'href')
        });

        it('Access the forget Password form and verify it is visible', function() {
            cy.get(this.loginElements.forgetPasswordLink)
            .click({timeout: 6000})
            cy.url().should('include', 'reset_password')
        })

        it('Verify form doesn\'t accept empty fields', function() {
            cy.forgetPassword({email: ''})
            verifyTextContent(this.forgetPasswordElements.alertWarningMessage, this.forgetPasswordData.invalidForgetFormAlert)
        });

        it('Forget Password Form with invalid email', function() {
            cy.forgetPassword({email: this.forgetPasswordData.invalidEmail})
            verifyTextContent(this.forgetPasswordElements.alertWarningMessage, this.forgetPasswordData.invalidForgetFormAlert)
        });

        it('Forget Password Form with unregistered email', function() {
            cy.forgetPassword({email: this.users.unregisteredUser.email})
            verifyTextContent(this.forgetPasswordElements.alertErrorMessage, this.forgetPasswordData.forgetFormErrorMessage)
        });

        it('Forget Password Form with registered email', function() {
            cy.forgetPassword({email: this.users.registeredUser.email})
            verifyTextContent(this.forgetPasswordElements.alertSuccessMessage, this.forgetPasswordData.forgetFormSuccessMessage)
            cy.get(this.loginElements.signInForm).should('be.visible')
            verifyTextContent(this.loginElements.loginPageHeading, this.loginData.loginPageHeading)
        });

        
    })

    context.skip('Login Form Functionality', () => {

        it('Access the login Page', function() {
            cy.visit("", {timeout: 60000})
            cy.accessAccountPage();
            cy.url().should('include', 'login.php')
            verifyTextContent(this.loginElements.loginPageHeading, this.loginData.loginPageHeading)
            
        })

        it('Login Form Functionality with empty fields', function() {
            cy.signIn({email: '',password:''});
            verifyTextContent(this.loginElements.emailInlineMessage, this.loginData.usernameWarningMessage)
            verifyTextContent(this.loginElements.passwordInlineMessage, this.loginData.passwordWarningMessage)
        })

        it('Login Form Functionality with invalid Credentials', function() {
            cy.signIn({email: this.users.invalidUser.email, password: this.users.invalidUser.password });
            verifyTextContent(this.loginElements.emailInlineMessage, this.loginData.usernameWarningMessage)
        });

        it('Login Form Functionality with Unregistered User', function() {
            cy.signIn({email: this.users.unregisteredUser.email, password: this.users.unregisteredUser.password });
            verifyTextContent(this.loginElements.loginAlertErrorMessage, this.loginData.errorMessage)
        });

        it('Login Form Functionality with Registered User email and no password', function() {
            cy.signIn({email: this.users.registeredUser.email,password: ''});
            verifyTextContent(this.loginElements.passwordInlineMessage, this.loginData.passwordWarningMessage)
        });

        it('Login Form Functionality with Registered User', function() {
        
            cy.signIn({email: this.users.registeredUser.email, password: this.users.registeredUser.password });
            cy.url().should('include', 'account.php')
            verifyTextContent(this.myAccountElements.accountPageHeading, this.myAccountData.accountPageHeading)
        });
    })

    context.skip("Logout Functionality", () =>{
        it('Access the Login Page and Verify', function() {
            cy.visit("", {timeout: 60000})
            cy.accessAccountPage();
            cy.url().should('include', 'login.php')
            verifyTextContent(this.loginElements.loginPageHeading, this.loginData.loginPageHeading)
            cy.signIn({email: this.users.registeredUser.email, password: this.users.registeredUser.password });
            cy.url().should('include', 'account.php')
            verifyTextContent(this.myAccountElements.accountPageHeading, this.myAccountData.accountPageHeading)
            
        })

        it('Logout Button functionality', function() {
            cy.logout()
            verifyTextContent(this.loginElements.loginAlertSuccessMessage, this.loginData.logoutMessage)
        });
    })

    context("Register Form Functionality", () =>{
        
        it.skip('Access the login Page', function() {
            cy.visit("", {timeout: 60000})
            cy.accessAccountPage();
            cy.url().should('include', 'login.php')
            verifyTextContent(this.loginElements.loginPageHeading, this.loginData.loginPageHeading)
            
        })

        it('Navigate to Register Form and verify visibility', function() {
            verifyTextContent(this.loginElements.registerDivHeader, this.loginData.registerDivHeader)
            cy.get(this.loginElements.registerButton)
            .should('have.attr', 'href', this.loginData.registerLink)
            .should('be.visible')
            .click()
        });
        context("Form Fields Required Attribute and Asterisk", () =>{
            it('First Name', function() {
                verifyFieldAttributes(this.registerElements.firstNameInput, this.registerElements.firstNameLabel)
            });

            it('Last Name', function() {
                verifyFieldAttributes(this.registerElements.lastNameInput, this.registerElements.lastNameLabel)
            });

            it('Email', function() {
                verifyFieldAttributes(this.registerElements.emailInput, this.registerElements.emailLabel)
            });

            it('Password', function() {
                verifyFieldAttributes(this.registerElements.passwordInput, this.registerElements.passwordLabel)
            });

            it('Confirm Password', function() {
                verifyFieldAttributes(this.registerElements.confirmPasswordInput, this.registerElements.confirmPasswordLabel)
            });
            
            it('Address Line 1', function() {
                verifyFieldAttributes(this.registerElements.addressLine1Input, this.registerElements.addressLine1Label)
            });

            it('City', function() {
                verifyFieldAttributes(this.registerElements.cityInput, this.registerElements.cityLabel)
            });

            it('Country', function() {
                verifyFieldAttributes(this.registerElements.countrySelect, this.registerElements.countryLabel)
            });

            it('State', function() {
                verifyFieldAttributes(this.registerElements.stateSelect, this.registerElements.stateLabel)
            });

            it('Phone Number', function() {
                verifyFieldAttributes(this.registerElements.phoneInput, this.registerElements.phoneLabel)
            });
        })
        
    })
})











function verifyFieldAttributes(inputElement, element){
    cy.get(inputElement).then(($el) => { 
        if (expect($el).to.have.attr('aria-required', 'true')) {
            cy.get(element)
            .contains('*')
            .should('be.visible')
        }
    })
}


function verifyTextContent(el, data) {
    cy.get(el)
    .should('be.visible', {timeout: 6000})
    .invoke('text')
    .should('contain', data)
}