const R = require('ramda');
const strftime = require('strftime');

const Record = require('./src/record');
const OriginTable = require('./src/origin_table');
const DestTable = require('./src/dest_table');

const log = msg => R.tap(() => console.log(msg));

const id = R.pipe(
  R.juxt([
    Record.rec,
    R.compose(d => strftime('%Y-%m-%d', d), Record.dueDate),
    Record.chores
  ]),
  R.join(' '),
  x => `[${x}]`
);

const processRecord = record => {
  return R.pipe(
    log(`${id(record)}: COPY`),
    DestTable.copyFromOriginRecord,

    R.then(log(`${id(record)}: INCREMENT AND INSERT`)),
    R.then(() => OriginTable.incrementAndInsert(record)),

    R.then(log(`${id(record)}: DELETE ORIGINAL`)),
    R.then(inserted =>
      OriginTable.destroy(record.id).then(() => inserted)
    )
  )(record);
};

const main = () => {
  return OriginTable.rows()
    .then(records => Promise.all(records.map(processRecord)))
    .then(r => console.log(`Processed ${r.length} records`));
};

exports.handler = main;
