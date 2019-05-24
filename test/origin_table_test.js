const expect = require('chai').expect;
const OriginTable = require('../src/origin_table');

describe('OriginTable', () => {
  it('returns a list of rows', done => {
    OriginTable.rows().then(rows => {
      expect(rows).to.not.equal(null);
      done();
    });
  });
});
