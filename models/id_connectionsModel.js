const mongoose = require('mongoose');

//order Schema
const id_connectionsSchema = new mongoose.Schema({
  key: String,
  count: { type: Number, default: 0 },
});

const id_connections = mongoose.model('id_connections', id_connectionsSchema);

module.exports = id_connections;
