// index.js
const mongoose = require('./db')
const Schema = mongoose.Schema

const uuidSchema = new Schema({
  uuid: String,
  unionid: String,
  openid: String,
  nickname: String,
  avatar: String
})

const MyModel = mongoose.model('uuids', uuidSchema)

class Mongodb {
  constructor() {}
  // 查询
  query(params) {
    return new Promise((resolve, reject) => {
      MyModel.find(params || {}, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }
  // 保存
  save(obj) {
    const m = new MyModel(obj)
    return new Promise((resolve, reject) => {
      m.save((err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
        console.log(res)
      })
    })
  }
}
module.exports = new Mongodb()
