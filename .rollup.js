import { babel } from '@rollup/plugin-babel';

export default {
	input: 'src/index.js',
	output: [
		{ file: 'index.js', format: 'cjs', sourcemap: true },
		{ file: 'index.mjs', format: 'esm', sourcemap: true }
	],
	plugins: [
		babel({
      babelHelpers: 'runtime',
			presets: [
				['@babel/env', { modules: false, targets: { node: 10 } }]
			],
      plugins:["@babel/plugin-transform-runtime"]
		},
    )
	]
};
