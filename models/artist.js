// link to mongoose
// 第一步，链接mongoose
const mongoose = require('mongoose')

// define a schema for artists
// 第二步，链接schema
var artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    //nested array for albums, one user to many albums
    albums: [{
        title: String,
        year: Number,
        rating: Number
    }]
})

// make this model public with the name of Artist
// 第三步发布这个schema，取名为Artist
// 就是说，Artist就代表了这个model的名称了
module.exports = mongoose.model('Artist', artistSchema)