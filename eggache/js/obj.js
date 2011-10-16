var Obj = function() {};

Obj.prototype.setId = function(id) {
    this.id = id;
};
Obj.prototype.getId = function(id) {
    return this.id;
};
Obj.prototype.setXY = function(x, y) {
    if (typeof(x) === 'number' && typeof(y) === 'number') {
        this.x = x;
        this.y = y;
        this.location = fc.getIndex(x, y);
        return;
    } else if (typeof(x) === 'string') {
        var xy = fc.getXY(x);
        this.x = xy.x;
        this.y = xy.y;
        this.location = x;
        return;
    }
};
Obj.prototype.getXY = function() {
    return { x: this.x, y: this.y };
};
Obj.prototype.getPosition = function(x, y) {
    if (x === undefined && y === undefined) {
        return { x: this.x * GRID_SINGLE_WIDTH, y: this.y * GRID_SINGLE_HEIGHT };
    }
    return { x: x * GRID_SINGLE_WIDTH, y: y * GRID_SINGLE_HEIGHT };
};
Obj.prototype.setNextXY = function(x, y) {
    if (typeof(x) === 'number' && typeof(y) === 'number') {
        this.nextX = x;
        this.nextY = y;
        this.nextLocation = fc.getIndex(x, y);
        return;
    } else if (typeof(x) === 'string') {
        var xy = fc.getXY(x);
        this.nextX = xy.x;
        this.nextY = xy.y;
        this.nextLocation = x;
        return;
    }
};
Obj.prototype.getNextXY = function() {
    return { x: this.nextX, y: this.nextY };
};
Obj.prototype.getNextPosition = function(x, y) {
    return { x: this.nextX * GRID_SINGLE_WIDTH, y: this.nextY * GRID_SINGLE_HEIGHT };
};
Obj.prototype.setXYToNext = function(x, y) {
    var nextXY = this.getNextXY();
    this.setXY(nextXY.x, nextXY.y);
};
Obj.prototype.put = function() {
    if (!this.el) {
        throw "This Obj has no el";
    }
    var xy = this.getPosition();
    $(this.el).css({ left: xy.x + 'px', top: xy.y + 'px' });
};
Obj.prototype.getDirection = function(nextXY, nowXY) {
    if (nextXY.x - nowXY.x === 1) {
        return 'right';
    } else if (nextXY.x - nowXY.x === -1) {
        return 'left';
    } else if (nextXY.y - nowXY.y === 1) {
        return 'down';
    } else if (nextXY.y - nowXY.y === -1) {
        return 'up';
    }
};
Obj.prototype.setInitXY = function(x, y) {
    this.initX = x;
    this.initY = y;
};
Obj.prototype.destroy = function() {
    if (this.animation) {
        cancelRequestAnimationFrame(this.animation.runAnimationId);
        cancelRequestAnimationFrame(this.animation.moveAnimationId);
    }

    if (this.ai) {
        cancelRequestAnimationFrame(this.ai.runId);
    }
    if (this.refreshId) {
        window.clearTimeout(this.refreshId);
    }
    if (this.functionId) {
        window.clearTimeout(this.functionId);
    }
};
