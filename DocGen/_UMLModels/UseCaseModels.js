
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
        common          = require("DocGen/_common");

    //UMLPackage
    function UseCasePackage(Package) {
        this._self = Package;
        this.actors = [];
        this.usecases = [];
        this.diagrams = [];
        this.packages = [];
        this.extractElements();
    }
    UseCasePackage.prototype.extractElements = function() {
        //
    };

    //UMLModel
    function UseCaseModel(Model) {
        this._self = new UseCasePackage(Model);
    }
    UseCaseModel.prototype._collectActors = function() {
        //
    };

    exports.obj = UseCaseModel;








  /* -- Extract Elements ----------------------------------------------- */
    /**
    * @desc Given that the FunctionalSpec object has a Project element in
    *       its 'project' attribute, this extracts all of the UML Models inside
    * @return   Array of UMLModel(s)
    */
    FunctionalSpec.prototype._extractUMLModels = function() {
        return common.extractElements(this.project, type.UMLModel);
    };
    /**
    * @desc Uses the given model, and returns an array of all Use Cases within it
    * @return   Array of UMLUseCase(s)
    */
    FunctionalSpec.prototype._extractUseCases = function(aModel) {
        return common.extractElements(aModel, type.UMLUseCase);
    };
    /**
    * @desc Uses the given model, and returns an array of all Diagrams within it
    * @return   Array of UMLDiagram(s)
    */
    FunctionalSpec.prototype._extractDiagrams = function(aModel) {
        return common.extractElements(aModel, type.UMLUseCaseDiagram);
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
            var start = UCObj.header.toUpperCase()
                                    .indexOf(searchterm);
            if (start === -1) {
                continue;
            } else {
                start += (searchterm.length);
            }
            var end = UCObj.header.toUpperCase()
                                  .indexOf(":", start);
            if (end === -1) {
                end = UCObj.header.length;
            }
            var text = UCObj.header.slice(start,end);
            //This is removing the next category title from the string, if
            // it was grabbed in .slice() above
            for (subind=0; subind<headers.length; subind++) {
                //Looking for the header title, starting at the end of the
                // string in 'text' minus the length of the header
                var found = text.toUpperCase()
                                .indexOf(headers[subind],
                                         text.length-headers[subind].length-1);
                if (found !== -1) {
                    text = text.slice(0,found);
                }
            }
            text = text.trim();
            UCObj[headers[ind]] = text;
        }

        //Parsing the Use Case Elaboration into a sequence of steps.
        UCObj.main = UCObj.main.split("\n");
        for (ind=0; ind<UCObj.main.length; ind++) {
            UCObj.main[ind] = ( "<b>"+
                                UCObj.main[ind].slice(0, UCObj.main[ind].indexOf(":")+1)+
                                "</b>"+
                                UCObj.main[ind].slice(UCObj.main[ind].indexOf(":")+1)
                               );
        }

        var HTML = "";
        HTML += "<div class=\"use-case-elab\">\n"+
                    "<h2>"+usecase.name+"</h2><br>\n"+
                    "<div class=\"use-case-elab-header\">"+
                        "<p><b>Description:</b> "+UCObj.DESCRIPTION+"</p>"+
                        "<p><b>Priority:</b> "+UCObj.PRIORITY+"</p>"+
                        "<p><b>Risk:</b> "+UCObj.RISK+"</p>"+
                        "<p><b>Main Scenario:</b></p>"+
                    "</div>"+
                    "<div class=\"use-case-elab-main\">"+
                        "<p>"+UCObj.main.join("<br>")+"</p>"+
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



});
