/**
 * Created by pradeep on 20-06-2015.
 */
var assetLoader = assetLoader || {};

(function () {
    /**
      EventDispatcher provides methods for adding,removing,dispatching a event.
     */
    var EventDispatcher = function () {
        this._listeners = null;
    };

    var p = EventDispatcher.prototype;

    /**
     * public function
     *
     * To add a event
     *
     * <h4>Example</h4>
     *      var preloadjs = new src.preloadjs();
     *      preloadjs.addEventListener("onComplete", functionName);
     *
     * @method loadManifest
     * @param {String} type  The Event which we want to add
     * @param {Function} listener  Function which we want to call when we trigger the event
     */
    p.addEventListener = function (type, listener) {
        var listeners;
        listeners = this._listeners = this._listeners || {};
        this._listeners[type] = listener;
    };

    /**
     * public function
     *
     * To add a event
     *
     * <h4>Example</h4>
     * preloadjs.removeEventListener("onComplete");
     *
     * @method loadManifest
     * @param {String} type  The Event which we want to remove

     */


    p.removeEventListener = function (type) {
        var listeners;
        listeners = this._listeners = this._listeners || {};
        delete(listeners[type]);
    };

    /**
     * public function
     *
     * To remove all the event
     *
     * <h4>Example</h4>
     * preloadjs.removeAllEventListener();
     *
     * @method removeAllEventListener

     */

    p.removeAllEventListener = function () {
        this._listeners = {};
    };

    /**
     * public function
     *
     * To dispatch a event
     *
     * <h4>Example</h4>
     *  dispatchEvent("onComplete",this);
     *
     * @method dispatchEvent
     * @param {String} event  The Event which we want to dispatch
     * @param {scope} scope  the scope of the function along with call back to avoid the confusion
     */


    p.dispatchEvent = function (event, scope) {
        listeners = this._listeners = this._listeners || {};
        if (typeof this._listeners[event] !== 'undefined') {
            this._listeners[event].apply(scope);
        }
    };
    assetLoader.EventDispatcher = EventDispatcher;

}());