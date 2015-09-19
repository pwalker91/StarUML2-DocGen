
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
    var Dialogs             = app.getModule("dialogs/Dialogs"),
        FileSystem          = app.getModule("filesystem/FileSystem"),
        FileUtils           = app.getModule("file/FileUtils"),
        Async               = app.getModule("utils/Async"),
        SelectionManager    = app.getModule("engine/SelectionManager"),
        CommandManager      = app.getModule("command/CommandManager"),
        ExtensionUtils      = app.getModule("utils/ExtensionUtils");

    /**
    * @desc This is the FunctionalSpec object, which we will use to
    *       catalogue information on the project we've been asked to export
    * @constructor
    */
    function FunctionalSpec() {
        this.nothing = null;
        this.project = null;
        this.models  = [];
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

        //Make folder in directory
            //if exists, remove then create
            // make folder in folder for images
            // make folder in folder for css

        //find info in project
            //basic info
            //uml model(s)
                // model = {"usecases":[], "diagrams":[]}
                //use cases
                //diagram

        // ask user for css styling (??)

        //build HTML file

        //exit





        var directory = FileSystem.getDirectoryForPath(path);
        console.log("created directory obj", directory);
        var newdirectory = FileSystem.getDirectoryForPath(directory.fullPath+"mynewdir");
        newdirectory.create();
        var newerdirectory = FileSystem.getDirectoryForPath(path+"/mynewerdir");
        newerdirectory.create();
        var newerfile = FileSystem.getFileForPath(path+"/mynewerdir/testfile.txt");
        console.log("writing file");
        //NOTE: Callbacks, fucking everywhere.
        newerfile.write("FILE CONTENTS",
        function(err, stats) {
            console.log("all directories", directory, newdirectory, newerdirectory);
            console.log(newerdirectory.getContents(
                function(err, entries, stats){
                    console.log("getting newer contents", err, entries, stats);
                }));
            newerfile.moveToTrash(
            function(err) {
                console.log(newerdirectory.getContents(
                    function(err, entries, stats){
                        console.log("getting newer contents 2", err, entries, stats);
                    }));
            });
        });

        //this might be useful
        Async.doSequentially(
            elem.ownedElements,
            function (child) {
                return self.generate(child, fullPath, opts);
            },
            false
        ).then(result.resolve, result.reject);

        var temp1 = project.find_a_diagram_object_to_use();
        CommandManager.get("file.exportDiagramAs.png")
            ._commandFn(temp1,"/Users/peterwalker/Desktop/imtestingthis1.png");

        var DOCUMENT = new FunctionalSpec();
        DOCUMENT.project = project;
        console.log("my object", DOCUMENT);

        return result.resolve("I think I'm doing this correctly...");
    }

    //This exports the functions we've defined so that other scripts
    // can use them when executing
    exports.execute = execute;
});
