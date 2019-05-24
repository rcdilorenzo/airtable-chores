const R = require('ramda');
const table = require('./airtable').client.origin;

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

module.exports = {
  rows
};
