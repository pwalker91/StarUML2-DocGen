
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
    */
    function handleFuncSpecGen(baseElem, path, opts) {
        //A boolean value, which will be returned when we finish the function
        var returns = false;

        //If baseElem is not assigned, popup the ElementPickerDialog dialog box.
        //Calling showDialog returns a Promise object, so we modify the data
        // by adding a .done() function.
        //If the base element is not defined, we ask the user for one
        if (!baseElem) {
            ElementPickerDialog.showDialog("Select a base PROJECT to generate from",
                                           null, type.Project)
                .done(function (buttonId, selected) {
                    if (buttonId === Dialogs.DIALOG_BTN_OK && selected) {
                        baseElem = selected;
                    }
                });
        }
        //If the user has at least chosen/given an element, and we currently
        // don't have anything in 'path', then we ask the user to tell us where
        // to save the files we are going to create
        if (baseElem && !path) {
            FileSystem.showOpenDialog(
                false, true,
                "Select a folder to place the documents in",
                null, null,
                function (err, files) {
                    if (!err) {
                        if (files.length > 0) {
                            path = files[0];
                        } else {
                            console.log(FileSystem.USER_CANCELED);
                        }
                    }
                }
            );
        }
        //And now, if we have both a BASE and a PATH, then we execute.
        if (baseElem && path) {
            //What's happening here is that the function 'execute' is executing
            // when a base element and path have been given.
            //However, once that is finished, we want to resolve our Deferred object,
            // which is what has been executing this. Using the .then() function, we
            // give this code a way to resolve the Deferred object with either a
            // yay! or nay! at the end (yay=resolve, nay=reject)
            returns = FunctionalSpec.execute(baseElem, path);
        }

        //We finish by returning the result of running our function
        return returns;
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
