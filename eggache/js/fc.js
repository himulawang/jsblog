var fc = {
    getNowTimestamp : function() {
        return Date.now();
    }
    ,guid : function() {
        var guid = ""; 
        for (var i = 1; i <= 32; i++){ 
            var n = Math.floor(Math.random() * 16.0).toString(16); 
            guid += n; 
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) 
                guid += "-";
        } 
        return guid; 
    }
    ,fill0 : function(length, origin) {
        var originLength = ('' + origin).length;
        var fillTime = length - originLength;
        var string = origin;
        for (var i = 0; i < fillTime; ++i) {
            string = '0' + string;
        }
        return string;
    }
    ,getXY : function(index) {
        index = index.split(',');
        return { x : parseInt(index[0]), y : parseInt(index[1]) };
    }
    ,getIndex : function(x, y) {
        return x + ',' + y;
    }
    ,getDisplacement : function(a, b) {
        var m = Math;
        return m.sqrt(m.pow(b.x - a.x, 2) + m.pow(b.y - a.y, 2));
    }
}
