[![npm version](https://img.shields.io/npm/v/requirey.svg)](https://www.npmjs.com/package/requirey)
[![Build Status](https://img.shields.io/travis/debopamsengupta/requirey.svg)](https://travis-ci.org/debopamsengupta/requirey)
[![Windows Build Status](https://img.shields.io/appveyor/ci/debopamsengupta/requirey/master.svg?label=appveyor)](https://ci.appveyor.com/project/debopamsengupta/requirey)

![Logo](https://www.dropbox.com/s/a89s7cegzye0d79/requirey.png?dl=1)

Intelligent multi-version dependency management for npm packages.

### Install
`npm install --save requirey`

### Usage

- #### Initialize 

```js
const ry = require('requirey')(config, options);
```
`config` - object of module names mapped to arrays of supported versions   
`options` - extra options to override default behaviors like `strict`

**Default behavior is strict mode enabled which will always use config to determine which versions can be installed and required**

**Strict mode will ignore version overrides for require calls**

eg: 
```js
{
  "lodash": ['1.0.0', '2.1.2'],
  ...
}
```

- #### Install

```js
ry.installAll();
```
or
```js
ry.install('lodash');
// or
ry.install('lodash', '1.0.0');
ry.install('lodash', '2.0.0');
```

- #### Require

```js
const requirer = new ry.Requirer(pkgJson);

requirer.require('lodash'); // ==> highest possible version supported
requirer.require('lodash@1.0.0'); // ==> version 1.0.0
requirer.require('lodash', '^2.0.0'); // ==> highest version in the range between 2.0.0 and 3.0.0
requirer.require('lodash', '~2.2.0'); // ==> highest version in the range between 2.2.0 to 2.3.0
requirer.require('lodash/fp/curry'); // ==> require sub-paths from auto-detected version
requirer.require('lodash@3.0.0/array/chunk'); // ==> require sub-paths from particular version
```

The `require` method also takes an optional third parameter:

`force` - boolean ==> Forces a require call for a particular version

```js
requirer.require('lodash', '4.0.0', true);
```

#### Built Using

- [npm-install-version](https://www.npmjs.com/package/npm-install-version)
- [semver](https://www.npmjs.com/package/semver)
