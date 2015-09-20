
/*
 * A Document Generation extension for StarUML 2.0
 *
 * AUTHOR:  Peter Walker
 * DATE:    16 September 2015
 *
 * If you are confused, start here...
 * http://requirejs.org/docs/why.html
 *
 * For more information on the API to the StarUML modules, see...
 * http://starumldocs-7a0.kxcdn.com/2.0.0/api/
 * https://github.com/staruml/staruml-dev-docs/wiki
 * http://staruml.io/support
 */

define(function (require, exports, module) {
    "use strict";

    /*
        Making all of the necessary imports and requires from either local
        files (we get those with 'require') or from StarUML (app.getModule)
    */

    //Importing the StarUML global modules that we want to use using the already
    // globally accessible module 'app', as well as any modules local to this
    // extension, the Document Generation extension.
    var Commands            = app.getModule("command/Commands"),
        CommandManager      = app.getModule("command/CommandManager"),
        MenuManager         = app.getModule("menu/MenuManager"),
        Dialogs             = app.getModule("dialogs/Dialogs"),
        ElementPickerDialog = app.getModule("dialogs/ElementPickerDialog"),
        FileSystem          = app.getModule("filesystem/FileSystem"),
        ExtensionUtils      = app.getModule("utils/ExtensionUtils"),
        //Notice that the name of the modules below are the exact same as
        // the name of the files, but DO NOT end with '.js'. This was
        // causing me confusion early on.
        //What require returns is the 'exports' object that was modified (likely)
        // at the end of the file we are requiring. In my case, I put the object
        // constructor for my 'DesignSpec' object in the 'exports' object under
        // the attribute 'object'.
        DocGenMixins    = require("DocGen/DocGenMixins"),
        FunctionalSpec  = require("DocGen/FunctionalSpec"),
        DesignSpec      = require("DocGen/DesignSpec");

    //Now I'm actually using the objects I have access to after using require.
    // I will create an instance, which will be used later on.
    //If I had instead put a FUNCTION in an attribute of exports, I could
    // call it using the appropiate attribute of the return of require()
    // e.g. DesignSpec.myfunction()
    var DSGen = new DesignSpec.object();



    /*
        This block creates the functions that we will later associate with commands
    */

    // local handler for "Not Implemented"
    function localAlert() {
        Dialogs.showAlertDialog("I'm not implemented yet!");
    }

    /**
    * @desc This function creates the dialog box where a user can select
    *       a project to convert into a document.
    *       The logic for this function was copied from the StarUMLJS extension
    * @param    baseElem : Star UML Object
    * @param    path : String
    */
    function handleFuncSpecGen(baseElem, path) {
        //Because our function depends on user input, we cannot halt the
        // execution for each branch. The solution is to create a Deferred
        // object, a kind of AJAX-like object, and as the user responds to
        // dialogs or other code executes, we update this object.
        var result = new $.Deferred();

        //If baseElem is not defined, popup the ElementPickerDialog dialog box.
        //Calling showDialog returns a Promise object, a special kind of Deferred
        // object. What we can do is add a function to execute once the Promise
        // object completes. In this case, once the user has selected an element,
        // I can get what button they pressed, and what element was chosen.
        if (!baseElem) {
            ElementPickerDialog.showDialog(
                "Select a base PROJECT to generate from", null, type.Project)
                .done(function (buttonId, selected) {
                    if (buttonId === Dialogs.DIALOG_BTN_OK && selected) {
                        console.log("User selected project", selected);
                        baseElem = selected;
                        if (!path) {
                            FileSystem.showOpenDialog(
                                //false (not allowing mulitple selection)
                                //true (user can select directories)
                                //title
                                //null (initial path)
                                //null (filetypes allowed, everything)
                                false, true, "Select a folder to place the documents in", null, null,
                                function (err, files) {
                                    if (!err) {
                                        if (files.length > 0) {
                                            console.log("User selected directory", files);
                                            path = files[0];
                                            //For explanation, see last block
                                            FunctionalSpec.execute(baseElem, path)
                                                          .then(result.resolve, result.reject);
                                        } else {
                                            console.log("User cancelled directory selection");
                                            //If our function was not able to get the
                                            // necessary info, and we want to end the
                                            // execution of our extension, we don't
                                            // return false (we have a Deferred object).
                                            // Instead, we resolve the Deferred object,
                                            // in this case with a false-y end, by
                                            // REJECTING. And as a parameter, we give
                                            // the error encountered.
                                            result.reject(FileSystem.USER_CANCELED);
                                        }
                                    } else {
                                        console.log("Error in dialog");
                                        result.reject(err);
                                    }
                                }
                            );
                        } else {
                            console.log("Function given path", path);
                            //For explanation, see last block
                            FunctionalSpec.execute(baseElem, path)
                                          .then(result.resolve, result.reject);
                        }
                    } else {
                        console.log("Project element not chosen", buttonId, selected);
                        result.reject("BadElementChosen");
                    }
                });
        }
        //If the user has at given a Project element, and we currently
        // don't have anything in 'path', then we ask the user to tell us where
        // to save the files we are going to create
        else if ((baseElem instanceof type.Project) && !path) {
            window.alert("Please select the directory to place the documents in...");
            FileSystem.showOpenDialog(
                false, true, "Select a folder to place the documents in", null, null,
                function (err, files) {
                    if (!err) {
                        if (files.length > 0) {
                            console.log("User selected directory", files);
                            path = files[0];
                            FunctionalSpec.execute(baseElem, path)
                                          .then(result.resolve, result.reject);
                        } else {
                            console.log("User cancelled directory selection");
                            result.reject(FileSystem.USER_CANCELED);
                        }
                    } else {
                        console.log("Error in dialog");
                        result.reject(err);
                    }
                }
            );
        }
        //If we have both a BASE of type Project and a PATH, then we execute.
        else if ((baseElem instanceof type.Project) && path) {
            console.log("Function given project and path", baseElem, path);
            //What's happening here is that the function 'execute' is executing
            // when a base element and path have been given.
            //However, once that is finished, we want to resolve our Deferred object,
            // which is what has been executing this. Using the .then() function, we
            // give this code a way to resolve the Deferred object with either a
            // yay! or nay! at the end (yay=resolve, nay=reject)
            FunctionalSpec.execute(baseElem, path)
                          .then(result.resolve, result.reject);
        }

        //We finish by returning a Promise object
        return result.promise();
    }



    /*
        This block add in all of our buttons and commands.
    */

    // Create the commands that link a user's command (through a button or
    // shortcut) to a function to execute.
    var CMD_GENERATEDOC    = "tools.generatedoc",
        CMD_GEN_FUNCSPEC   = "tools.generatedoc.funcspec",
        CMD_GEN_DESIGNSPEC = "tools.generatedoc.designspec",
        CMD_GEN_NOTIMP     = "tools.generatedoc.notimp";
    CommandManager.register("Generate Document",        CMD_GENERATEDOC,    CommandManager.doNothing);
    CommandManager.register("Functional Specification", CMD_GEN_FUNCSPEC,   handleFuncSpecGen);
    CommandManager.register("Design Specification",     CMD_GEN_DESIGNSPEC, DSGen.test_alert);
    CommandManager.register("Not Implemented!!",        CMD_GEN_NOTIMP,     localAlert);

    // Add menu items to Tools menu under "Generate Document" (Tools > Generate...)
    var toolsMenu = MenuManager.getMenu(Commands.TOOLS);
    var genMenu = toolsMenu.addMenuItem(CMD_GENERATEDOC, MenuManager.AFTER, toolsMenu.LAST);
    genMenu.addMenuItem(CMD_GEN_FUNCSPEC);
    genMenu.addMenuItem(CMD_GEN_DESIGNSPEC);
    genMenu.addMenuDivider();
    genMenu.addMenuItem(CMD_GEN_NOTIMP);
});
