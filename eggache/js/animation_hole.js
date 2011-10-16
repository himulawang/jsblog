var Animation_Hole = function() {
    Animation_Hole.super_.apply(this, arguments);
};

util.inherits(Animation_Hole, Animation);

Animation_Hole.prototype.init = function(owner) {
    // init owner
    this.owner = owner;

    // init el
    this.el = owner.el;
    // init canvas
    this.canvas = owner.canvas;
    owner.canvasEl.width = 24;
    owner.canvasEl.height = 24;

    // prepare src and offsets
    this.getSrc();
    this.width = 24;
    this.height = 24;
    this.srcOffsetsY = {
        down : 0,
        up : 24,
        left: 48,
        right: 72
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
Animation_Hole.prototype.getSrc = function() {
    this.srcImage = holeImage;
    this.srcWidth = holeImage.width;
    this.srcHeight = holeImage.height;
};
Animation_Hole.prototype.drawRun = function() {
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
Animation_Hole.prototype.getSrcImageOffset = function() {
    return { x: this.nowFrame * this.width, y: this.srcOffsetsY[this.direction] };
};
