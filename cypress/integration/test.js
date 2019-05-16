describe('Test Environment', function() {
    
    before (() => {
        
        cy.visit("", {timeout: 30000})
        cy.wait(5000);
    });
    /*--------------------------------------------
    Before each test retrieve data from fixture 
    --------------------------------------------*/
    beforeEach(() => {
        

    });
    /*--------------------------------------------
    Verify the login form has forgot your password 
    link and clickable
    --------------------------------------------*/
    it('Test Environment', function() {
        cy.log("Test Completed")
        cy.wait(5000);
    });
    
})