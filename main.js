
/**
 * Currently a basic Hello World extension for StarUML 2.0
 *
 * AUTHOR:  Peter Walker
 * DATE:    16 September 2015
 */

define(function (require, exports, module) {
    "use strict";

    //Importing the StarUML global modules that we want to use,
    // as well as local scripts that we require for operation
    var Commands        = app.getModule("command/Commands"),
        CommandManager  = app.getModule("command/CommandManager"),
        MenuManager     = app.getModule("menu/MenuManager"),
        Dialogs         = app.getModule("dialogs/Dialogs"),
        //FSGen           = require("DocGen/FunctionalSpec.js");
        //FSGen           = require("FunctionalSpec.js");
        x=1;

    // local handler for Design Spec gen
    function handleDSGen() {
        Dialogs.showAlertDialog("I'm not implemented yet!");
    }

    // Add a Generate Document menu
    var CMD_GENERATEDOC    = "tools.generatedoc",
        CMD_GEN_FUNCSPEC   = "tools.generatedoc.funcspec",
        CMD_GEN_DESIGNSPEC = "tools.generatedoc.designspec";
    CommandManager.register("Generate Document", CMD_GENERATEDOC, CommandManager.doNothing);
    CommandManager.register("Functional Specification", CMD_GEN_FUNCSPEC, handleDSGen);
    CommandManager.register("Design Specification", CMD_GEN_DESIGNSPEC, handleDSGen);


    // Add Generate Functional Spec menu item (Tools > Generate...)
    var toolsMenu = MenuManager.getMenu(Commands.TOOLS);
    var genMenu = toolsMenu.addMenuItem(CMD_GENERATEDOC, MenuManager.AFTER, toolsMenu.LAST);
    genMenu.addMenuItem(CMD_GEN_FUNCSPEC);
    //genMenu.addMenuDivider();
    genMenu.addMenuItem(CMD_GEN_DESIGNSPEC);
});
