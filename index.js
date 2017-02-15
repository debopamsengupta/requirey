const niv = require('npm-install-version');
const semver = require('semver');

let global_config;
let currentPkg;

const init = (config, pkg) => {
	global_config = config;
	currentPkg = pkg || {};
}

const setPackage = (pkg) => {
	currentPkg = pkg;
}

const oc_require = (moduleName) => {
	let versions = global_config[moduleName] || [];
	if (versions.length === 0) {
		return require(moduleName); //if no such module is installed
	}
	const version_needed = currentPkg.dependencies[moduleName];
	const satisfying_versions = versions.filter((v) => {
		return semver.satisfies(v, version_needed);
	});

	if (satisfying_versions.length === 0) {
		return require(moduleName); //module installed but not satisfying version [hope to avoid]
	}

	const final_version = satisfying_versions.sort(semver.rcompare).shift();
	return niv.require(`${moduleName}@${final_version}`);
}

module.exports = {
	init: init,
	setPackage: setPackage,
	require: oc_require
};
