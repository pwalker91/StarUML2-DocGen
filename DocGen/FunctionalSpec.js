
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
    }
        /**
        * @desc This is a simple function for testing that the object works
        */
        FunctionalSpec.prototype.test_alert = function test_alert() {
            Dialogs.showAlertDialog("Hello, world!");
        };

        /* ----------------------------------------------------------------- */

        /**
        * @desc This takes a given object, which is assumed to be a StarUML object
        *       that has "ownedElements", and checks that it is of a given type.
        *       It then loops through its owned elements, searching for the second
        *       given type.
        * @param    StarUMLType : Class : A class type in StarUML 2
        * @return   Array of elements extracted
        */
        FunctionalSpec.prototype._extractType = function(obj, objType, searchType) {
            if (obj !== null && (obj instanceof objType)) {
                var allElems = [],
                    _oldlength = obj.ownedElements.length,
                    _newlength = 0;
                for (var ind=0; ind<obj.ownedElements.length; ind++) {
                    var _newitem = obj.ownedElements[ind];
                    if (_newitem instanceof searchType) {
                        _newlength = allElems.push( _newitem );
                        if (_newlength === _oldlength+1) {
                            _oldlength = _newlength;
                        }
                    }
                }
                return allElems;
            }
            return [];
        };
        /**
        * @desc Given that the FunctionalSpec object has a Project element in
        *       its 'project' attribute, this extracts all of the UML Models inside
        * @return   Array of UMLModel(s)
        */
        FunctionalSpec.prototype._extractUMLModels = function() {
            return this._extractType(this.project, type.Project, type.UMLModel);
        };
        /**
        *
        */
        FunctionalSpec.prototype._extractUseCases = function(aModel) {
            return this._extractType(aModel, type.UMLModel, type.UMLUseCase);
        };
        /**
        *
        */
        FunctionalSpec.prototype._extractDiagrams = function(aModel) {
            return this._extractType(aModel, type.UMLModel, type.UMLDiagram);
        };

        /* ----------------------------------------------------------------- */

        /**
        *
        */
        FunctionalSpec.prototype._convertUseCaseToHTML = function(usecase) {
            // body...
        };
        /**
        *
        */
        FunctionalSpec.prototype._convertModelToHTML  = function(model) {
            var HTML = "";
            var useCases = this._extractUseCases(model);

            //uml model(s)
                // model = {"usecases":[], "diagrams":[]}
                //use cases
                //diagram
            HTML += "<div id=\"use-cases\">";
            for (var ind2=0; ind2<useCases.length; ind2++) {
                HTML += this._convertUseCaseToHTML(useCases[ind2]);
            }
            HTML += "</div>";

            return HTML;
        };
        /**
        *
        */
        FunctionalSpec.prototype._convertProjectToHTMLHeader = function(project) {
            // body...
        };

        /* ----------------------------------------------------------------- */

        /**
        *
        */
        FunctionalSpec.prototype._writeCSS = function(CSSFolder) {
            ExtensionUtils.loadFile(module, "css file path").done(function(){});
            var result = $.Deferred();
            return result.promise();
        };
        /**
        *
        */
        FunctionalSpec.prototype._writeImages = function(ImageFolder, diagrams) {
            var temp1 = project.find_a_diagram_object_to_use();
            CommandManager.get("file.exportDiagramAs.png")
                ._commandFn(temp1,"/Users/peterwalker/Desktop/imtestingthis1.png");
        };
        /**
        *
        */
        FunctionalSpec.prototype._writeHTML = function(HomeFolder, HTML) {
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
        };

        /* ----------------------------------------------------------------- */

        /**
        *
        */
        FunctionalSpec.prototype._createUseCaseHTML = function() {
            var HTML = "";
            var models = this._extractUMLModels();
            //This loop will potentially add multiple divs, all of which
            // represent a UMLModel from the project
            for (var ind=0; ind<models.length; ind++) {
                HTML += this._convertModelToHTML(models[ind]);
            }
            return HTML;
        };
        /**
        *
        */
        FunctionalSpec.prototype.createHTML = function(project, home) {
            var result = $.Deferred();
            var HTML = "";

            //Some bookkeeping to do, like checking that we were given a project
            if ( !(project instanceof type.Project) ) {
                result.reject("Was not given a project");
            } else {
                this.project = project;
            }

            //Creating the necessary directories that we will be saving our HTML,
            // image, and CSS documents to.
            var HOME    = FileSystem.getDirectoryForPath(home),
                IMAGES  = FileSystem.getDirectoryForPath(HOME.fullPath+"/images"),
                CSS     = FileSystem.getDirectoryForPath(HOME.fullPath+"/css");
            HOME.create(); IMAGES.create(); CSS.create();

            //Now we start creating our HTML, which is put in the string HTML
            HTML += "<html>"+
                        "<head>"+
                            "<link rel=\"stylesheet\" type=\"text/css\" href=\"css/funcspec.css\">"+
                        "</head>"+
                        "<body>"+
                            "<div id=\"title\">"+
                                "<h1>Functional Specification for <b>"+this.project.name+"</b></h1>"+
                            "</div>"+
                            "<div id=\"header\">"+
                                this._convertProjectToHTMLHeader(this.project)+
                            "</div>"+
                            //creates divs of class 'use-cases'
                            this._createUseCaseHTML()+
                        "</body>"+
                    "</html>";

            //Writing the content to the files, actually
            // creating the HTML page for the user
            this._writeCSS(CSS)
                .then(result.resolve, result.reject);
            this._writeImages(IMAGES, this.project)
                .then(result.resolve, result.reject);
            this._writeHTML(HOME, HTML)
                .then(result.resolve, result.reject);

            return result.promise();
        };


    /**
    * @desc This function preforms the high level execution, taking a Project
    *       element and path, and creating the Functional Specification document
    * @param    project : type.Project : The Project element to convert into a document
    * @param    path : String : Folder to save document in. Defaults to directory if FILEPATH given
    * @return   Deferred resolution : A REJECT or RESOLVE ending for our Deferred
    */
    function execute(project, path) {
        var result = new $.Deferred();
        var FuncSpecObj = new FunctionalSpec();
        var DIRECTORY = FileSystem.getDirectoryForPath(path),
            HOME      = DIRECTORY.fullPath + "/staruml_html";

        return FuncSpecObj.createHTML(project, HOME);
    }

    //This exports the functions we've defined so that other scripts
    // can use them when executing
    exports.execute = execute;
});
