const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const MongoClient = require('mongodb').MongoClient;
const { db } = require('./models/ProductsList');
var Db = require('mongodb').Db;
const http = require('http').createServer(app);
// const server = require('http').createServer(app);

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message, err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB =
  'mongodb+srv://divyankojha:VDNVb5ZLokqtfBKl@cluster0.chllg.mongodb.net/TookOne';

// mongoose
//   .connect(DB, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(() => {
//     console.log('DB connection successfull');
//   });
MongoClient.connect(
  'mongodb+srv://divyankojha:VDNVb5ZLokqtfBKl@cluster0.chllg.mongodb.net/TookOne',
  {
    useUnifiedTopology: true,
  },
  function (err, _db) {
    if (err) {
      console.log(err);
    } else {
      console.log('connected');
      let mongoClient = _db;
      let db = mongoClient.db();
    }
  }
);

const port = process.env.PORT || 4000;

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
