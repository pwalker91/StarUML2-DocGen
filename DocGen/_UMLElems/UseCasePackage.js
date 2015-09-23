
/**
 * A class for handling the parsing and catalogueing of
 *  StarUML 2 Use Case Packages.
 *
 * AUTHOR:  Peter Walker
 * DATE:    22 September 2015
 */

define(function (require, exports, module) {
    "use strict";

    //Importing the StarUML global modules that we want to use
    var FileSystem      = app.getModule("filesystem/FileSystem"),
        FileUtils       = app.getModule("file/FileUtils"),
        CommandManager  = app.getModule("command/CommandManager"),
        ExtensionUtils  = app.getModule("utils/ExtensionUtils"),
        common          = require("DocGen/_common");

    /* BEGIN CLASS */
    /**
    * @constructor
    * @desc This is the UseCasePackage object, which holds all of the relevant
    *       Use Case UML elements at our current level, like Actors and Use Cases
    * @param    project : UMLProject, the project to convert
    */
    function UseCasePackage(aPackage) {
        this._self = aPackage || null;
        if (this._self !== null && (this._self instanceof type.UMLPackage)) {
            this.actors = common.extractElements(aPackage, type.UMLActor);
            this.usecases = common.extractElements(aPackage, type.UMLUseCase);
            this.diagrams = common.extractElements(aPackage, type.UMLUseCaseDiagram);
            this.packages = common.extractElements(aPackage, type.UMLPackage);
        }
    }
        /**
        * @desc Retrieving all of the UML Actors from our package, and any
        *       contained sub-packages
        * @return   Array of all UMLActors in our package and sub-packages
        */
        UseCasePackage.prototype.getAllActors = function() {
            //Sanity Check
            if (!this._self) {
                return [];
            }

            var allActors = [].concat(this.actors);
            var actorFilter = function (item) {
                return allActors.indexOf(item) < 0;
            };
            for (var ind=0; ind<this.packages.length; ind++) {
                //This will concatenate onto 'allActors' all of the unique actors
                // in the package at this iteration. This is done by filtering the
                // returned array of Actors.
                // ....This may not be necessary, but I have it just in case
                //
                // Implementation gathered from this resource
                //http://stackoverflow.com/questions/1584370/#23080662
                allActors.concat(this.packages[ind]
                                     .getAllActors()
                                     .filter(actorFilter));
            }

            //Now that we've gone through all of the sub-packages, we can
            // return our array of all actors
            return allActors;
        };

      /* -- Convert to HTML ------------------------------------------------ */
        /**
        * @desc Takes a given use case, parses the documentation, and returns
        *       the HTML for how it will appear on the HTML page.
        * @return   String of HTML
        */
        UseCasePackage.prototype._convertUseCaseToHTML = function(usecase) {
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
        UseCasePackage.prototype._convertDiagramToHTML = function(diagram, IMAGES) {
            var imagePath = IMAGES.fullPath+diagram.name+".png";
            common.writeImage(diagram, imagePath);
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
        * @param    IMAGES : type.Directory : Where to save generated diagrams
        * @return   String of HTML
        */
        UseCasePackage.prototype.createFSHTML  = function(IMAGES) {
            var HTML = "", ind;

            HTML += "<div class=\"use-cases\">\n";
            for (ind=0; ind<this.diagrams.length; ind++) {
                HTML += this._convertDiagramToHTML(this.diagrams[ind], IMAGES)+"\n";
            }
            for (ind=0; ind<this.usecases.length; ind++) {
                HTML += this._convertUseCaseToHTML(this.usecases[ind])+"\n";
            }
            HTML += "</div>\n";

            return HTML;
        };
    /* END CLASS */


    //Exporting our object constructor
    exports.obj = UseCaseModel;
});
