const mongoose = require('mongoose');
const username = encodeURIComponent(process.env.MONGO_USERNAME);

const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const clusterUrl = process.env.MONGO_CLUSTER;
const authSource = "admin";
const database = process.env.MONGO_DB;
let proto = 'mongodb'
if (typeof process.env.MONGO_IS_SRV !== 'undefined') {
  if (process.env.MONGO_IS_SRV == 'yes') {
    proto = 'mongodb+srv'
  }
}
const uri = `${proto}://${username}:${password}@${clusterUrl}/${database}`;
const options = { useNewUrlParser: true, authSource: authSource };
mongoose.connect(uri, options).then(
  /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
  () => { console.log('Conectado a DB ' +  process.env.MONGO_DB) },
  /** handle initial connection error */
  err => { console.log(err) }
);