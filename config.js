var G;
try {
    var test = global; // test this is server
} catch (e) {
    G = window; // this is client
}
if (!G) {
    G = global;
}

var env = 'live';

if (env === 'local') {
    G.PORT = '8080';
    G.URL_ADMIN = 'ws://jsblog:' + G.PORT;
} else if (env === 'live') {
    G.PORT = '80';
    G.URL_ADMIN = 'ws://gi.no.de:' + G.PORT;
}

G.DB = 'mongodb://localhost/jsblog';
G.PROTOCOL = 'jsblog';

