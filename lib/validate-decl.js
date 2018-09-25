import stylelint from 'stylelint';
import valueParser from 'postcss-values-parser';
import ruleName from './rule-name';

// validate css declarations
export default (decl, opts) => {
	const valueAST = valueParser(decl.value).parse();

	validateValueAST(valueAST, { ...opts, decl });
};

// validate a value ast
const validateValueAST = (ast, opts) => {
	const { customProperties, messages, result, decl } = opts;

	if (Object(ast.nodes).length) {
		ast.nodes.forEach(node => {
			if (isVarFunction(node)) {
				const [propertyNode, comma, ...fallbacks] = node.nodes.slice(1, -1); // eslint-disable-line no-unused-vars
				const propertyName = String(propertyNode);

				if (propertyName in customProperties) {
					return;
				}

				if (fallbacks.length) {
					return;
				}

				stylelint.utils.report({
					message: messages.unexpected(propertyName, decl.prop),
					node: decl,
					result,
					ruleName,
					word: String(propertyNode)
				});
			} else {
				validateValueAST(node, opts);
			}
		});
	}
};

// match var() functions
const varRegExp = /^var$/i;

// whether the node is a var() function
const isVarFunction = node => node.type === 'func' && varRegExp.test(node.value) && Object(node.nodes).length > 0;
