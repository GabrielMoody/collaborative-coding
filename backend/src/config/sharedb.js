const ShareDB = require('sharedb')

const backend = new ShareDB({
  db: require('sharedb-mongo')(process.env.MONGO_URL),
});

const connection = backend.connect();

module.exports = {
  connection,
  backend
}