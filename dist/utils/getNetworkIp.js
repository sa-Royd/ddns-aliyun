"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetIp = void 0;
const tslib_1 = require("tslib");
const http = (0, tslib_1.__importStar)(require("http"));
const log_1 = require("./log");
async function getNetIp(localAddress) {
    if (localAddress && localAddress.length > 19) {
        return localAddress;
    }
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'ifconfig.co',
            method: 'GET',
            path: '/ip',
            localAddress
        };
        const req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                chunk = chunk.replace('\n', '');
                (0, log_1.log)(`获取公网IP: ${localAddress || '默认'} -> ${chunk}`);
                resolve(chunk);
            });
            // res.on('end', () => {
            //     resolve('');
            // });
        });
        req.on('error', (e) => {
            reject(`problem with request: ${e.message}`);
        });
        //   req.write(postData);
        req.end();
    });
}
exports.getNetIp = getNetIp;
