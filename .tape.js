const test = require('stylelint-test-rule-tape');
const { default: { rule }, ruleName } = require('.');
const skipBasicChecks = true;
let accept = [], reject = [];

/* Test basic checks
/* ========================================================================== */

test(rule, { ruleName, config: null });
test(rule, { ruleName, config: false });
test(rule, { ruleName, config: true });

/* Test disabled
/* ========================================================================== */

accept = [
	{ code: 'body { color: var(--brand-blue); }', description: 'ignored custom property' }
];

test(rule, { ruleName, skipBasicChecks, config: null, accept });
test(rule, { ruleName, skipBasicChecks, config: false, accept });

/* Test enabled
/* ========================================================================== */

accept = [
	{ code: 'body { color: oops var(abc); }' },
	{ code: 'body { --brand-blue: #33f; color: var(--brand-blue); }' },
	{ code: ':root { --brand-blue: #33f; } body { color: var(--brand-blue); }' },
	{ code: 'html { --brand-blue: #33f; } body { color: var(--brand-blue); }' },
	{ code: '* { --brand-blue: #33f; } body { color: var(--brand-blue); }' },
	{ code: '.anything { --brand-blue: #33f; } body { color: var(--brand-blue); }' },
	{ code: ':root { --brand-blue: #33f; --brand-color: var(--brand-blue); }' },
	{ code: "@import './test/import-custom-properties.css'; body { color: var(--brand-red); }"},
	{ code: "@import './test/import-custom-properties.css'; @import './test/import-custom-properties123.css'; body { color: var(--brand-red); }"}
];
reject = [
	{ code: 'body { color: var(--brand-blue); }' },
	{ code: "@import './test/import-custom-properties123.css'; body { color: var(--brand-red); }"}
];

test(rule, { ruleName, skipBasicChecks, config: true, accept, reject });

/* Test fallbacks
/* ========================================================================== */

accept = [
	{ code: 'body { color: var(--brand-blue, #33f); }' }
];
reject = [
	{ code: 'body { color: var(--brand-blue, var(--brand-red)); }' }
];
test(rule, { ruleName, skipBasicChecks, config: true, accept, reject });

/* Test enabled: not var()s
/* ========================================================================== */

accept = [
	{ code: 'body { color: brand-blue; }' },
	{ code: 'body { color: var(); }' }
];

test(rule, { ruleName, skipBasicChecks, config: true, accept });

/* Test enabled: { importFrom }
/* ========================================================================== */

accept = [
	{ code: 'body { color: var(--brand-blue); }' }
];
reject = [
	{ code: 'body { color: var(--brand-blu); }' },
	{ code: 'body { color: var(--brand-bluez); }' }
];

test(rule, {
	ruleName,
	config: [true, {
		importFrom: {
			customProperties: {
				'--brand-blue': '#fff'
			}
		}
	}],
	skipBasicChecks
});

accept = [
	{ code: 'body { background-color: var(--brand-red); background: var(--brand-green); border-color: var(--brand-white); color: var(--brand-blue); }' }
];
reject = [
	{ code: 'body { color: var(--brand-blu); }' },
	{ code: 'body { color: var(--brand-bluez); }' },
	{ code: 'html { background-color: var(--brand-orange); }' }
];

test(rule, {
	ruleName,
	config: [true, {
		importFrom: [
			'test/import-custom-properties.js',
			'test/import-custom-properties.json',
			'test/import-custom-properties.css',
			'test/import-custom-properties.scss'
		]
	}],
	skipBasicChecks,
	accept,
	reject
});

accept = [
	{ code: 'body { background-color: var(--brand-red); background: var(--brand-green); border-color: var(--brand-white); color: var(--brand-blue); }' }
];
reject = [
	{ code: 'body { color: var(--brand-blu); }' },
	{ code: 'body { color: var(--brand-bluez); }' },
	{ code: 'html { background-color: var(--brand-orange); }' }
];

test(rule, {
	ruleName,
	config: [true, {
		importFrom: [
			{
				from: 'test/import-custom-properties.js'
			},
			{
				customProperties: {
					'--brand-xy': 'not-used'
				}
			},
			{
				'custom-properties': {
					'--brand-zz': 'not-used'
				}
			},
			{},
			() => ({
				from: 'test/import-custom-properties.json',
				type: 'json'
			}),
			Promise.resolve({
				from: 'test/import-custom-properties.css',
				type: 'css'
			}),
			'test/import-custom-properties.scss'
		]
	}],
	skipBasicChecks,
	accept,
	reject
});
