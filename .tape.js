const test = require('stylelint-test-rule-tape');
const { default: { rule }, ruleName } = require('.');

/* Test: Basic Checks
/* ========================================================================== */

test(rule, {
	ruleName: ruleName,
	config: null
});

/* Test: Declared Custom Properties
/* ========================================================================== */

test(rule, {
	ruleName: ruleName,
	config: null,
	skipBasicChecks: true,
	accept: [
		{ code: 'body { --brand-blue: #33f; color: var(--brand-blue); }' },
		{ code: ':root { --brand-blue: #33f; } body { color: var(--brand-blue); }' },
		{ code: 'html { --brand-blue: #33f; } body { color: var(--brand-blue); }' },
		{ code: '* { --brand-blue: #33f; } body { color: var(--brand-blue); }' },
		{ code: '.anything { --brand-blue: #33f; } body { color: var(--brand-blue); }' }
	],
	reject: [
		{ code: 'body { color: var(--brand-blue); }' }
	]
});

test(rule, {
	ruleName: ruleName,
	config: null,
	skipBasicChecks: true,
	accept: [
		{ code: ':root { --brand-blue: #33f; --brand-color: var(--brand-blue); }' }
	]
});

/* Test: Custom Properties with a Fallback
/* ========================================================================== */

test(rule, {
	ruleName: ruleName,
	config: null,
	skipBasicChecks: true,
	accept: [
		{ code: 'body { color: var(--brand-blue, #33f); }' }
	]
});

/* Test: Non Custom Properties or Incomplete Custom Properties
/* ========================================================================== */

test(rule, {
	ruleName: ruleName,
	config: null,
	skipBasicChecks: true,
	accept: [
		{ code: 'body { color: brand-blue; }' },
		{ code: 'body { color: var(); }' }
	]
});

/* Test: Imported Custom Properties
/* ========================================================================== */

test(rule, {
	ruleName: ruleName,
	config: {
		importFrom: {
			customProperties: {
				'--brand-blue': '#fff'
			}
		}
	},
	skipBasicChecks: true,
	accept: [
		{ code: 'body { color: var(--brand-blue); }' }
	],
	reject: [
		{ code: 'body { color: var(--brand-blu); }' },
		{ code: 'body { color: var(--brand-bluez); }' }
	]
});

test(rule, {
	ruleName: ruleName,
	config: [{
		importFrom: [
			'test/import.js',
			'test/import.json',
			'test/import.css'
		]
	}],
	skipBasicChecks: true,
	accept: [
		{ code: 'body { background-color: var(--brand-red); border-color: var(--brand-white); color: var(--brand-blue); }' }
	],
	reject: [
		{ code: 'body { color: var(--brand-blu); }' },
		{ code: 'body { color: var(--brand-bluez); }' }
	]
});
