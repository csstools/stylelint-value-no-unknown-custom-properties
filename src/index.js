import stylelint from 'stylelint';
import getCustomPropertiesFromRoot from './lib/get-custom-properties-from-root';
import getCustomPropertiesFromImports from './lib/get-custom-properties-from-imports';
import validateResult from './lib/validate-result';
import ruleName from './lib/rule-name';

export default stylelint.createPlugin(ruleName, (method, opts) => {
	// sources to import custom selectors from
	const {
		importFrom = [],
		reportEarlyUses = false,
		rejectBadPrefallbacks = false
	} = Object(opts);

	const imprtFrom = [].concat(importFrom);

	const priorCustomPropertyReferences = reportEarlyUses
		? new Map()
		: null;

	return async (root, result) => {
		// promise any custom selectors are imported
		const customPropertiesPromise = isMethodEnabled(method)
			? getCustomPropertiesFromImports(imprtFrom, {
				priorCustomPropertyReferences, result
			})
		: {};

		// validate the method
		const isMethodValid = stylelint.utils.validateOptions(result, ruleName, {
			actual: method,
			possible() {
				return isMethodEnabled(method) || isMethodDisabled(method);
			}
		});

		if (isMethodValid && isMethodEnabled(method)) {
			// all custom properties from the file and imports
			const customProperties = Object.assign(
				await customPropertiesPromise,
				await getCustomPropertiesFromRoot(root, result, priorCustomPropertyReferences)
			);
			// validate the css root
			validateResult(result, customProperties, rejectBadPrefallbacks);
		}
	};
});

export { ruleName }

const isMethodEnabled = method => method === true;
const isMethodDisabled = method => method === null || method === false;
