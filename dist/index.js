#!/usr/bin/env node

import goUpdate from "./ddnsHelper.js";
import { default as argvHelper } from "./utils/getArgv.js";
import { default as logHelper } from "./utils/log.js";
import * as ifcHelper from "./utils/printLocalNet.js";
import packages from "../package.json" assert { type: "json" };
import * as RPC from "@alicloud/pop-core";

/*
const ddns_1 = require("./ddnsHelper");
const getArgv_1 = require("./utils/getArgv");
const log_1 = require("./utils/log");
const printLocalNet_1 = require("./utils/printLocalNet");
const packages = require('../package.json');
*/

logHelper.logConfig.debug = true; // 是否输出日志信息

async function init(argvs) {
	const config = {};
    config.AccessKey = argvs.get('--accessKey');
    config.AccessKeySecret = argvs.get('--accessKeySecret');
    config.IPVersion = argvs.get('--ip');
    config.Domain = argvHelper.getDomain(argvs.get("--domain"));

	const settimeID = setTimeout(() => {
		logHelper.log('---超时退出---');
	    process.exit(1);
	}, 10000);
    const r = await goUpdate(config);
    if (r && r.length)
    	logHelper.log('---成功---');
    else
		logHelper.log('---失败---');
    
    clearTimeout(settimeID);
}

var	argvs = argvHelper.createArgv();
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
if(!argvs.has("--ip")) argvs.set("--ip","4"); // 未指定ip协议，默认用6更新
if (argvs.has('-p') || argvs.has("--print")) 
    ifcHelper.printLocalNetwork();

if (argvs.has('-e') || argvs.has("--execute")){
    logHelper.log('---开始---');
	
    
	init(argvs);
}

process.exit(0);

