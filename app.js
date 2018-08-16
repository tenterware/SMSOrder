var express = null;
var app = null;
var fs = null;
var path = null;
var fileUpload = null;
var itemManager = null;
var orderManager = null;
const PORT = 40000;
const PATH_DATABASE = 'database';
const PATH_IMAGE = 'image';
const PATH_IMAGE_ITEM = PATH_IMAGE + '/' + 'item';

//setting middleware
//app.use(express.static(__dirname)); //Serves resources from public folder

try{
	fs = require('fs');
	path = require('path');
	express = require('express');
	fileUpload = require('express-fileupload');
	itemManager = require('./ItemManager');
	orderManager = require('./OrderManager');

	itemManager.init( PATH_IMAGE_ITEM );
	orderManager.init();

	app = express();

	var _pathDB = __dirname + '/' + PATH_DATABASE;
	if (!fs.existsSync(_pathDB)){fs.mkdirSync(_pathDB);}

	app.use(fileUpload());
	app.use(express.static(__dirname + '/web')); //Serves resources from public folder
	app.use('/image',express.static(__dirname + '/image')); //Serves resources from public folder

	var _pathImage = __dirname + '/' + PATH_IMAGE_ITEM ;

	app.post('/addItem', function(req, res) {
		console.log( 'ADD_ITEM: ' + JSON.stringify(req.body) );
		if (!req.files)return res.status(400).send('No files were uploaded.');

  		var imagePath = req.files.ImagePath;
		var _ext = path.extname( imagePath.name )

		var newItemName = itemManager.addItem( req.body, _ext ); 
		console.log( newItemName );
	
		if (!fs.existsSync(_pathImage + '/' + newItemName )){fs.mkdirSync(_pathImage + '/' + newItemName);}
		imagePath.mv( _pathImage + '/' + newItemName + '/' + newItemName + _ext, function(err) {
			if (err)return res.status(500).send(err);
			res.redirect('/page_itemManage.html');
			//res.send('File uploaded!');
		});
	});

	app.post('/editItem', function(req, res) {
		console.log( 'EDIT_ITEM: ' + JSON.stringify(req.body) );
		/*
		if (req.files){
  			var imagePath = req.files.ImagePath;
			var _ext = path.extname( imagePath.name )
			if (!fs.existsSync(_pathImage + '/' + newItemName )){fs.mkdirSync(_pathImage + '/' + newItemName);}
			imagePath.mv( _pathImage + '/' + newItemName + '/' + newItemName + _ext, function(err) {
				if (err)return res.status(500).send(err);
				res.redirect('/page_itemManage.html');
				//res.send('File uploaded!');
			});
		}
		*/

		itemManager.editItem( req.body ); 
		res.redirect('/page_itemManage.html');
	});
	app.get("/ORDER/*", function(req, res) {
		var parts = req.originalUrl.split('/');
		var _orderID = parts[2];
		console.log( _orderID );

		var _status = orderManager.getStatus( _orderID ); 
		console.log( _status );
		if( _status == 'CART' ){
			res.redirect('/page_cart.html');
		} else if( _status == 'PAIED' ) {
			res.redirect('/page_paid.html');
		} else if( _status == 'COMPLETED' ) {
			res.redirect('/page_completed.html');
		} else {
			res.redirect('/page_error.html');
		}
	});

	var server = app.listen(PORT);
	console.log('The magic happening in ' + PORT);
} catch (e) {
	console.log('App initing failing...' + e.toString());
}

const io = require('socket.io')(server);
io.on('connection', function(socket) {
	var _arr = itemManager.readAllLast();
	socket.emit('ITEM_LIST', { 'items':_arr } );

	socket.on('REQUEST_ORDER_URL', function(msg) {
		var _orderID = orderManager.createOrder(msg.PhoneNumber); 
		var _url = 'http://203.251.187.227:40000/ORDER/' + _orderID;
		socket.emit('REQUEST_ORDER_URL', { 'URL':_url} );
	});
});

