/// <reference types="cypress" />


const _   = Cypress._

// require node's url module
const url = require('url')

describe('Logging In - Single Sign on', function(){
  Cypress.Commands.add('loginBySingleSignOn', (overrides = {}) => {

    Cypress.log({
      name: 'loginBySingleSignOn'
    })

    const options = {
      method: 'POST',
      url: 'https://login.bigcommerce.com/login',
      qs: {
        // use qs to set query string to the url that creates
        // http://auth.corp.com:8080?redirectTo=http://localhost:7074/set_token
        redirectTo: 'https://ironman4x4america.com/manage/customers/set_token'
      },
      form: true, // we are submitting a regular form body
      body: {
        user_email: 'team@arcticleaf.io',
        user_password: 'K9,NCrYD@cKR3,t.tJKY8PENWxjYi',
      }
    }

    // allow us to override defaults with passed in overrides
    _.extend(options, overrides)

    cy.request(options)
  })

  context('Use redirectTo and a session cookie to login', function(){
    // This first example assumes we have an app server that
    // is capable of handling the redirect and set a session cookie

    // The flow will be:
    // 1. sign into auth.corp.com
    // 2. redirect back to our app server
    // 3. have our app server set an HttpOnly session cookie
    // 4. check that we are now properly logged in

    it('can authenticate with cy.request', function(){
      // before we start, there should be no session cookie
      cy.getCookie('cypress-session-cookie').should('not.exist')

      // this automatically gets + sets cookies on the browser
      // and follows all of the redirects that ultimately get
      // us to /dashboard.html
      cy.loginBySingleSignOn()
        .then((resp) => {
          // yup this should all be good
          expect(resp.status).to.eq(200)

          // we're at http://localhost:7074/dashboard contents
          //expect(resp.body).to.include('<h1>Welcome to the Dashboard!</h1>')
        })

      // the redirected page hits the server, and the server middleware
      // parses the authentication token and returns the dashboard view
      // with our cookie 'cypress-session-cookie' set
      //cy.getCookie('cypress-session-cookie').should('exist')

      // you don't need to do this next part but
      // just to prove we can also visit the page in our app
      cy.visit('https://ironman4x4america.com/manage/customers')

      //cy.get('h1').should('contain', 'Welcome to the Dashboard')
    })
  })

  context('Manually parse id_token and set on local storage to login', function(){
    // This second example assumes we are building a SPA
    // without a server to handle setting the session cookie.

    // The flow will be:
    // 1. Disable following automatic redirects
    // 2. Sign into auth.corp.com
    // 3. Parse out the id_token manually
    // 4. Visit our application
    // 5. Before it loads, set token on local storage
    // 6. Make sure the XHR goes out and the response
    //    is correct + #main has the correct response text

    it('knows when there is no session token', function(){
      // by default our SPA app checks for id_token set in local storage
      // and will display a message if its not set
      //
      // else it will make an XHR request to the backend and display the results
      cy.visit('https://ironman4x4america.com/manage/customers')
      //cy.get('#main')
      //  .should('contain', 'No session token set!')
    })


    /**
     * Assuming "cy.request" was called with `{followRedirect: false}` grabs the
     * redirected to URI, parses it and returns just the "id_token".
    */
    const responseToToken = (resp) => {
      // we can use the redirectedToUrl property that Cypress adds
      // whenever we turn off following redirects
      //
      // and use node's url.parse module (and parse the query params)
      const uri = url.parse(resp.redirectedToUrl, true)

      // we now have query params as an object and can return
      // the id_token
      expect(uri.query).to.have.property('id_token')
      return uri.query.id_token
    }

    it('can parse out id_token and set on local storage', function(){
      // dont follow redirects so we can manually parse out the id_token
      cy.loginBySingleSignOn({followRedirect: true})
        .then(responseToToken)
        .then((id_token) => {
          cy.server()
          // observe the "GET /config" call from the application
          cy.route('/config').as('getConfig')

          // now go visit our app
          cy.visit('https://ironman4x4america.com/manage/customers', {
            onBeforeLoad: function(win){
              // and before the page finishes loading
              // set the id_token in local storage
              win.localStorage.setItem('id_token', id_token)
            }
          })

          // wait for the /config XHR
          cy.wait('@getConfig')
            .its('response.body')
            .should('deep.eq', {
              foo: 'bar',
              some: 'config',
              loggedIn: true
            })

          // and now our #main should be filled
          // with the response body
          cy.get('#main')
            .invoke('text')
            .should((text) => {
              // parse the text into JSON
              const json = JSON.parse(text)

              expect(json).to.deep.eq({
                foo: 'bar',
                some: 'config',
                loggedIn: true
              })
            })
        })
    })

    describe.skip('Log in once for speed', () => {
      // in this example we follow SPA workflow, get the auth token once
      // and then set it in window.localStorage before each test
      // and voilá - we are logged in very quickly

      before(function () {
        // before any tests execute, get the token once
        // as save it in the test context - thus the callback
        // is using "function () { ... }" form and NOT arrow function
        cy.loginBySingleSignOn({followRedirect: false})
          .then(responseToToken)
          .as('token') // saves under "this.token"
      })

      beforeEach(function () {
        // before every test we need to grab "this.token"
        // and set it in the local storage,
        // so the application sends with and the user is authenticated
        cy.on('window:before:load', win => {
          win.localStorage.setItem('id_token', this.token)
        })
      })

      it('opens page as logged in user', () => {
        cy.visit('/')
        cy.contains('"loggedIn":true')
      })

      it('config returns logged in: true', function () {
        // note again this test uses "function () { ... }" callback
        // in order to get access to the test context "this.token" saved above

        cy.server()
        // observe the "GET /config" call from the application
        cy.route('/config').as('getConfig')

        cy.visit('/')

        cy.wait('@getConfig')
          .then((xhr) => {
            // inspect sent and received information
            expect(xhr.request.headers, 'request includes token header')
              .to.have.property('x-session-token', this.token)

            expect(xhr.response.body, 'response body').to.deep.equal({
              foo: 'bar',
              loggedIn: true,
              some: 'config'
            })
          })
      })
    })
  })
})




