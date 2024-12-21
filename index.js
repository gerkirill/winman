const { spawnSync } = require('child_process');
const { exit, env } = require('process');

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

function listWindows() {
  // todo: check exit code, handle errors
  const res = spawnSync('wmctrl', ['-p', '-G', '-l', '-x']);
  const out = res.stdout.toString();
  return parseWindowList(out);
}

function focusWindow(id) {
  spawnSync('wmctrl', ['-ia', id]);
}

function minimizeWindow(id) {
  spawnSync('wmctrl', ['-i', '-r', id, '-b', 'add,hidden']);
}

function windowsIntersect(a, b) {
  if (a.desktop !== b.desktop) return false;
  // Check for no overlap conditions:
  if (a.x + a.w <= b.x) return false; // window1 is to the left of window2
  if (b.x + b.w <= a.x) return false; // window2 is to the left of window1
  if (a.y + a.h <= b.y) return false; // window1 is above window2
  if (b.y + b.h <= a.y) return false; // window2 is above window1
  // If none of the conditions are true, the windows intersect
  return true;
}

function minimizeIntersectingWindows(id, windows) {
  const window = windows.find(w => w.id === id);
  windows.forEach(w => {
    if (w.id === id) return;
    if (windowsIntersect(window, w)) {
      minimizeWindow(w.id);
    }
  });
}

function getNextId(ids, currentId) {
  const index = ids.indexOf(currentId);
  return ids[index + 1] || ids[0];
}

function parseWindowList(s) {
  const lines = s.replace(/ +/g, ' ').split('\n').filter(s => s.length > 0);

  const windows = lines.map(line => {
    const [id, desktop, pid, x, y, w, h, winClass, host, ...rest] = line.split(' ');
    return { id, desktop: parseInt(desktop), pid: parseInt(pid), x: parseInt(x), y: parseInt(y), w: parseInt(w), h: parseInt(h), winClass, host, title: rest.join(' ') };
  });

  return windows;
}

function getWindowIdsByClass(className, stackOrder = false) {
  const windows = listWindows();
  const ids = windows.filter(w => w.winClass.toLowerCase().includes(className.toLowerCase())).map(w => w.id);
  if (!stackOrder) return ids;
  const stackOrderIds = getWindowIdsInStackingOrder();
  return stackOrderIds.filter(id => ids.includes(id));
}

function getActiveWindowId() {
  const res = spawnSync('xprop', ['-root']);
  const out = res.stdout.toString();
  const lines = out.split('\n');
  const activeWindowId = lines.find(l => l.startsWith('_NET_ACTIVE_WINDOW'));
  if (!activeWindowId) {
    return null;
  }
  const shortId = activeWindowId.split(' ')[4].replace(/,/, '');
  return normalizeShortId(shortId);
}

// xprop returns hex xtring w/o leading zero, in contrast to wmctrl
// tat's why we need to convert e.g. 0x5a00007 to 0x05a00007 
function normalizeShortId(shortId) {
  return shortId.replace(/^0x/, '0x0');
}


function getWindowIdsInStackingOrder() {
  const res = spawnSync('xprop', ['-root']);
  const out = res.stdout.toString();
  const lines = out.split('\n');
  const listLine = lines.find(l => l.startsWith('_NET_CLIENT_LIST_STACKING'));
  const ids = listLine?.match(/0x[0-9a-f]+/g) || [];
  return ids.map(normalizeShortId);
}

// function parseDesktopList(s) {
//   const lines = s.replace(/ +/g, ' ').split('\n').filter(s => s.length > 0);
//   const desktops = lines.map(line => {
//     const [id, active, _1, geometry, _2, pos, _3, areaPos, areaSize, ...rest] = line.split(' ');
//     return { id: parseInt(id), active: active === '*', geometry, pos, areaPos, areaSize, name: rest.join(' ') };
//   });
//   return desktops;
// }

// function listDesktops() {
//   // todo: check exit code, handle errors
//   const res = spawnSync('wmctrl', ['-d']);
//   const out = res.stdout.toString();
//   return parseDesktopList(out);
// }

// function getActiveDesktopId() {
//   const desktops = listDesktops();
//   return desktops.find(d => d.active).id;
// }

// `wmctrl -d` list the desktops.When notebook lead is closed -
//   ```bash
// 0  - DG: 2560x1440  VP: N/A  WA: 0,41 2560x1399  1
// 1  - DG: 2560x1440  VP: N/A  WA: 0,41 2560x1399  2
// 2  * DG: 2560x1440  VP: 0,0  WA: 0,41 2560x1399  3
// 3  - DG: 2560x1440  VP: N/A  WA: 0,41 2560x1399  4