"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mian = void 0;
const getipv6s = require("./utils/getIpv6Address");
const getPublicIp_1 = require("./utils/getNetworkIp");
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
	let ips = null;
	if(config.IPVersion==='4'){
		const pubIp = await (0, getPublicIp_1.getNetIp)();
		var ip= {
            name: '默认',
            address: pubIp,
            family: "IPv4",
            mac: "默认",
            netmask: "默认"
		};
	    for (var dm of config.Domain) {
			(0, log_1.log)(`准备更新：${dm.domain} -> ${ip.address}`);
	        const record = await updateRecord(dm.domain, ip.address, ip);
		    if (record) records.push(record);
		}
	}
	else {
		// 当没有指定网卡时，就不获取本地地址了。指定网卡绑定域名更多是因为网卡在ipv6下才有意义。
		ips = (0, getipv6s.getIpv6Address)();
	    if (ips === null || ips.size==0 ) {
			console.log("获取解析的ip地址失败！无法更新解析记录.");
			return;
		}
		var ip = null;
		for (var dm of config.Domain) {
			// 有指定网卡名
			ip = ips.get(dm.name);
			if(ip===null || ip===undefined){
				if(dm.name==null||dm.name==="")
					console.log("更新失败：您没有为域名",dm.domain,"指定网卡!");
				else
					console.log("更新失败：您为域名",dm.domain,"指定了不存在的网卡",dm.name,"解析!");
				continue;
			}
			(0, log_1.log)(`准备更新：${dm.domain} -> ${ip.address}`);
	        const record = await updateRecord(dm.domain, ip.address, ip);
		    if (record)	records.push(record);
		}
	}
    return records;
}
exports.mian = mian;
