/**
 * Analyses two windows and returns true if they intersect
 * Window object example:
 * {
    desktop: 3,
    x: 0,
    y: 0,
    w: 2560,ds
    h: 1440,
}
*/
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

module.exports = {
    windowsIntersect
}