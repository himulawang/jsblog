var AI = function() {};

AI.prototype.isCollision = function(aXY, bXY, aR, bR) {
    var displacement = fc.getDisplacement(aXY, bXY) * GRID_SINGLE_WIDTH;
    var abR = aR + bR;
    return displacement < abR;
};
