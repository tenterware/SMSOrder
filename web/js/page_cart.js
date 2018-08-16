var gSocketIO = null;
var gArrItem = null;

function drawCartItem( _arrItems ){
	//if( gArrItem == null ){return;}
	var strHTML = '';
	gArrItem = _arrItems;
	for( var i=0; i < gArrItem.length ; i++ ){
		strHTML += "<div class='col-lg-3 col-md-4 col-xs-6'>";
		strHTML += "<a ItemID = '" + gArrItem[i].ItemID +"' style='cursor:pointer;' class='d-block mb-4 h-100 editItem' data-toggle='modal' data-target='#exampleModalCenter'>";
        	strHTML += "<img class='img-fluid img-thumbnail STATUS-" + gArrItem[i].ItemStatus + " ' src='" + gArrItem[i].ImagePath + "' alt=''>";
		strHTML += "<div class='centered-caption'><h3 style='background-color:#D00;'>" + gArrItem[i].ItemStatus + "</h3></div>";
		strHTML += "<div class='carousel-caption'><h3 style='background-color:#000;'>" + gArrItem[i].NameFull + "</h3></div>";
		//strHTML += "<div class='bottom-centered-caption'><h3 style='background-color:#D00;'>" + gArrItem[i].NameShort + "</h3></div>";
        	strHTML += "</a>";
        	strHTML += "</div>";
	}
	$('#divListItem').html(strHTML);
	$('.addItem').click( function (){
		$('#uploadForm').attr('action', '/addItem');
	});
	$('.editItem').click(function (){
		$('#uploadForm').attr('action', '/editItem');
		var itemID = $(this).attr('ItemID');
		for( var i=0; i < gArrItem.length ; i++ ){
			if( gArrItem[i].ItemID == itemID ){
				$('#itemID').val(gArrItem[i].ItemID);
				$('#nameFull').val(gArrItem[i].NameFull);
				$('#nameShort').val(gArrItem[i].NameShort);
				$('#itemStatus').val(gArrItem[i].ItemStatus);
				$('#priceVisit').val(gArrItem[i].PriceVisit);
				$('#priceUber').val(gArrItem[i].PriceUber);
				$('#priceOnline').val(gArrItem[i].PriceOnline);
				if( gArrItem[i].ItemType == 'MEAL' ){ 
					$('#itemTypeMeal').attr('checked', true);
				} else {
					$('#itemTypeDish').attr('checked', true);
				}
				break;
			}
		}
	});
}

$( function() {
        var srvIPort = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
        gSocketIO = io( srvIPort );
	gSocketIO.on('connect', function(socket) {
		gSocketIO.emit('ITEM_CART_LIST',{});
	});

        gSocketIO.on('ITEM_CART_LIST', function(data){
		drawCartItem(data.items);
		//gArrItem = data.items;
        });
	
	$( "#tabCart" ).click(function(){
		$("#navTabMenu" ).hide();
	});
	$( "#tabMenu" ).click(function(){
		$("#navTabMenu" ).show();
	});
});

