var Monster = function() {
    Monster.super_.apply(this, arguments);
};

util.inherits(Monster, Obj);

Monster.prototype.init = function(x, y, range) {
    this.setId(fc.guid());
    this.el = util.createDiv(this.getId());
    this.el.style['z-index'] = 10;
    this.el.style.position = 'absolute';
    this.canvasEl = util.createCanvas();
    this.canvas = this.canvasEl.getContext('2d');
    this.el.appendChild(this.canvasEl);

    this.setXY(x, y);
    this.setInitXY(x, y);
    this.put();

    this.animation = new Animation_Monster();
    this.animation.init(this);

    this.ai = new AI_Monster();
    this.ai.init(this, range);
};

Monster.prototype.append = function() {
    $('#game').append(this.el);
};

Monster.prototype.move = function(direction) {
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

    if (this.isCollision()) {
        elf.doDamage();
    }
};

Monster.prototype.faceTo = function(direction) {
    this.animation.direction = direction;
    this.animation.lastRunStamp = 0;
};

Monster.prototype.isCollision = function() {
    var sprite, spriteXY;
    var selfXY = this.getNextXY();
    for (var i = 0; i < elf.savedSprites.length; ++i) { // check sprites
        sprite = elf.savedSprites[i];
        spriteXY = sprite.getXY();
        if (selfXY.x === spriteXY.x && selfXY.y === spriteXY.y) {
            audio.play('audio-monster-catch');
            return true;
        }
    }

    var elfXY = elf.getXY();
    if (selfXY.x === elfXY.x && selfXY.y === elfXY.y) {
        audio.play('audio-monster-catch');
        return true;
    }
};
