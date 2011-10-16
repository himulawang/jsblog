var Animation_Sprite = function() {
    Animation_Sprite.super_.apply(this, arguments);
};

util.inherits(Animation_Sprite, Animation);

Animation_Sprite.prototype.init = function(owner) {
    // init owner
    this.owner = owner;

    // init el
    this.el = owner.el;
    // init canvas
    this.canvas = owner.canvas;
    owner.canvasEl.width = 16;
    owner.canvasEl.height = 16;

    // prepare src and offsets
    this.getSrc();
    this.width = 16;
    this.height = 16;
    this.srcOffsetsY = {
        down : 0,
        up : 16,
        left: 32,
        right: 48
    };

    // init frame
    this.nowFrame = 0;
    this.maxFrame = 0;
    this.frameDuration = 1000;

    this.direction = 'down';
    
    // init run parameter
    this.lastRunStamp = 0;

    // init move parameter
    this.moveStartStamp = 0;
    this.moving = false;
    this.moveDuration = 250;

    // init timerId
    this.runAnimationId = 0;
    this.moveAnimationId = 0;

    // run
    this.drawRun();

};
Animation_Sprite.prototype.getSrc = function() {
    this.srcImage = spriteImage;
    this.srcWidth = spriteImage.width;
    this.srcHeight = spriteImage.height;
};
Animation_Sprite.prototype.drawRun = function() {
    var _this = this;
    var now = fc.getNowTimestamp();
    var timeDelta = now - this.lastRunStamp;
    if (timeDelta < this.frameDuration) {
        this.runAnimationId = requestAnimationFrame(function() { _this.drawRun(); });
        return;
    }
    
    var offsets = this.getSrcImageOffset();
    this.canvas.clearRect(0, 0, this.width, this.height);
    this.canvas.drawImage(this.srcImage, offsets.x, offsets.y, this.width, this.height, 0, 0, this.width, this.height);

    var nextFrame = this.nowFrame + 1;
    this.nowFrame = (nextFrame > this.maxFrame) ? 0 : nextFrame;

    this.lastRunStamp = now;
    this.runAnimationId = requestAnimationFrame(function() { _this.drawRun(); });
};
Animation_Sprite.prototype.getSrcImageOffset = function() {
    return { x: this.nowFrame * this.width, y: this.srcOffsetsY[this.direction] };
};

Animation_Sprite.prototype.backRun = function() {
    cancelRequestAnimationFrame(this.moveAnimationId);
    this.startMove();
};
