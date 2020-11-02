import { promises as fs } from 'fs';
import path from 'path';
import postcss from 'postcss';
import stylelint from 'stylelint';
import { parse } from 'postcss-values-parser';
import {hasCustomPropertyReference} from './validate-result';
import {isVarFunction} from './validate-decl';
import messages from './messages';
import ruleName from './rule-name';

// return custom selectors from the css root, conditionally removing them
export default async function getCustomPropertiesFromRoot(root, result, priorCustomPropertyReferences) {
	// initialize custom selectors
	let customProperties = {};

	// resolve current file directory
	let sourceDir = __dirname;
	if (root.source && root.source.input && root.source.input.file) {
		sourceDir = path.dirname(root.source.input.file);
	}

	// recursively add custom properties from @import statements
	const importPromises = [];
	root.walkAtRules('import', atRule => {
		const fileName = atRule.params.replace(/['|"]/g, '');
		const resolvedFileName = path.resolve(sourceDir, fileName);
		importPromises.push(getCustomPropertiesFromCSSFile(resolvedFileName, result, priorCustomPropertyReferences));
	});

	(await Promise.all(importPromises)).forEach(propertiesFromImport => {
		customProperties = Object.assign(customProperties, propertiesFromImport);
	});

	function checkAST (ast, decl) {
		if (Object(ast.nodes).length) {
			ast.nodes.forEach(node => {
				if (isVarFunction(node)) {
					const [propertyNode, /* comma */ , ...fallbacks] = node.nodes;
					const propertyName = propertyNode.value;
					priorCustomPropertyReferences.set(propertyName, decl);

					if (fallbacks.length) {
						checkAST({ nodes: fallbacks.filter(isVarFunction) }, decl);
					}
				} else {
					checkAST(node, decl);
				}
			});
		}
	}

	// for each custom property declaration
	root.walkDecls(decl => {
		// Add any uses to collection along the way
		if (priorCustomPropertyReferences && hasCustomPropertyReference(decl)) {
			const ast = parse(decl.value);
			checkAST(ast, decl);
		}
		const { prop } = decl;
		if (!customPropertyRegExp.test(prop)) {
			return;
		}
		// Discard uses if not found by time of declaration

		if (priorCustomPropertyReferences && priorCustomPropertyReferences.has(prop)) {
			const dec = priorCustomPropertyReferences.get(prop);
			stylelint.utils.report({
				message: messages.earlyReference(prop, dec.prop),
				node: dec,
				result,
				ruleName,
				word: String(prop)
			});
			priorCustomPropertyReferences.delete(prop);
		}

		// write the parsed value to the custom property
		customProperties[prop] = decl.value;
	});

	// return all custom properties, preferring :root properties over html properties
	return customProperties;
}

// match custom properties
const customPropertyRegExp = /^--[A-z][\w-]*$/;


async function getCustomPropertiesFromCSSFile(from, result, priorCustomPropertyReferences) {
	try {
		const css = await fs.readFile(from, 'utf8');
		const root = postcss.parse(css, { from });

		return await getCustomPropertiesFromRoot(root, result, priorCustomPropertyReferences);
	} catch (e) {
		return {};
	}
}
