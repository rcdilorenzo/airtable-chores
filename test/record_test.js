const expect = require('chai').expect;
const R = require('ramda');
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
    'Completed Date': '2019-05-17',
    'Reoccur Type': 'After Due Date'
  };

  it('parses due date', () => {
    expect(Record.dueDate(data)).to.eql(new Date(2019, 4, 16));
  });

  it('parses completed date', () => {
    expect(Record.completedDate(data)).to.eql(new Date(2019, 4, 17));
  });

  it('determines next repeat date based on due date', done => {
    Record.nextDate(data).then(nextDate => {
      // June 13, 2019
      expect(nextDate).to.eql(new Date(2019, 5, 13));
      done();
    });
  });

  it('determines next repeat date based on completion date', done => {
    const modifiedData = {
      ...data,
      'Reoccur Type': 'After Completion'
    };

    Record.nextDate(modifiedData).then(nextDate => {
      // June 14, 2019
      expect(nextDate).to.eql(new Date(2019, 5, 14));
      done();
    });
  });

  it('returns null date with an invalid reoccur type', done => {
    const modifiedData = {
      ...data,
      'Reoccur Type': 'Not Yet Scheduled'
    };

    Record.nextDate(modifiedData).then(nextDate => {
      expect(nextDate).to.eql(null);
      done();
    });
  });

  it('prepares data for archive', () => {
    expect(Record.prepareForArchive(data)).to.eql(R.omit(['Rec'], data));
  });

  it('increments next date', done => {
    const expectedData = {
      Rec: 1236,
      Name: 'Jacob',
      Chores: 'Check/swap/refill bathroom soap dispensers',
      'Specific Day of Week': 'Thursday',
      Frequency: 'Every 4 weeks',
      Type: 'Active',
      Status: null,
      'Due Date': '2019-06-13',
      'Completed Date': null,
      'Reoccur Type': 'After Due Date'
    };

    Record.incrementNextDate(data).then(newData => {
      expect(newData).to.eql(expectedData);
      done();
    });
  });
});
