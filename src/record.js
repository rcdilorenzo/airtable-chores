const R = require('ramda');
const moment = require('node-moment');
const strftime = require('strftime');

const repeatex = require('./repeatex');

const getDate = key => R.pipe(R.prop(key), moment, m => m.toDate());
const setDate = R.curry((key, date, object) =>
  R.assoc(key, date ? strftime('%Y-%m-%d', date) : null, object)
);

const dateLens = key => R.lens(getDate(key), setDate(key));

const lenses = {
  rec: R.lensProp('Rec'),
  name: R.lensProp('Name'),
  choreDescription: R.lensProp('Chore Description'),
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
const setters = R.map(R.set, lenses);

const prepareForArchive = record => {
  const keys = [
    'Name', 'Chores', 'Specific Day of Week', 'Frequency', 'Type', 'Status',
    'Chore Description', 'Reoccur Type', 'Due Date', 'Completed Date'
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

const incrementNextDate = record => {
  return nextDate(record)
    .then(newDate => R.pipe(
      setters.status(null),
      setters.completedDate(null),
      setters.choreDescription(null),
      setters.dueDate(newDate)
    )(record)
  );
};

module.exports = {
  ...accessors,
  nextDate,
  reoccurDate,
  prepareForArchive,
  incrementNextDate
};
