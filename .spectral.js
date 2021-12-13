// .spectral.js (CommonJS)
const { oas } = require("@stoplight/spectral-rulesets");
const { truthy } = require("@stoplight/spectral-functions");
const { DiagnosticSeverity } = require("@stoplight/types");

module.exports = {
  extends: oas,
  rules: {
    'rhoas-response-media-type': {
      given: '$.paths.*.*.responses.*.content',
      description: 'application/json is the only acceptable content type',
      severity: DiagnosticSeverity.Error,
      then: {
        function: truthy,
        field: 'application/json'
      }
    },
    'title-required': {
      given: '$.info',
      description: 'Description is required',
      severity: DiagnosticSeverity.Error,
      then: {
        function: truthy,
        field: 'title'
      }
    }
  }
};