"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.logConfig = void 0;
exports.logConfig = {
    debug: true
};
function log(a1, a2, a3, a4) {
    if (exports.logConfig.debug) {
        console.log(`${Date.now().toFixed(1)} => ${a1}${getText(a2)}${getText(a3)}${getText(a4)}`);
    }
}
exports.log = log;
function getText(t) {
    if (t === undefined) {
        return '';
    }
    if (typeof t === 'string') {
        return ',' + t;
    }
    else {
        return ',' + JSON.stringify(t);
    }
}
