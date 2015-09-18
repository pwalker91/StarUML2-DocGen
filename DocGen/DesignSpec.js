
/**
 * The functions for when a user wants to generate
 *  a Design Specification document
 *
 * AUTHOR:  Peter Walker
 * DATE:    17 September 2015
 */

define(function (require, exports, module) {
    "use strict";

    //Importing the StarUML global modules that we want to use
    var Dialogs = app.getModule("dialogs/Dialogs");

    function DesignSpec() {
        this.nothing = null;
    }

    DesignSpec.prototype.test_alert = function test_alert() {
        Dialogs.showErrorDialog("I am a dangerous error. Fear me!!");
    };

    //This exports the functions we've defined so that other scripts
    // can use them when executing
    exports.object = DesignSpec;
});
