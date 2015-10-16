/**
 * Created by pradeep on 20-06-2015.
 */
var assetLoader = assetLoader || {};
(function () {
    /**
    * Sets up the prototype chain and constructor property for a new class.
    *
    * This should be called right after creating the class constructor.
    *
    * 	function MySubClass() {}
    * 	src.extend(MySubClass, MySuperClass);
    * 	MySubClass.prototype.doSomething = function() { }
    *

    *
    * @method extend
    * @param {Function} subclass The subclass.
    * @param {Function} superclass The superclass to extend.
    * @return {Function} Returns the subclass's new prototype.
    */
    assetLoader.extend = function (subclass, superclass) {
        "use strict";
        function o() {
            this.constructor = subclass;
        }
        o.prototype = superclass.prototype;
        return (subclass.prototype = new o());
    };
}());