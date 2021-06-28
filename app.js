const converter = require('json-2-csv');
const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const userRouter = require('./routes/user');
// const globalErrorHandler = require('./controllers/errorController');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );

  next();
});
// 1) MIDDLEWARES

//Set security HTTP headers
app.use(helmet());

let testVar = global.testVar;

//development logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan());
// }

//app.use(morgan('dev'));

// Limit requests from same API
// const limiter = rateLimit({
//   max: 1000,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!',
// });
// app.use('/api', limiter);

//body parser - reading data from the body into req.body

app.use(bodyParser.json({ limit: '50mb' }));

//app.use(bodyParser.urlencoded({ extended: false }, { limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 5000,
  })
);
app.use(cookieParser());
//app.use(express.json({ limit: '50mb' }));

//Data Sanitization against NoSql Query Injection
app.use(mongoSanitize());

app.use(express.static(path.join(__dirname, 'public')));

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(res.cookies);
  next();
});

// 3) ROUTES

app.use('/api/test-L2', async (req, res, next) => {
  console.log('tests');
  console.log('body', req.body);
  // Requiring users file
  const users = req.body;
  // for (i in users) {
  // teen tak mila toh !push
  // else push
  let usersCopy = [...users];

  let finalDataSet = [];
  // console.log(users);
  // flag; //previous value 0?
  //0 0 0 0

  /**
  1 value !=0 ?" push"
  0  value = 0 flag = true store in aray
  0 value = 0 flag=true store in array
  0  
  0 value =0 flag true, store
  1 value !=0 ,counter value =4  ? if counter > 3, push 4-0's, flag false , counter =0 then push 1
**/

  let flag = false;
  let counter = 0;
  array1 = []; //pushing non zero values
  array2 = []; // for storing 0's
  for (let i in users) {
    if (users[i].RPM != '0' && users[i].RPM > '1500' && flag == false) {
      array1.push(users[i]);
      // console.log('pushed 1');
    } else if (users[i].RPM == '0' && flag == false) {
      counter = counter + 1;
      flag = true;
      array2.push(users[i]);
      // console.log('storing 1');
    } else if (users[i].RPM == '0' && flag == true) {
      array2.push(users[i]);
      counter = counter + 1;
      // console.log('storing 2');
    } else if (users[i].RPM !== '0' && users[i].RPM > '1500' && flag == true) {
      if (counter > 3) {
        // console.log(counter);

        for (var j in array2) {
          array1.push(array2[j]);
        }

        flag = false;
        counter = 0;
        array1.push(users[i]);
        array2 = [];
      } else {
        flag = false;
        counter = 0;
        array1.push(users[i]);
        array2 = [];
      }
    }
  }
  // for (let i in users) {
  //   if (users[i].RPM != 0) {
  //     counter = 0;
  //   }
  //   if (users[i].RPM == 0) {
  //     counter = counter + 1;
  //     if (counter > 3 && users[i].RPM) {
  //       // console.log('counter', counter);
  //       finalDataSet.push(users[i]);
  //     }
  //   }

  //   if (users[i].RPM > 1500) {
  //     // console.log('counter', counter);
  //     finalDataSet.push(users[i]);
  //   }
  // }
  // let finaldataset1 = [];
  // for (let i in finalDataSet) {
  //   if (finalDataSet[i].RPM == 0) {
  //     counter = counter + 1;
  //   }
  //   if (counter > 3) {
  //     console.log('counter', counter);
  //     finaldataset1.push(finalDataSet[i]);
  //     counter = 0;
  //   }
  // }
  converter.json2csv(array1, (err, csv) => {
    if (err) {
      throw err;
    }

    // print CSV string
    // console.log(csv);

    // write CSV to a file
    fs.writeFileSync('finalDataSet.csv', csv);
  });
  // }

  //console.log(users);
  res.status(200).json({
    status: 'success',
    data: array1.length,
    array1,
    // data1: finaldataset1.length,
  });
});

app.use('/api/users', userRouter);

// // app.use(globalErrorHandler);

module.exports = app;
