var Map = function() {
    Map.super_.apply(this, arguments);
    this.data = {};
};

util.inherits(Map, Obj);

Map.prototype.init = function() {
    this.setId('map');
    this.el = util.createDiv(this.getId());
    this.canvasEl = util.createCanvas();
    this.el.style.position = 'absolute';
    this.el.style['background-image'] = 'url("img/mapbackground.png")';
    this.canvasEl.width = GRID_MAX_WIDTH * GRID_SINGLE_WIDTH;
    this.canvasEl.height = GRID_MAX_HEIGHT * GRID_SINGLE_HEIGHT;
    this.canvas = this.canvasEl.getContext('2d');
    this.el.appendChild(this.canvasEl);

    this.getData(MAP_DATA1);
    this.getBlockImage();
    this.draw();
    this.append();
};
Map.prototype.getData = function(data) {
    var index = '', x = 0; y = 0;
    for (var i = 0; i < data.length; ++i) {
        x = i % GRID_MAX_WIDTH;
        y = Math.floor(i / GRID_MAX_WIDTH);
        index = fc.getIndex(x, y);
        this.data[index] = MAP_DATA1[i];
    }
};
Map.prototype.getBlockImage = function() {
    this.blocks = sceneImages;
};
Map.prototype.draw = function() {
    var type, xy, offset;
    for (var i in this.data) {
        type = this.data[i];
        if (type === 2 || type === 3) {
            continue;
        }
        
        xy = fc.getXY(i);
        offset = this.getPosition(xy.x, xy.y);
        this.canvas.drawImage(this.blocks[type], offset.x, offset.y);
    }
};
Map.prototype.append = function() {
    $('#game').append(this.el);
};
Map.prototype.canMove = function(x, y) {
    var index = fc.getIndex(x, y);
    var type = this.data[index];
    if (type === 2 || type === 3) {
        return true;
    }
    return false;
};
