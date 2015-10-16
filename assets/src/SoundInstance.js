/**
 * Created by Pradeep Prabhu on 23-07-2015.
 */
var assetLoader = assetLoader || {};
(function () {
    var SoundInstance = function (parentClass, id) {
        assetLoader.EventDispatcher.call(this)
        this.id = id;
        this.source = null;
        this.pauseTime = 0;
        this.currentTime = 0;
        this.proxy = assetLoader.proxy;
        this._parentClass = parentClass;
    };
    var p = SoundInstance.prototype = assetLoader.extend(SoundInstance, assetLoader.EventDispatcher);
    p.play = function () {

        if (typeof sound[this.id] !== 'undefined') {
            this.pauseTime = 0;
            if (webAudioPlugin) {
                this.source = audioContext.createBufferSource(); // creates a sound source
                this.source.buffer = sound[this.id];
                this.source.connect(this._parentClass._gainNode);
                this._parentClass._gainNode.connect(audioContext.destination);
                this.source.totalDuration = sound[this.id].duration * 1000;
                this.currentTime = audioContext.currentTime;// connect the source to the context's destination (the speakers)
                if (typeof  this.source.start !== undefined) {
                    this.source.start(0);
                }
                else {
                    this.source.noteOn(0);
                }


                this.source.onComplete = setTimeout(this.proxy(this.soundComplete, this), this.source.totalDuration);
            }
            else {
                var domAudio = this.source = document.getElementById(this.id);
                if (domAudio === null) {
                    this.source = document.body.appendChild(sound[this.id]);
                    this.source.play();
                }
                else {
                    this.source.currentTime = 0;
                    this.source.play();
                }
                this.source.addEventListener('ended', this.proxy(this.soundComplete, this))

            }
        }
    };
    p.soundComplete = function () {
        this.dispatchEvent("complete", this);
        delete this._parentClass._soundPlayList[this.id];
    };
    p.pause = function () {

        if (webAudioPlugin) {

            if (typeof this.source.stop !== "undefined") {
                this.source.stop(0);
            }
            else {
                this.source.noteOff(0);
            }
            this.pauseTime = audioContext.currentTime;
            clearTimeout(this.source.onComplete);
        }
        else {

            this.pauseTime = this.source.currentTime;
            this.source.pause();
        }
    };
    p.resume = function () {
        if (webAudioPlugin) {
            this.source = audioContext.createBufferSource(); // creates a sound source
            this.source.buffer = sound[this.id];
            this.source.connect(this._parentClass._gainNode);
            this._parentClass._gainNode.connect(audioContext.destination);
            this.source.totalDuration = sound[this.id].duration * 1000;
            if (typeof this.source.start !== "undefined") {
                this.source.start(0, this.pauseTime % sound[this.id].duration);
            } else {
                this.source.noteOn(0, this.pauseTime % sound[this.id].duration);
            }
            this.source.onComplete = setTimeout(this.proxy(this.soundComplete, this), (this.pauseTime % this.source.totalDuration) * 1000);
        }
        else {
            this.source.load();
            if (this.pauseTime > 1) {
                this.source.currentTime = this.pauseTime;
                this.source.play();
            }
            else {
                this.source.play();
            }
        }
    };
    assetLoader.soundInstance = SoundInstance;
}());