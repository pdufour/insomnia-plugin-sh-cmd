# Insomnia Plugin - Shell command executor

This is a plugin for [Insomnia](https://insomnia.rest) that enables you to execute some shell commands and use it output.
Commands are exeucted using `child_process`.`exec`. ie., equivalent to `/bin/sh` `<cmd-specified>`

You can use this for example to get generate a signed token using existing utility script available.

## Installation
1. Open Insomnia and click on the Insomnia menu in the top left corner of the window.
1. Select Preferences from the dropdown menu.
1. In the Preferences window, select the Plugins tab.
1. Search for`insomnia-plugin-shell-exec` in the list of available plugins.
1. Click the Install Plugin button next to the insomnia-plugin-shell-exec plugin.
1. After installation, click the Enable button to activate the plugin.

## Usage
Insert function either in headers or body either by typing `ctrl + space` or start type `{{`

- Enter your command
- Choose JSON type if you want to parse your output using `JSON.parse()`

See screenshot below
![Screenshot](https://raw.githubusercontent.com/mageshwaranr/insomnia-plugin-sh-cmd/master/example-usage.png)
