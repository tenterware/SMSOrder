var gSocketIO = null;
var gArrItem = null;

function validatePhone( _txt) {
    var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
    if (filter.test( _txt )) {
        return true;
    }
    else {
        return false;
    }
}

$( function() {
        var srvIPort = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
        gSocketIO = io( srvIPort );
	$('#btnSend').click( function(){
		//Send Emit with 
		var _pn = $('#iptPhoneNumber').val();
		if( validatePhone (_pn) ){
			var newPn = _pn.replace(/[^0-9\.]/g, '');
			var param = { 'PhoneNumber' : newPn };
			gSocketIO.emit('REQUEST_ORDER_URL', param);
		} else {
			var _html = "<div class='alert alert-danger w-100'><strong>(오류) </strong> 전화번호를 확인해주세요!</div>";
			$('#modalFooter').html( _html );
		}
	});

        gSocketIO.on('REQUEST_ORDER_URL', function(msg){
		var _html = "<div class='alert alert-success w-100'><strong>주문링크</strong>" + msg.URL + "</div>";
		$('#modalFooter').html(_html);
        });
});

