const env = require('../env');

const Airtable = require('airtable');
Airtable.configure({ apiKey: env.API_KEY });

const client = {
  origin: Airtable.base(env.ORIGIN_BASE)(env.ORIGIN_RECUR_TABLE),
  dest: Airtable.base(env.DEST_BASE)(env.DEST_TABLE)
};

module.exports = { client };
