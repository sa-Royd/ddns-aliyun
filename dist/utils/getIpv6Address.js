import os from 'os';

// 返回所有的ipv6地址的网卡及网卡名
export function getIpv6Address() {
    const ipv6s = new Map();
    const nets = os.networkInterfaces();
	for (let nw in nets) {
        let objArr = nets[nw];
        if (objArr) {
		objArr.forEach((obj, idx, arr) => {
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
