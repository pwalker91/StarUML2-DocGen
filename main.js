
/**
 * Currently a basic Hello World extension for StarUML 2.0
 *
 * AUTHOR:  Peter WALKER
 * DATE:    16 September 2015
 */

define(function (require, exports, module) {
    "use strict";

    var Commands       = app.getModule("command/Commands"),
        CommandManager = app.getModule("command/CommandManager"),
        MenuManager    = app.getModule("menu/MenuManager"),
        Dialogs        = app.getModule("dialogs/Dialogs");

    // Handler for Generate command
    function handleFSGen() {
        window.alert("Hello, world!");
        Dialogs.showErrorDialog("I am a dangerous error. Fear me!!");
    }

    // Add a Generate Functional Spec command
    var CMD_GENFUNCSPEC = "tools.helloworld";
    CommandManager.register("Generate Functional Specification",
                            CMD_GENFUNCSPEC,
                            handleFSGen);

    // Add Generate Functional Spec menu item (Tools > Generate...)
    var menu = MenuManager.getMenu(Commands.TOOLS);
    menu.addMenuItem(CMD_GENFUNCSPEC);
});
