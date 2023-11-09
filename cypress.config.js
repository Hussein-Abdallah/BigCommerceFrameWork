const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '164wn9',
  blockHosts: 'www.google-analytics.com, *google.com',
  chromeWebSecurity: false,
  defaultCommandTimeout: 6000,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'mochawesome-report',
    overwrite: false,
    html: false,
    json: true,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://preview.arcticleaf.co/pusehjx/staging/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
