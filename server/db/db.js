// db.js
const mongoose = require('mongoose')
const config = require('../config.js')

const DB_URL = 'mongodb://' + config.db

mongoose.connect(DB_URL, { useUnifiedTopology: true })

mongoose.connection.on('connected', function() {
  console.log('Mongoose connection open to ' + DB_URL)
})
/**
 * 连接异常 error 数据库连接错误
 */
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err)
})
/**
 * 连接断开 disconnected 连接异常断开
 */
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose connection disconnected')
})

module.exports = mongoose
