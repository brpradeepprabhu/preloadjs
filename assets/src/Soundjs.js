/**
 * Created by pradeep on 21-06-2015.
 */
var assetLoader = assetLoader || {};
var sound = sound || {};
(function () {
    /***
     *
     * @constructor
     */
    var SoundClass = function () {
        this._soundPlayList = {};
        this.muteVolume = false;
        this._gainNode = null;
        this.volume = 1;
        if (webAudioPlugin) {
            if (typeof audioContext.createGainNode === "undefined") {
                this._gainNode = audioContext.createGain();
            }
            else {
                this._gainNode = audioContext.createGainNode();
            }

        }
    };


    var p = SoundClass.prototype;
    /**
     *
     * @param id
     * @returns {*}
     */
    p.play = function (id) {
        if (typeof(this._soundPlayList[id]) !== 'undefined') {
            this._soundPlayList[id].pause();
            delete this._soundPlayList[id];
        }
        this._soundPlayList[id] = new assetLoader.soundInstance(this, id);
        this._soundPlayList[id].play();
        return this._soundPlayList[id];
    };
    /**
     * To pause all the sound created by an instance
     * Eg:
     *  var soundClass = new assetLoader.soundjs();
     *  soundClass.play("one.mp3");
     *  soundClass.play("two.mp3");
     *  soundClass.pause();
     */
    p.pause = function () {
        if (Object.keys(this._soundPlayList).length > 0) {
            for (var prop in this._soundPlayList) {
                if (this._soundPlayList.hasOwnProperty(prop)) {
                    this._soundPlayList[prop].pause();
                }
            }
        }
    };
    /**
     * To resume all the sound created by an instance
     * Eg:
     *  var soundClass = new assetLoader.soundjs();
     *  soundClass.play("one.mp3");
     *  soundClass.play("two.mp3");
     *  soundClass.pause();
     *  soundClass.resume();
     */
    p.resume = function () {
        if (Object.keys(this._soundPlayList).length > 0) {
            for (var prop in this._soundPlayList) {

                if (this._soundPlayList.hasOwnProperty(prop)) {
                    this._soundPlayList[prop].resume();
                }
            }
        }
    };
    /**
     * To set the volume for the audio is playing and newly playing sound
     *
     * @param {Number} no  the volume for the global context
     */
    p.setVolume = function (no) {
        this.volume = no;
        if (webAudioPlugin) {
            this._gainNode.gain.value = (this.muteVolume) ? 0 : this.volume;
            this._gainNode.connect(audioContext.destination);
        }
        else {
            if (Object.keys(this._soundPlayList).length > 0) {
                for (var prop in this._soundPlayList) {
                    if (this._soundPlayList.hasOwnProperty(prop)) {
                        this._soundPlayList[prop].volume = this.volume;
                        document.getElementById(prop).volume = this.volume;
                    }
                }
            }
        }
    };
    /**
     *  To mute the sound created by an instance
     *  var soundClass = new assetLoader.soundjs();
     *  soundClass.play("one.mp3");
     *  soundClass.pause();
     */
    p.mute = function () {
        this.muteVolume = true;
        if (webAudioPlugin) {
            this._gainNode.gain.value = (this.muteVolume) ? 0 : this.volume;
            this._gainNode.connect(audioContext.destination);

        }
        else {
            if (Object.keys(this._soundPlayList).length > 0) {
                for (var prop in this._soundPlayList) {
                    if (this._soundPlayList.hasOwnProperty(prop)) {
                        this._soundPlayList[prop].volume = 0;
                    }
                }
            }
        }

    };
    /**** unmute the playlist ***/
    p.unMute = function () {
        this.muteVolume = false;
        if (webAudioPlugin) {
            this._gainNode.gain.value = (this.muteVolume) ? 0 : this.volume;
            this._gainNode.connect(audioContext.destination);
        }
        else {
            if (Object.keys(this.playList).length > 0) {
                for (var prop in this._soundPlayList) {
                    if (this._soundPlayList.hasOwnProperty(prop)) {
                        this._soundPlayList[prop].volume = 1;
                    }
                }
            }
        }

    };

    assetLoader.soundjs = SoundClass;

}());