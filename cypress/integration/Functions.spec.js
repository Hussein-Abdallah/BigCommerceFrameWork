describe('Functionality Tests', function() {
    before (() => {
        cy.clearCookie('SHOP_SESSION_TOKEN')
        //https://www.jpbbox.com/
        //https://gregnormancollection.com/
        //https://www.trainingmask.com/
        //https://groupaeng.arcticleaf.co/
        cy.visit("") 
        
    });

    beforeEach(() => {
        cy.fixture("product").as("product");
        cy.fixture("messages").as("messages");
    });

    context('Search Functionality Tests', () => {
        it('Locate & Submit the search form', function() {
            cy.get('header a[data-search="quickSearch"]')
            .then (($search) =>{
                if ($search.attr('aria-expanded')==='false') {
                    $search.click()
                    cy.get('#search_query-dropdown')
                    .and('be.visible')
                    .type(this.product[0].productTitle)
                    .type('{enter}')
                } else {
                    cy.get('#search_query-nav')
                    .type(this.product[0].productTitle)
                    .type('{enter}')
                }
            });
            
        });

        it('Verify the product is available in the search results', function() {
            cy.get('a').contains(this.product[0].productTitle)
            .should('be.visible')
            .click()
        });

        it('Access and verify the product details page', function() {
            cy.get('h1').contains(this.product[0].productTitle)
            .should('be.visible')
        });

        it('locate & submit empty search form', function() {
            cy.get('header a[data-search="quickSearch"]')
            .then (($search) =>{
                if ($search.attr('aria-expanded')==='false') {
                    $search.click()
                    cy.get('#search_query-dropdown')
                    .and('be.visible')
                    .type(' ')
                    .type('{enter}')
                } else {
                    cy.get('#search_query-nav')
                    .type(' ')
                    .type('{enter}')
                }
            });
        });

        it('Verify inline message', function() {
            cy.get('h4').contains(this.messages.emptySearch)
            .should('be.visible')
        });
    })
})
