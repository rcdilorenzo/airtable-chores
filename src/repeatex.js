const axios = require('axios')
const moment = require('node-moment');
const R = require('ramda');
const strftime = require('strftime');
const qs = require('query-string');
const env = require('../env');

const DAYS = ['Sun', 'Mond', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

const _preprocess = (date, repeatDescription) =>
      R.any(d => repeatDescription.includes(d), DAYS) ?
      repeatDescription :
      `${repeatDescription} ${DAYS[date.getDay()]}`;

const nextDate = (date, repeatDescription) => {
  const params = {
    value: _preprocess(date, repeatDescription),
    date: strftime('%Y-%m-%d', date)
  };

  return axios.request({
    method: 'get',
    url: `${env.REPEATEX_URL}/api?${qs.stringify(params)}`
  }).then(r => {
    return moment(r.data.dates[1]).toDate();
  });
};

module.exports = { nextDate };
