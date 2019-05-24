const R = require('ramda');
const moment = require('node-moment');
const strftime = require('strftime');

const repeatex = require('./repeatex');

const toDate = key => R.pipe(R.prop(key), moment, m => m.toDate());

const dateLens = key => R.lens(toDate(key), d => strftime('%Y-%m-%d', d));

const lenses = {
  rec: R.lensProp('Rec'),
  name: R.lensProp('Name'),
  chores: R.lensProp('Chores'),
  specificDayOfWeek: R.lensProp('Specific Day of Week'),
  frequency: R.lensProp('Frequency'),
  type: R.lensProp('Type'),
  status: R.lensProp('Status'),
  reoccurType: R.lensProp('Reoccur Type'),
  dueDate: dateLens('Due Date'),
  completedDate: dateLens('Completed Date')
};

const accessors = R.map(R.view, lenses);

const prepareForArchive = record => {
  const keys = [
    'Name', 'Chores', 'Specific Day of Week', 'Frequency', 'Type', 'Status',
    'Reoccur Type', 'Due Date', 'Completed Date'
  ];

  return R.pick(keys, record);
};

const reoccurDate = record => {
  const { dueDate, completedDate, reoccurType } = accessors;

  const dateProp = R.propOr(() => null, reoccurType(record), {
    'After Due Date': dueDate,
    'After Completion': completedDate
  });

  return dateProp(record);
};

const nextDate = record => {
  const { frequency } = accessors;

  const date = reoccurDate(record);
  if (date) {
    return repeatex.nextDate(date, frequency(record));
  } else {
    return Promise.resolve(null);
  }
};

module.exports = {
  ...accessors,
  nextDate,
  reoccurDate,
  prepareForArchive
};
