var Event = function() {
    this.pressedKey = [];
};

Event.prototype.initMenuEvent = function() {
    audio.play('audio-bg-menu');
    $('#button-start').bind('click', this.startGame);
    $('.button').bind('mouseover', this.buttonOver)
        .bind('click', this.buttonClick)
    ;
    $('#button-music').bind('click', this.musicToggle);
    $('#button-sound').bind('click', this.soundToggle);
};
Event.prototype.musicToggle = function() {
    audio.musicToggle();
};
Event.prototype.soundToggle = function() {
    audio.soundToggle();
};
Event.prototype.startGame = function() {
    audio.pause('audio-bg-menu');
    audio.play('audio-bg-game');
    $('#menu').addClass('hide');
    $('#game').removeClass('hide');

    map = new Map();
    map.init();

    elf = new Elf();
    elf.init(1, 1);
    elf.append();

    findway = new Findway();
    findway.setScope({ x: 0, y: 0}, { x: GRID_MAX_WIDTH - 1, y: GRID_MAX_HEIGHT - 1});
    var xy, mapType;
    for (var i in map.data) {
        xy = fc.getXY(i);
        mapType = map.data[i];
        if (mapType === 2 || mapType === 3) {
            continue;
        }
        findway.setObstacle(xy.x, xy.y);
    }

    monster1 = new Monster();
    var range1 = [
        "7,7",
        "7,8",
        "7,9",
        "7,10",
        "7,11",
        "7,12",
        "7,13",
        "7,14",
        "7,15",
        "7,16",
        "7,15",
        "7,14",
        "7,13",
        "7,12",
        "7,11",
        "7,10",
        "7,9",
        "7,8"
    ];
    monster1.init(7, 6, range1);
    monster1.append();

    monster2 = new Monster();
    var range2 = [
        "20,10",
        "20,11",
        "20,12",
        "20,13",
        "20,14",
        "20,15",
        "20,16",
        "20,17",
        "20,16",
        "20,15",
        "20,14",
        "20,13",
        "20,12",
        "20,11"
    ];
    monster2.init(20, 11, range2);
    monster2.append();

    monster3 = new Monster();
    var range3 = [
        "23,7",
        "23,6",
        "23,5",
        "23,4",
        "23,3",
        "23,2",
        "24,2",
        "25,2",
        "26,2",
        "27,2",
        "27,3",
        "27,4",
        "27,5",
        "27,6",
        "27,5",
        "27,4",
        "27,3",
        "27,2",
        "26,2",
        "25,2",
        "24,2",
        "23,2",
        "23,3",
        "23,4",
        "23,5",
        "23,6"
    ];
    monster3.init(23, 6, range3);
    monster3.append();

    sprites.push(new Sprite());
    sprites[0].init(15, 1);
    //sprites[0].init(2, 2);
    sprites[0].append();
    sprites.push(new Sprite());
    sprites[1].init(13, 14);
    //sprites[1].init(3, 4);
    sprites[1].append();
    sprites.push(new Sprite());
    sprites[2].init(26, 15);
    //sprites[2].init(5, 4);
    sprites[2].append();

    // event
    events.initElf();

    // tool
    foot = new Foot();
    foot.init(7, 7);
    foot.append();

    // hole
    hole = new Hole();
    hole.init(3, 16);
    hole.append();
};
Event.prototype.initElf = function() {
    $(document).bind('keydown', this.keyDown)
        .bind('keyup', this.keyUp)
    ;
};
Event.prototype.initWinLostBanner = function() {
    $('#banner-win,#banner-lose').bind('click', this.backToMenu);
}
Event.prototype.elfAction = function(e) {
    if (elf.animation.moving) return;
    if (this.pressedKey.length === 0) return;

    var keyCode = this.pressedKey[this.pressedKey.length - 1];
    /* 38: up
     * 40: down
     * 37: left
     * 39: right
     * */
    if (keyCode === 38) {
        elf.move('up');
    } else if (keyCode === 40) {
        elf.move('down');
    } else if (keyCode === 37) {
        elf.move('left');
    } else if (keyCode === 39) {
        elf.move('right');
    }
};
Event.prototype.buttonOver = function(e) {
    audio.play('audio-menu-over');
};
Event.prototype.buttonClick = function(e) {
    audio.play('audio-menu-click');
};
Event.prototype.keyDown = function(e) {
    var keyCode = e.which;
    if (util.inObject(keyCode, events.pressedKey)) {
        return;
    }
    events.pressedKey.push(keyCode);
};
Event.prototype.keyUp = function(e) {
    var keyCode = e.which;
    var index = util.inObject(keyCode, events.pressedKey);
    if (index) {
        delete events.pressedKey[index];
    }
};
Event.prototype.win = function() {
    audio.pause('audio-bg-game');
    audio.play('audio-win');
    $('#banner-win').show('slow');

    this.pressedKey = [];

    this.unbindAll();
    this.gameFinish();
};
Event.prototype.lose = function() {
    audio.pause('audio-bg-game');
    audio.play('audio-death');
    $('#banner-lose').show('slow');

    this.pressedKey = [];

    this.unbindAll();
    this.gameFinish();
};

Event.prototype.unbindAll = function() {
    $(document).unbind('keydown').unbind('keyup');
};
Event.prototype.gameFinish = function() {
    elf.destroy();
    monster1.destroy();
    monster2.destroy();
    monster3.destroy();
    sprites[0].destroy();
    sprites[1].destroy();
    sprites[2].destroy();
    foot.destroy();
    hole.destroy();
    map.destroy();
};
Event.prototype.backToMenu = function() {
    $('#game').addClass('hide');
    $('#menu').removeClass('hide');
    audio.pauseAll();
    $('#banner-win,#banner-lose').hide();

    // recycle resources

    $(elf.el).remove();
    $(monster1.el).remove();
    $(monster2.el).remove();
    $(monster3.el).remove();
    $(sprites[0].el).remove();
    $(sprites[1].el).remove();
    $(sprites[2].el).remove();
    $(foot.el).remove();
    $(hole.el).remove();

    elf = null;
    monster1 = null;
    monster2 = null;
    monster3 = null;
    delete sprites[0];
    delete sprites[1];
    delete sprites[2];
    sprites = [];
    foot = null;
    map = null;
    hole = null;
    findway = null;
};
