var Sprite = function() {
    Sprite.super_.apply(this, arguments);
};

util.inherits(Sprite, Obj);

Sprite.prototype.init = function(x, y) {
    this.setId(fc.guid());
    this.el = util.createDiv(this.getId());
    this.el.style['z-index'] = 10;
    this.el.style.position = 'absolute';
    this.canvasEl = util.createCanvas();
    this.canvas = this.canvasEl.getContext('2d');
    this.el.appendChild(this.canvasEl);

    this.functionId = 0;
    this.status = 'jail';
    this.setXY(x, y);
    this.setInitXY(x, y);
    this.isSpeedUp = false;
    this.put();

    this.animation = new Animation_Sprite();
    this.animation.init(this);
};

Sprite.prototype.append = function() {
    $('#game').append(this.el);
};

Sprite.prototype.move = function(direction) {
    var xy = this.getXY();
    var nextXY;

    this.faceTo(direction);

    if (direction === 'up') {
        nextXY = { x: xy.x, y: xy.y - 1 };
    } else if (direction === 'down') {
        nextXY = { x: xy.x, y: xy.y + 1 };
    } else if (direction === 'left') {
        nextXY = { x: xy.x - 1, y: xy.y };
    } else if (direction === 'right') {
        nextXY = { x: xy.x + 1, y: xy.y };
    }

    if (!map.canMove(nextXY.x, nextXY.y)) {
        return;
    }

    this.setNextXY(nextXY.x, nextXY.y);
    this.animation.startMove();
    this.put();
};

Sprite.prototype.faceTo = function(direction) {
    this.animation.direction = direction;
    this.animation.lastRunStamp = 0;
};
Sprite.prototype.doBack = function() {
    this.status = 'jail';
    this.setNextXY(this.initX, this.initY);
    this.animation.backRun();
};
Sprite.prototype.speedUp = function() {
    this.isSpeedUp = true;
    var _this = this;
    this.functionId = setTimeout(function(){
        _this.isSpeedUp = false;
    }, 5000);
};
