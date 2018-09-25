// return custom selectors from the css root, conditionally removing them
export default root => {
	// initialize custom selectors
	const customProperties = {};

	// for each custom property declaration
	root.walkDecls(customPropertyRegExp, decl => {
		const { prop } = decl;

		// write the parsed value to the custom property
		customProperties[prop] = decl.value;
	});

	// return all custom properties, preferring :root properties over html properties
	return customProperties;
};

// match custom properties
const customPropertyRegExp = /^--[A-z][\w-]*$/;
