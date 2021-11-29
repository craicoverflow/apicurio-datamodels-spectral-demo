import { IValidationExtension, NodePath, ValidationProblem, ValidationProblemSeverity } from "apicurio-data-models";
import { ISpectralDiagnostic, Spectral, Ruleset, Rule, RulesetDefinition } from '@stoplight/spectral-core';
import { migrateRuleset } from '@stoplight/spectral-ruleset-migrator';
import { DiagnosticSeverity } from "@stoplight/types";
import path from 'path';

export class SpectralApicurioValidatorPlugin implements IValidationExtension {
	private spectral: Spectral;
	constructor() {
		this.spectral = new Spectral();
	}

	async validate<Document>(node: Document): Promise<ValidationProblem[]> {
		//@ts-ignore
		const results = await this.spectral.run(node);

		if (!results.length) {
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

	async setRuleset(ruleset: RulesetDefinition) {
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