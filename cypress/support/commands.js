// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
import 'cypress-wait-until';

//
// -- This is a parent command --
Cypress.Commands.add("signIn", ({email, password}) => { 

    if(email === '') {
    cy.get('#login_email').clear()
    } else {
        cy.get('#login_email').clear().type(email)
    }
    if(password === '') {
        cy.get('#login_pass').clear()
    }else {
        cy.get('#login_pass').clear().type(password)
    }
    cy.get('.login-form').submit()

 })

 Cypress.Commands.add("logout", () => { 

    cy.get('.navUser a').then(($a) => { 

        if ($a.text().includes('Sign Out')) {
            cy.get('.navUser a').contains('Sign Out').should('have.attr', 'href', '/login.php?action=logout').click({force:true, timeout: 6000})
        } else if ($a.text().includes('Sign out')) { 
            cy.get('.navUser a').contains('Sign out').should('have.attr', 'href', '/login.php?action=logout').click({force:true, timeout: 6000})
        } else if ($a.text().includes('Logout')) { 
            cy.get('.navUser a').contains('Logout').should('have.attr', 'href', '/login.php?action=logout').click({force:true, timeout: 6000})
        } else {
            cy.get('.navUser a').contains('LOGOUT').should('have.attr', 'href', '/login.php?action=logout').click({force:true, timeout: 6000})
        }
    })
 })


//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("forgetPassword", ({email}) => { 
    cy.get('form.forgot-password-form')
    .should('be.visible')
    
    if(email === '') {
        cy.get('form.forgot-password-form').get('#email').clear()
    } else {
        cy.get('form.forgot-password-form').get('#email').clear().type(email)
    }
    cy.get('form.forgot-password-form').submit()

 });

 //function to insert text into fields
Cypress.Commands.add("fillInputForm", ({element, text}) =>{
    cy.get(element)
        .clear()
        .type(text)
})

Cypress.Commands.add("fillSelectForm", ({element, text}) => {
    cy.get(element)
    .select(text)
    cy.wait(1000)
})

 Cypress.Commands.add("accessAccountPage",()=>{
    cy.get('body', {timeout:60000}).then(($a) => { 
        if ($a.text().includes('Login')) { 
            cy.contains('Login')
            .click({force:true, timeout:30000})
            
        } else if ($a.text().includes('Sign In')) { 
            cy.contains('Sign In')
            .click({force:true, timeout:30000})  

        } else if ($a.text().includes('Account')) {
            cy.contains('Account')
            .click({force:true, timeout:30000})

        }else {
            cy.get('.navUser-item--account .navUser-action').click({force:true, timeout:30000})
        }
    })    
 });

 Cypress.Commands.add("brokenLinks",()=>{
     
    let name = this.test.fullTitle();
    cy.writeFile(name+'.csv','ID, Name, Link, Locatio, Status\n', { encoding: 'utf-8'})
    cy.get('a').each(function ($a, x =0) {
        x++
        var stat;
        if ($a.attr('href') !== null && $a.attr('href') !== undefined && $a.attr('href') !== ""){

            cy.request({url: $a.attr('href'), failOnStatusCode: false}).then((resp)=>{
                stat = resp.status;

                var link = $a.attr('href')
                var linkText = $a.text().replace(/\,/g,"");
                cy.writeFile(name+'.csv',x+","+linkText.trim()+","+link.trim()+","+stat+ '\n', { encoding: 'utf-8', flag: 'a+' })
            })
        } else {
                if($a.attr('href') !== null) {
                    stat = 'Null';
                } else if ($a.attr('href') !== undefined) {
                    stat = 'Undefined';
                } else if ($a.attr('href') !== "") {
                    stat = 'Empty URL'
                } else {
                    stat = 'Unknown Reason'
                }
            cy.writeFile(name+'.csv',x+","+$a.text().replace(/\,/g,"").trim()+","+$a.attr('href')+', Null \n', { encoding: 'utf-8', flag: 'a+' })
        }
    })


});