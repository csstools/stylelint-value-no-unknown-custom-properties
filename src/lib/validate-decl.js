import stylelint from 'stylelint';
import { parse } from 'postcss-values-parser';
import ruleName from './rule-name';
import messages from './messages';

// validate css declarations
export default (decl, { result, customProperties, rejectBadPrefallbacks }) => {
	const valueAST = parse(decl.value);

	validateValueAST(valueAST, { result, customProperties, decl, rejectBadPrefallbacks });
};

// validate a value ast
const validateValueAST = (ast, { result, customProperties, decl, rejectBadPrefallbacks }) => {
	if (Object(ast.nodes).length) {
		ast.nodes.forEach(node => {
			if (isVarFunction(node)) {
				const [propertyNode, /* comma */, ...fallbacks] = node.nodes;
				const propertyName = propertyNode.value;

				if (propertyName in customProperties) {
					return;
				}

				// conditionally test fallbacks
				if (fallbacks.length) {
					validateValueAST({ nodes: fallbacks.filter(isVarFunction) }, { result, customProperties, decl, rejectBadPrefallbacks });

					if (!rejectBadPrefallbacks) {
						return;
					}
				}

				// report unknown custom properties
				stylelint.utils.report({
					message: messages.unexpected(propertyName, decl.prop),
					node: decl,
					result,
					ruleName,
					word: String(propertyName)
				});
			} else {
				validateValueAST(node, { result, customProperties, decl, rejectBadPrefallbacks });
			}
		});
	}
};

// whether the node is a var() function
export const isVarFunction = node => node.type === 'func' && node.name === 'var' && node.nodes[0].isVariable;
