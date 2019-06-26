import stylelint from 'stylelint';
import valueParser from 'postcss-values-parser';
import ruleName from './rule-name';
import messages from './messages';

// validate css declarations
export default (decl, { result, customProperties }) => {
	const valueAST = valueParser(decl.value).parse();

	validateValueAST(valueAST, { result, customProperties, decl });
};

// validate a value ast
const validateValueAST = (ast, { result, customProperties, decl }) => {
	if (Object(ast.nodes).length) {
		ast.nodes.forEach(node => {
			if (isVarFunction(node)) {
				const [propertyNode, comma, ...fallbacks] = node.nodes.slice(1, -1); // eslint-disable-line no-unused-vars
				const propertyName = String(propertyNode).trim();

				if (propertyName in customProperties) {
					return;
				}

				// conditionally test fallbacks
				if (fallbacks.length) {
					validateValueAST({ nodes: fallbacks.filter(isVarFunction) }, { result, customProperties, decl });

					return;
				}

				// report unknown custom properties
				stylelint.utils.report({
					message: messages.unexpected(propertyName, decl.prop),
					node: decl,
					result,
					ruleName,
					word: String(propertyNode)
				});
			} else {
				validateValueAST(node, { result, customProperties, decl });
			}
		});
	}
};

// match var() functions
const varRegExp = /^var$/i;

// whether the node is a var() function
const isVarFunction = node => node.type === 'func' && varRegExp.test(node.value) && Object(node.nodes).length > 0;
