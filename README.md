# X Window Manager Script

A Node.js script for managing application windows in X11 environments, focusing on window switching, focusing, and automatic minimization of intersecting windows.
Designed to be invoked by keyboard shortcuts. 

## Features

- Switch between instances of a specified application, stack-order aware.
- Auto-spawn application if no windows of that application are open.
- Minimize intersecting windows automatically.
- Multi-monitor support.

## Prerequisites

- X11 window system.
- wmctrl, nohup and xprop utilities installed.
- Node.js

## Basic script usage

```bash
# Basic usage, when application class containts the executable name
APP_NAME=Firefox switch.sh

# With custom startupcommand
APP_NAME=Firefox APP_COMMAND=firefox switch.sh

# Spawn new instance even if one is already running
APP_NAME=Firefox SPAWN=1 switch.sh
```

APP_NAME, APP_COMMAND and SPAWN can be replaced with the switch.sh script arguments, -n, -c and -s respectively., e.g.

```bash
switch.sh -n Firefox -c firefox -s
```

## Auto generate keyboard shortcuts

The project comes with an installation script that sets up keyboard shortcuts in XFCE4.

The script relies on the following:

- XFCE4 desktop environment
- xfconf-query utility

```bash
./install-shortcuts.sh
```

Refer to the script for more details.

## Troubleshooting

If keyboard shortcuts are not working, make sure the script is executable and run it manually from the command line.

If the script works from the command line but not from the keyboard shortcut, add logging to the swith.sh, there is an example in the script.