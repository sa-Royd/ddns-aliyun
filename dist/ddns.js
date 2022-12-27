"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mian = void 0;
const geLocalNetWorkInterfaces_1 = require("./utils/geLocalNetWorkInterfaces");
const getNetworkIp_1 = require("./utils/getNetworkIp");
const log_1 = require("./utils/log");
// 获取域名解析记录
async function getDescribeDomainRecords(subDomain, mainDomain) {
    const res = await config.aliyunCore.request('DescribeDomainRecords', {
        DomainName: mainDomain,
        PageSize: 100,
        KeyWord: subDomain,
    }, {
        method: 'POST'
    });
    if (res) {
        return res.DomainRecords.Record;
    }
    else {
        return [];
    }
}
async function UpdateDomainRecord(RecordId, RR, Value) {
    const _type = Value.length > 19 ? 'AAAA' : 'A';
    const res = await config.aliyunCore.request('UpdateDomainRecord', {
        RecordId,
        RR,
        Type: _type,
        Value
    }, {
        method: 'POST'
    });
    if (res) {
        return res;
    }
    else {
        return undefined;
    }
}
async function updateRecord(domain, networkIp, localObj) {
    const subDomain = domain.split('.').slice(0, domain.split('.').length - 2).join('.');
    const mainDomain = domain.split('.').slice(-2).join('.');
    const domainRecords = await getDescribeDomainRecords(subDomain, mainDomain);
    if (domainRecords && domainRecords.length > 0) {
        // 匹配已有记录是否存在
        for (let i = 0; i < domainRecords.length; i++) {
            const item = domainRecords[i];
            if (item.RR === subDomain) {
                if (item.Value === networkIp) {
                    (0, log_1.log)(`无需更新`);
                    return;
                }
                else {
                    const record = await UpdateDomainRecord(item.RecordId, subDomain, networkIp); // 记录不一致
                    if (record) {
                        (0, log_1.log)(`更新成功:(${localObj.name})->${localObj.address}->${networkIp}->${domain}`);
                    }
                    return record;
                }
            }
        }
    }
    else {
        (0, log_1.log)(`没有找到更新的域名，建议在阿里云控制台添加域名`);
    }
    return;
}
;
let config = {};
const Core = require('@alicloud/pop-core');
async function mian(c) {
    if (!c.AccessKey || !c.AccessKeySecret || !c.Domain.length) {
        (0, log_1.log)('配置参数异常AccessKey｜AccessKeySecret｜Domain');
        return;
    }
    config = c;
    config.aliyunCore = new Core({
        accessKeyId: config.AccessKey,
        accessKeySecret: config.AccessKeySecret,
        endpoint: 'https://alidns.aliyuncs.com',
        apiVersion: '2015-01-09'
    });
    let records = [];
    const values = [];
	var ethNames = new Map();
	config.Ethernets.forEach(item => {
			let n=item.trim();
			ethNames.set(n,n);
		});


	if(config.IPVersion==='6'){
		// 当没有指定网卡时，就不获取本地地址了。指定网卡绑定域名更多是因为网卡在ipv6下才有意义。
		const ips = (0, geLocalNetWorkInterfaces_1.geLocalNetWorkInterfaces)(ethNames);
	    if (ips === undefined || ips.size==0 ) {
			console.log("获取本地的ipv6的地址失败！无法更新解析记录.");
			return;
		}
		var ip = null;
		var defip = null;
		for(var [k,v] of ips){defip = v; break;}
        for (let index=0;index<config.Domain.length;index++) {
			// 有指定网卡名
			if(ethNames.size>0)	ip = ips.get(config.Ethernets[index]);
			if(ip==null || ip===undefined)	// 没有找到指定网卡名的ipv6地址，则用默认ipv6更新
				ip=defip;
			
			//该接口并没有返回公网的IPV6接口，所以调用意义没有。直接用本地的IPV6地址即可
            //const networkIp = await (0, getNetworkIp_1.getNetIp)(value.address).catch(value => {
            //    (0, log_1.log)(`无法获取公网地址，绑定失败：${value}`);
            //});
			
            (0, log_1.log)(`准备更新：${config.Domain[index]} -> ${ip.address}`);
            const record = await updateRecord(config.Domain[index], ip.address, ip);
            if (record) {
                records.push(record);
            }
        }
    }
    else { // 单IP
		const networkIp = await (0, getNetworkIp_1.getNetIp)();
        const networkInfo = {
            name: '默认',
            address: '默认',
            family: "默认",
            mac: "默认",
            netmask: "默认"
        };
		var ip = null;
        for (let index=0;index<config.Domain.length;index++) {
            (0, log_1.log)(`准备更新：${config.Domain[index]} -> ${networkIp}`);
			const record = await updateRecord(config.Domain[index], networkIp, networkInfo);

	        if (record) records.push(record);
		}
    }
    return records;
}
exports.mian = mian;
