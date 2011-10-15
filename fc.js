global.fc = {
    //generate a GUID
    guid : function() {
        var guid = ""; 
        for (var i = 1; i <= 32; i++){ 
            var n = Math.floor(Math.random() * 16.0).toString(16); 
            guid += n; 
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) 
                guid += "-"; 
        } 
        return guid; 
    }
    //get random
    ,random : function(n) {
        return Math.floor(Math.random() * n);
    }
    //get timestamp
    ,getTimestamp : function() {
        return Date.now();
    }
    //get object length
    ,objectLength : function(object) {
        var c = 0;
        for (var i in object) {
            if (object.hasOwnProperty(i)) ++c;
        }
        return c;
    }
    ,fix : function(float) {
        return typeof(float) === 'number' ? parseInt(float.toFixed()) : float;
    }
};
