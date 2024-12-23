const { spawnSync } = require('child_process');
const { windowsIntersect } = require('./geometry');

/**
 * 
 * Result array entry example:
 * {
    id: '0x0120002',
    desktop: 1,
    pid: 1147382,
    x: 0,
    y: 0,
    w: 2560,
    h: 1800,
    winClass: 'code.Code',
    host: 'LWO1-LHP-A17196',
    title: 'executors.js - winman - Visual Studio Code'
}
 */
function listWindows() {
  // todo: check exit code, handle errors
  const res = spawnSync('wmctrl', ['-p', '-G', '-l', '-x']);
  const out = res.stdout.toString();
  return parseWindowList(out);
}

function parseWindowList(s) {
  const lines = s.replace(/ +/g, ' ').split('\n').filter(s => s.length > 0);

  const windows = lines.map(line => {
    const [id, desktop, pid, x, y, w, h, winClass, host, ...rest] = line.split(' ');
    return { id, desktop: parseInt(desktop), pid: parseInt(pid), x: parseInt(x), y: parseInt(y), w: parseInt(w), h: parseInt(h), winClass, host, title: rest.join(' ') };
  });

  return windows;
}

function focusWindow(id) {
  spawnSync('wmctrl', ['-ia', id]);
}

function minimizeWindow(id) {
  spawnSync('wmctrl', ['-i', '-r', id, '-b', 'add,hidden']);
}

function getWindowIdsInStackingOrder() {
  const res = spawnSync('xprop', ['-root']);
  const out = res.stdout.toString();
  const lines = out.split('\n');
  const listLine = lines.find(l => l.startsWith('_NET_CLIENT_LIST_STACKING'));
  const ids = listLine?.match(/0x[0-9a-f]+/g) || [];
  return ids.map(normalizeShortId);
}

function getActiveWindowId() {
  const res = spawnSync('xprop', ['-root']);
  const out = res.stdout.toString();
  const lines = out.split('\n');
  const activeWindowId = lines.find(l => l.startsWith('_NET_ACTIVE_WINDOW'));
  if (!activeWindowId) return null;
  const shortId = activeWindowId.split(' ')[4].replace(/,/, '');
  return normalizeShortId(shortId);
}

// xprop returns hex xtring w/o leading zero, in contrast to wmctrl
// tat's why we need to convert e.g. 0x5a00007 to 0x05a00007 
function normalizeShortId(shortId) {
  return shortId.replace(/^0x/, '0x0');
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

function getPrevId(ids, currentId) {
  const index = ids.indexOf(currentId);
  return ids[index - 1] || ids[ids.length - 1];
}

function getWindowIdsByClass(className, stackOrder = false) {
  const windows = listWindows();
  const ids = windows.filter(w => w.winClass.toLowerCase().includes(className.toLowerCase())).map(w => w.id);
  if (!stackOrder) return ids;
  const stackOrderIds = getWindowIdsInStackingOrder();
  return stackOrderIds.filter(id => ids.includes(id));
}

function getWindowsByDesktop(desktopId, stackOrder = false) {
  const windows = listWindows();
  const desktopWindows = windows.filter(w => w.desktop === desktopId);
  if (!stackOrder) return desktopWindows;
  const stackOrderIds = getWindowIdsInStackingOrder();
  return stackOrderIds.map(id => desktopWindows.find(w => w.id === id)).filter(w => w);
}

module.exports = {
  listWindows,
  focusWindow,
  minimizeWindow,
  getWindowIdsInStackingOrder,
  getActiveWindowId,
  minimizeIntersectingWindows,
  getNextId,
  getPrevId,
  getWindowIdsByClass,
  getWindowsByDesktop
}