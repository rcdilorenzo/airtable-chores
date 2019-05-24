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
  reoccurType: R.prop('Reoccur Type'),
  dueDate: date('Due Date'),
  completedDate: date('Completed Date')
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
  nextDate
};
