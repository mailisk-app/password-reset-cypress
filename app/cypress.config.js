const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    MAILISK_API_KEY: "SwG8AkjAMKpkaiPADkWGFqDtof0xvUz_1o80_eqmnS4",
    MAILISK_NAMESPACE: "5tp17s0n30y5",
  },
});
