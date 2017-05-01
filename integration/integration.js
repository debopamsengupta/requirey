const requirey = require('../dist/index');
const expect = require('chai').expect;

const config = {
  lodash: ['1.3.1', '2.4.2', '3.10.1']
};

describe('requirey - integration', () => {
  let ry;
  before(() => {
    ry = requirey(config);
  });

  it('should install all and be requireable', () => {
    ry.installAll();
    let requirer = new ry.Requirer();
    let a = requirer.require('lodash@1.3.1');
    expect(a.VERSION).to.equal('1.3.1'); 

    let b = requirer.require('lodash@2.4.2');
    expect(b.VERSION).to.equal('2.4.2');

    let c = requirer.require('lodash@3.10.1');
    expect(c.VERSION).to.equal('3.10.1');
  });

  it('should find correct version intelligently', () => {
    let requirer_1 = new ry.Requirer({
      dependencies: {
        lodash: '^3.0.0'
      }
    });

    let a = requirer_1.require('lodash');
    expect(a.VERSION).to.equal('3.10.1');

    let requirer_2 = new ry.Requirer({
      dependencies: {
        lodash: '^2.0.0'
      }
    });

    let b = requirer_2.require('lodash');
    expect(b.VERSION).to.equal('2.4.2');
  });
});