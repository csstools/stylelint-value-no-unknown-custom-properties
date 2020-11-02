import validateDecl from './validate-decl';

// validate the css root
export default (result, customProperties, rejectBadPrefallbacks) => {
	// validate each declaration
	result.root.walkDecls(decl => {
		if (hasCustomPropertyReference(decl)) {
			validateDecl(decl, { result, customProperties, rejectBadPrefallbacks });
		}
	});
};

// match custom property inclusions
const customPropertyReferenceRegExp = /(^|[^\w-])var\([\W\w]+\)/;

// whether a declaration references a custom property
export const hasCustomPropertyReference = decl => customPropertyReferenceRegExp.test(decl.value);
