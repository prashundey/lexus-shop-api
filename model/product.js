var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product = new Schema({
    title: String,
    price: Number,
    imgURL: {type: String, default: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"},
    likes: {type: Number, default: 0}
});

module.exports = mongoose.model('Product', product);
