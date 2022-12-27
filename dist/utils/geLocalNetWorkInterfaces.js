"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geLocalNetWorkInterfaces = void 0;
const tslib_1 = require("tslib");
const os = (0, tslib_1.__importStar)(require("os"));
function geLocalNetWorkInterfaces(networkNames) {
    const ipv6s = new Map();
    const networksObj = os.networkInterfaces();
    for (let nw in networksObj) {
        let objArr = networksObj[nw];
        if (objArr) {
			objArr.forEach((obj, idx, arr) => {
				// 没有指定网卡名时，返回所有的有效IPV6地址, 有网卡名时，只返回网卡名对应的IPV6地址
				if (networkNames.size == 0 || networkNames.has(nw)) {
                    if (obj.family === 'IPv6' && obj.address.length > 19 && obj.address.indexOf('fe80') === -1) {
						// 这里还需要过滤到链路本地的ipv6网址。
						const newObject = Object.assign(obj, { name: nw });
						ipv6s.set(nw, newObject);
                    }
				}
			});
        }
        else {
            return undefined;
        }
    }
    return ipv6s;
}
exports.geLocalNetWorkInterfaces = geLocalNetWorkInterfaces;
