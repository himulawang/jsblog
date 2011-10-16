var View = function() {};

View.prototype.json = function(data, cb) {
    var callback = cb || function() {};
    try {
        var j = JSON.parse(data);
    } catch(e) {
        callback();
    }
    if (!j.result) {
        callback();
        return;
    }
    return j.data;
};
View.prototype.pad = function(number) {
    return ('' + number).length === 1 ? '0' + number : number;
};
View.prototype.getDate = function(string) {
    var d = new Date(string);
    return d.getFullYear() + '-' +
        this.pad((d.getMonth() + 1)) + '-' + 
        this.pad(d.getDate()) + ' ' +
        this.pad(d.getHours()) + ':' + 
        this.pad(d.getMinutes()) + ':' + 
        this.pad(d.getSeconds());
}
View.prototype.getList = function() {
    var _this = this;
    $.post('getList',
        {},
        function(json) {
            var data = _this.json(json);
            if (!data) return;

            $('#content').html(_this.formList(data));
        }
    );
};
View.prototype.formList = function(data) {
    var _this = this;
    var h = '';
    data.forEach(function(blog) {
        h += _this.formBlog(blog);
    });
    return h;
};
View.prototype.formBlog = function(blog) {
    var h = '';
    h += '<div class="blog">';
    h += '<div class="title">' + blog.title + '</div>';
    h += '<div class="date">' + this.getDate(blog.date) + '</div>';
    h += '<div class="body">' + blog.body + '</div>';
    h += '</div>';
    return h;
}

$(document).ready(function() {
    window.view = new View();
    view.getList();
});
