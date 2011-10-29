var G;
try {
    var test = global; // test this is server
} catch (e) {
    G = window; // this is client
}
if (!G) {
    G = global;
}

//var env = 'local';
var env = 'live';

if (env === 'local') {
    G.PORT = '8080';
    G.URL_ADMIN = 'ws://jsblog:' + G.PORT;
    G.PASSWORD = '123';
} else if (env === 'live') {
    G.PORT = '80';
    G.URL_ADMIN = 'ws://ila.no.de:' + G.PORT;
    G.PASSWORD = '!QAZXSW@';
}

G.DB = 'mongodb://127.0.0.1/jsblog';
G.PROTOCOL = 'jsblog';
