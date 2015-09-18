
/**
 * Currently a basic Hello World extension for StarUML 2.0
 *
 * AUTHOR:  Peter Walker
 * DATE:    16 September 2015
 *
 * If you are confused, start here...
 * http://requirejs.org/docs/why.html
 */

define(function (require, exports, module) {
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
        //What require returns is the 'exports' object that was used (likely)
        // at the end of the file. In this case, I put the object constructor
        // for my 'FunctionalSpec' object in the 'exports' object under the
        // attribute 'object'.
        FunctionalSpec  = require("DocGen/FunctionalSpec"),
        DesignSpec      = require("DocGen/DesignSpec");

    //Now I'm actually using the objects I imported using require()
    // to create an instance, which will be used later on.
    //If I had instead put a FUNCTION in an attribute of exports, I could
    // call it using the appropiate attribute.
    var FSGen = new FunctionalSpec.object,
        DSGen = new DesignSpec.object;

    // local handler for Design Spec gen
    function localAlert() {
        Dialogs.showAlertDialog("I'm not implemented yet!");
    }

    // Add a Generate Document menu
    var CMD_GENERATEDOC    = "tools.generatedoc",
        CMD_GEN_FUNCSPEC   = "tools.generatedoc.funcspec",
        CMD_GEN_DESIGNSPEC = "tools.generatedoc.designspec",
        CMD_GEN_NOTIMP     = "tools.generatedoc.notimp";
    CommandManager.register("Generate Document",        CMD_GENERATEDOC,    CommandManager.doNothing);
    CommandManager.register("Functional Specification", CMD_GEN_FUNCSPEC,   FSGen.test_alert);
    CommandManager.register("Design Specification",     CMD_GEN_DESIGNSPEC, DSGen.test_alert);
    CommandManager.register("Not Implemented!!",        CMD_GEN_NOTIMP,     localAlert);

    // Add Generate Functional Spec menu item (Tools > Generate...)
    var toolsMenu = MenuManager.getMenu(Commands.TOOLS);
    var genMenu = toolsMenu.addMenuItem(CMD_GENERATEDOC, MenuManager.AFTER, toolsMenu.LAST);
    genMenu.addMenuItem(CMD_GEN_FUNCSPEC);
    genMenu.addMenuItem(CMD_GEN_DESIGNSPEC);
    genMenu.addMenuDivider();
    genMenu.addMenuItem(CMD_GEN_NOTIMP);
});
