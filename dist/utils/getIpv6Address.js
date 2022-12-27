"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalInterfaces = void 0;
const tslib_1 = require("tslib");
const os = (0, tslib_1.__importStar)(require("os"));

// 返回所有的ipv6地址的网卡及网卡名
function getIpv6Address() {
    const ipv6s = new Map();
    const nets = os.networkInterfaces();
    for (let nw in nets) {
        let objArr = nets[nw];
        if (objArr) {
			objArr.forEach((obj, idx, arr) => {
				// 没有指定网卡名时，返回所有的有效IPV6地址, 有网卡名时，只返回网卡名对应的IPV6地址
                if (obj.family === 'IPv6' && obj.address.length > 19 && obj.address.indexOf('fe80') === -1) {
					// 这里还需要过滤到链路本地的ipv6网址。
					const newObject = Object.assign(obj, { name: nw });
					if(!ipv6s.size) ipv6s.set("_default_",newObject);	// 添加一个默认的网卡
					ipv6s.set(nw, newObject);
                 }
			});
        }
        else {
            return null;
        }
    }
    return ipv6s;
}
exports.getIpv6Address = getIpv6Address;
