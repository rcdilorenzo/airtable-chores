const table = require('./airtable').client.dest;
const Record = require('./record');

const copyFromOriginRecord = record => {
  return table.create(Record.prepareForArchive(record));
};

module.exports = {
  copyFromOriginRecord
};
