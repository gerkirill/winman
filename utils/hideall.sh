#!/bin/bash
# Get current desktop number
current_desktop=$(wmctrl -d | grep '*' | cut -d ' ' -f1)

# Hide all windows on current desktop
wmctrl -l | while read -r window_id desktop_num rest; do
    # Only hide windows on current desktop
    if [ "$desktop_num" = "$current_desktop" ]; then
        wmctrl -i -r "$window_id" -b add,hidden
    fi
done