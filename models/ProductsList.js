const mongoose = require('mongoose');

const productsListSchema = new mongoose.Schema({
  Name: String,
  Country: String,
  Currency: String,
});

const productsList = mongoose.model('productsList', productsListSchema);

module.exports = productsList;
