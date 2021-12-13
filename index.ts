import { Library } from 'apicurio-data-models';
import { SpectralApicurioValidatorPlugin } from './SpectralApicurioValidatorPlugin';
import openapiData from './petstore.json';
import spectralRuleset from './.spectral'

async function run() {
	const document = Library.readDocument(openapiData)

	const spectralValidationExtension = new SpectralApicurioValidatorPlugin();
	spectralValidationExtension.setRuleset(spectralRuleset);
	// Validate that your changes are OK.
	const problems = await Library.validateDocument(document, null, [spectralValidationExtension]);

	console.log(JSON.stringify(problems, null, 2));
};

run();