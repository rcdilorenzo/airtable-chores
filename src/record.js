const R = require('ramda');
const moment = require('node-moment');

const repeatex = require('./repeatex');

const date = key => R.pipe(R.prop(key), moment, m => m.toDate());

const accessors = {
  rec: R.prop('Rec'),
  name: R.prop('Name'),
  chores: R.prop('Chores'),
  specificDayOfWeek: R.prop('Specific Day of Week'),
  frequency: R.prop('Frequency'),
  type: R.prop('Type'),
  status: R.prop('Status'),
  dueDate: date('Due Date'),
  completedDate: date('Completed Date')
};

const nextDate = record => {
  const { dueDate, frequency } = accessors;
  return repeatex.nextDate(dueDate(record), frequency(record));
};

module.exports = {
  ...accessors,
  nextDate
};
