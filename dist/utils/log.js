const logConfig = { debug: true };

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
function log(a1, a2, a3, a4) {
    if (logConfig.debug) {
        console.log(`${Date.now().toFixed(1)} => ${a1}${getText(a2)}${getText(a3)}${getText(a4)}`);
    }
}
export default { logConfig, log };
