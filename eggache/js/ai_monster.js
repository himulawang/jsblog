var AI_Monster = function() {
    AI_Monster.super_.apply(this, arguments);
};

util.inherits(AI_Monster, AI);

AI_Monster.prototype.init = function(owner, range) {
    this.owner = owner;

    this.status = 'idle';
    this.setIdleRange(range);
    this.lastIdleTime = 0;
    this.lastIdleIndex = -1;
    this.path = [];

    this.warningRange = 4 * GRID_SINGLE_WIDTH;

    this.run();
};

AI_Monster.prototype.setIdleRange = function(range) {
    this.idleRange = range;
};

AI_Monster.prototype.run = function() {
    var _this = this;
    if (this.owner.animation.moving) {
        this.runId = requestAnimationFrame(function() { _this.run(); });
        return;
    }

    this.getWarning();

    if (this.status === 'idle') {
        this.doIdle();
    } else if (this.status === 'warning') {
        this.doWarning();
    } else if (this.status === 'back') {
        this.doBack();
    }

    this.runId = requestAnimationFrame(function() { _this.run(); });
};

AI_Monster.prototype.getWarning = function() {
    if (this.status === 'back') return;
    var selfXY = this.owner.getXY();
    var selfR = this.warningRange;
    var testR = GRID_SINGLE_WIDTH;
    var testXY = elf.getXY();

    if (this.isCollision(selfXY, testXY, selfR, testR)) {
        if (this.status !== 'warning') {
            audio.play('audio-monster-warning');
        }
        this.status = 'warning';
        return;
    }
    for (var i = 0; i < elf.savedSprites.length; ++i) {
        testXY = elf.savedSprites[i].getXY();
        if (this.isCollision(selfXY, testXY, selfR, testR)) {
            if (this.status !== 'warning') {
                audio.play('audio-monster-warning');
            }
            this.status = 'warning';
            return;
        }
    }

    // out of range back to guard position
    if (this.status === 'warning') {
        this.prepareBack();
    }
};
AI_Monster.prototype.doIdle = function() {
    var nextIdleIndex = this.lastIdleIndex + 1;
    this.lastIdleIndex = (nextIdleIndex > this.idleRange.length - 1) ? 0 : nextIdleIndex;
    var nextIndex = this.idleRange[this.lastIdleIndex];
    var nextXY = fc.getXY(nextIndex);
    var nowXY = this.owner.getXY();

    var direction = this.owner.getDirection(nextXY, nowXY);
    this.owner.move(direction);
    this.lastIdleTime = fc.getNowTimestamp();
};
AI_Monster.prototype.doWarning = function() {
    this.setTarget();
    this.setTargetPath();
    this.doCatch();
};
AI_Monster.prototype.setTarget = function() {
    var savedSpritesLength = elf.savedSprites.length;
    if (savedSpritesLength === 0) { //elf save no one
        this.target = elf;
    } else { // elf saved some one and set last sprite as target
        this.target = elf.savedSprites[savedSpritesLength - 1];
    }
};
AI_Monster.prototype.setTargetPath = function() {
    findway.reset();
    var start = this.owner.getNextXY();
    var end = this.target.getXY();
    if (start.x === end.x && start.y === end.y) {
        return;
    }
    findway.setStart(start.x, start.y);
    findway.setEnd(end.x, end.y);
    this.path = findway.getWay();
};
AI_Monster.prototype.doCatch = function() {
    if (this.path.length === 0) return;
    var nextXY = fc.getXY(this.path.shift());

    var nowXY = this.owner.getXY();
    var direction = this.owner.getDirection(nextXY, nowXY);
    this.owner.move(direction);
};
AI_Monster.prototype.prepareBack = function() {
    findway.reset();
    var start = this.owner.getNextXY();
    var end = fc.getXY(this.idleRange[0]);
    findway.setStart(start.x, start.y);
    findway.setEnd(end.x, end.y - 1); // this -1 because monster init position is : x, y-1
    this.path = findway.getWay();
    this.status = 'back';
};
AI_Monster.prototype.doBack = function() {
    if (this.path.length === 0) {
        this.status = 'idle';
        this.lastIdleIndex = -1;
        return;
    }
    var nextXY = fc.getXY(this.path.shift());
    var nowXY = this.owner.getNextXY();
    var direction = this.owner.getDirection(nextXY, nowXY);
    this.owner.move(direction);
};
