import stylelint from 'stylelint';
import getCustomPropertiesFromRoot from './lib/get-custom-properties-from-root';
import getCustomPropertiesFromImports from './lib/get-custom-properties-from-imports';
import messages from './lib/messages';
import ruleName from './lib/rule-name';
import validateRoot from './lib/validate-root';

export default stylelint.createPlugin(ruleName, pluginOpts => {
	// sources to import custom selectors from
	const importFrom = [].concat(Object(pluginOpts).importFrom || []);

	// promise any custom selectors are imported
	const customPropertiesPromise = getCustomPropertiesFromImports(importFrom);

	return async (root, result) => {
		// validate options
		const validOptions = stylelint.utils.validateOptions(result, ruleName, {
			actual: Object(pluginOpts),
			possible: {
				importFrom: function() { return true; }
			}
		});

		if (validOptions) {
			// all custom properties from the file and imports
			const customProperties = Object.assign(
				await customPropertiesPromise,
				getCustomPropertiesFromRoot(root)
			);

			// validate the css root
			validateRoot(root, { customProperties, messages, result });
		}
	};
});

export { ruleName, messages }
