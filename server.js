require('./config');
require('./fc');
var express = require('express');
var app = express.createServer();
var BlogPost = require('./db').BlogPost;

app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/'));

var downloads = {};
var sessionId;
app.get(/server.js|config.js|db.js/, function(req, res, next) {
    res.send('nice try');
});

/* Admin Start */
app.post('/blog/login', function(req, res, next) {
    if (req.body.password === PASSWORD) {
        sessionId = fc.guid();
        resResult(res, { sessionId : sessionId });
        return;
    }
    resFailResult(res);
});
app.post('/blog/initList', function(req, res, next) {
    if (!checkLogin(req.body.sessionId)) {
        resFailResult(res);
        return;
    }
    BlogPost.find({}).desc('date').run(function(err, docs) {
        resResult(res, docs);
    });
});
app.post('/blog/save', function(req, res, next) {
    if (!checkLogin(req.body.sessionId)) {
        resFailResult(res);
        return;
    }
    // new article
    if (req.body.date === '' && req.body._id === '') {
        var newArticle = new BlogPost({
            title : req.body.title,
            body : req.body.body,
            date : new Date()
        });
        newArticle.save(function(err) {
            BlogPost.find({}).desc('date').limit(1).run(function(err, docs) {
                if (!docs[0]) {
                    resFailResult(res);
                    return;
                }
                resResult(res, { newArticle : true, _id : docs[0]._id, date : docs[0].date });
            })
        });
        return;
    }

    // old article
    BlogPost.update(
        { _id : req.body._id }, // conditions
        { title : req.body.title, body : req.body.body }, // docs
        {}, // options
        function(err) {
            resResult(res, { newArticle : false });
        }
    );
});
app.post('/blog/del', function(req, res, next) {
    if (!checkLogin(req.body.sessionId)) {
        resFailResult(res);
        return;
    }
    BlogPost.remove({ _id : req.body._id }, function(err) {
        resResult(res, { delResult : true });
    });
});
/* Admin End */

/* Index Start */
app.post('/blog/getList', function(req, res, next) {
    BlogPost.find({}).desc('date').limit(10).run(function(err, docs) {
        resResult(res, docs);
    });
});
/* Index End */
app.get('/*', function(req, res, next){
    var file = req.params[0];
    downloads[file] = downloads[file] || 0;
    ++downloads[file];
    next();
});
app.listen(PORT);

var checkLogin = function(reqSessionId) {
    if (reqSessionId === sessionId) {
        return true;
    }
    return false;
};
var resFailResult = function(res) {
    res.send(JSON.stringify({ result : 0 }));
};
var resResult = function(res, data) {
    res.send(JSON.stringify({ result : 1, data : data}));
};
