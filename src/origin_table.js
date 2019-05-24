const R = require('ramda');
const table = require('./airtable').client.origin;
const Record = require('./record');

const rows = () => {
  return table
    .select({
      view: 'Grid view',
      filterByFormula: "AND({Type} = 'Active', {Due Date} != '', {Completed Date} != '')"
    })
    .all()
    .then(R.map(R.prop('fields')))
    .then(R.tap(console.log))
    .catch(console.log);
};

const incrementAndInsert = R.pipe(
  Record.incrementNextDate,
  R.then(R.pipe(Record.prepareForArchive, table.create))
);

module.exports = {
  rows, incrementAndInsert
};
