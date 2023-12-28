import stylelint from 'stylelint';
import getCustomPropertiesFromRoot from './lib/get-custom-properties-from-root.mjs';
import getCustomPropertiesFromImports from './lib/get-custom-properties-from-imports.mjs';
import validateResult from './lib/validate-result.mjs';
import messages from './lib/messages.mjs';
import ruleName from './lib/rule-name.mjs';

const meta = {
	url: 'https://github.com/csstools/stylelint-value-no-unknown-custom-properties/blob/main/README.md',
};

const ruleFunction = (method, opts) => {
	// sources to import custom selectors from
	const importFrom = [].concat(Object(opts).importFrom || []);
	const resolver = Object(opts).resolver || {};

	// promise any custom selectors are imported
	const customPropertiesPromise = isMethodEnabled(method)
		? getCustomPropertiesFromImports(importFrom, resolver)
		: {};

	return async (root, result) => {
		// validate the method
		const isMethodValid = stylelint.utils.validateOptions(result, ruleName, {
			actual: method,
			possible() {
				return isMethodEnabled(method) || isMethodDisabled(method);
			},
		});

		if (isMethodValid && isMethodEnabled(method)) {
			// all custom properties from the file and imports
			const customProperties = Object.assign(
				await customPropertiesPromise,
				await getCustomPropertiesFromRoot(root, resolver),
			);

			// validate the css root
			validateResult(result, customProperties);
		}
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);

const isMethodEnabled = method => method === true;
const isMethodDisabled = method => method === null || method === false;
