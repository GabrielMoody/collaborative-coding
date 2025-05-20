const ShareDB = require('sharedb')

const backend = new ShareDB({
  db: require('sharedb-mongo')('mongodb://localhost:27017/collabs')
});

const connection = backend.connect();

module.exports = {
  connection,
  backend
}