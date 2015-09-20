
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
        common          = require("DocGen/common");


    /* BEGIN CLASS */
    /**
    * @desc This is the FunctionalSpec object, which we will use to
    *       catalogue information on the project we've been asked to export
    * @constructor
    */
    function FunctionalSpec() {
        this.nothing = null;
        this.project = null;
        this.HOME    = null;
        this.IMAGES  = null;
        this.CSS     = null;
        this.cssfn   = "funcspec.css";
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
        FunctionalSpec.prototype._extractElements = common.extractElements;
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
            //Parsing our use case into the elements we need for the HTML file
            var content = usecase.documentation,
                ind, subind,
                UCObj = {},
                headers = ["DESCRIPTION", "PRIORITY", "RISK", "ACTORS"];
            //Getting all text before "Main Scenario". '-1' is to ignore the preceding \n
            UCObj.header = content.slice(0, content.toUpperCase()
                                                        .indexOf("MAIN SCENARIO:")-1);
            //Getting UC Elaboration, ignore "Main Scenario:\n"
            UCObj.main = content.slice(content.toUpperCase()
                                                   .indexOf("MAIN SCENARIO:")+16);

            //Now that we have the main text separated into the header and body
            // info, we parse it to create the HTML page content.
            for (ind=0; ind<headers.length; ind++) {
                var searchterm = headers[ind]+":";
                console.log(searchterm);
                var start = UCObj.header.indexOf(searchterm)+(searchterm.length+1);
                var end = UCObj.header.indexOf(":", start);
                console.log(start,end);
                if (end === -1) {
                    end = UCObj.header.length;
                }
                UCObj[headers[ind]] = UCObj.header.slice(start,end);
                console.log(UCObj[headers[ind]]);
            }

            var HTML = "";
            HTML += "<div class=\"use-case-elab\">\n"+
                        "<h2>"+usecase.name+"</h2><br>\n"+
                        "<div class\"use-case-elab-header\">"+
                            UCObj.header+
                        "</div>"+
                        "<div class\"use-case-elab-main\">"+
                            UCObj.main+
                        "</div>"+
                    "</div>\n";
            return HTML;
        };
        /**
        * @desc Takes a given diagram (and the Directory object of where the
        *       images will be placed) and returns the HTML for how it will
        *       appear on the HTML page.
        * @return   String of HTML
        */
        FunctionalSpec.prototype._convertDiagramToHTML = function(diagram) {
            var imagePath = this.IMAGES.fullPath+diagram.name+".png";
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
        FunctionalSpec.prototype._convertModelToHTML  = function(model) {
            var HTML = "", ind;
            var useCases = this._extractUseCases(model);
            var diagrams = this._extractDiagrams(model);

            HTML += "<div class=\"use-cases\">\n";
            for (ind=0; ind<diagrams.length; ind++) {
                HTML += this._convertDiagramToHTML(diagrams[ind])+"\n";
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
        FunctionalSpec.prototype._writeCSS = common.writeCSS;
        /**
        * @desc Creating an image file from a diagram
        */
        FunctionalSpec.prototype._writeImage = common.writeImage;
        /**
        * @desc Creating an HTML file
        */
        FunctionalSpec.prototype._writeHTML = common.writeHTML;

      /* -- Create HTML ---------------------------------------------------- */
        /**
        * @desc Returns a string of HTML, the different models in the project
        *       which will become information on the HTML page
        * @param    IMAGES : Directory Object, where the Images will be saved
        * @return   String of HTML
        */
        FunctionalSpec.prototype._createUseCaseHTML = function() {
            var HTML = "", ind;
            var models = this._extractUMLModels();
            //This loop will potentially add multiple divs, all of which
            // represent a UMLModel from the project
            for (ind=0; ind<models.length; ind++) {
                HTML += this._convertModelToHTML(models[ind]);
            }
            return HTML;
        };
        /**
        * @desc To retain 'this' as scoped to the FunctionalSpec object, the
        *       object handles the callback functions. This function should be
        *       run once the HOME and IMAGES folders are created
        */
        FunctionalSpec.prototype._createHTMLFile = function() {
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
                            this._convertProjectToHTMLHeader(this.project)+"\n"+
                            //creates div(s) of class 'use-cases'
                            this._createUseCaseHTML()+"\n"+
                        "</body>\n"+
                    "</html>";
            this._writeHTML(this.HOME, this.project.name+".html", HTML);
        };
        /**
        * @desc To retain 'this' as scoped to the FunctionalSpec object, the
        *       object handles the callback functions. This function should be
        *       run once the HOME and CSS folders are created
        */
        FunctionalSpec.prototype._createCSSFile = function() {
            this._writeCSS(this.CSS, this.cssfn);
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
            this.HOME   = FileSystem.getDirectoryForPath(home);
            this.IMAGES = FileSystem.getDirectoryForPath(this.HOME.fullPath+"images");
            this.CSS    = FileSystem.getDirectoryForPath(this.HOME.fullPath+"css");
            this.HOME.create(); this.IMAGES.create(); this.CSS.create();
            this._createHTMLFile();
            this._createCSSFile();

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
