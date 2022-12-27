#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.getDomain = exports.getArgv = exports.logConfig = exports.mian = void 0;
const ddns_1 = require("./ddns");
Object.defineProperty(exports, "mian", { enumerable: true, get: function () { return ddns_1.mian; } });
const getArgv_1 = require("./utils/getArgv");
Object.defineProperty(exports, "getArgv", { enumerable: true, get: function () { return getArgv_1.getArgv; } });
Object.defineProperty(exports, "getDomain", { enumerable: true, get: function () { return getArgv_1.getDomain; } });
const log_1 = require("./utils/log");
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return log_1.log; } });
Object.defineProperty(exports, "logConfig", { enumerable: true, get: function () { return log_1.logConfig; } });
const printLocalNet_1 = require("./utils/printLocalNet");
const packages = require('../package.json');
log_1.logConfig.debug = true; // 是否输出日志信息
async function init() {
    const config = {};
    config.AccessKey = (0, getArgv_1.getArgv)('AccessKey');
    config.AccessKeySecret = (0, getArgv_1.getArgv)('AccessKeySecret');
    config.IPVersion = (0, getArgv_1.getArgv)('ip') || '4';
    config.Domain = (0, getArgv_1.getDomain)((0, getArgv_1.getArgv)('Domain'));
    const settimeID = setTimeout(() => {
        (0, log_1.log)('---超时退出---');
        process.exit(1);
    }, 10000);
    const r = await (0, ddns_1.mian)(config);
    if (r && r.length) {
        (0, log_1.log)('---成功---');
    }
    else {
        (0, log_1.log)('---失败---');
    }
    clearTimeout(settimeID);
}
if ((0, getArgv_1.getArgv)('v') || (0, getArgv_1.getArgv)('version')) {
    console.log("当前版本:", packages.version);
    process.exit(0);
}
if ((0, getArgv_1.getArgv)('e') === 'true') {
    (0, printLocalNet_1.printLocalNetwork)();
    (0, log_1.log)('---开始---');
    init();
}
