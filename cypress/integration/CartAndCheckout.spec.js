import { Context } from "mocha";

Cypress.Cookies.debug(true)

Cypress.Cookies.defaults({
    whitelist: 'SHOP_SESSION_TOKEN'
})
var i = 0;
    for (i = 0; i < 5 ; i++) { 
    }
describe('Functionality Tests ', function() {
    let product, productTitle
    before (() => {
        cy.clearCookie('SHOP_SESSION_TOKEN')
        cy.visit('categories') 

        cy.fixture("BaseElements/homePageElements", {timeout: 30000}).as("homePageElements");
        cy.fixture("BaseElements/productElements", {timeout: 30000}).as("productElements");
        cy.fixture("BaseElements/cartElements", {timeout: 30000}).as("cartElements");
        cy.fixture("Data/homePageData", {timeout: 30000}).as("homePageData");
        cy.fixture("Data/cartData", {timeout: 30000}).as("cartData");

        cy.get('#product-listing-container ul>li.product').then (($list) =>{
            product = Math.floor(Math.random() * ($list.length - 1))
        })

    });

    after(()=>{
        cy.clearCookie('SHOP_SESSION_TOKEN')
    })

    context('Cart functionality', () => {
        it('Verify Cart is empty', function() {
            cy.get(this.cartElements.cartElement)
            .click()
    
            cy.waitUntil(() =>cy.get(this.cartElements.cartEmptyBody)
            .invoke('text')
            .should('contain', this.cartData.cartEmptyMessage))
        });

        it('Access a Random Product Page', function() {
            
            cy.get(this.productElements.CategoryProductCard)
            .eq(product)
            .click({force:true, timeout:60000})
            
        });
        /*--------------------------------------------
        Verify Size option is avilable, select a random size else log size option is not available
        --------------------------------------------*/
        it('Verify if Size option is available', function() {
            cy.get('form[data-cart-item-add]')
            .then (($options) =>{
                if ($options.find('[data-product-attribute-name="Size"][type="radio"] ').length) {
                    cy.get('[data-product-attribute-name="Size"] [type="radio"]').then(($sizeOptions) =>{
                        var sxl = $sizeOptions.length
                        var sizes2 = Math.floor(Math.random() * ($sizeOptions.length-1)) 
                        cy.log('sizes', sxl + " " + sizes2)
                        cy.get('[data-product-attribute-name="Size"] [type="radio"]').eq(sizes2).check({force:true})
                    })
                } else if ($options.find('[data-product-attribute-name="Size"]>select>option').length){
                    cy.get('[data-product-attribute-name="Size"]>select>option').then(($sizeOptions) =>{
                        var optionslength = $sizeOptions.length
                        var sizes3 = Math.floor(Math.random() * ($sizeOptions.length-1)) 
                        cy.get('[data-product-attribute-name="Size"]>select>option').eq(sizes3).then(($selectoption) =>{
                            cy.get('[data-product-attribute-name="Size"]>select')
                            .select($selectoption.text(),{force:true})
                        })
                    })
                }
                else {
                    cy.log('Size option is not available')
                }
            })
        });
        /*--------------------------------------------
        Verify Color option is avilable, select a random Color else log Color option is not available
        --------------------------------------------*/
        it('Verify if Color option is available', function() {
            cy.get('form[data-cart-item-add]')
            .then (($options) =>{
                if ($options.find('[data-product-attribute-name="Color"]').length) {
                    cy.get('[data-product-attribute-name="Color"] [type="radio"]').then(($colorOptions) =>{
                        var sxl = $colorOptions.length
                        var sizes2 = Math.floor(Math.random() * ($colorOptions.length-1)) 
                        cy.log('sizes', sxl + " " + sizes2)
                        cy.get('[data-product-attribute-name="Color"] [type="radio"]').eq(sizes2).check({force:true})
                    })
                } else {
                    cy.log('Color option is not available')
                }
            })
        });

        it('Add & Verify Product in Drop down Cart', function() {
            cy.get(this.productElements.productTitle).then(($productName)=>{
                productTitle = $productName.text();
                cy.get(this.productElements.addToCartForm)
                .should('have.attr','type', 'submit')
                .click({force:true, responseTimeout:60000})
                cy.wait(1500)
                cy.waitUntil(() => cy.get(this.cartElements.cartDropdownHeaderVisibility).should('be.visible'));

                cy.get(this.cartElements.cartElement).then(($dropdownCart)=>{
                    if ($dropdownCart.attr('aria-expanded')==='true'){
                        cy.get(this.productElements.productTitle).then(($productName)=>{
                            cy.get(this.cartElements.productTitleDropdownCart).should('contain', productTitle)
                        })
                    } else {

                        cy.get(this.productElements.productTitle).then(($productName)=>{
                            cy.get(this.cartElements.cartElement).click()
                            cy.get(this.cartElements.productTitleDropdownCart).should('contain', productTitle)
                        })
                    }
                
                });
            })
        })

        it('Go to Cart Page and verify product added', function() {
            cy.get(this.cartElements.dropdownViewCartButton)
            .click()
            cy.get(this.cartElements.productTitle).should('contain', productTitle)
        })

        it('Verify the cart badge had been updated to 1', function() {

            cy.get(this.cartElements.cartBadge)
            .then (($cartQty) =>{
                if ($cartQty.text().includes('1')) {
                    expect($cartQty).to.have.text('1')
                } else {
                    cy.log('No quantity badge on the cart icon')
                }
            })    
        });

        /* Adding same product one more time. */
        it('Add same product one more', function() {
            cy.location().then((loc) => {
                if(loc.pathname !== '/cart.php'){
                    cy.visit('cart.php')
                } 
            })
            //Require Re-writing test script for variation      
            cy.get('body').then(($body)=>{
                if ($body.find('.definitionList').length){
                    cy.get('.definitionList').then(($list) =>{
                        if ($list.find('.definitionList-key').text().includes('Size')){
                            var size = $list.find('.definitionList-value').first().text()
                            size = size.replace(/\s/g,''); 
                        }
                        if ($list.find('.definitionList-key').text().includes('Color')){
                            var color = $list.find('.definitionList-value').last().text()
                            color = color.replace(/\s/g,''); 
                        }
    
                        cy.get('.cart-item-name > a')
                        .click()
    
                        cy.get('form[data-cart-item-add]').then (($options) =>{
                            if ($options.find('[data-product-attribute-name="Size"][type="radio"] ').length) {
                                cy.get('[data-product-attribute-name="Size"] [type="radio"]').then(($sizeOptions) =>{
                                    cy.get('[data-product-attribute-name="Size"] [type="radio"]').check(size, {force:true})
                                })
                            } else if ($options.find('[data-product-attribute-name="Size"]>select>option').length){
                                        cy.get('[data-product-attribute-name="Size"]>select')
                                        .select(size, {force:true})
                            }
                            else {
                                cy.log('Size option is not available')
                            }
                        })
                        cy.get('form[data-cart-item-add]').then (($options) =>{
                            if ($options.find('[data-product-attribute-name="Color"]').length) {
                                cy.get('[data-product-attribute-name="Color"] [type="radio"]').then(($colorOptions) =>{
                                    cy.get('[title='+color+']').parent('label').then(($colorVal)=>{
                                        var cValue = $colorVal.attr('data-product-attribute-value')
                                        cy.get('[data-product-attribute-name="Color"] [type="radio"]').check(cValue, {force:true})
                                    })
                                })
                            } else {
                                cy.log('Color option is not available')
                            }
                        })
                    
    
                    })
                } else {
                    cy.get('.cart-item-name > a')
                    .click()
                }  
            })
            cy.get(this.productElements.productTitle).then(($productName)=>{
                var productTitle = $productName.text();
    
                cy.get(this.productElements.productPrice).first().then(($price)=>{
                        
                    var price = $price.text()
                    price = Number(price.replace(/[^0-9.-]+/g,""));
                    cy.get(this.productElements.addToCartForm)
                    .should('have.attr','type', 'submit')
                    .click({force:true, responseTimeout:60000})
                    cy.wait(2000)
                    cy.waitUntil(() => cy.get(this.cartElements.cartDropdownHeaderVisibility).should('be.visible'));
    
                    cy.get(this.cartElements.dropdownViewCartButton)
                    .click()
    
                    cy.get(this.cartElements.productTitle).should('have.text', productTitle)
    
                    cy.get(this.cartElements.productQuantity)
                    .should('have.value', '2')
    
                    cy.get(this.cartElements.productTotalPrice)
                    .should('have.text', '$'+price*2)   
                })

            })
        })     

        it('verify cart badge quantity eq 2', function(){
            cy.get(this.cartElements.cartBadge)
            .then (($cartQty) =>{
                expect($cartQty).to.have.text('2')
            })   
        })

        it('Verify checkout button is visible', function() {
            cy.get(this.cartElements.checkoutButton)
            .should('contain', this.cartData.checkoutButton)
        })

        context('Verify Coupon Code functionality', () => {
            it('Verify Invalid Coupon is Not Accepted', function() {
                cy.waitUntil(() => cy.get(this.cartElements.addCouponCodeElement).click())
                cy.get(this.cartElements.couponCodeField).type(this.cartData.invalidCouponData)
                cy.get(this.cartElements.couponCodeForm).submit()
                cy.get(this.cartElements.invalidCouponErrorMessage).should('have.text',this.cartData.invalidCouponErrorMessage)
                cy.get(this.cartElements.confirmCouponErrorMessage).click()
                cy.get(this.cartElements.couponCodeField).clear()
                cy.get(this.cartElements.closeCouponForm).click()
            })

            it('Verify Valid Coupon is Accepted', function() {
                cy.waitUntil(() => cy.get(this.cartElements.addCouponCodeElement).click())
                cy.get(this.cartElements.couponCodeField).type(this.cartData.validCouponData)
                cy.get(this.cartElements.submitCouponForm).submit()
                cy.wait(2000)
                cy.waitUntil(()=> cy.get(this.cartElements.appliedCouponCodeRow).should('have.length', 4), {
                    timeout:8000,
                    interval:500
                })
                cy.waitUntil(()=> cy.get(this.cartElements.appliedCouponCodeRow).contains(this.cartData.validCouponData).should('be.visible'), {
                    timeout:8000,
                    interval:500
                })

                cy.get(this.cartElements.subtotalPrice).then(($subtotal)=>{
                    var subtotal = $subtotal.text()
                    subtotal = Number(subtotal.replace(/[^0-9.-]+/g,""));
                    cy.get(this.cartElements.couponDiscountAmount).then(($coupon)=>{
                        var coupon = $coupon.text()
                        coupon = Number(coupon.replace(/[^0-9.-]+/g,""));
                        var orderTotal = subtotal + coupon
                        cy.get(this.cartElements.grandTotal)
                        .should('have.text','$'+orderTotal.toFixed(2))
                    })
                })
        
                cy.get(this.cartElements.removeAppliedCoupon)
                .should('be.visible')
                .and('contain', this.cartData.couponRemoveButton) 
                .click()
        
                cy.get(this.cartElements.couponCodeLabel)
                .contains(this.cartData.couponCodeLabel).should('be.visible')
            })
        })
    })
})

describe('Checkout Functionality Tests', function() {
    let product, productTitle
    before (() => {
        cy.clearCookie('SHOP_SESSION_TOKEN')
        cy.visit('categories') 

        cy.fixture("BaseElements/homePageElements", {timeout: 30000}).as("homePageElements");
        cy.fixture("BaseElements/productElements", {timeout: 30000}).as("productElements");
        cy.fixture("BaseElements/cartElements", {timeout: 30000}).as("cartElements");
        cy.fixture("Data/homePageData", {timeout: 30000}).as("homePageData");
        cy.fixture("Data/cartData", {timeout: 30000}).as("cartData");

        cy.get('#product-listing-container ul>li.product').then (($list) =>{
            product = Math.floor(Math.random() * ($list.length - 1))
        })

    });

    after(()=>{
        cy.clearCookie('SHOP_SESSION_TOKEN')
    })

    context('Cart functionality', () => {
        it('Verify Cart is empty', function() {
        })
    })
})