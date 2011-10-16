var Audio = function() {
    this.music = {
        "audio-bg-menu": $('#audio-bg-menu')[0],
        "audio-bg-game": $('#audio-bg-game')[0]
    };
    this.sound = {
        "audio-menu-over": $('#audio-menu-over')[0],
        "audio-menu-click": $('#audio-menu-click')[0],
        "audio-kickwall": $('#audio-kickwall')[0],
        "audio-findsprite": $('#audio-findsprite')[0],
        "audio-monster-warning": $('#audio-monster-warning')[0],
        "audio-monster-catch": $('#audio-monster-catch')[0],
        "audio-win": $('#audio-win')[0],
        "audio-death": $('#audio-death')[0],
        "audio-speedup": $('#audio-speedup')[0]
    };
    this.musicEnabled = true;
    this.soundEnabled = true;
};

Audio.prototype.play = function(name) {
    if (this.music[name] && this.musicEnabled) {
        this.music[name].play();
        return;
    }
    if (this.sound[name] && this.soundEnabled) {
        this.sound[name].play();
    }
};
Audio.prototype.pause = function(name) {
    if (this.music[name] && this.musicEnabled) {
        this.music[name].pause();
        return;
    }
    if (this.sound[name] && this.soundEnabled) {
        this.sound[name].pause();
    }
};
Audio.prototype.pauseAll = function() {
    for (var i in this.music) {
        this.music[i].pause();
    }
    for (var j in this.sound) {
        this.sound[j].pause();
    }
};
Audio.prototype.musicToggle = function() {
    if (audio.musicEnabled) {
        audio.pauseAll();
        audio.musicEnabled = false;
        $('#button-music').addClass('alpha');
    } else {
        audio.musicEnabled = true;
        $('#button-music').removeClass('alpha');
    }
};
Audio.prototype.soundToggle = function() {
    if (audio.soundEnabled) {
        audio.pauseAll();
        audio.soundEnabled = false;
        $('#button-sound').addClass('alpha');
    } else {
        audio.soundEnabled = true;
        $('#button-sound').removeClass('alpha');
    }
};
