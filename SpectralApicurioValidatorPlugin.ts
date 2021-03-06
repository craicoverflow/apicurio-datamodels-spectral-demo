import { IDocumentValidatorExtension, NodePath, ValidationProblem, ValidationProblemSeverity, Node } from "apicurio-data-models";
import { ISpectralDiagnostic, Spectral, RulesetDefinition, Ruleset } from '@stoplight/spectral-core';
import { DiagnosticSeverity } from "@stoplight/types";
import path from 'path';

export class SpectralApicurioValidatorPlugin implements IDocumentValidatorExtension {
	private spectral: Spectral;
	constructor() {
		this.spectral = new Spectral();
	}

	async validateDocument(node: Node): Promise<ValidationProblem[]> {
		//@ts-ignore
		const results = await this.spectral.run(node);

		if (!results.length) {
			console.debug("no validation problems found in Spectral validator..")
			return [];
		}
		const validationProblems: ValidationProblem[] = [];

		results.forEach((d: ISpectralDiagnostic) => {
			const pathSegments = d.path.splice(0, d.path.length - 1).join('.');
			validationProblems.push({
				errorCode: String(d.code),
				nodePath: new NodePath("/" + pathSegments),
				message: d.message,
				severity: severityCodeMapConfig[d.severity],
				property: d.path[0].toString(),
				accept: () => { }
			});
		});
		return validationProblems;
	}

	async setRuleset(ruleset: RulesetDefinition | Ruleset) {
		this.spectral.setRuleset(ruleset)
	}
}

const severityCodeMapConfig: { [key in DiagnosticSeverity]: ValidationProblemSeverity } = {
	0: ValidationProblemSeverity.high,
	1: ValidationProblemSeverity.medium,
	2: ValidationProblemSeverity.low,
	3: ValidationProblemSeverity.ignore
}

function isBasicRuleset(filepath: string): boolean {
	return /\.(json|ya?ml)$/.test(path.extname(filepath));
}