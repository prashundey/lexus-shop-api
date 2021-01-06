// Imports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/lexus-shop', {useNewUrlParser: true, useUnifiedTopology: true});

var Product = require('./model/product');
var Wishlist = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// ---------------------------------- PRODUCT ----------------------------------

// Create Product Database, Handle Post Request from Client
app.post('/product', function(request, response){
	var product = new Product({
		title: request.body.title,
		price: request.body.price,
    imgURL: request.body.imgURL
	});

	product.save(function(err, savedProduct) {
		if (err)
			response.status(500).send({error: "Could Not Save Product"});
		else
			response.status(200).send(savedProduct);
	});
});

// Handle Get Request from Client: Fetches whole Inventory
app.get('/product', function(request, response){
	// Asynchronous Function - running on seperate thread
	Product.find({}, function(err, products) {
		if (err)
			response.status(500).send({error: "Could Not Fetch Product"});
		else
			response.status(200).send(products);
	});
});


// ---------------------------------- WISHLIST ---------------------------------

// Create New Wishlist, Handle Post Request from Client
app.post('/wishlist', function(request, response) {
	var wishlist = new Wishlist();
	wishlist.title = request.body.title;

	wishlist.save(function(err, newWishList){
		if (err)
			response.status(500).send({error: "Could Not Create Wishlist"});
		else
			response.send(newWishList);
	});
});

// Update Wishlist with Product
app.put('/wishlist/product/add', function(request, response){
	Product.findOne({_id: request.body.productId}, function(err, product){
		if (err)
			response.status(500).send({error: "Could Not Fetch Product"});
		else {
			Wishlist.updateOne({_id:request.body.wishlistId}, {$addToSet: {products: product._id}},
				function(err, wishlistStatus){
					if (err)
						response.status(500).send({error: "Could Not Add Item to Wishlist"});
					else
						response.send(wishlistStatus);
			});
		}
	});
});

// Handle Get Request from Client: Fetches Inventory with Product Data Populated Within
app.get('/wishlist', function(request, response){
	Wishlist.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wishlists){
		if (err)
			response.status(500).send({error: "Could Not Fetch Wishlist"});
		else
			response.send(wishlists);
	});
});

app.listen(3000, function() {
    console.log("Lexus Shop API running on port 3000...")
});
