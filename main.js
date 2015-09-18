
/**
 * Currently a basic Hello World extension for StarUML 2.0
 *
 * AUTHOR:  Peter Walker
 * DATE:    16 September 2015
 */

define(function (require, exports, module) {
    "use strict";


    //So, I don't really know how the other extensions handle this, but
    // I cannot seem to get access to the files that I thought were downloaded
    // when the extension was installed. It seems that they are, but using
    // require() doesn't work how I expect.

    //The solution is to get the path of this module, the main.js. To do
    // this, you include and use the ExtensionUtils, and get the module path
    // using the variable "module". From there, we can finally require
    // the supporting scripts


    //Importing the StarUML global modules that we want to use,
    // as well as local scripts that we require for operation
    var Commands        = app.getModule("command/Commands"),
        CommandManager  = app.getModule("command/CommandManager"),
        MenuManager     = app.getModule("menu/MenuManager"),
        Dialogs         = app.getModule("dialogs/Dialogs"),
        ExtensionUtils  = app.getModule("utils/ExtensionUtils");

    var homebase = ExtensionUtils.getModulePath(module);
    var FSGen           = require(homebase + "DocGen/FunctionalSpec.js"),
        DSGen           = require(homebase + "DocGen/DesignSpec.js");

    //And just because, we are going to log the license for this product,
    // because it's funny and I think everyone should read it, if they feel so
    // inclined to open their dev tools.
    var LICENSE = require(homebase + "LICENSE.md");
    console.log(LICENSE);

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
    var genMenu = toolsMenu.addMenuItem(CMD_GENERATEDOC); //, MenuManager.AFTER, toolsMenu.LAST);
    genMenu.addMenuItem(CMD_GEN_FUNCSPEC);
    genMenu.addMenuItem(CMD_GEN_DESIGNSPEC);
    genMenu.addMenuDivider();
    genMenu.addMenuItem(CMD_GEN_NOTIMP);

    console.log(window.location);
});
