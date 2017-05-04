import niv from 'npm-install-version';
import multi from './index';

jest.mock('npm-install-version', () => ({
    install: jest.fn(),
    require: jest.fn()
  })
);

jest.mock('lodash@3.0.0', () => 'lodash@3.0.0', { virtual: true });
jest.mock('lodash@2.0.0', () => 'lodash@2.0.0', { virtual: true });
jest.mock('lodash@2.0.0/package.json', () => 'lodash@2.0.0/package.json', { virtual: true });
jest.mock('lodash@15.0.0', () => 'lodash@15.0.0', { virtual: true });
jest.mock('lodash@2.2.0', () => 'lodash@2.2.0', { virtual: true });
jest.mock('lodash@3.1.6', () => 'lodash@3.1.6', { virtual: true });
jest.mock('lodash@3.1.6/package.json', () => 'lodash@3.1.6/package.json', { virtual: true });

describe('requirey', () => {
  describe('installAll', () => {
    it('should call install correctly', () => {
      let config = {
        lodash: ['1.0.0', '2.0.0']
      };
      let underTest = multi(config);
      underTest.installAll();
      expect(niv.install).toHaveBeenCalledTimes(2);
      expect(niv.install).toHaveBeenCalledWith('lodash@1.0.0');
      expect(niv.install).toHaveBeenCalledWith('lodash@2.0.0');
      niv.install.mockClear();
    });
  });

  describe('install', () => {
    let underTest;
    beforeEach(() => {
      underTest = multi({});
    });

    afterEach(() => {
      niv.install.mockClear();
    })

    it('should install correctly with absolute versions', () => {
      underTest.install('lodash', '1.0.0');
      expect(niv.install).toHaveBeenCalledTimes(1);
      expect(niv.install).toHaveBeenCalledWith('lodash@1.0.0');
    });

    it('should install correctly with caret', () => {
      underTest.install('lodash', '^1.1.0');
      expect(niv.install).toHaveBeenCalledTimes(1);
      expect(niv.install).toHaveBeenCalledWith('lodash@1.1.0');
    });

    it('should install correctly with tilde', () => {
      underTest.install('lodash', '~1.1.0');
      expect(niv.install).toHaveBeenCalledTimes(1);
      expect(niv.install).toHaveBeenCalledWith('lodash@1.1.0');
    });

    it('should install correctly with no version', () => {
      underTest.install('lodash');
      expect(niv.install).toHaveBeenCalledTimes(1);
      expect(niv.install).toHaveBeenCalledWith('lodash@latest');
    });
  });

  describe('requirer', () => {
    let underTest;
    afterEach(() => {
      niv.require.mockClear();
    });
    it('should throw error when no config', () => {
      underTest = multi({}, true);
      const requirer = new underTest.Requirer();
      expect(() => {requirer.require('lodash')}).toThrowError('no satisfying version found');
    });

    it('should throw error when no correct version', () => {
      underTest = multi({ lodash: ['1.0.0'] }, true);
      const requirer = new underTest.Requirer({ dependencies: { lodash: '^2.0.0' } });
      expect(() => {requirer.require('lodash')}).toThrowError('no satisfying version found');
    });

    it('should throw error when not in package.json', () => {
      underTest = multi({ lodash: ['1.0.0'] }, true);
      const requirer = new underTest.Requirer({ dependencies: { something: '^2.0.0' } });
      expect(() => {requirer.require('lodash')}).toThrowError('no satisfying version found');
    });

    it('should throw error when trying to get wrong version', () => {
      underTest = multi({ lodash: ['2.0.0'] }, true);
      const requirer = new underTest.Requirer({ dependencies: { lodash: '^2.0.0' } });
      expect(() => {requirer.require('lodash', '3.0.0')}).toThrowError('no satisfying version found');
    });

    it('should not throw error when force to get version', () => {
      underTest = multi({ lodash: ['2.0.0'] }, true);
      const requirer = new underTest.Requirer({ dependencies: { lodash: '^2.0.0' } });
      let a = requirer.require('lodash', '3.0.0', true);
      expect(a).toBe('lodash@3.0.0');
    });

    it('should get correct version from name', () => {
      underTest = multi({ lodash: ['2.0.0'] }, true);
      const requirer = new underTest.Requirer({ dependencies: { lodash: '^2.0.0' } });
      let a = requirer.require('lodash@~2.0.0');
      expect(a).toBe('lodash@2.0.0');
    });

    it('should get max possible version when no package.json given', () => {
      underTest = multi({ lodash: ['2.0.0', '3.0.0', '15.0.0'] }, true);
      const requirer = new underTest.Requirer();
      let a = requirer.require('lodash');
      expect(a).toBe('lodash@15.0.0');
    });

    it('should get correct version based on package.json given with caret', () => {
      underTest = multi({ lodash: ['2.0.0', '2.2.0', '3.0.0', '15.0.0'] }, true);
      const requirer = new underTest.Requirer({ dependencies: { lodash: '^2.0.0' } });
      let a = requirer.require('lodash');
      expect(a).toBe('lodash@2.2.0');
    });

    it('should get correct version based on package.json given with tilde', () => {
      underTest = multi({ lodash: ['2.0.0', '3.0.0', '3.1.6', '3.2.0'] }, true);
      const requirer = new underTest.Requirer({ dependencies: { lodash: '~3.1.0' } });
      let a = requirer.require('lodash');
      expect(a).toBe('lodash@3.1.6');
    });

    it('should require subpath', () => {
      underTest = multi({ lodash: ['2.0.0', '3.0.0', '3.1.6', '3.2.0'] }, true);
      const requirer = new underTest.Requirer({ dependencies: { lodash: '~3.1.0' } });
      let a = requirer.require('lodash/package.json');
      expect(a).toBe('lodash@3.1.6/package.json');
    });

    it('should require subpath with specified version', () => {
      underTest = multi({ lodash: ['2.0.0', '3.0.0', '3.1.6', '3.2.0'] }, true);
      const requirer = new underTest.Requirer({ dependencies: { lodash: '~3.1.0' } });
      let a = requirer.require('lodash@2.0.0/package.json');
      expect(a).toBe('lodash@2.0.0/package.json');
    });
  });
});