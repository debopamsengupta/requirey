import niv from 'npm-install-version';
import semver from 'semver';

const globalConfig = {};
let strict = true;

class Requirer {
	constructor(pkg) {
		this.pkgJson = pkg;
	}

	require(name, version, force) {
		const splitPaths = name.split('/');
		name = splitPaths.shift();
		const pathString = splitPaths.join('/');
		const subPath = pathString ? `/${pathString}` : '';

		if (name.split('@')[1]) {
			version = name.split('@')[1];
			name = name.split('@')[0];
		}

		const versionList = globalConfig[name] || [];
		let satisfying_version;
		if (strict) {
			const version_needed = this.pkgJson ? this.pkgJson.dependencies[name] : '*';
			satisfying_version = satisfier(version_needed, versionList);
		}
		else {
			const version_needed = version || (this.pkgJson ? this.pkgJson.dependencies[name] : '*');
			satisfying_version = force ? version : satisfier(version_needed, versionList);
		}
		
		if (!satisfying_version) {
			throw Error('no satisfying version found');
		}

		return require(`${name}@${satisfying_version}${subPath}`);
	}
};

const satisfier = (version, version_list) => {
	if (version_list.length === 0) {
		return null;
	}
	return semver.maxSatisfying(version_list, version);
};

const installAll = () => {
	Object.keys(globalConfig).forEach((moduleName) => {
		const versions = globalConfig[moduleName] || [];
		versions.forEach((version) => {
			install(moduleName, version);
		});
	});
};

const install = (name, version) => {
	const valid_version = version ? semver.validRange(version, true) : 'latest';
	const clean_version = valid_version.split(' ')[0].replace(/(>|=)/g, '');

	if (strict) {
		if (!globalConfig[name]) {
			throw Error(`${name} is not a supported module from the configuration`);
		}

		if (globalConfig[name].indexOf(clean_version) === -1) {
			throw Error(`${name} with version ${clean_version} is not supported in the configuration`);
		}
	}
	niv.install(`${name}@${clean_version}`);
};

module.exports = (configs = {}, options = {}) => {
	if (options.override) {
		Object.keys(globalConfig).forEach((key) => {
			delete globalConfig[key];
		});
	}
	if (options.strict === false) {
		strict = options.strict;
	}
	Object.keys(configs).forEach((config) => {
		if(!Array.isArray(configs[config])) {
			configs[config] = [configs[config]];
		}
	});
	Object.assign(globalConfig, configs);
	return { installAll, install, Requirer };
};