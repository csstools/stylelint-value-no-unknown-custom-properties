import stylelint from 'stylelint';
import ruleName from './rule-name';

export default stylelint.utils.ruleMessages(ruleName, {
	unexpected: (name, prop) => `Unexpected custom property "${name}" inside declaration "${prop}".`,
});
