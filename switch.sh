#!/bin/bash

# Workaround to work with nvm
# First try using system node
if node -v >/dev/null 2>&1; then
    NODE_CMD=node
else
    # Get first directory in versions/node
    NODE_VERSION=$(ls -1 "$HOME/.nvm/versions/node/" | head -n 1)
    NODE_CMD="$HOME/.nvm/versions/node/$NODE_VERSION/bin/node"
    
    # Check if NVM node exists
    if [ ! -x "$NODE_CMD" ]; then
        echo "Error: Node.js not found" >&2
        exit 1
    fi
fi

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

$NODE_CMD $SCRIPT_DIR/index.js "$@"
## For debugging purposes - replace above line with:
#  $NODE_CMD $SCRIPT_DIR/index.js "$@" >> $SCRIPT_DIR/winman.log 2>&1
