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

## Usage

```bash
# Basic usage, when application class containts the executable name
APP_NAME=Firefox switch.sh

# With custom startupcommand
APP_NAME=Firefox APP_COMMAND=firefox switch.sh

# Spawn new instance even if one is already running
APP_NAME=Firefox SPAWN=1 switch.sh
```

## Troubleshooting

If keyboard shortcuts are not working, make sure the script is executable and run it manually from the command line.

If the script works frim the command line but not from the keyboard shortcut, add logging to the script: ` > ./winman.log 2>&1`