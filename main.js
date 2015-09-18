
/**
 * Currently a basic Hello World extension for StarUML 2.0
 *
 * AUTHOR:  Peter Walker
 * DATE:    16 September 2015
 *
 * If you are confused, start here...
 * http://requirejs.org/docs/why.html
 */

define(
    //The array of LOCAL dependencies (don't include stuff that's included
    // using the app.getModule() call)
    ["DocGen/FunctionalSpec", "DocGen/DesignSpec" ],

    //The function to execute when all dependencies have loaded.
    function (require, exports, module) {
        "use strict";

        //Importing the StarUML global modules that we want to use,
        // as well as local scripts that we require for operation
        var Commands        = app.getModule("command/Commands"),
            CommandManager  = app.getModule("command/CommandManager"),
            MenuManager     = app.getModule("menu/MenuManager"),
            Dialogs         = app.getModule("dialogs/Dialogs"),
            ExtensionUtils  = app.getModule("utils/ExtensionUtils"),
            //Notice that the name of the modules below are the exact same as
            // the name of the files, but DO NOT end with '.js'. This was
            // causing me confusion early on.
            FSGen           = require("DocGen/FunctionalSpec"),
            DSGen           = require("DocGen/DesignSpec");

        // local handler for Design Spec gen
        function localAlert() {
            Dialogs.showAlertDialog("I'm not implemented yet!");
        }

        // Add a Generate Document menu
        var CMD_GENERATEDOC    = "tools.generatedoc",
            CMD_GEN_FUNCSPEC   = "tools.generatedoc.funcspec",
            CMD_GEN_DESIGNSPEC = "tools.generatedoc.designspec",
            CMD_GEN_NOTIMP     = "tools.generatedoc.notimp";
        CommandManager.register("Generate Document", CMD_GENERATEDOC, CommandManager.doNothing);
        CommandManager.register("Functional Specification", CMD_GEN_FUNCSPEC, FSGen.test_alert);
        CommandManager.register("Design Specification", CMD_GEN_DESIGNSPEC, DSGen.test_alert);
        CommandManager.register("Not Implemented!!", CMD_GEN_NOTIMP, localAlert);

        // Add Generate Functional Spec menu item (Tools > Generate...)
        var toolsMenu = MenuManager.getMenu(Commands.TOOLS);
        var genMenu = toolsMenu.addMenuItem(CMD_GENERATEDOC, MenuManager.AFTER, toolsMenu.LAST);
        genMenu.addMenuItem(CMD_GEN_FUNCSPEC);
        genMenu.addMenuItem(CMD_GEN_DESIGNSPEC);
        genMenu.addMenuDivider();
        genMenu.addMenuItem(CMD_GEN_NOTIMP);
    }
);
