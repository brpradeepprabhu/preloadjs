/**
 * Created by pradeep on 19-06-2015.
 */
var assetLoader = assetLoader || {};
var sound = sound || {};
var images = images || {};
var script = script || {};
var webAudioPlugin = true;
var audioContext;

/**
 *  check whether webaudio supports or not
 *
 */
if (typeof AudioContext !== 'undefined') {
    audioContext = new AudioContext();
} else if (typeof webkitAudioContext !== 'undefined') {
    audioContext = new webkitAudioContext();
}
else {
    webAudioPlugin = false;
}

(function () {

    "use strict";
    var preload = function () {
        assetLoader.EventDispatcher.call(this);
        this._loadSoundCount = 0;
        this._loadSoundArray = [];
        this._loadImageArray = [];
        this._loadScriptArray = [];
        this._loadImageCount = 0;
        this._loadScriptCount = 0;
        this._loadScriptComplete = false;
        this._loadImageComplete = false;
        this._loadsoundComplete = false;
        this.proxy = assetLoader.proxy;
    };
    /*** extend the class with event dispatcher*****/

    var p = preload.prototype = assetLoader.extend(preload, assetLoader.EventDispatcher);

    /**
     * public function
     * 
     * To load the assets.
     *
     * <h4>Example</h4>
     *      var preloadjs = new src.preloadjs();
     *      preloadjs.loadManifest(manifest);
     *
     * @method loadManifest
     * @param {Object} manifest The Object type of the manifest.
     */
    p.loadManifest = function (manifest) {

        for (var i = 0; i < manifest.length; i++) {
            var extension = manifest[i].src.split(".");
            extension[1] = extension[1].toLowerCase();
            if (extension[1] === "mp3" || extension[1] === "wav" || extension[1] === "ogg") {
                this._loadSoundArray.push(manifest[i]);
            }
            if (extension[1] === "png" || extension[1] === "jpeg" || extension[1] === "jpg") {
                this._loadImageArray.push(manifest[i]);
            }
            if (extension[1] === "js") {
                this._loadScriptArray.push(manifest[i]);
            }
        }
        this._loadSound();
        this._loadImage();
        this._loadScript();

    };
    /**
     * private function
     *
     * To load the script which we split in the manifest
     * @method _loadScript
     *
     */

    p._loadScript = function () {
        if( this._loadScriptArray.length>0) {
            for (var i = 0; i < this._loadScriptArray.length; i++) {
                var src = this._loadScriptArray[i].src;
                var id = this._loadScriptArray[i].id;
                if (typeof script[id] === 'undefined') {
                    var scriptTag = document.createElement("script");
                    scriptTag.src = src;
                    scriptTag.id = id;
                    scriptTag.type = "text/javascript";
                    document.getElementsByTagName('head')[0].appendChild(scriptTag);
                    scriptTag.addEventListener('load', this.proxy(this.scriptLoadComplete, this, scriptTag, id));

                }
            }
        }
        else
        {
            this._loadScriptComplete = true;
            this._checkComplete();
        }
    };
    /**
     * private function
     *
     * Trigger when  each  script load is complete
     * @method scriptLoadComplete
     * @param {event} e load event which triggers when we load script
     * @param {event} scriptTag script tag which we added
     * @param {id} id id of the script tag which we passed in manifest
     */
    p.scriptLoadComplete = function (e, scriptTag, id) {
        script[id] = scriptTag;
        this._loadScriptCount++;
        if (this._loadScriptCount === this._loadScriptArray.length) {
            this._loadScriptComplete = true;
            this._checkComplete();
        }


    };
    /**
     * private function
     *
     * To load the image which we split in the manifest
     * @method _loadImage
     *
     */
    p._loadImage = function () {
        if( this._loadImageArray.length>0) {
            for (var i = 0; i < this._loadImageArray.length; i++) {
                var src = this._loadImageArray[i].src;
                var id = this._loadImageArray[i].id;
                if (typeof images[id] === 'undefined') {
                    var image = new Image();
                    image.src = src;
                    image.addEventListener('load', this.proxy(this._imageComplete, this, image, id));
                }
            }
        }
        else
        {
            this._loadImageComplete=true;
            this._checkComplete();
        }
    };
    /**
     * private function
     *
     * Trigger when  each  image load is complete
     * @method _imageComplete
     * @param {event} e load event which triggers when we load image
     * @param {event} image image tag which we added
     * @param {id} id id of the image tag which we passed in manifest
     */
    p._imageComplete = function (e, image, id) {
        images[id] = image;
        this._loadImageCount++;
        if(this._loadImageCount===this._loadImageArray.length)
        {
            this._loadImageComplete=true;
            this._checkComplete();
        }
    };
    /**
     * private function
     * Here we are checking whether browser support webaudio or not. if not it will fallback
     * native html audio. Currenlty Chrome,Safari (greater than 6) ,Firefox will support webaudio.
     * For IE it will create audio tag.
     *
     * To load the sound which we split in the manifest
     *
     * @method _loadSound
     *
     */
    p._loadSound = function () {
        if (this._loadSoundArray.length>0) {
            for (var i = 0; i < this._loadSoundArray.length; i++) {
                var src = this._loadSoundArray[i].src;
                var id = this._loadSoundArray[i].id;
                if (typeof  sound[id] === 'undefined') {
                    if (!webAudioPlugin) {
                        var audiotag = document.createElement("audio");
                        audiotag.id = id;
                        var sourceTag = document.createElement("source");
                        sourceTag.src = src;
                        audiotag.appendChild(sourceTag);
                        audiotag.addEventListener('canplaythrough', this.proxy(this._soundComplete, this, audiotag, id));
                        document.body.appendChild(audiotag)
                    }
                    else {
                        var request = new XMLHttpRequest();
                        request.id = id;
                        request.open('GET', src, true);
                        request.responseType = 'arraybuffer';
                        request.addEventListener('load', this.proxy(this._soundComplete, this, request, id), false);
                        request.send();
                    }

                }
            }
        }
        else
        {
            this._loadsoundComplete=true;
            this._checkComplete();
        }

    };
    /**
     * private function
     *
     * Trigger when  each  audio load is complete
     * @method _soundComplete
     * @param {event} e load event which triggers when we load audio
     * @param {event} audio audio tag which we added
     * @param {id} id id of the image tag which we passed in manifest
     */
    p._soundComplete = function (e, audio, id) {
        if (webAudioPlugin) {
            audioContext.decodeAudioData(audio.response, this.proxy(this._decodedAudio, this, id));
        }
        else {
            sound[id] = audio;
            this._loadSoundCount++;
            if(this._loadSoundCount===this._loadSoundArray.length)
            {
                this._loadsoundComplete=true;
                this._checkComplete();
            }

        }
    };
    /**
     * private function
     *
     * When sound is loaded for the webaudio  the output will be a array buffer.
     * after the decode the function this function will trigger
     * @method _decodedAudio
     * @param {buffer} buffer the output after decode the audio
     * @param {id} id id of the sound tag which we passed in manifest
     */
    p._decodedAudio = function (buffer, id) {
        sound[id] = buffer;
        this._loadSoundCount++;
        if(this._loadSoundCount===this._loadSoundArray.length)
        {
            this._loadsoundComplete=true;
            this._checkComplete();
        }
    };
    /**
     * private function
     *
     * Check whether all load is completed or not.
     * if complete it will trigger the dispatch event of onComplete.
     *
     * @method _checkComplete
     *
     */
    p._checkComplete= function () {

        if((this._loadScriptComplete===true)&&(this._loadImageComplete===true)&&(this._loadsoundComplete===true))
        {
            console.log("onCompleteFn");
            this.dispatchEvent("complete",this)
        }
    };

    assetLoader.preload = preload;
}());