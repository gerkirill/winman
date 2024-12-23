const { spawnSync } = require('child_process');

function parseDesktopList(s) {
  const lines = s.replace(/ +/g, ' ').split('\n').filter(s => s.length > 0);
  const desktops = lines.map(line => {
    const [id, active, _1, geometry, _2, pos, _3, areaPos, areaSize, ...rest] = line.split(' ');
    return { id: parseInt(id), active: active === '*', geometry, pos, areaPos, areaSize, name: rest.join(' ') };
  });
  return desktops;
}

function listDesktops() {
  // todo: check exit code, handle errors
  const res = spawnSync('wmctrl', ['-d']);
  const out = res.stdout.toString();
  return parseDesktopList(out);
}

function getActiveDesktopId() {
  const desktops = listDesktops();
  return desktops.find(d => d.active).id;
}

// `wmctrl -d` list the desktops.When notebook lead is closed -
//   ```bash
// 0  - DG: 2560x1440  VP: N/A  WA: 0,41 2560x1399  1
// 1  - DG: 2560x1440  VP: N/A  WA: 0,41 2560x1399  2
// 2  * DG: 2560x1440  VP: 0,0  WA: 0,41 2560x1399  3
// 3  - DG: 2560x1440  VP: N/A  WA: 0,41 2560x1399  4

module.exports = {
  listDesktops,
  getActiveDesktopId
}