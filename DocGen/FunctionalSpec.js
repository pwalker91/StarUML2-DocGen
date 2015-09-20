
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
        FileUtils       = app.getModule("file/FileUtils"),
        CommandManager  = app.getModule("command/CommandManager"),
        ExtensionUtils  = app.getModule("utils/ExtensionUtils"),
        DocGenMixins    = require("DocGen/DocGenMixins");


    /* BEGIN CLASS */
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

      /* -- Extract Elements ----------------------------------------------- */
        /**
        * @desc Extracting elements of a certain type from a given object
        */
        FunctionalSpec.prototype._extractElements = DocGenMixins.extractElements;
        /**
        * @desc Given that the FunctionalSpec object has a Project element in
        *       its 'project' attribute, this extracts all of the UML Models inside
        * @return   Array of UMLModel(s)
        */
        FunctionalSpec.prototype._extractUMLModels = function() {
            return this._extractElements(this.project, type.UMLModel);
        };
        /**
        * @desc Uses the given model, and returns an array of all Use Cases within it
        * @return   Array of UMLUseCase(s)
        */
        FunctionalSpec.prototype._extractUseCases = function(aModel) {
            return this._extractElements(aModel, type.UMLUseCase);
        };
        /**
        * @desc Uses the given model, and returns an array of all Diagrams within it
        * @return   Array of UMLDiagram(s)
        */
        FunctionalSpec.prototype._extractDiagrams = function(aModel) {
            return this._extractElements(aModel, type.UMLUseCaseDiagram);
        };

      /* -- Convert to HTML ------------------------------------------------ */
        /**
        * @desc Takes a given use case, parses the documentation, and returns
        *       the HTML for how it will appear on the HTML page.
        * @return   String of HTML
        */
        FunctionalSpec.prototype._convertUseCaseToHTML = function(usecase) {

            // parse usecase into object

            var HTML = "";
            HTML += "<div class=\"use-case-elab\">\n"+
                        "<h2>"+usecase.name+"</h2><br>\n"+
                        "<p>One day, I'll grow up to be a real content...</p>\n"+
                    "</div>\n";
            return HTML;
        };
        /**
        * @desc Takes a given diagram (and the Directory object of where the
        *       images will be placed) and returns the HTML for how it will
        *       appear on the HTML page.
        * @return   String of HTML
        */
        FunctionalSpec.prototype._convertDiagramToHTML = function(diagram, IMAGES) {
            var imagePath = IMAGES.fullPath+diagram.name+".png";
            this._writeImage(diagram, imagePath);
            var HTML =  "<div class=\"use-case-image\">\n"+
                            "<img src=\"images/"+diagram.name+".png\">\n"+
                        "</div>\n";
            return HTML;
        };
        /**
        * @desc Takes a given model (and the Directory object of where the
        *       images will be placed) and returns the HTML for how it will
        *       appear on the HTML page.
        *       Delegates the creation of the Use Case Elaboration and Image
        *       to other functions.
        * @return   String of HTML
        */
        FunctionalSpec.prototype._convertModelToHTML  = function(model, IMAGES) {
            var HTML = "", ind;
            var useCases = this._extractUseCases(model);
            var diagrams = this._extractDiagrams(model);

            HTML += "<div class=\"use-cases\">\n";
            for (ind=0; ind<diagrams.length; ind++) {
                HTML += this._convertDiagramToHTML(diagrams[ind], IMAGES)+"\n";
            }
            for (ind=0; ind<useCases.length; ind++) {
                HTML += this._convertUseCaseToHTML(useCases[ind])+"\n";
            }
            HTML += "</div>\n";

            return HTML;
        };
        /**
        * @desc Returns a string of HTML, the content within the header of the
        *       document being created.
        * @return   String of HTML
        */
        FunctionalSpec.prototype._convertProjectToHTMLHeader = function(project) {
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

      /* -- Write Files ---------------------------------------------------- */
        /**
        * @desc Creating a CSS file
        */
        FunctionalSpec.prototype._writeCSS = DocGenMixins.writeCSS;
        /**
        * @desc Creating an image file from a diagram
        */
        FunctionalSpec.prototype._writeImage = DocGenMixins.writeImage;
        /**
        * @desc Creating an HTML file
        */
        FunctionalSpec.prototype._writeHTML = DocGenMixins.writeHTML;

      /* -- Create HTML ---------------------------------------------------- */
        /**
        * @desc Returns a string of HTML, the different models in the project
        *       which will become information on the HTML page
        * @param    IMAGES : Directory Object, where the Images will be saved
        * @return   String of HTML
        */
        FunctionalSpec.prototype._createUseCaseHTML = function(IMAGES) {
            var HTML = "", ind;
            var models = this._extractUMLModels();
            //This loop will potentially add multiple divs, all of which
            // represent a UMLModel from the project
            for (ind=0; ind<models.length; ind++) {
                HTML += this._convertModelToHTML(models[ind], IMAGES);
            }
            return HTML;
        };
        /**
        * @desc This is the main function of our class, which converts a given
        *       Project into an HTML file, and saves it to the given home path
        * @param    project : Project class : The project to convert into HTML
        * @param    home : String : The path to the home folder to save to
        * @return   Deferred Resolve/Reject, whether the function completed.
        */
        FunctionalSpec.prototype.createHTML = function(project, home) {
            var result = $.Deferred();

            //Some bookkeeping to do, like checking that we were given a project
            if ( !(project instanceof type.Project) ) {
                return result.reject("Was not given a project");
            } else {
                this.project = project;
            }

            //Creating the necessary directories that we will be saving our HTML,
            // image, and CSS documents to.
            var HOME    = FileSystem.getDirectoryForPath(home),
                IMAGES  = FileSystem.getDirectoryForPath(HOME.fullPath+"images"),
                CSS     = FileSystem.getDirectoryForPath(HOME.fullPath+"css");
            //We want the creation of files to happen after the necessary directories
            // are created, so we embed the code in a callback function.
            //In this case, I want the HOME folder to be created before I create
            // the IMAGES and CSS folders. Then, once all three directories
            // are created, I generate and create my HTML and PNG files.
            HOME.create(function(err, stats){
                var cssfn = "funcspec.css";
                IMAGES.create(function(er, stats){
                    var HTML = "";
                    HTML += "<html>\n"+
                                "<head>\n"+
                                    "<link rel=\"stylesheet\" type=\"text/css\" "+
                                          "href=\"css/"+cssfn+"\">"+
                                "</head>\n"+
                                "<body>\n"+
                                    "<div class=\"title\">"+
                                        "<h1>Functional Specification for <b>"+this.project.name+"</b></h1>"+
                                    "</div>\n"+
                                    this._convertProjectToHTMLHeader(this.project)+"\n"+
                                    //creates div(s) of class 'use-cases'
                                    this._createUseCaseHTML(IMAGES)+"\n"+
                                "</body>\n"+
                            "</html>";
                    this._writeHTML(HOME, this.project.name+".html", HTML);
                });
                CSS.create(function(err, stats){
                    this._writeCSS(CSS, cssfn);
                });
            });

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
        var FuncSpecObj = new FunctionalSpec();
        var DIRECTORY = FileSystem.getDirectoryForPath(path),
            HOME      = DIRECTORY.fullPath+"staruml_html";

        return FuncSpecObj.createHTML(project, HOME);
    }

    //This exports the functions we've defined so that other scripts
    // can use them when executing
    exports.execute = execute;
});
