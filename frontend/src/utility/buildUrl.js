export default function buildUrl(...args) {
	const url = args.join('/');
	return url.replace(/\\/g, '/');
}
