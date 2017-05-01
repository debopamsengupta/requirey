import niv from 'npm-install-version';
import semver from 'semver';

const config = {};

class Requirer {
	constructor(pkg) {
		this.pkgJson = pkg;
	}

	require(name, version, force) {
		if (name.split('@')[1]) {
			version = name.split('@')[1];
			name = name.split('@')[0];
		}
		const versionList = config[name] || [];
		const version_needed = version || (this.pkgJson ? this.pkgJson.dependencies[name] : '*');
		const satisfying_version  = force ? version : satisfier(version_needed, versionList);
		if (!satisfying_version) {
			throw Error('no satisfying version found');
		}
		return niv.require(`${name}__${satisfying_version}`);
	}
};

const satisfier = (version, version_list) => {
	if (version_list.length === 0) {
		return null;
	}
	return semver.maxSatisfying(version_list, version);
};

const installAll = () => {
	Object.keys(config).forEach((moduleName) => {
		const versions = config[moduleName] || [];
		versions.forEach((version) => {
			install(moduleName, version);
		});
	});
};

const install = (name, version) => {
	const valid_version = version ? semver.validRange(version, true) : 'latest';
	const clean_version = valid_version.split(' ')[0].replace(/(>|=)/g, '');
	niv.install(`${name}@${clean_version}`, { destination: `${name}__${clean_version}` });
};

module.exports = function(opts, override) {
	if (override) {
		Object.keys(config).forEach((key) => {
			delete config[key];
		});
	}
	Object.assign(config, opts);
	return { installAll, install, Requirer };
};