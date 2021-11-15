//第一步，链接mongdb，并且需要passport
const mongoose = require('mongoose')
const plm = require('passport-local-mongoose') // need this module so this model can be used for auth

//第二步，建立一个userSchema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,

})

// use passport-local-mongoose to extend this model's functionality so it can include User Management & Authentication
// 第三步，让这个userSchema去扩展，使得这个包括了password的
userSchema.plugin(plm)

module.exports = mongoose.model('User', userSchema)
//结束后前往挨app.js