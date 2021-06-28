const mongoose = require('mongoose');
let da = '2017-01-25 14:17:58.735130';
// let date = new Date(d).toLocaleString().slice(0, 10);
let d = new Date(da);

date = [
  d.getFullYear(),
  ('0' + (d.getMonth() + 1)).slice(-2),
  ('0' + d.getDate()).slice(-2),
].join('-');

console.log(date);

productsListBasedOnCountry = 'products sheet';

//order Schema
const orderSchema = new mongoose.Schema({
  userId: String,
  orderId: String,
  productCode: String,
  productName: String,
  currencyCode: Number,
  amount: String,
  discount: Number, //discount Percentage
  deliveryMethod: { type: String, default: 'email' }, //email/direct
  deliveryFormat: { type: String, default: 'raw' },
  paymentId: { type: String, default: String },
  quantity: Number,
  orderStatus: { type: Boolean, default: false },
});

const giftCardOrder = mongoose.model('giftCardOrder', giftCardOrderSchema);

module.exports = giftCardOrder;
