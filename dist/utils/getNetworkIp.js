import { default as http } from 'http';
import * as logHelper from './log.js';

export async function getNetIp() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'ifconfig.co',
            method: 'GET',
            path: '/ip'
        };
        const req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                chunk = chunk.replace('\n', '');
                logHelper.log(`获取公网IP: ${localAddress || '默认'} -> ${chunk}`);
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
