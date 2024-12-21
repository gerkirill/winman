# CLI tools used

- wmctrl
- xprop
- xdotool

```bash
# usage examples for wmctrl
workspace_number=`wmctrl -d | grep '\*' | cut -d' ' -f 1`
win_list=`wmctrl -lx | grep $app_name | grep " $workspace_number " | awk '{print $1}'`
local target_desktop=$(wmctrl -l | grep "$target_window_id" | awk '{print $2}')
wmctrl -l | while read -r window_id desktop_num rest; do
wmctrl -i -r "$window_id" -b add,hidden
win_list=$(wmctrl -lx | grep $app_name | awk '{print $1}')
wmctrl -ia $i
# Activate the window
wmctrl -ia "$switch_to"

# usage examples for xprop
# Get the id of the active window (i.e., window which has the focus)
active_win_id=`xprop -root | grep '^_NET_ACTIVE_W' | awk -F'# 0x' '{print $2}' | awk -F', ' '{print $1}'`
IDs=$(xprop -root|grep "^_NET_CLIENT_LIST_STACKING" | tr "," " ")

# usage examples for xdotool
# Get the Y position of the target window
local target_y=$(xdotool getwindowgeometry "$target_window_id" | grep "Position:" | awk -F'[:,]' '{print $3}' | grep -oE '^[0-9]+')
 # Get window Y position
local window_y=$(xdotool getwindowgeometry "$window_id" | grep "Position:" | awk -F'[:,]' '{print $3}' | grep -oE '^[0-9]+')
```

# wmctrl

`wmctrl -d` list the desktops. When notebook lead is closed - 
```bash
0  - DG: 2560x1440  VP: N/A  WA: 0,41 2560x1399  1
1  - DG: 2560x1440  VP: N/A  WA: 0,41 2560x1399  2
2  * DG: 2560x1440  VP: 0,0  WA: 0,41 2560x1399  3
3  - DG: 2560x1440  VP: N/A  WA: 0,41 2560x1399  4
```

when notebook lead is opened - 
```bash
0  - DG: 2560x2520  VP: N/A  WA: 0,0 2560x2520  1
1  - DG: 2560x2520  VP: N/A  WA: 0,0 2560x2520  2
2  * DG: 2560x2520  VP: 0,0  WA: 0,0 2560x2520  3
3  - DG: 2560x2520  VP: N/A  WA: 0,0 2560x2520  4
```

Big screen resolution - is 2560x1440.
Notebook lead resolution - is 2920x1800.

List  all  desktops managed by the window manager. One line is output for each desktop, with the line broken
up into space separated columns. The first column contains an integer desktop number. The second column con‐
tains  a  '*' character for the current desktop, otherwise it contains a '-' character. The next two columns
contain the fixed string DG: and then the desktop geometry as  '<width>x<height>'  (e.g.  '1280x1024').  The
following  two  columns  contain the fixed string VP: and then the viewport position in the format '<y>,<y>'
(e.g. '0,0'). The next three columns after this contains the fixed string WA: and then two columns with  the
workarea  geometry  as  'X,Y  and  WxH' (e.g. '0,0 1280x998'). The rest of the line contains the name of the
desktop (possibly containing multiple spaces).

Useful option for zenity and xfdesktop: export NO_AT_BRIDGE=1

Extended window list: `wmctrl -p -G -l -x`

```bash
# show displays, their location, profiles and configuration
xfconf-query -c displays -lv
```