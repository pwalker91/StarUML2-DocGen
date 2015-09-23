
/**
 * The functions for when a user wants to generate
 *  a Functional Specification document
 *
 * AUTHOR:  Peter Walker
 * DATE:    16 September 2015
 * UPDATED: 22 September 2015
 */

define(function (require, exports, module) {
    "use strict";

    //Importing the StarUML global modules that we want to use
    var Dialogs         = app.getModule("dialogs/Dialogs"),
        FileSystem      = app.getModule("filesystem/FileSystem"),
        Directory       = app.getModule("filesystem/Directory"),
        FileUtils       = app.getModule("file/FileUtils"),
        CommandManager  = app.getModule("command/CommandManager"),
        ExtensionUtils  = app.getModule("utils/ExtensionUtils"),
        UseCaseModel    = require("DocGen/_UMLElems/UseCaseModel"),
        common          = require("DocGen/_common");


    /* BEGIN CLASS */
    /**
    * @constructor
    * @desc This is the FunctionalSpec object, which we will use to
    *       catalogue information on the project we've been asked to export
    * @param    project : UMLProject, the project to convert
    */
    function FunctionalSpec(project, HOME) {
        this.nothing = null;
        this.project = project || null;
        this.HOME    = HOME || null;
        //If this.HOME is a Directory object, then we can create the sub-folders
        // for the images and CSS
        if (this.HOME !== null && (this.HOME instanceof Directory)) {
            this.IMAGES = FileSystem.getDirectoryForPath(this.HOME.fullPath+"images");
            this.CSS    = FileSystem.getDirectoryForPath(this.HOME.fullPath+"css");
        } else {
            this.IMAGES = null;
            this.CSS    = null;
        }
    }
        /**
        * @desc This is a simple function for testing that the object works
        */
        FunctionalSpec.prototype.test_alert = function test_alert() {
            Dialogs.showAlertDialog("Hello, world!");
        };

      /* ------------------------------------------------------------------- */
        /**
        * @desc Returns a string of HTML, the content within the header of the
        *       document being created.
        * @param    project : UMLProject to extract header info from
        * @return   String of HTML
        */
        FunctionalSpec.prototype._createHTMLHeader = function(project) {
            var HTML = "";
            HTML += "<div class=\"header\">\n"+
                        "<div class=\"author\">\n"+
                            "<p><b>Author:</b> "+project.author+"</p>\n"+
                            "<p><b>Company:</b> "+project.company+" &copy;"+project.copyright+"</p>\n"+
                            "<p><b>Version:</b> "+project.version+"</p>\n"+
                        "</div>\n"+
                        "<div class=\"intro\">\n"+
                            "<p>"+project.documentation+"</p>\n"+
                        "</div>\n"+
                    "</div>\n";
            return HTML;
        };
        /**
        * @desc Creates the HTML document based on the project attribute
        * @return   Deferred, a RESOLVE or REJECT based on success
        */
        FunctionalSpec.prototype.createDoc = function() {
            var result = $.Deferred();
            //Sanity check
            if (!(this.project instanceof type.Project)) {
                var err = "Did not have a project to convert";
                console.log(err, this.project);
                return result.reject(err);
            }

            //Just to be safe, we will create the folders if they aren't already
            this.HOME.create(); this.IMAGES.create(); this.CSS.create();
            //The name of the CSS file we will copy
            this.cssfn   = "funcspec.css";
            common.writeCSS(this.CSS, this.cssfn);

            //After defining our base HTML, this will extract all of the
            // UMLModels from our project, and go through each one to extract
            // the Use Cases.
            var HTML = "";
            HTML += "<html>\n"+
                        "<head>\n"+
                            "<link rel=\"stylesheet\" type=\"text/css\" "+
                                  "href=\"css/"+this.cssfn+"\">"+
                        "</head>\n"+
                        "<body>\n"+
                            "<div class=\"title\">"+
                                "<h1>Functional Specification for <b>"+this.project.name+"</b></h1>"+
                            "</div>\n"+
                            this._createHTMLHeader(this.project)+"\n";
            //Extracting all of our Use Case Models from the project, and
            // generating our HTML from each
            var allUCModels = common.extractElements(this.project, type.UMLModel);
            for (var ind=0; ind<allUCModels.length; ind++) {
                var model = new UseCaseModel.obj(allUCModels[ind]);
                HTML += model.createFSHTML(this.IMAGES);
            }
            HTML +=     "</body>\n"+
                    "</html>";

            //Now we can finally save our HTML file
            common.writeHTML(this.HOME, this.project.name+".html", HTML);
            return result.resolve();
        };
    /* END CLASS */


    /**
    * @desc This function preforms the high level execution, taking a Project
    *       element and path, and creating the Functional Specification document
    * @param    project : type.Project : The Project element to convert into a document
    * @param    path : String : Folder to save documents in. Defaults to directory if FILEPATH given
    * @return   Deferred resolution : A REJECT or RESOLVE ending for our Deferred
    */
    function execute(project, path) {
        var DIRECTORY = FileSystem.getDirectoryForPath(path),
            HOME      = DIRECTORY.fullPath+"staruml_html";
        var FuncSpecObj = new FunctionalSpec(project, HOME);

        return FuncSpecObj.createDoc();
    }

    //This exports the functions we've defined so that other scripts
    // can use them when executing
    exports.execute = execute;
});
