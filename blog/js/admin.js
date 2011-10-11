var Admin = function() {};

Admin.prototype.connect = function() {
    var _this = this;
    this.ws = new WebSocket(URL_ADMIN, PROTOCOL);
    this.ws.onopen = function(e) {
        console.log(e);
    };
    this.ws.onclose = function(e) {
        console.log(e);
    };
    this.ws.onmessage = function(e) {
        var message = JSON.parse(e.data);
        if (message.result === 1) {
            $('#dialog').dialog('close');
            _this.initList();
            return;
        }

        console.log(message);

    };
    this.ws.onerror = function(e) {
        console.log(e);
    };
};
Admin.prototype.send = function(obj) {
    this.ws.send(JSON.stringify(obj));
};
Admin.prototype.loginDialog = function() {
    var h = '';
    h += '<div>Password:<input id="password"></div>';
    var _this = this;
    $('#dialog').dialog({
        title: 'Login',
        modal: true,
        buttons: {
            "OK": function() {
                var password = $('#password').val();
                _this.send({ password: password });
            }
        }
    }).html(h);
};
Admin.prototype.initList = function() {
    this.send({ action: 'initList' });
};

$(document).ready(function(){
    window.admin = new Admin();
    admin.loginDialog();
    admin.connect();
});
