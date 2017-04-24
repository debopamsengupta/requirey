import requirey from '../src/index';

const config = {
  lodash: ['1.3.1', '2.4.2', '3.10.1']
};

describe('requirey - integration', () => {
  let ry;
  beforeAll(() => {
    ry = requirey(config);
  });

  it('should install all and be requireable', () => {
    ry.installAll();
    let requirer = new ry.Requirer();
    let a = requirer.require('lodash@1.3.1');
    let b = requirer.require('lodash@2.4.2');
    let c = requirer.require('lodash@3.10.1');

    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
    expect(c).toBeTruthy();
  });

  it('should fetch correct version', () => {
    let requirer = new ry.Requirer();
    let a = requirer.require('lodash@1.3.1');
    expect(a.drop).toBeTruthy(); //for 1.x
    expect(a.findLastIndex).toBeFalsy(); //for 2.x
    expect(a.chunk).toBeFalsy(); //for 3.x

    let b = requirer.require('lodash@2.4.2');
    expect(b.drop).toBeTruthy(); //for 1.x
    expect(b.findLastIndex).toBeTruthy(); //for 2.x
    expect(b.chunk).toBeFalsy(); //for 3.x

    let c = requirer.require('lodash@3.10.1');
    expect(c.drop).toBeTruthy(); //for 1.x
    expect(c.findLastIndex).toBeTruthy(); //for 2.x
    expect(c.chunk).toBeTruthy(); //for 3.x
  });

  it('should find correct version intelligently', () => {
    let requirer_1 = new ry.Requirer({
      dependencies: {
        lodash: '^3.0.0'
      }
    });

    let a = requirer_1.require('lodash');
    expect(a.chunk).toBeTruthy();

    let requirer_2 = new ry.Requirer({
      dependencies: {
        lodash: '^2.0.0'
      }
    });

    let b = requirer_2.require('lodash');
    expect(b.chunk).toBeFalsy();
    expect(b.findLastIndex).toBeTruthy();
  });
});