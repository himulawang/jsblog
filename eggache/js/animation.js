var Animation = function() {};

Animation.prototype.init = function() {
};
Animation.prototype.drawRun = function() {
};
Animation.prototype.startMove = function() {
    this.getMoveDisplacement();
    this.drawMove();
};
Animation.prototype.getMoveDisplacement = function() {
    if (this.moving) return;

    this.moving = true;
    this.moveStartStamp = fc.getNowTimestamp();

    var nowOffset = this.owner.getPosition();
    this.nowScreenX = nowOffset.x;
    this.nowScreenY = nowOffset.y;

    var nextOffset = this.owner.getNextPosition();
    this.nextScreenX = nextOffset.x;
    this.nextScreenY = nextOffset.y;

    this.displacementX = this.nextScreenX - this.nowScreenX;
    this.displacementY = this.nextScreenY - this.nowScreenY;
};
Animation.prototype.drawMove = function() {
    var deltaTime = fc.getNowTimestamp() - this.moveStartStamp;
    if (deltaTime > this.getMoveDuration()) {
        this.stopMove();
        return;
    }

    var nowDisplacementX = util.fix(this.nowScreenX + deltaTime / this.getMoveDuration() * this.displacementX);
    var nowDisplacementY = util.fix(this.nowScreenY + deltaTime / this.getMoveDuration() * this.displacementY);
    $(this.el).css({ left: nowDisplacementX + 'px', top: nowDisplacementY + 'px'});

    var _this = this;
    this.moveAnimationId = requestAnimationFrame(function() { _this.drawMove(); });
};
Animation.prototype.stopMove = function() {
    this.moveStartStamp = 0;
    this.owner.setXYToNext();
    this.moving = false;
    this.owner.put();
};
Animation.prototype.getMoveDuration = function() {
    if (this.owner.isSpeedUp) {
        return this.moveDuration / 2;
    }
    return this.moveDuration;
}
