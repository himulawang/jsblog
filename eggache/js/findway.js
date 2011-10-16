var Findway = function() {
    this.minGridXY = {};
    this.maxGridXY = {};
    this.obstacleList = {};
    this.parentList = {};
    this.openList = {};
    this.closeList = {};
    this.nowPoint = {x : 0, y : 0};
}
Findway.prototype.reset = function() {
    this.parentList = {};
    this.openList = {};
    this.closeList = {};
}
Findway.prototype.setScope = function(min, max) {
    this.minGridXY = min;
    this.maxGridXY = max;
}
Findway.prototype.setObstacle = function(x, y) {
    this.obstacleList[this.getIndex(x, y)] = {x : parseInt(x), y : parseInt(y)};
}
Findway.prototype.getObstacleList = function() {
    return this.obstacleList;
}
Findway.prototype.setStart = function(x, y) {
    this.startPoint = {x : parseInt(x), y : parseInt(y)};
}
Findway.prototype.setEnd = function(x, y) {
    this.endPoint = {x : parseInt(x), y : parseInt(y)};
}
Findway.prototype.getG = function(x, y) {
    var childX = x;
    var childY = y;
    var childIndex = this.getIndex(x, y);
    var parent, parentX, parentY;
    var g = 0;

    while (1) {
        parent = this.parentList[childIndex];
        parentX = parent.x;
        parentY = parent.y;
        g += this.getSingleG(childX, childY, parentX, parentY);
        if (parentX === this.startPoint.x && parentY === this.startPoint.y) break;

        childX = parentX;
        childY = parentY;
        childIndex = this.getIndex(childX, childY);
    }

    return g;
}
Findway.prototype.getSingleG = function(x, y, parentX, parentY) {
    var absX = Math.abs(x - parentX);
    var absY = Math.abs(y - parentY);

    if (absX === absY) {
        //14 means 2sqrt * 10
        return 21; //change to 21 because this game needn't diagonal move
    }else {
        return 10;
    }
}
Findway.prototype.getH = function(x, y) {
    absX = Math.abs(this.endPoint.x - x);
    absY = Math.abs(this.endPoint.y - y);

    return (absX + absY) * 10;
}
Findway.prototype.getF = function(x, y) {
    var index = this.getIndex(x, y);
    var thisPoint = this.openList[index];

    return thisPoint.g + thisPoint.h;
}
Findway.prototype.getWay = function() {
    this.way = [];
    // if start === end
    if (this.startPoint.x === this.endPoint.x && this.startPoint.y === this.endPoint.y) {
        return this.way;
    }
    this.newRouteBegin = 0;
    var index = this.getIndex(this.startPoint.x, this.startPoint.y);
    this.openList[index] = this.startPoint;
    this.setNowPoint(this.startPoint.x, this.startPoint.y);
    this.outputPointToCloseList(index);
    this.dealAroundGrid();
    var minFIndexArray = this.getMinFIndex();
    var fIndex = minFIndexArray[0];
    while (1) {
        this.outputPointToCloseList(fIndex);
        this.setNowPoint(this.closeList[fIndex].x, this.closeList[fIndex].y);
        this.dealAroundGrid();
        if (this.nowPoint.x === this.endPoint.x && this.nowPoint.y === this.endPoint.y) break;
        var minFIndexArray = this.getMinFIndex();
        var fIndex = minFIndexArray[0];
    }

    this.nowPoint = {x : this.endPoint.x, y : this.endPoint.y};
    this.traceBack();
    
    return this.way.reverse();
}
Findway.prototype.dealAroundGrid = function() {
    var x = this.nowPoint.x;
    var y = this.nowPoint.y;
    this.dealSingleGrid(x, y - 1);
    this.dealSingleGrid(x + 1, y - 1);
    this.dealSingleGrid(x + 1, y);
    this.dealSingleGrid(x + 1, y + 1);
    this.dealSingleGrid(x, y + 1);
    this.dealSingleGrid(x - 1, y + 1);
    this.dealSingleGrid(x - 1, y);
    this.dealSingleGrid(x - 1, y - 1);
}
Findway.prototype.dealSingleGrid = function(x, y) {
    if (x < this.minGridXY.x || y < this.minGridXY.y || x > this.maxGridXY.x || y > this.maxGridXY.y) return;
    var index = this.getIndex(x, y);
    //if this point has in obstacleList or closeList , do nothing
    var point = this.obstacleList[index] || this.closeList[index];
    if (point) return;
    //if this point hasn't in openList
    point = this.openList[index];
    if (!point) {
        this.addSingleToOpenList(x, y);
        return;
    }
    // if this point has in openList
    var parentG = this.closeList[this.getIndex(this.nowPoint.x, this.nowPoint.y)].g;
    var deltaG = this.getSingleG(x, y, this.nowPoint.x, this.nowPoint.y);
    var childG = this.openList[this.getIndex(x, y)].g;

    var newWayG = parentG + deltaG;
    var oldWayG = childG;
    //new way is longer than old way
    if (newWayG >= oldWayG) return;
    //new way is shortcut, set new parent and recaculate FGH
    this.parentList[this.getIndex(x, y)] = {x : this.nowPoint.x, y : this.nowPoint.y};
    this.calculateSinglePoint(x, y);
}
Findway.prototype.calculateSinglePoint = function(x, y) {
    var index = this.getIndex(x, y);

    this.openList[index].g = this.getG(x, y);
    this.openList[index].h = this.getH(x, y);
    this.openList[index].f = this.getF(x, y);
}
Findway.prototype.addSingleToOpenList = function(x, y) {
    var index = this.getIndex(x, y)
    if (this.openList[index]) return;

    this.openList[index] = {x : x, y : y};
    this.parentList[index] = {x : this.nowPoint.x, y : this.nowPoint.y};
    this.calculateSinglePoint(x, y);
}
Findway.prototype.outputPointToCloseList = function(index) {
    if (!this.openList[index]) return;

    this.closeList[index] = this.openList[index];
    delete this.openList[index];
}
Findway.prototype.getMinFIndex = function() {
    var fArray = [], indexArray = [];
    var i;
    for (i in this.openList) {
        fArray.push(this.openList[i].f);
        indexArray.push(i);
    }
    var minF = this.minInArray(fArray);
    var minFIndexArray = [];
    for (i in this.openList) {
        if (this.openList[i].f === minF) {
            minFIndexArray.push(i);
        }
    }
    return minFIndexArray;
}
Findway.prototype.traceBack = function() {
    if (this.nowPoint.x === this.startPoint.x && this.nowPoint.y === this.startPoint.y) return;

    var index = this.getIndex(this.nowPoint.x, this.nowPoint.y);
    this.way.push(index);

    var parent = this.parentList[index];
    this.nowPoint = {x : parent.x, y : parent.y};

    this.traceBack();
}
Findway.prototype.setNowPoint = function(x, y) {
    this.nowPoint.x = x;
    this.nowPoint.y = y;
}
Findway.prototype.minInArray = function(array) {
    return Math.min.apply( Math, array );
}
Findway.prototype.maxInArray = function(array) {
    return Math.max.apply( Math, array );
}
Findway.prototype.getIndex = function(x, y) {
    return x + ',' + y;
}
Findway.prototype.getXY = function(index) {
    index = index.split(',');
    return {x : index[0], y : index[1]};
}
