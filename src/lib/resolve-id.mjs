import resolve from 'resolve';

export function resolveId(id, basedir, {
	paths = [],
	moduleDirectories = ['node_modules'],
	extensions = ['.css'],
} = {},
) {
	const resolveOpts = {
		basedir,
		moduleDirectory: moduleDirectories,
		paths,
		extensions,
		preserveSymlinks: false,
	};
	return new Promise((res, rej) => {
		resolve(id, resolveOpts, (err, resolvedPath) => err ? rej(err) : res(resolvedPath));
	});
}
