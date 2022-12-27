"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printLocalNetwork = void 0;
const tslib_1 = require("tslib");
const os = (0, tslib_1.__importStar)(require("os"));
function printLocalNetwork() {
    const networksObj = os.networkInterfaces();
    for (let nw in networksObj) {
        let objArr = networksObj[nw];
        console.log(`网卡名：${nw}`);
        if (objArr) {
            objArr.forEach((obj, idx, arr) => {
                console.log(`地址：${obj.address}`);
                console.log(`掩码：${obj.netmask}`);
                console.log(`物理地址：${obj.mac}`);
                console.log(`协议族：${obj.family}`);
            });
        }
        console.log(`===========================`);
    }
}
exports.printLocalNetwork = printLocalNetwork;
