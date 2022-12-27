"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomain = exports.getArgv = void 0;
function getArgv(key) {
    if (process.env[key]) {
        return process.env[key];
    }
    for (let i = 0; i < process.argv.length; i++) {
        if (process.argv[i] === '-' + key) {
            return process.argv[i + 1];
        }
        else if (process.argv[i] === '-v' || process.argv[i] === '-version') {
            return 'true';
        }
    }
    return undefined;
}
exports.getArgv = getArgv;
// '10010&10010.xxxx.com,10086&10086.xxxx.com'
// 网卡名1&要绑定的域名1,网卡名2&要绑定的域名2
function getDomain(v) {
	// 如果没有指定任何一个网卡名，则所有域名共同更新为一个Ip,如果部分有指定网卡名，那么没指定网卡名的就不更新域名
	var updateAll=true;	
    const domains = [];
    if (v) {
        const a = v.split(',');
        a.forEach(value => {
            const b = value.split('&');
			var dm = {name:null,domain:""};
            if (b.length === 1) {
				dm.domain=b[0].trim();
            }
            else {
				updateAll=false;
				dm.name=b[0].trim();
				dm.domain=b[1].trim();
            }
            domains.push(dm);
        });
		
		domains.forEach(value=>value.name=(updateAll&&(value.name==null||value.name===""))?"_default_":value.name);
    }
    return domains;
}
exports.getDomain = getDomain;
