var Hole = function() {
    Hole.super_.apply(this, arguments);
};

util.inherits(Hole, Obj);

Hole.prototype.init = function(x, y) {
    this.setId('hole');
    this.el = util.createDiv(this.getId());
    this.el.style['z-index'] = 9;
    this.el.style.position = 'absolute';
    this.canvasEl = util.createCanvas();
    this.canvas = this.canvasEl.getContext('2d');
    this.el.appendChild(this.canvasEl);

    this.setXY(x, y);
    this.setInitXY(x, y);

    this.animation = new Animation_Hole();
    this.animation.init(this);

    this.put();
};

Hole.prototype.append = function() {
    $('#game').append(this.el);
};
Hole.prototype.put = function() {
    if (!this.el) {
        throw "This Obj has no el";
    }
    var xy = this.getPosition();
    $(this.el).css({ left: xy.x - 4  + 'px', top: xy.y - 4 + 'px' });
};
