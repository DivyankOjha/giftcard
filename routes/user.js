const express = require('express');

const router = express.Router();
const ProductController = require('../controllers/productListController');

router.get('/productsList', ProductController.getAllProductsList);
router.get('/availability-of-product', ProductController.getStocksOfAProduct);
router.post('/buy-giftcard', ProductController.buyGiftCard);

module.exports = router;
