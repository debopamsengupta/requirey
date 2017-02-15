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
	const satisfying_version = _satisfier(version_needed, versions);

	if (!satisfying_version) {
		return require(moduleName); //module installed but not satisfying version [hope to avoid]
	}
	return niv.require(`${moduleName}@${satisfying_version}`);
}

const _satisfier = (version, version_list) => {
	return semver.maxSatisfying(version_list, version);
}

const oc_install = (pkg) => {
	let install_package = currentPkg || pkg;
	const deps = install_package.dependencies;
	for(dep in deps) {
		if (!_satisfier(deps[dep], global_config[dep])) {
			let valid_version = semver.validRange(deps[dep], true);
			let clean_version = valid_version.split(' ')[0].replace(/(>|=)/g, '');
			niv.install(`${dep}@${clean_version}`);
			if (!global_config[dep]) {
				global_config[dep] = [];
			}
			global_config[dep].push(clean_version);
		}
	}
	return global_config;
}

module.exports = {
	init: init,
	setPackage: setPackage,
	require: oc_require,
	install: oc_install
};
