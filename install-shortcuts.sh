#!/bin/bash

# Function to set a keyboard shortcut
set_shortcut() {
    local shortcut="$1"
    local command="$2"
    # Clear any existing binding for the shortcut
    xfconf-query -c xfce4-keyboard-shortcuts -p "/commands/custom/$shortcut" -r
    # Set the new command for the shortcut
    xfconf-query -c xfce4-keyboard-shortcuts -p "/commands/custom/$shortcut" -n -t string -s "$command"
}

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Add some shortcuts
# They are saved to $HOME/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-keyboard-shortcuts.xml
set_shortcut "<Super>c" "$SCRIPT_DIR/switch.sh -n Code"
set_shortcut "<Super><Shift>c" "$SCRIPT_DIR/switch.sh -n Code -s"

set_shortcut "<Super>t" "$SCRIPT_DIR/switch.sh -n terminal -c xfce4-terminal"
set_shortcut "<Super><Shift>t" "$SCRIPT_DIR/switch.sh -n terminal -c xfce4-terminal -s"

set_shortcut "<Super>w" "$SCRIPT_DIR/switch.sh -n Chromium"
set_shortcut "<Super><Shift>w" "$SCRIPT_DIR/switch.sh -n Chromium -s"

set_shortcut "<Super>e" "$SCRIPT_DIR/switch.sh -n TelegramDesktop -c telegram-desktop"
set_shortcut "<Super>f" "$SCRIPT_DIR/switch.sh -n Thunar"
set_shortcut "<Super>g" "$SCRIPT_DIR/switch.sh -n SmartGit -c /home/kyrylo/Downloads/smartgit/bin/smartgit.sh"
set_shortcut "<Super>o" "$SCRIPT_DIR/switch.sh -n obsidian"
set_shortcut "<Super>v" "$SCRIPT_DIR/switch.sh -n Vivaldi"

set_shortcut "<Super>d" "$SCRIPT_DIR/utils/hideall.sh"
set_shortcut "<Super>b" "$SCRIPT_DIR/utils/win-tg-max.sh"
set_shortcut "<Super>q" "$SCRIPT_DIR/utils/win-min.sh"

set_shortcut "<Super>m" "$SCRIPT_DIR/scroll.sh"
set_shortcut "<Super>n" "$SCRIPT_DIR/scroll.sh -b"