
describe('Login.php Functionality Automation Tests - Login, Logout, Reset, Register', function() {

    before (() => {
        cy.visit('')
        cy.accessAccountPage({timeout: 60000});
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
    context('Forget Password Form Functionality', () => {

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

    context('Login Form Functionality', () => {

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

    context("Logout Functionality", () =>{
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
        
        it('Access the SignIn Page', function() {
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
        
        context("Verify Fields Format", () => {
            context("Password & confirm Password fields verification process", () => {
                it("Only Numeric Characters", function() {
                    formatVerification(this.registerElements.passwordInput, '123456789', this.registerElements.passwordInlineMessage,this.registerData.passwordInlineMessage)
                })

                it("Only alphabetic Characters", function() {
                    formatVerification(this.registerElements.passwordInput, 'qwertyqwerty', this.registerElements.passwordInlineMessage,this.registerData.passwordInlineMessage)
                })

                it("Less than 7 characters", function() {
                    formatVerification(this.registerElements.passwordInput, 'qwer12', this.registerElements.passwordInlineMessage,this.registerData.passwordInlineMessage)
                })

                it("Passwords don't match", function() {
                    formatVerification(this.registerElements.passwordInput, 'qwerty12345', " "," ", this.registerElements.confirmPasswordInput, 'qwerty123', this.registerElements.confirmPasswordInlineMessage,this.registerData.confirmPasswordInlineMessage)
                })

                it("Matching Password", function(){
                    cy.get(this.registerElements.passwordInput).clear().type('qwerty12345')
                    cy.get(this.registerElements.confirmPasswordInput).clear().type('qwerty12345')
                    cy.get(this.registerElements.passwordInput).invoke('val').then(fstElement => {
                        cy.get(this.registerElements.confirmPasswordInput).should('have.value', fstElement)
                    })
                    cy.get(this.registerElements.passwordInput).clear()
                    cy.get(this.registerElements.confirmPasswordInput).clear()
                })
            })

            context("Email field verification process", () => {
                it('Invalid email format', function() {
                    cy.get(this.registerElements.emailInput)
                    .clear()
                    .type(this.users.invalidUser.email)
                    verifyTextContent(this.registerElements.emailInlineMessage, this.registerData.emailInlineMessage)
                })

                it('Valid email format', function() {
                    cy.get(this.registerElements.emailInput)
                    .clear()
                    .type(this.users.registeredUser.email)
                    cy.get(this.registerElements.emailInput, {requestTimeout: 6000})
                    .invoke('val')
                    .should('match', /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)
                })
            })
        })

        context("Submitting the registration form", () =>{
            it('Register with existing user', function() {
                cy.reload()
                cy.fillInputForm({element: this.registerElements.firstNameInput, text:  this.users.registeredUser.firstName});
                cy.fillInputForm({element: this.registerElements.lastNameInput, text:  this.users.registeredUser.lastName});
                cy.fillInputForm({element: this.registerElements.emailInput, text:  this.users.registeredUser.email})
                cy.fillInputForm({element: this.registerElements.phoneInput, text:  this.users.registeredUser.phone})
                cy.fillInputForm({element: this.registerElements.passwordInput, text:  this.users.registeredUser.password}),
                cy.fillInputForm({element: this.registerElements.confirmPasswordInput, text:  this.users.registeredUser.password}),
                cy.fillInputForm({element: this.registerElements.addressLine1Input, text:  this.users.registeredUser.address.street+' '+this.users.registeredUser.address.suite})
                cy.fillInputForm({element: this.registerElements.addressLine2Input, text:  this.users.registeredUser.address.address2}),
                cy.fillSelectForm({element: this.registerElements.countrySelect, text:  this.users.registeredUser.address.country}),
                cy.fillInputForm({element: this.registerElements.cityInput, text:  this.users.registeredUser.address.city}),
                cy.fillSelectForm({element: this.registerElements.stateSelect, text:  this.users.registeredUser.address.state}),
                cy.fillInputForm({element: this.registerElements.postalCodeInput, text:  this.users.registeredUser.address.postalCode}),
                cy.fillInputForm({element: this.registerElements.companyNameInput, text:  this.users.registeredUser.company.name})
                cy.get('form')
                .contains('Create Account')
                .click()
                
                cy.get('.alertBox--error .alertBox-message', {timeout: 6000}).should('be.visible')
                .invoke('text')
                .should('contain', this.registerData.formErrorMessage1+" "+this.users.registeredUser.email+" "+this.registerData.formErrorMessage2)
            })

            it('Register new user', function() {
                cy.reload()
                cy.fillInputForm({element: this.registerElements.firstNameInput, text:  this.users.newUser.firstName});
                cy.fillInputForm({element: this.registerElements.lastNameInput, text:  this.users.newUser.lastName});
                cy.fillInputForm({element: this.registerElements.emailInput, text:  this.users.newUser.email})
                cy.fillInputForm({element: this.registerElements.phoneInput, text:  this.users.newUser.phone})
                cy.fillInputForm({element: this.registerElements.passwordInput, text:  this.users.newUser.password}),
                cy.fillInputForm({element: this.registerElements.confirmPasswordInput, text:  this.users.newUser.password}),
                cy.fillInputForm({element: this.registerElements.addressLine1Input, text:  this.users.newUser.address.street+' '+this.users.newUser.address.suite})
                cy.fillInputForm({element: this.registerElements.addressLine2Input, text:  this.users.newUser.address.address2}),
                cy.fillSelectForm({element: this.registerElements.countrySelect, text:  this.users.newUser.address.country}),
                cy.fillInputForm({element: this.registerElements.cityInput, text:  this.users.newUser.address.city}),
                cy.fillSelectForm({element: this.registerElements.stateSelect, text:  this.users.newUser.address.state}),
                cy.fillInputForm({element: this.registerElements.postalCodeInput, text:  this.users.newUser.address.postalCode}),
                cy.fillInputForm({element: this.registerElements.companyNameInput, text:  this.users.newUser.company.name})
                cy.get('form')
                .contains('Create Account')
                .click()
                //cy.wait({requestTimeout: 2000})
                cy.url({requestTimeout: 10000}).should('include', '/login.php?action=account_created')
                cy.get(this.registerElements.createdAccountPageHeading, {requestTimeout: 6000})
                .should('be.visible', {timeout: 6000})
            })

            it('Confirm New User Registeration by Signing In NewUser', function() {
                cy.logout();
                cy.accessAccountPage()
                cy.signIn({email: this.users.newUser.email, password: this.users.newUser.password });
                cy.url().should('include', 'account.php')
                verifyTextContent(this.myAccountElements.accountPageHeading, this.myAccountData.accountPageHeading)
            })
        })
    })
})



//Used for Password Verification
function formatVerification(inputElement, text, msgElement, msg, pass2inputElement, pass2Text, pass2MsgElement, pass2Msg){
    cy.get(inputElement)
    .clear()
    .type(text)
    if (msgElement!== " "){
        cy.get(msgElement, {requestTimeout: 6000})
        .contains(msg)
        .should('be.visible')
    }
    if (pass2inputElement !== undefined && pass2inputElement!== null) {
        cy.get(pass2inputElement)
        .clear()
        .type(pass2Text)
        cy.get(pass2MsgElement, {requestTimeout: 6000})
        .contains(pass2Msg)
        .should('be.visible')
    }
}



//Verify if required fields have the required attribute set to true and the 
//Asterisk is visible
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
    cy.get(el, {requestTimeout: 6000})
    .should('be.visible', {timeout: 6000})
    .invoke('text')
    .should('include', data)
}