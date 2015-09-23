
/**
 * A class for handling the parsing and catalogueing of
 *  StarUML 2 Use Case Models.
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
        UseCasePackage  = require("DocGen/_UMLElems/UseCasePackage");

    /* BEGIN CLASS */
    /**
    * @constructor
    * @desc This is the UseCaseModel object, which hold information on a
    *       UMLModel within a project
    * @param    aModel : UMLModel, the model we will retain
    */
    function UseCaseModel(aModel) {
        this._self = aModel || null;
        if (this._self !== null && (this._self instanceof type.UMLModel)) {
            this._self = new UseCasePackage.obj(aModel);
            // ! Can extract more information at this point !
        }
    }
        /**
        * @desc Using this object's package, we will collect all actors from all
        *       different levels and in different packages.
        * @return   Array of type.UMLActor
        */
        UseCaseModel.prototype._collectActors = function() {
            //Sanity Check
            if (!this._self) {
                return [];
            }
            //Returning delegator function
            return this._self.getAllActors();
        };
        /**
        * @desc A small delegator function for creating the Business Context part
        *       of the HTML.
        * @return   String, the HTML for the Business Context
        */
        UseCaseModel.prototype._createFSHTML_BC = function() {
            //Collecting all of the actors for our "Business Context" section
            var allActors = this._collectActors();
            var HTML = "";

            //Generating the HTML for each actor
            HTML += "<div class=\"business-context\">"+
                        "<h2>Business Context</h2><br>";
            for (var ind=0; ind<allActors.length; ind++) {
                var actor = allActors[ind];
                HTML += "<p>"+
                            "<b>"+actor.name+"</b>: "+
                            actor.documentation.trim()+
                        "</p>";
            }
            HTML += "</div>";

            return HTML;
        };
        /**
        * @desc Converts this object into its HTML form for the Functional Specification
        *       document (hence the 'FS' in the name)
        * @param    IMAGES : type.Directory : Where to save images
        * @return   String, the HTML content for the Functional Spec Doc
        */
        UseCaseModel.prototype.createFSHTML = function(IMAGES) {
            //Sanity Check
            if (!this._self) {
                return "";
            }
            //This will create the Business Context HTML, and combine it
            // with the Use Case Elaborations for each Use Case and sub-package
            var HTML =  this._createFSHTML_BC() +
                        this._self.createFSHTML(IMAGES);
            return HTML;
        };
    /* END CLASS */


    //Exporting our object constructor
    exports.obj = UseCaseModel;
});
