var db = require('mongoose');

db.connect(DB);

var Schema = db.Schema;

var BlogPostSchema = new Schema({
    title : String,
    body : String,
    date : Date
});

exports.BlogPost = db.model('BlogPost', BlogPostSchema);
