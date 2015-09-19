
/**
 * The functions for when a user wants to generate
 *  a Functional Specification document
 *
 * AUTHOR:  Peter Walker
 * DATE:    16 September 2015
 */

define(function (require, exports, module) {
    "use strict";

    //Importing the StarUML global modules that we want to use
    var Dialogs = app.getModule("dialogs/Dialogs");

    /**
    * @desc This is the FunctionalSpec object, which we will use to
    *       catalogue information on the project we've been asked to export
    * @constructor
    */
    function FunctionalSpec() {
        this.nothing = null;
    }

    /**
    * @desc This is a simple function for testing that the object works
    */
    FunctionalSpec.prototype.test_alert = function test_alert() {
        Dialogs.showAlertDialog("Hello, world!");
    };


    /**
    * @desc This function preforms the high level execution, taking a Project
    *       element and path, and creating the Functional Specification document
    * @param    project : type.Project  : __
    * @param    path    : String?       : __
    * @return   Boolean : Success(TRUE) or failure(FALSE) of document creation
    */
    function execute(project, path) {
        var result = new $.Deferred();

        console.log(project);
        console.log(path);

        if ( !(project instanceof type.Project) ) {
            result.reject();
        } else {
            result.resolve()
        }

        return result.promise();
    }

    //This exports the functions we've defined so that other scripts
    // can use them when executing
    exports.execute = execute;
});
