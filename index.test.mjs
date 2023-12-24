import { testRule } from 'stylelint-test-rule-node';

import messages from './src/lib/messages.mjs';
import ruleName from './src/lib/rule-name.mjs';

const skipBasicChecks = true;
let accept = [], reject = [];

/* Test basic checks
/* ========================================================================== */

testRule({ plugins: ['.'], ruleName, config: null, accept: [''] });
testRule({ plugins: ['.'], ruleName, config: false, accept: [''] });
testRule({ plugins: ['.'], ruleName, config: true, accept: [''] });

/* Test disabled
/* ========================================================================== */

accept = [
	{ code: 'body { color: var(--brand-blue); }', description: 'ignored custom property' },
];

testRule({ plugins: ['.'], ruleName, skipBasicChecks, config: null, accept });

/* Test enabled
/* ========================================================================== */

accept = [
	{ code: 'body { --brand-blue: #33f; color: var(--brand-blue); }' },
	{ code: ':root { --brand-blue: #33f; } body { color: var(--brand-blue); }' },
	{ code: 'html { --brand-blue: #33f; } body { color: var(--brand-blue); }' },
	{ code: '* { --brand-blue: #33f; } body { color: var(--brand-blue); }' },
	{ code: '.anything { --brand-blue: #33f; } body { color: var(--brand-blue); }' },
	{ code: ':root { --brand-blue: #33f; --brand-color: var(--brand-blue); }' },
	{ code: '@import \'./test/import-custom-properties.css\'; body { color: var(--brand-red); }' },
	{ code: '@import \'./test/import-custom-properties.css\'; @import \'./test/import-custom-properties123.css\'; body { color: var(--brand-red); }' },
];
reject = [
	{ code: 'body { color: var(--brand-blue); }', message: messages.unexpected('--brand-blue', 'color') },
	{ code: '@import \'./test/import-custom-properties123.css\'; body { color: var(--brand-red); }', message: messages.unexpected('--brand-red', 'color') },
];

testRule({ plugins: ['.'], ruleName, skipBasicChecks, config: true, accept, reject });


/* Test fallbacks
/* ========================================================================== */

accept = [
	{ code: 'body { color: var(--brand-blue, #33f); }' },
];
reject = [
	{ code: 'body { color: var(--brand-blue, var(--brand-red)); }', message: messages.unexpected('--brand-red', 'color') },
];
testRule({ plugins: ['.'], ruleName, skipBasicChecks, config: true, accept, reject });

/* Test enabled: not var()s
/* ========================================================================== */

accept = [
	{ code: 'body { color: brand-blue; }' },
	{ code: 'body { color: var(); }' },
];

testRule({ plugins: ['.'], ruleName, skipBasicChecks, config: true, accept });

/* Test enabled: { importFrom }
/* ========================================================================== */

accept = [
	{ code: 'body { color: var(--brand-blue); }' },
];
reject = [
	{ code: 'body { color: var(--brand-blu); }', message: messages.unexpected('--brand-blu', 'color') },
	{ code: 'body { color: var(--brand-bluez); }', message: messages.unexpected('--brand-bluez', 'color') },
];

testRule({
	plugins: ['.'],
	ruleName,
	config: [true, {
		importFrom: {
			customProperties: {
				'--brand-blue': '#fff',
			},
		},
	}],
	skipBasicChecks,
	accept: ['']
});

accept = [
	{ code: 'body { background-color: var(--brand-red); background: var(--brand-green); border-color: var(--brand-white); color: var(--brand-blue); }' },
];
reject = [
	{ code: 'body { color: var(--brand-blu); }', message: messages.unexpected('--brand-blu', 'color') },
	{ code: 'body { color: var(--brand-bluez); }', message: messages.unexpected('--brand-bluez', 'color') },
];

/*
FIXME: This creates a segmentation fault in node

testRule({
	plugins: ['.'],
	ruleName,
	config: [true, {
		importFrom: [
			'./test/import-custom-properties.mjs',
			'./test/import-custom-properties.json',
			'./test/import-custom-properties.css',
		],
	}],
	skipBasicChecks,
	accept,
	reject,
});

accept = [
	{ code: '@import "import-custom-properties-absolute.css"; body { background-color: var(--brand-red); background: var(--brand-green); }' },
];
reject = [];

testRule({
	plugins: ['.'],
	ruleName,
	config: [true, {
		resolver: {
			paths: './test',
		},
	}],
	skipBasicChecks,
	accept,
	reject,
});
*/
