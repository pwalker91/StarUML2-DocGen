
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
    var Dialogs         = app.getModule("dialogs/Dialogs"),
        FileSystem      = app.getModule("filesystem/FileSystem"),
        ExtensionUtils  = app.getModule("utils/ExtensionUtils");

    /**
    * @desc This is the FunctionalSpec object, which we will use to
    *       catalogue information on the project we've been asked to export
    * @constructor
    */
    function FunctionalSpec() {
        this.nothing = null;
        this.project = null;
        this.diagram = null;
        this.usecases = [];
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
    * @return   Deferred resolution : A REJECT or RESOLVE ending for our Deferred
    */
    function execute(project, path) {
        var result = new $.Deferred();

        //Some bookkeeping to do, like checking that we were given
        // a project, and that the path is a directory
        if ( !(project instanceof type.Project) ) {
            return result.reject("Was not given a project");
        }
        var directory = new type.Directory(path, FileSystem);
        console.log(directory);

        var DOCUMENT = new FunctionalSpec();
        DOCUMENT.project = project;
        console.log(DOCUMENT);

        return result.resolve("I think I'm doing this correctly...");
    }

    //This exports the functions we've defined so that other scripts
    // can use them when executing
    exports.execute = execute;
});
