
/**
 * These are generic functions, which can be added to objects
 * as a user wishes to.
 *
 * AUTHOR:  Peter Walker
 * DATE:    20 September 2015
 */

define(function (require, exports, module) {
    "use strict";

    //Importing the StarUML global modules that we want to use
    var Dialogs         = app.getModule("dialogs/Dialogs"),
        FileSystem      = app.getModule("filesystem/FileSystem"),
        FileUtils       = app.getModule("file/FileUtils"),
        CommandManager  = app.getModule("command/CommandManager"),
        ExtensionUtils  = app.getModule("utils/ExtensionUtils");

    /**
    * @desc This takes a given object, which is assumed to be a StarUML object
    *       that has "ownedElements", and checks that it is of a given type.
    *       It then loops through its owned elements, searching for the second
    *       given type.
    * @param    obj : object that should have an "ownedElements" property
    * @param    searchType : Class : A class type in StarUML 2
    * @return   Array of elements extracted
    */
    function extractElements(obj, searchType) {
        if (obj !== null && obj.hasOwnProperty("ownedElements")) {
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
    }
    /**
    * @desc Creates a copy of the contents in the extension's CSS file
    *       (given by 'filename'). It does this by reading the content,
    *       and writing to another file.
    * @param    CSS : Directoy object, where CSS file should be located
    * @param    filename : String, name of CSS file local to extension
    */
    function writeCSS(CSS, filename) {
        ExtensionUtils.loadFile(module, "/css/"+filename)
            .done(function(contents) {
                FileSystem.getFileForPath(CSS.fullPath+filename)
                    .write(contents, {"blind":true});
            });
    }
    /**
    * @desc Given a Diagram object and a String path, uses the built-in
    *       functions to save the diagram as an image
    * @param    diagram : Diagram object that the user wants to save
    * @param    path : String, where the user wants to save (with .png extension included)
    */
    function writeImage(diagram, path) {
        //We need to create the file using FileSystem before using
        // CommandManager. Why? Because it seems that the directory or file
        // isn't actually created by the time we get to here, and we need
        // that directory to save the file in.
        //To get around the file not being "real" until something is written
        // to it, we are going to write an empty string. We will then use the
        // callback as our path to exporting the image. This way, we know
        // that the file has been created and that nothing has been written
        // to it.
        // BEWARE: If you move the export out of the callback, the write will
        //          likely write over the contents. Things aren't executed in sequence
        FileSystem.getFileForPath(path).write("",function() {
            CommandManager.get("file.exportDiagramAs.png")
                ._commandFn(diagram, path);
        });
    }
    /**
    * @desc Given a Directory, filename, and the contents, create an HTML file
    * @param    HOME : Directory object, where the file will be saved
    * @param    filename : String, the name of the file to save (with extension)
    * @param    contents : String, the contents of the file-to-be
    */
    function writeHTML(HOME, filename, contents) {
        FileSystem.getFileForPath(HOME.fullPath+filename)
            .write(contents, {"blind":true});
    }

    //Adding our functions to exports
    exports.extractType = extractType;
    exports.writeCSS = writeCSS;
    exports.writeImage = writeImage;
    exports.writeHTML = writeHTML;
});
