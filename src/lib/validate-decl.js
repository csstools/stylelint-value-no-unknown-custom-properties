import stylelint from 'stylelint';
import parse from 'postcss-value-parser';
import ruleName from './rule-name';
import messages from './messages';

// validate css declarations
export default (decl, { result, customProperties }) => {
	const valueAST = parse(decl.value);

	validateValueAST(valueAST, { result, customProperties, decl });
};

// validate a value ast
const validateValueAST = (ast, { result, customProperties, decl }) => {
	if (!Object(ast.nodes).length) {
		return;
	}
	ast.nodes.forEach((node) => {
		if (isVarFunction(node)) {
			const { nodes } = node;
			const [propertyNode, comma, ...fallbacks] = nodes;

			if (!propertyNode || propertyNode.value in customProperties) {
				return;
			}

			// conditionally test fallbacks
			if (fallbacks.length) {
				validateValueAST({ nodes: fallbacks.filter(isVarFunction) }, { result, customProperties, decl });
				return;
			}

			// report unknown custom properties
			stylelint.utils.report({
				message: messages.unexpected(propertyNode.value, decl.prop),
				node: decl,
				result,
				ruleName,
				word: String(propertyNode.value),
			});
		} else {
			validateValueAST(node, { result, customProperties, decl });
		}
	});
};

// whether the node is a var() function
const isVarFunction = node => node.type === 'function' && node.value === 'var';
