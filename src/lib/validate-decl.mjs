import stylelint from 'stylelint';
import valueParser from 'postcss-value-parser';
import ruleName from './rule-name.mjs';
import messages from './messages.mjs';

// validate css declarations
export default (decl, { result, customProperties, opts }) => {
	const valueAST = valueParser(decl.value);

	validateValueAST(valueAST, { result, customProperties, decl, opts: opts || {} });
};

// validate a value ast
const validateValueAST = (ast, { result, customProperties, decl, opts }) => {
	const isValid = typeof ast?.walk === 'function';

	if (!isValid) {
		return;
	}

	ast.walk(node => {
		if (isVarFunction(node)) {
			const [propertyNode, , ...fallbacks] = node.nodes;
			const propertyName = propertyNode.value;

			if (propertyName in customProperties) {
				return;
			}

			// when a fallback is provided we still need to walk it so we can
			// surface unknown custom properties referenced inside the fallback
			if (fallbacks.length) {
				validateValueAST({ nodes: fallbacks.filter(isVarFunction) }, { result, customProperties, decl, opts });

				// by default, the presence of a fallback suppresses the warning
				// on the outer var(). When `checkVarsWithFallbacks` is enabled,
				// the outer reference is still reported even though a fallback exists.
				if (!opts.checkVarsWithFallbacks) {
					return;
				}
			}

			// report unknown custom properties
			stylelint.utils.report({
				message: messages.unexpected,
				messageArgs: [propertyName, decl.prop],
				node: decl,
				result,
				ruleName,
				word: String(propertyName),
			});
		}
	});
};

// whether the node is a var() function
const isVarFunction = node => node.type === 'function' && node.value === 'var' && node.nodes[0].value.startsWith('--');
