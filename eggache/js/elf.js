var Elf = function() {
    Elf.super_.apply(this, arguments);
};

util.inherits(Elf, Obj);

Elf.prototype.init = function(x, y) {
    this.setId('elf');
    this.el = util.createDiv(this.getId());
    this.el.style['z-index'] = 10;
    this.el.style.position = 'absolute';
    this.canvasEl = util.createCanvas();
    this.canvas = this.canvasEl.getContext('2d');
    this.el.appendChild(this.canvasEl);

    this.functionId = 0;
    this.savedSprites = [];
    this.setXY(x, y);
    this.setInitXY(x, y);
    this.isSpeedUp = false;
    this.put();

    this.animation = new Animation_Elf();
    this.animation.init(this);

};

Elf.prototype.append = function() {
    $('#game').append(this.el);
};

Elf.prototype.move = function(direction) {
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
        audio.play('audio-kickwall');
        return;
    }

    this.setNextXY(nextXY.x, nextXY.y);

    // Sprite Collision
    this.spriteCollision();

    // Tool Collision
    this.toolCollision();

    // Exit Collision
    this.exitCollision();

    // chain move for spirte saved
    this.spriteChain();

    this.animation.startMove();
    this.put();
};

Elf.prototype.faceTo = function(direction) {
    this.animation.direction = direction;
    this.animation.lastRunStamp = 0;
};
Elf.prototype.spriteCollision = function() {
    var spriteXY;
    var elfXY = this.getNextXY();
    for (var i = 0; i < sprites.length; ++i) {
        if (sprites[i].status === 'saved') continue;
        spriteXY = sprites[i].getXY();
        if (elfXY.x === spriteXY.x && elfXY.y === spriteXY.y) {
            audio.play('audio-findsprite');
            sprites[i].status = 'saved';
            this.savedSprites.push(sprites[i]);
        }
    }
};
Elf.prototype.toolCollision = function() {
    var elfXY = this.getNextXY();
    var footXY = foot.getXY();
    if (elfXY.x === footXY.x && elfXY.y === footXY.y) {
        audio.play('audio-speedup');
        foot.eaten();
    }
};
Elf.prototype.exitCollision = function() {
    var elfXY = this.getNextXY();
    var holeXY = hole.getXY();
    if (this.savedSprites.length != sprites.length) return;
    if (elfXY.x === holeXY.x && elfXY.y === holeXY.y) {
        events.win();
    }
};
Elf.prototype.spriteChain = function() {
    var nowXY, nextXY, direction;
    for (var i = 0; i < this.savedSprites.length; ++i) {
        nowXY = this.savedSprites[i].getXY();
        if (i === 0) {
            nextXY = this.getXY();
        } else {
            nextXY = this.savedSprites[i - 1].getXY();
        }
        direction = this.getDirection(nextXY, nowXY);
        if (direction) {
            this.savedSprites[i].move(direction);
        }
    }
};

Elf.prototype.doDamage = function() {
    var savedSpritesLength = this.savedSprites.length;
    if (savedSpritesLength === 0) {
        events.lose();
        return;
    }

    var sprite = this.savedSprites.pop();
    sprite.doBack();
};
Elf.prototype.speedUp = function() {
    this.isSpeedUp = true;
    var _this = this;
    this.functionId = setTimeout(function(){
        _this.isSpeedUp = false;
    }, 5000);
};