describe('delete newly registered user from database', function() {
    Cypress.Commands.add('loginBySingleSignOn', (overrides = {}) => {

        Cypress.log({
          name: 'loginBySingleSignOn'
        })
    
        const options = {
          method: 'POST',
          url: 'https://ironman4x4america.com/manage/customers',
          form: true, // we are submitting a regular form body
          body: {
            user_email: 'team@arcticleaf.io',
            user_password: 'K9,NCrYD@cKR3,t.tJKY8PENWxjYi',
          }
        }
    
        // allow us to override defaults with passed in overrides
        _.extend(options, overrides)
    
        cy.request(options)
    })
  
    it('can authenticate with cy.request', function(){
        // before we start, there should be no session cookie
        cy.getCookie('cypress-session-cookie').should('not.exist')
  
        // this automatically gets + sets cookies on the browser
        // and follows all of the redirects that ultimately get
        // us to /dashboard.html
        cy.loginBySingleSignOn()
          .then((resp) => {
            // yup this should all be good
            expect(resp.status).to.eq(200)
  
            // we're at http://localhost:7074/dashboard contents
            expect(resp.body).to.include('<iframe')
          })
  
        // the redirected page hits the server, and the server middleware
        // parses the authentication token and returns the dashboard view
        // with our cookie 'cypress-session-cookie' set
        //cy.getCookie('cypress-session-cookie').should('exist')
  
        // you don't need to do this next part but
        // just to prove we can also visit the page in our app
        cy.loginBySingleSignOn()
          .then((resp) => {
            // yup this should all be good
            expect(resp.status).to.eq(200)
  
            // we're at http://localhost:7074/dashboard contents
            expect(resp.body).to.include('<iframe')
          })
  cy.visit("https://ironman4x4america.com/manage/customers")
        //cy.get('h1').should('contain', 'Welcome to the Dashboard')
  })
      it.skip('can authenticate with cy.request', function(){


        cy.loginBySingleSignOn()
          
        cy.visit('https://ironman4x4america.com/manage/customers')
        cy.wait(3000)

        cy.get("#content-iframe").then(function ($iframe) {
            
            const $body = $iframe.contents().find('body')
            cy.wrap($body, {timeout:60000})
            .find('a')
     
        })

      })

    })
















