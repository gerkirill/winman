const { spawnSync } = require('child_process');
const { exit, env } = require('process');
const { listWindows, focusWindow, getActiveWindowId, minimizeIntersectingWindows, getNextId, getWindowIdsByClass } = require('./helpers/win-utils');

const args = parseArgs(process.argv.slice(2));
const APP_NAME = args.name || env.APP_NAME;
if (!APP_NAME) {
  console.error('APP_NAME is not set');
  exit(1);
}

// todo: what if APP_NAME is not set? But SPAWN and APP_COMMAND are set.
const APP_COMMAND = args.command || env.APP_COMMAND || APP_NAME.toLowerCase();
const SPAWN = args.spawn || env.SPAWN || false;
const SPAWN_TIMEOUT = 8000;

console.log({ APP_NAME, APP_COMMAND, SPAWN });

const allWindows = listWindows();
const activeWindowId = getActiveWindowId();
const activeWindow = allWindows.find(w => w.id === activeWindowId);

let nextWindowId;
if (activeWindow.winClass.toLowerCase().includes(APP_NAME.toLowerCase())) {
  const allClassIds = getWindowIdsByClass(APP_NAME, false);
  nextWindowId = getNextId(allClassIds, activeWindowId);
} else {
  const allClassIds = getWindowIdsByClass(APP_NAME, true);
  nextWindowId = allClassIds[allClassIds.length - 1];
  // nextWindowId = allClassIds[0];
}

if (nextWindowId && !SPAWN) {
  focusWindow(nextWindowId);
  minimizeIntersectingWindows(nextWindowId, allWindows);
  exit();
} else {
  spawnSync('nohup', [APP_COMMAND]);
  // await when new windows appears in the list, handle timeout
  // get active window id and minimize others if they intersect
  const interval = 500;
  let timer = 0;
  const t = setInterval(() => {
    const newWindows = listWindows();
    if (newWindows.length > allWindows.length) {
      clearInterval(t);
      // find out new window ID
      const activeWindowId = getActiveWindowId();
      const activeWindow = newWindows.find(w => w.id == activeWindowId);
      minimizeIntersectingWindows(activeWindow.id, newWindows);
      exit();
    }
    timer += interval;
    if (timer > SPAWN_TIMEOUT) {
      clearInterval(t);
      console.error('Timeout');
      exit();
    }
  }, interval);
}

function parseArgs(args) {
  const params = {};
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-n':
        params.name = args[++i];
        break;
      case '-c':
        params.command = args[++i];
        break;
      case '-s':
        params.spawn = true;
        break;
    }
  }
  return params;
}
