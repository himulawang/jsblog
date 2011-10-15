var Admin = function() {
    this.sessionId = '';
    this.blogs = [];
    this.articleIndex = 0;
};

Admin.prototype.json = function(data, cb) {
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
                _this.xhrLogin(password);
            }
        }
    }).html(h);
};
Admin.prototype.xhrLogin = function(password) {
    var _this = this;
    $.post('login',
        { password : password },
        function(json) {
            var data = _this.json(json, function() {
                alert('Password Wrong');
            });
            if (!data) return;
            _this.sessionId = data.sessionId;
            _this.xhrInitList();
            $('#dialog').dialog('close');
        }
    );
};
Admin.prototype.xhrInitList = function() {
    var _this = this;
    $.post('initList',
        { sessionId : _this.sessionId },
        function(json) {
            var data = _this.json(json);
            if (!data) return;

            if (data.length === 0) {
                $('#articles').html('No Article');
                return;
            }

            var h = '';
            for (var i = 0; i < data.length; ++i) {
                h += '<div class="article-title" onclick="admin.switchArticle(' + i + ')">' + data[i].title + '</div>';
            }

            $('#articles').html(h);
            _this.blogs = data;
            _this.switchArticle(_this.articleIndex);
        }
    );
};
Admin.prototype.switchArticle = function(index) {
    var blog = this.blogs[index];
    $('#title').val(blog.title);
    $('#edit-area').html(blog.body);
    $('#date').html(blog.date);
    this.articleIndex = index;
}
Admin.prototype.newArticle = function() {
    this.save();
    $('#title').val('');
    $('#edit-area').html('');
    $('#date').html('');
    this.articleIndex = this.blogs.push({
        title : '',
        body : '',
        _id : '',
        date : ''
    }) - 1;

};
Admin.prototype.save = function() {
    var _this = this;
    $.post('save',
        { sessionId : this.sessionId,
            _id : this.blogs[this.articleIndex]._id,
            title : $('#title').val(),
            body : $('#edit-area').html(),
            date : this.blogs[this.articleIndex].date
        },
        function(json) {
            var data = _this.json(json, function() {
                alert('Save Failed');
            });
            if (!data) return;

            if (data.newArticle) {
                admin.blogs[_this.articleIndex]._id = data._id;
                admin.blogs[_this.articleIndex].date = data.date;
                $('#date').html(data.date);
            }
        }
    );
};
Admin.prototype.del = function() {
    var _this = this;
    $.post('del',
        { sessionId : this.sessionId, _id : this.blogs[this.articleIndex]._id },
        function(json) {
            var data = _this.json(json);
            if (!data) return;

            if (data.delResult) {
                _this.xhrInitList();
            }
        }
    );
};
