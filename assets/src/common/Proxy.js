/**
 * Created by Pradeep Prabhu on 23-07-2015.
 */
var assetLoader = assetLoader || {};
(function () {


    /**
     * A function proxy for methods. By default, JavaScript methods do not maintain scope, so passing a method as a
     * callback will result in the method getting called in the scope of the caller. Using a proxy ensures that the
     * method gets called in the correct scope.
     *
     * Additional arguments can be passed that will be applied to the function when it is called.
     *
     * <h4>Example</h4>
     *
     *      myObject.addEventListener("event", src.proxy(myHandler, this, arg1, arg2));
     *
     *      function myHandler(arg1, arg2) {
	 *           // This gets called when myObject.myCallback is executed.
	 *      }
     *
     * @method proxy
     * @param {Function} method The function to call
     * @param {Object} scope The scope to call the method name on
     * @param {arguments} [args] * Arguments that are appended to the callback for additional params.
     * @public
     * @static
     */
    assetLoader.proxy = function (method, scope, args) {
        var aArgs = Array.prototype.slice.call(arguments, 2);
        return function () {
            return method.apply(scope, Array.prototype.slice.call(arguments, 0).concat(aArgs));
        };
    };
}());