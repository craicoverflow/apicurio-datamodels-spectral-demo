import { Library } from 'apicurio-data-models';
import { SpectralApicurioValidatorPlugin } from './SpectralApicurioValidatorPlugin';
import { DiagnosticSeverity } from "@stoplight/types";
import { truthy } from '@stoplight/spectral-functions';
import openapiData from './petstore.json';

async function run() {
	let document = Library.readDocumentFromJSONString(JSON.stringify(openapiData));
	Library.writeDocumentToJSONString(document);

	const spectralPlugin = new SpectralApicurioValidatorPlugin();
	spectralPlugin.setRuleset({
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
	})
	// Validate that your changes are OK.
	let problems = await Library.validateWithExtensions(document, null, [spectralPlugin]);

	console.log(JSON.stringify(problems, null, 2));
};

run();