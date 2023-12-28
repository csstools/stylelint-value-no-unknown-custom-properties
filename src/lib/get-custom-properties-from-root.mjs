import { promises as fs } from 'fs';
import path from 'path';
import postcss from 'postcss';
import { resolveId } from './resolve-id.mjs';

// return custom selectors from the css root, conditionally removing them
export default async function getCustomPropertiesFromRoot(root, resolver) {
	// initialize custom selectors
	let customProperties = {};

	// resolve current file directory
	let sourceDir = process.cwd();
	if (root.source && root.source.input && root.source.input.file) {
		sourceDir = path.dirname(root.source.input.file);
	}

	// recursively add custom properties from @import statements
	const importPromises = [];
	root.walkAtRules('import', atRule => {
		const fileName = atRule.params.replace(/['|"]/g, '');

		if (path.isAbsolute(fileName)) {
			importPromises.push(getCustomPropertiesFromCSSFile(fileName, resolver));
		} else {
			const promise = resolveId(fileName, sourceDir, {
				paths: resolver.paths,
				extensions: resolver.extensions,
				moduleDirectories: resolver.moduleDirectories,
			})
				.then((filePath) => getCustomPropertiesFromCSSFile(filePath, resolver))
				.catch(() => {});

			importPromises.push(promise);
		}
	});

	(await Promise.all(importPromises)).forEach(propertiesFromImport => {
		customProperties = Object.assign(customProperties, propertiesFromImport);
	});

	// for each custom property declaration
	root.walkDecls(customPropertyRegExp, decl => {
		const { prop } = decl;

		// write the parsed value to the custom property
		customProperties[prop] = decl.value;
	});

	// return all custom properties, preferring :root properties over html properties
	return customProperties;
}

// match custom properties
const customPropertyRegExp = /^--[A-z][\w-]*$/;


async function getCustomPropertiesFromCSSFile(from, resolver) {
	try {
		const css = await fs.readFile(from, 'utf8');
		const root = postcss.parse(css, { from });

		return await getCustomPropertiesFromRoot(root, resolver);
	} catch (e) {
		return {};
	}
}
