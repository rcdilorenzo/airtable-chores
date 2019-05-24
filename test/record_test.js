const expect = require('chai').expect;
const Record = require('../src/record');

describe('Record', () => {
  const data = {
    Rec: 1236,
    Name: 'Jacob',
    Chores: 'Check/swap/refill bathroom soap dispensers',
    'Specific Day of Week': 'Thursday',
    Frequency: 'Every 4 weeks',
    Type: 'Active',
    Status: 'On-Time',
    'Due Date': '2019-05-16',
    'Completed Date': '2019-05-17'
  };

  it('parses due date', () => {
    expect(Record.dueDate(data)).to.eql(new Date(2019, 4, 16));
  });

  it('parses completed date', () => {
    expect(Record.completedDate(data)).to.eql(new Date(2019, 4, 17));
  });

  it('determines next repeat date', done => {
    Record.nextDate(data).then(nextDate => {
      // June 13, 2019
      expect(nextDate).to.eql(new Date(2019, 5, 13));
      done();
    });
  })
});
