describe('Broken Links Test', function() {



    it('HomePage Broken Links Test', function(){
        cy.visit('')
        const todaysDate = Cypress.moment().format('MMM DD, YYYY')
        let name = this._runnable.title+'-'+todaysDate;
        cy.brokenLinks({name: name})
    })
    it('Category Page Broken Links Test', function(){
        cy.visit('categories')
        const todaysDate = Cypress.moment().format('MMM DD, YYYY')
        let name = this._runnable.title+'-'+todaysDate;
        cy.brokenLinks({name: name})
    })
})