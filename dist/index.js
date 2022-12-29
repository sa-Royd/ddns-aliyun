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
async function init(argvs) {
    const config = {};
    config.AccessKey = argvs.get('--accessKey');
    config.AccessKeySecret = argvs.get('--accessKeySecret');
    config.IPVersion = argvs.get('--ip');
    config.Domain = (0, getArgv_1.getDomain)(argvs.get("--domain"));

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

var	argvs = (0,getArgv_1.createArgv)();
if (argvs.has("-v") || argvs.has("--version")) {
    console.log("当前版本:", packages.version);
    process.exit(0);
}
if(argvs.has("-accessKey")){
    console.log("-accessKey参数不正确，请使用--accessKey！");
	process.exit(1);
}
if(argvs.has("-accessKeySecret")){
    console.log("-accessKeySecret参数不正确，请使用--accessKeySecret！");
	process.exit(1);
}
if(!argvs.has("--accessKey")||!argvs.has("--accessKeySecret")){
    console.log("请提供更新域名所需要的accessKey及accessKeySecret！");
	process.exit(1);
}
if(!argvs.has("--domain")){
    console.log("请提供要更新的域名信息！");
	process.exit(1);
}
if(argvs.has("-ip")){
    console.log("-ip参数不正确，请使用--ip！");
	process.exit(1);
}
if(!argvs.has("--ip")) argvs.set("--ip","6"); // 未指定ip协议，默认用6更新
if (argvs.has('-p') || argvs.has("--print")) 
    (0, printLocalNet_1.printLocalNetwork)();

if (argvs.has('-e') || argvs.has("--execute")){
    (0, log_1.log)('---开始---');
    init(argvs);
}

process.exit(0);

