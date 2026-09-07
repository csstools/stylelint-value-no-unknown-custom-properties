import validateDecl from './validate-decl.mjs';

// validate the css root
export default (root, result, customProperties, opts = {}) => {
	// validate each declaration
	root.walkDecls(decl => {
		if (hasCustomPropertyReference(decl)) {
			validateDecl(decl, { result, customProperties, opts });
		}
	});
};

// match custom property inclusions
const customPropertyReferenceRegExp = /(^|[^\w-])var\([\W\w]+\)/i;

// whether a declaration references a custom property
const hasCustomPropertyReference = decl => customPropertyReferenceRegExp.test(decl.value);
