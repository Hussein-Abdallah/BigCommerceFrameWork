describe('Functionality Tests', function() {
    before (() => {
        cy.visit("") 
        cy.fixture("BaseElements/productElements", {timeout: 30000}).as("productElements");
        cy.fixture("BaseElements/homePageElements", {timeout: 30000}).as("homePageElements");
        cy.fixture("Data/productData", {timeout: 30000}).as("productData");
        cy.fixture("Data/homePageData", {timeout: 30000}).as("homePageData");
        
       
    });

    beforeEach(() => {

    });

    context('Search Functionality Tests', () => {

        it('Submit empty search form and verify Error inline message', function() {
            cy.get(this.homePageElements.searchInputElement)
            .type(' ')
            .type('{enter}', {timeout:60000})
            cy.get(this.homePageElements.emptySearchHeader).contains(this.homePageData.emptySearch)
            .should('be.visible')
        });

        it('Search for a Product', function() {
            cy.get(this.homePageElements.searchInputElement)
            .type(this.productData.productTitle)
            .type('{enter}')
        });

        it('verify product in the search result and click on it', function() {
            cy.get('a').contains(this.productData.productTitle)
            .should('be.visible')
            .click()
        });

        it('verify the clicked product in the search is the same opened Url', function() {
            cy.get(this.productElements.productTitle).contains(this.productData.productTitle)
            .should('be.visible')
            cy.url().should('include', this.productData.productUrl)
        });

        

    })

    context('Product Page functionality', ()=>{
        it('Verify image changes based on selected thumbnail', function() {
            cy.get('body').then (($body) =>{
                if ($body.find(this.productElements.productThumbnailList).length) {
                    cy.get(this.productElements.productThumbnails).then (($lis) =>{
                        var thumb
                        thumb = Math.floor(Math.random() * ($lis.length))
                        cy.get(this.productElements.productThumbnailsLinks).eq(thumb)
                        .click()
                        .invoke('attr','href').then(($imagesrc)=>{
                            cy.get(this.productElements.mainImage).should('have.attr','src',$imagesrc)
                        })                    
                    })
                } else {
                    cy.log('Thumbnails aren\'t available')
            }
        })
        })
    })


    context('Footer Test', ()=>{
        it('Verify Footer visibility', function() {
            cy.get('footer').should('be.visible')
        }); 
    
        it('Check Copyright message', function() {
            cy.get(this.homePageElements.copyrightMessageElement).last().invoke('text').should('contain', this.homePageData.copyrightMessage)
        });
    
        it('Check Social Media Icons visibility and log URLs', function() {
            cy.get(this.homePageElements.footerSocialElement)
            .each(($li)=>{
                cy.task('log',$li.text())
                cy.task('log',$li.attr('href'))
            })
            .should('be.visible')
        });
    })

})
