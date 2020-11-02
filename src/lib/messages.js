import stylelint from 'stylelint';
import ruleName from './rule-name';

export default stylelint.utils.ruleMessages(ruleName, {
	earlyReference: (name, prop) => `Custom property "${name}" referenced too early (inside declaration "${prop}").`,
	unexpected: (name, prop) => `Unexpected custom property "${name}" inside declaration "${prop}".`,
});
