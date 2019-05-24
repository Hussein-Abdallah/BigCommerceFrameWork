import { Context } from "mocha";
import { AssertionError } from "assert";

Cypress.Cookies.debug(true)

Cypress.Cookies.defaults({
    whitelist: 'SHOP_SESSION_TOKEN'
})
var i = 0;
    for (i = 0; i < 1 ; i++) { 
    
describe('Functionality Tests '+i, function() {
    let product, productTitle, shippingMethod
    before (() => {
        cy.clearCookie('SHOP_SESSION_TOKEN')
        cy.visit('categories') 

        cy.fixture("BaseElements/homePageElements", {timeout: 30000}).as("homePageElements");
        cy.fixture("BaseElements/productElements", {timeout: 30000}).as("productElements");
        cy.fixture("BaseElements/cartElements", {timeout: 30000}).as("cartElements");
        cy.fixture("BaseElements/checkoutElements", {timeout: 30000}).as("checkoutElements");
        cy.fixture("Data/homePageData", {timeout: 30000}).as("homePageData");
        cy.fixture("Data/cartData", {timeout: 30000}).as("cartData");
        cy.fixture("Data/checkoutData", {timeout: 30000}).as("checkoutData");
        cy.fixture("Data/users", {timeout: 30000}).as("users")

        cy.get('#product-listing-container ul>li.product').then (($list) =>{
            product = Math.floor(Math.random() * ($list.length - 1))
        })

    });

    after(()=>{
        cy.clearCookie('SHOP_SESSION_TOKEN')
    })

    context.skip('Cart functionality', () => {
        it('Verify Cart is empty', function() {
            cy.get(this.cartElements.cartElement, {timeout: 30000})
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
                cy.get(this.cartElements.cartDropdownHeaderVisibility, {timeout: 9000}).should('be.visible')

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

        it('Visit Cart Page and verify product added', function() {
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
                    cy.get(this.cartElements.cartDropdownElement).click({force:true})
                    cy.get(this.cartElements.cartDropdownHeaderVisibility, {timeout: 30000}).should('be.visible')
    
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
                cy.get(this.cartElements.couponCodeField).clear({force:true})
                cy.get(this.cartElements.closeCouponForm).click()
            })

            it('Verify Valid Coupon is Accepted', function() {
                cy.waitUntil(() => cy.get(this.cartElements.addCouponCodeElement).click())
                cy.get(this.cartElements.couponCodeField).type(this.cartData.validCouponData)
                cy.get(this.cartElements.submitCouponForm).submit()
                cy.get(this.cartElements.appliedCouponCodeRow, {timeout: 30000}).should('have.length', 4)
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

    context('Checkout functionality', () => {
        context('General Checkout functionality', () => {
            it('Access Checkout with Empty cart', function() {
                cy.clearCookie('SHOP_SESSION_TOKEN')
                cy.visit('checkout')
                cy.waitUntil(()=>cy.url({timeout:70000}).should('include', '/cart.php'),{
                    timeout:30000,
                    interval: 500
                })
                cy.visit('categories')
                cy.get(this.productElements.CategoryProductCard)
                .eq(product)
                .click({force:true, timeout:60000})
            });
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
            it('Access the Checkout page with a product', function() {
                
                cy.get(this.productElements.productTitle).then(($productName)=>{
                    productTitle = $productName.text();
                })
                cy.get(this.productElements.addToCartForm)
                .should('have.attr','type', 'submit')
                .click({force:true, timeout:60000})
                cy.wait(500)
                cy.visit('/checkout.php')
                cy.url().should('include', '/checkout')
            });

            it('Verify the Edit Cart visibility', function() {
    
                cy.get(this.checkoutElements.editCartButton)
                .should('be.visible')
                .should('have.attr', 'href')
            });
            it('Verify Invalid Coupon is Not Accepted', function() {
                cy.get(this.checkoutElements.couponButton)
                .click()
                cy.get(this.checkoutElements.couponCodeField).type(this.checkoutData.invalidCouponData)
                cy.get(this.checkoutElements.submitCouponButton).click()
                cy.get(this.checkoutElements.invalidCouponErrorMessage).should('have.text',this.checkoutData.invalidCouponErrorMessage)
                cy.get(this.checkoutElements.couponCodeField).clear({force:true})
            });

            it('Verify Valid Coupon is Accepted', function() {  
                cy.get(this.checkoutElements.couponCodeField).type(this.checkoutData.validCouponData)
                cy.get(this.checkoutElements.submitCouponButton).click()
                cy.waitUntil(()=> cy.get(this.checkoutElements.discountMessage).should('be.visible'), {
                    timeout:8000,
                    interval:500
                })
            });

            it('Confirm Product Name Visibility', function() {        
                cy.get(this.checkoutElements.productTitle)
                .should('be.visible')
                .should('contain', productTitle)
            });

            it('Verify Form Sections Layout - Customer is Expanded and the rest are closed', function() {        
                cy.get(this.checkoutElements.customerSection).children().then(($customer)=>{
                    expect($customer.length).to.be.greaterThan(0)
                })
                cy.get(this.checkoutElements.shippingSection).children().should('have.length',0)
                cy.get(this.checkoutElements.billingSection).children().should('have.length',0)
                cy.get(this.checkoutElements.paymentSection).children().should('have.length',0)
            });
        })

        context('Guest Checkout Form', ()=>{

            it('Complete Customer Section as Guest', function() {   
                cy.get(this.checkoutElements.emailField).type(this.users.unregisteredUser.email)
                cy.get(this.checkoutElements.guestCustomerSectionForm).submit()
                cy.wait(1000)
                cy.get(this.checkoutElements.customerSection).children().should('have.length', 0)
                cy.get(this.checkoutElements.shippingSection).children().then(($shipping)=>{
                    expect($shipping.length).to.be.greaterThan(0)
                })
            });

            it('Verify form Sections Layout - Shipping is Expanded and the rest are closed', function(){
                cy.get(this.checkoutElements.customerSection).children().should('have.length', 0)
                cy.get(this.checkoutElements.shippingSection).children().then(($shipping)=>{
                    expect($shipping.length).to.be.greaterThan(0)
                })
                cy.get(this.checkoutElements.billingSection).children().should('have.length',0)
                cy.get(this.checkoutElements.paymentSection).children().should('have.length',0)
            })

            it('Verify Shipping required Fields & Alert Messages', function() {
    
                cy.get(this.checkoutElements.shippingFormButton)
                .click({force:true})
                
                verifyFieldAttributes(this.checkoutElements.country, {timeout: 9000})
                
                cy.get(this.checkoutElements.country)
                .select(this.users.unregisteredUser.address.country, {force:true})

                verifyFieldAttributes(this.checkoutElements.firstName)
                verifyTextContent(this.checkoutElements.firstNameError,this.checkoutData.firstNameError)

                verifyFieldAttributes(this.checkoutElements.lastName)
                verifyTextContent(this.checkoutElements.lastNameError,this.checkoutData.lastNameError)

                verifyFieldAttributes(this.checkoutElements.address)
                verifyTextContent(this.checkoutElements.addressError,this.checkoutData.addressError)

                verifyFieldAttributes(this.checkoutElements.city)
                verifyTextContent(this.checkoutElements.cityError,this.checkoutData.cityError)

                verifyFieldAttributes(this.checkoutElements.state)
                verifyTextContent(this.checkoutElements.stateError,this.checkoutData.stateError)

                verifyFieldAttributes(this.checkoutElements.postalCode)
                verifyTextContent(this.checkoutElements.postalCodeError,this.checkoutData.postalCodeError)

                cy.get(this.checkoutElements.phone).then(($el)=>{
                    if($el.attr('required') === 'required') {
                        verifyFieldAttributes(this.checkoutElements.phone)
                        verifyTextContent(this.checkoutElements.phoneError,this.checkoutData.phoneError)
                    }
                })
            })
        
            it('Filling Guest Shipping Data', function() {
        
                cy.get(this.checkoutElements.address)
                .type(this.users.unregisteredUser.address.suite + ' ' + this.users.unregisteredUser.address.street, {force: true})
        
                cy.get(this.checkoutElements.address2)
                .type(this.users.unregisteredUser.address.address2, {force: true})
        
                cy.get(this.checkoutElements.city)
                .type(this.users.unregisteredUser.address.city, {force: true}) 
        
                cy.get(this.checkoutElements.state)
                .select(this.users.unregisteredUser.address.state, {force: true}) 
        
                cy.get(this.checkoutElements.postalCode)
                .type(this.users.unregisteredUser.address.postalCode, {force: true}) 
        
        
                cy.get(this.checkoutElements.firstName)
                .type(this.users.unregisteredUser.firstName,{force:true})
        
                cy.get(this.checkoutElements.lastName)
                .type(this.users.unregisteredUser.lastName, {force: true})
        
                cy.get(this.checkoutElements.company)
                .type(this.users.unregisteredUser.company.name, {force: true})
        
                cy.get(this.checkoutElements.phone)
                .type(this.users.unregisteredUser.phone, {force: true})
        
                cy.get(this.checkoutElements.comment)
                .type(this.users.unregisteredUser.comment, {force:true})
            });

            it('Select Shipping Method & Verify total price updates', function() {
                cy.get(this.checkoutElements.subtotalPrice).then(($price)=>{
                    var subtotalPrice = $price.text()
                    subtotalPrice = Number(subtotalPrice.replace(/[^0-9.-]+/g,""));

                    cy.get(this.checkoutElements.shippingMethods, {timeout: 20000}).should('be.visible')

                    cy.get(this.checkoutElements.shippingMethodsList).then (($list) =>{
                        shippingMethod = Math.floor(Math.random() * ($list.length))
                        cy.get(this.checkoutElements.shippingMethodsList)
                        .eq(shippingMethod)
                        .check({force:true, timeout:60000})

                        cy.get(this.checkoutElements.shippingMethodPrice)
                        .eq(shippingMethod).then(($shippingPrice)=>{
                            var shippingCost = $shippingPrice.text()
                            shippingCost = Number(shippingCost.replace(/[^0-9.-]+/g,""));
                            
                            cy.wait(2000)
                            cy.get(this.checkoutElements.taxPrice).then(($taxPrice)=>{
                                var taxPrice = $taxPrice.text()
                                taxPrice = Number(taxPrice.replace(/[^0-9.-]+/g,""));
                                
                                cy.get(this.checkoutElements.discountPrice).then(($discountPrice)=>{
                                    var discountPrice = $discountPrice.text()
                                    discountPrice = Number(discountPrice.replace(/[^0-9.-]+/g,""));
                                    
                                    cy.get(this.checkoutElements.totalPrice).then(($updatedPrice)=>{
                                        var updatedPrice = $updatedPrice.text()
                                        updatedPrice = Number(updatedPrice.replace(/[^0-9.-]+/g,""));
        
                                        var sum = shippingCost+subtotalPrice+taxPrice+discountPrice
                                        expect($updatedPrice).to.contain(sum.toFixed(2))
                                    })

                                })
                                

                            })
                            
                        })

                    })
                })
                
            })
            it('Uncheck and proceed to Billing Section', function() {

                cy.get(this.checkoutElements.billingCheckbox).uncheck({force:true})
                cy.get(this.checkoutElements.shippingForm).submit()

            })

            it('Verify form Sections Layout - Billing is Expanded and the rest are closed', function(){
                cy.get(this.checkoutElements.customerSection).children().should('have.length', 0)
                cy.get(this.checkoutElements.shippingSection).children().should('have.length',0)
                cy.get(this.checkoutElements.billingSection).children().then(($billing)=>{
                    expect($billing.length).to.be.greaterThan(0)
                })
                cy.get(this.checkoutElements.paymentSection).children().should('have.length',0)
            })

            it('Verify Billing required Fields & Alert Messages', function() {
    
                cy.get(this.checkoutElements.billingForm)
                .submit({force:true})
                
                verifyFieldAttributes(this.checkoutElements.country, {timeout: 9000})
                
                cy.get(this.checkoutElements.country)
                .select(this.users.unregisteredUser.address.country, {force:true})

                verifyFieldAttributes(this.checkoutElements.firstName)
                verifyTextContent(this.checkoutElements.firstNameError,this.checkoutData.firstNameError)

                verifyFieldAttributes(this.checkoutElements.lastName)
                verifyTextContent(this.checkoutElements.lastNameError,this.checkoutData.lastNameError)

                verifyFieldAttributes(this.checkoutElements.address)
                verifyTextContent(this.checkoutElements.addressError,this.checkoutData.addressError)

                verifyFieldAttributes(this.checkoutElements.city)
                verifyTextContent(this.checkoutElements.cityError,this.checkoutData.cityError)

                verifyFieldAttributes(this.checkoutElements.state)
                verifyTextContent(this.checkoutElements.stateError,this.checkoutData.stateError)

                verifyFieldAttributes(this.checkoutElements.postalCode)
                verifyTextContent(this.checkoutElements.postalCodeError,this.checkoutData.postalCodeError)

                cy.get(this.checkoutElements.phone).then(($el)=>{
                    if($el.attr('required') === 'required') {
                        verifyFieldAttributes(this.checkoutElements.phone)
                        verifyTextContent(this.checkoutElements.phoneError,this.checkoutData.phoneError)
                    }
                })
            })

            it('Filling Guest Billing Data', function() {
        
                cy.get(this.checkoutElements.address)
                .type(this.users.unregisteredUser.address.suite + ' ' + this.users.unregisteredUser.address.street, {force: true})
        
                cy.get(this.checkoutElements.address2)
                .type(this.users.unregisteredUser.address.address2, {force: true})
        
                cy.get(this.checkoutElements.city)
                .type(this.users.unregisteredUser.address.city, {force: true}) 
        
                cy.get(this.checkoutElements.state)
                .select(this.users.unregisteredUser.address.state, {force: true}) 
        
                cy.get(this.checkoutElements.postalCode)
                .type(this.users.unregisteredUser.address.postalCode, {force: true}) 
        
        
                cy.get(this.checkoutElements.firstName)
                .type(this.users.unregisteredUser.firstName,{force:true})
        
                cy.get(this.checkoutElements.lastName)
                .type(this.users.unregisteredUser.lastName, {force: true})
        
                cy.get(this.checkoutElements.company)
                .type(this.users.unregisteredUser.company.name, {force: true})
        
                cy.get(this.checkoutElements.phone)
                .type(this.users.unregisteredUser.phone, {force: true})

                cy.get(this.checkoutElements.billingForm).submit()
            });

            it('Verify form Sections Layout - Payment is Expanded and the rest are closed', function(){
                
                cy.get(this.checkoutElements.customerSection).children().should('have.length', 0)
                cy.get(this.checkoutElements.shippingSection).children().should('have.length',0)
                cy.get(this.checkoutElements.billingSection).children().should('have.length',0)
                cy.waitUntil(() => cy.get(this.checkoutElements.paymentSection).children().then(($payment)=>{
                    expect($payment.length).to.be.greaterThan(0)
                }), {
                    timeout: 8000,
                    interval: 500
                })
            })

            it('Verify Payment required Fields & Alert Messages', function() {
    
                cy.get(this.checkoutElements.paymentForm)
                .submit({force:true})

                verifyTextContent(this.checkoutElements.creditCardNumberError,this.checkoutData.creditCardNumberError)

                verifyTextContent(this.checkoutElements.creditCardExpiryError,this.checkoutData.creditCardExpiryError)

                verifyTextContent(this.checkoutElements.creditCardNameError,this.checkoutData.creditCardNameError)

                verifyTextContent(this.checkoutElements.creditCardCVVError,this.checkoutData.creditCardCVVError)
            })
            
            it('Filling Guest Payment Data', function() {

                cy.get(this.checkoutElements.creditCardNumber)
                .type(this.users.unregisteredUser.creditCard.creditCardNumber, {force:true})
                cy.get(this.checkoutElements.creditCardExpiry)
                .type(this.users.unregisteredUser.creditCard.creditCardExpiry, {force:true})
                cy.get(this.checkoutElements.creditCardName)
                .type(this.users.unregisteredUser.creditCard.creditCardName, {force:true})
                cy.get(this.checkoutElements.creditCardCVV)
                .type(this.users.unregisteredUser.creditCard.creditCardCVV, {force:true})

            });
        })

        context('Registered User Checkout Form', ()=>{
            it('Access a Product',function(){
                cy.clearCookie('SHOP_SESSION_TOKEN')
                cy.visit('categories')
                cy.get(this.productElements.CategoryProductCard)
                .eq(product)
                .click({force:true, timeout:60000})
            });
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
            it('Access the Checkout page with a product', function() {
                
                cy.get(this.productElements.productTitle).then(($productName)=>{
                    productTitle = $productName.text();
                })
                cy.get(this.productElements.addToCartForm)
                .should('have.attr','type', 'submit')
                .click({force:true, timeout:60000})
                cy.wait(500)
                cy.visit('/checkout.php')
                cy.url().should('include', '/checkout')
            });

            it('Complete Customer Section as Guest', function() { 
                cy.get(this.checkoutElements.signInButton).click()

                cy.get(this.checkoutElements.emailField).type(this.users.registeredUser.email)
                cy.get(this.checkoutElements.passwordField).type(this.users.registeredUser.password)
                cy.get(this.checkoutElements.signInForm).submit()
                cy.wait(500)
                cy.get(this.checkoutElements.customerSection, {timeout: 20000}).children().should('have.length', 0)
                cy.get(this.checkoutElements.shippingSection).children().then(($shipping)=>{
                    expect($shipping.length).to.be.greaterThan(0)
                })
            });

            it('Verify form Sections Layout - Shipping is Expanded and the rest are closed', function(){
                cy.get(this.checkoutElements.customerSection).children().should('have.length', 0)
                cy.get(this.checkoutElements.shippingSection).children().then(($shipping)=>{
                    expect($shipping.length).to.be.greaterThan(0)
                })
                cy.get(this.checkoutElements.billingSection).children().should('have.length',0)
                cy.get(this.checkoutElements.paymentSection).children().should('have.length',0)
            })

            it('Select a Shipping Address and Method', function(){
                cy.get(this.checkoutElements.comment)
                .type(this.users.registeredUser.comment, {force:true})

                cy.get(this.checkoutElements.subtotalPrice).then(($price)=>{
                    var subtotalPrice = $price.text()
                    subtotalPrice = Number(subtotalPrice.replace(/[^0-9.-]+/g,""));

                    cy.get(this.checkoutElements.shippingMethods, {timeout: 20000}).should('be.visible')

                    cy.get(this.checkoutElements.shippingMethodsList).then (($list) =>{
                        shippingMethod = Math.floor(Math.random() * ($list.length))
                        cy.get(this.checkoutElements.shippingMethodsList)
                        .eq(shippingMethod)
                        .check({force:true, timeout:60000})

                        cy.get(this.checkoutElements.shippingMethodPrice)
                        .eq(shippingMethod).then(($shippingPrice)=>{
                            var shippingCost = $shippingPrice.text()
                            shippingCost = Number(shippingCost.replace(/[^0-9.-]+/g,""));
                            
                            cy.wait(2000)
                            cy.get(this.checkoutElements.taxPrice).then(($taxPrice)=>{
                                var taxPrice = $taxPrice.text()
                                taxPrice = Number(taxPrice.replace(/[^0-9.-]+/g,""));

                                cy.get(this.checkoutElements.totalPrice).then(($updatedPrice)=>{
                                    var updatedPrice = $updatedPrice.text()
                                    updatedPrice = Number(updatedPrice.replace(/[^0-9.-]+/g,""));
    
                                    var sum = shippingCost+subtotalPrice+taxPrice
                                    expect($updatedPrice).to.contain(sum.toFixed(2))
                                })

                            })
                            
                        })

                    })
                })
                
            })

            it('Submit the shipping Form', function(){
                cy.get(this.checkoutElements.shippingForm).submit()
            })
            it('Verify Payment required Fields & Alert Messages', function() {
    
                cy.get(this.checkoutElements.paymentForm)
                .submit({force:true})

                verifyTextContent(this.checkoutElements.creditCardNumberError,this.checkoutData.creditCardNumberError)

                verifyTextContent(this.checkoutElements.creditCardExpiryError,this.checkoutData.creditCardExpiryError)

                verifyTextContent(this.checkoutElements.creditCardNameError,this.checkoutData.creditCardNameError)

                verifyTextContent(this.checkoutElements.creditCardCVVError,this.checkoutData.creditCardCVVError)
            })
            
            it('Filling Registered User Payment Data', function() {

                cy.get(this.checkoutElements.creditCardNumber)
                .type(this.users.registeredUser.creditCard.creditCardNumber, {force:true})
                cy.get(this.checkoutElements.creditCardExpiry)
                .type(this.users.registeredUser.creditCard.creditCardExpiry, {force:true})
                cy.get(this.checkoutElements.creditCardName)
                .type(this.users.registeredUser.creditCard.creditCardName, {force:true})
                cy.get(this.checkoutElements.creditCardCVV)
                .type(this.users.registeredUser.creditCard.creditCardCVV, {force:true})

            });

            it('Submit Order and Verify completed checkout process', function(){

            })
        })

        context('Verify Order in Registered account Dashboard', ()=>{

        })

    })
})
}

function verifyTextContent(el, data) {
    cy.get(el, {requestTimeout: 6000})
    .should('be.visible', {timeout: 6000})
    .invoke('text')
    .should('include', data)
}

function verifyFieldAttributes(inputElement){
    cy.get(inputElement).then(($el) => { 
        expect($el).to.have.attr('required', 'required')
    })
}
