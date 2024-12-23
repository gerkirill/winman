const { focusWindow, minimizeIntersectingWindows, getNextId, getActiveWindowId, getWindowsByDesktop, getPrevId } = require('./helpers/win-utils');
const { getActiveDesktopId } = require('./helpers/desktop-utils');

const args = parseArgs(process.argv.slice(2));

const activeDesktopId = getActiveDesktopId();
const activeWindowId = getActiveWindowId();
//  get all windows for the current desktop
const desktopWindows = getWindowsByDesktop(activeDesktopId, false);
// switch to the next one
const nextWindowId = args.backwards ? getPrevId(desktopWindows.map(w => w.id), activeWindowId) : getNextId(desktopWindows.map(w => w.id), activeWindowId);
focusWindow(nextWindowId);
minimizeIntersectingWindows(nextWindowId, desktopWindows);

function parseArgs(args) {
   const params = {};
   for (let i = 0; i < args.length; i++) {
      switch (args[i]) {
         case '-b':
            params.backwards = true;
            break;
      }
   }
   return params;
}
