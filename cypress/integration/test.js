describe('Test Environment', function() {
    
    before (() => {
        
        cy.visit("", {timeout: 30000})
        
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
        cy.log(cy.url())
        cy.wait(5000);
 
    });
    
})