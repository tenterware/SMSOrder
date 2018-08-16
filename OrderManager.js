var fs = null;
var dateformat = null;
var randomstring = null;

const URL_KEY_LENGTH = 20;

var PATH_DATABASE = '';
var PATH_ORDER = '';
var PATH_FULL = '';

var gDicItems = {};

exports.init = function(){
	return init();
}
exports.createOrder = function( _phoneNumber ){
	return createOrder( _phoneNumber );
}
exports.getStatus = function( _orderID ){
	return getStatus ( _orderID );
}

function getStatus ( _orderID ){
	var _date = _orderID.substr(0,6);
	var _orderPath = PATH_FULL + '/' + _date;
	if (!fs.existsSync(_orderPath)){
		console.log( _orderPath + ' Not exist' );
		return '';
	}
	var _orderFullPath = _orderPath + '/' + _orderID;
	if (!fs.existsSync(_orderFullPath )){
		console.log( _orderFullPath + ' Not exist' );
		return '';
	}
	console.log (_orderFullPath );
	order = JSON.parse(fs.readFileSync( _orderFullPath , 'utf8'));
	return order.OrderStatus ;
}

function createOrder(_phoneNumber){
	var date_time = dateformat(new Date(), "yymmdd_HHMMss");
	var _date = date_time.split('_');
	var _genpsk = randomstring.generate( URL_KEY_LENGTH );
	var _orderID = _date[0] + _genpsk;
	var _newOrder = {
        	'OrderID': _orderID,
        	'DateTime': date_time,
        	'CustomerName': '',
        	'PhoneNumber': _phoneNumber,
        	'OrderStatus': 'CART',
		'CART' : []
	};
	var PATH_ORDER = PATH_FULL + '/' + _date[0];
	console.log( JSON.stringify( _newOrder ) );
	if (!fs.existsSync(PATH_ORDER)){fs.mkdirSync(PATH_ORDER);}
	fs.writeFile(PATH_ORDER + '/' + _orderID , JSON.stringify( _newOrder , null, 4));
	return _orderID;
}

function init(){
	try{
                fs = require('fs');
		dateformat = require('dateformat');
  		randomstring = require('randomstring');

		PATH_DATABASE = 'database';
		PATH_ORDER = 'order';

		//CONFIG = JSON.parse(fs.readFileSync('config.json', 'utf8'));
		PATH_FULL = __dirname + '/' + PATH_DATABASE + '/' + PATH_ORDER; 
		if (!fs.existsSync(PATH_FULL)){fs.mkdirSync(PATH_FULL);}
		return true;
	} catch(e) {
		//write('MULTI', 'INFO', 'init failing', e.toString());
		console.log('OrderManager initing failing...' + e.toString());
		return false;
	}
}

function readAllLast(){
	gDicItems = {};
	fs.readdirSync(PATH_FULL).forEach(file => {
		if (fs.statSync(PATH_FULL + file).isDirectory() == false ) {
			gDicItems[ file ] = JSON.parse(fs.readFileSync(PATH_FULL + file , 'utf8'));
		}
	});
	var _rtArray = [];
	for (let key of Object.keys(gDicItems)) {
		var _items = gDicItems[key];
		/* Put only last item (status) */
		_rtArray.push( _items[ _items.length - 1] );
	}
	return _rtArray;
}

function writeNewItem( _json ) {
	gDicItems[ _key ] = _rt;
	// DEBUG console.log( JSON.stringify( gDicItems[ _key ][0] ) );
}

function reWrite( _key ) {
	var _rt = gDicItems[ _key ];
	if( _rt != undefined && _rt != null ){
		//console.log( _rt );
		_rt[0].TYPE = 'MEAL';
	}
	fs.writeFile(PATH_FULL + _key , JSON.stringify( _rt , null, 4));
	gDicItems[ _key ] = _rt;
	// DEBUG console.log( JSON.stringify( gDicItems[ _key ][0] ) );
}

