const productsList = require('../models/ProductsList');
const dataJson = require('.././dataUsers.json');
const { promisify } = require('util');
const request = promisify(require('request'));
const idConnections = require('../models/id_connectionsModel');
const nullChecker = require('./nullChecker');
const MongoClient = require('mongodb').MongoClient;
exports.getAllProductsList = async (req, res, next) => {
  const getAllCountries = await productsList.find({});

  let list = [];
  let selectedCountry = dataJson.products.map((item, index) => {
    let countryFilter = item.countries.filter((item) => {
      //   console.log(item);
      if (item == 'US') list.push(dataJson.products[index]);
    });
  });
  //   console.log(list);

  //   console.log(dataJson.products.length);
  //   console.log(selectedCountry);

  let data = list.slice(
    (req.query.pageNumber - 1) * req.query.pageSize,
    req.query.pageNumber * req.query.pageSize
  );

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: data,
  });
};

incrementIdConnectionKey = async (key, transactionSession, callback) => {
  console.log('incrementIdConnectionKey', key, transactionSession, callback);

  if (nullChecker(transactionSession)) {
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
          db.collection('id_connections').findOneAndUpdate(
            {
              key,
            },
            {
              $inc: {
                count: 1,
              },
              $setOnInsert: {
                key,
              },
            },
            {
              returnOriginal: false,
              upsert: true,
            },
            (err, result) => {
              if (err) callback(err);
              else callback(null, result);
            }
          );
        }
      }
    );

    console.log('in if');
  } else {
    console.log('in else');

    await idConnections.findOneAndUpdate(
      {
        key,
      },
      {
        $inc: {
          count: 1,
        },
        $setOnInsert: {
          key,
        },
      },
      {
        returnOriginal: false,
        session: transactionSession.session,
        upsert: true,
      },
      (err, result) => {
        if (err) callback(err);
        else callback(null, result.value.count);
      }
    );
  }
};

exports.getStocksOfAProduct = async (req, res, next) => {
  let userId = '2';
  let orderId =
    Date.now().toString(36) + Math.random().toString(36).substr(2) + userId;

  // HTTP GET /api/Acquisition/stock/{productCode}?client_order_id={orderId}&client_user_id={userId}
  const { statusCode, body } = await request(
    'https://jsonplaceholder.typicode.com/posts',
    {
      json: true,
    }
  );

  console.log(statusCode);
  res.status(200).json({
    status: 'success',
    statusCode,
    userId,
    orderId,
    results: body.length,
    data: body,
  });
};

exports.buyGiftCard = async (req, res, next) => {
  // /api/Acquisition/stock/lock
  let orderId = 'kq8x6sfzm0c9uklfm8s12';
  incrementIdConnectionKey('gift_card_order_i1', null, (err, orderDetails) => {
    if (err) {
      console.log(error, err);
    } else {
      console.log('no error', orderDetails);
    }
  });
  console.log(req.body);

  const { statusCode, body } = await request(
    // /api/Acquisition/stock/lock
    'https://jsonplaceholder.typicode.com/posts',
    {
      json: true,
    }
  );

  res.status(200).json({
    status: 'success',
  });
};
