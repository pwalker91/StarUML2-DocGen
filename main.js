
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
        MenuManager    = app.getModule("menu/MenuManager");

    // Handler for HelloWorld command
    function handleHelloWorld() {
        window.alert("Hello, world!");
    }

    // Add a HelloWorld command
    var CMD_HELLOWORLD = "tools.helloworld";
    CommandManager.register("Hello World", CMD_HELLOWORLD, handleHelloWorld);

    // Add HelloWorld menu item (Tools > Hello World)
    var menu = MenuManager.getMenu(Commands.TOOLS);
    menu.addMenuItem(CMD_HELLOWORLD);
});
