const expect = require('chai').expect;
const OriginTable = require('../src/origin_table');

describe('OriginTable', () => {
  it('returns a list of rows', done => {
    OriginTable.rows().then(rows => {
      const row = rows[0];

      expect(row.id).to.exist;
      expect(row.Rec).to.exist;
      done();
    });
  });
});
