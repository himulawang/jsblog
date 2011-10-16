var Foot = function() {
    Foot.super_.apply(this, arguments);
};

util.inherits(Foot, Obj);

Foot.prototype.init = function(x, y) {
    this.setId('foot');
    this.el = util.createDiv(this.getId());
    this.el.style['z-index'] = 9;
    this.el.style.position = 'absolute';
    this.canvasEl = util.createCanvas();
    this.canvas = this.canvasEl.getContext('2d');
    this.el.appendChild(this.canvasEl);

    this.refreshId = 0;
    this.savedSprites = [];
    this.setXY(x, y);
    this.setInitXY(x, y);
    this.put();

    this.animation = new Animation_Foot();
    this.animation.init(this);
};

Foot.prototype.append = function() {
    $('#game').append(this.el);
};

Foot.prototype.eaten = function() {
    elf.speedUp();
    for (var i in sprites) {
        sprites[i].speedUp();
    }
    this.setXY(-1, -1);
    $(this.el).addClass('hide');
    this.refreshId = setTimeout(function() {
        $(foot.el).removeClass('hide');
        foot.setXY(foot.initX, foot.initY);
    }, 10000);
};
