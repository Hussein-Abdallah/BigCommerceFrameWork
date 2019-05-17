/// <reference types="cypress" />

// This recipe expands on the previous 'Logging in' examples
// and shows you how to login when authentication is done
// through a 3rd party server.

// There is a web security restriction in Cypress that prevents
// you from visiting two different super domains in the same test
// without setting {chromeWebSecurity: false} in cypress.json.
// However this restriction is easy to bypass (and is much more
// performant and less brittle) with cy.request

// There are two servers in use in this example.
// 1. http://localhost:7074 (the app server)
// 2. http://auth.corp.com:7075 (the authentication server)

// Be sure to run `npm start` to start the server
// before running the tests below.

// NOTE: We are able to use auth.corp.com without modifying our
// local /etc/hosts file because cypress supports hosts mapping
// in cypress.json

// Most 3rd party authentication works like this:

// 1. Visit the 3rd party site (http://auth.corp.com:7075) and tell
//    the 3rd party site where to redirect back to upon success:
//    http://auth.corp.com:7075?redirectTo=http://localhost:7074/set_token

// 2. Submit the username / password to the auth.corp.com site

// 3. Upon success, the 3rd party site redirects back to your application
//    and includes the id_token in the URL:
//    http://localhost:7074/set_token?id_token=abc123def456

// 4. Your application then parses out the id_token and sets it
//    as a cookie or on local storage then includes it on all
//    subsequent requests to your server.

// There are other various implementation differences but they all share
// the same fundamental concepts which we can test in Cypress.

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
      url: 'https://ironman4x4america.com/admin/oauth/bigcommerce',
      qs: {
        // use qs to set query string to the url that creates
        // http://auth.corp.com:8080?redirectTo=http://localhost:7074/set_token
        redirectTo: 'http://localhost:7074/set_token'
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

    it('is 403 unauthorized without a session cookie', function(){
      // smoke test just to show that without logging in we cannot
      // visit the dashboard
      cy.visit('https://ironman4x4america.com/admin/oauth/bigcommerce')

      //cy.url().should('include', 'unauthorized')
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
          expect(resp.body).to.include('iframe')
        })

      // the redirected page hits the server, and the server middleware
      // parses the authentication token and returns the dashboard view
      // with our cookie 'cypress-session-cookie' set
      //cy.getCookie('cypress-session-cookie').should('exist')

      // you don't need to do this next part but
      // just to prove we can also visit the page in our app
      cy.visit('https://ironman4x4america.com/admin/oauth/bigcommerce')

      //cy.get('h1').should('contain', 'Welcome to the Dashboard')
    })
  })

})