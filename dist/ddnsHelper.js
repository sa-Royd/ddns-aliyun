import * as ifcHelper from "./utils/getIpv6Address.js";
import * as ipHelper from "./utils/getNetworkIp.js";
import { default as logHelper } from "./utils/log.js";

async function getDomainRecords(subDomain, mainDomain, aliHelper){
	var res = await aliHelper.request("DescribeDomainRecords",{
		DomainName: mainDomain,
		PageSize: 100,
		KeyWord: subDomain
	});
	if(res) return res.DomainRecords.Record;
	
	return [];
}

async function updateDomainRecord(recordId, RR, value, aliHelper){
	const _type = value.length > 19 ? 'AAAA' : 'A';
	var res = await aliHelper.request("UpdateDomainRecord",{
		recordId,
		RR,
		Type: _type,
		value
	},{	method: 'POST' });

	if(res) return res;
	
	return undefined;
}

async function updateData(domain, ip, ifcObj, aliHelper){
	const subDomain = domain.split('.').slice(0, domain.split('.').length - 2).join('.');
    const mainDomain = domain.split('.').slice(-2).join('.');
	const domainRecords = await getDomainRecords(subDomain, mainDomain, aliHelper);
    if (domainRecords && domainRecords.length > 0) {
        // 匹配已有记录是否存在
        for (let i = 0; i < domainRecords.length; i++) {
            const item = domainRecords[i];
            if (item.RR === subDomain) {
                if (item.Value === ip) {
                    logHelper.log(`无需更新`);
                    return;
                }                                                                                                        
                else {
                    var record = await updateDomainRecord(item.RecordId, subDomain, ip, aliHelper);
                    if (record) {
                        logHelper.log(`更新成功:(${ifcObj.name})->${ifcObj.address}->${ip}->${domain}`);
                    }
                    return record;
                }
            }
        }
    }
    else logHelper.log(`没有找到更新的域名，建议在阿里云控制台添加域名`);

    return;
}

import * as RPC from "@alicloud/pop-core";
export default async function goUpdate(config){
	var aliHelper = new RPC.RPCClient({
        accessKeyId: config.AccessKey,
        accessKeySecret: config.AccessKeySecret,
        endpoint: 'https://alidns.aliyuncs.com',
        apiVersion: '2015-01-09'
    });
	let records = [];
    let ips = null;
    if(config.IPVersion==='4'){
		var pubIp = await ipHelper.getNetIp();
        var ip= {
            name: '默认',
            address: pubIp,
        	family: "IPv4",
            mac: "默认",
            netmask: "默认"
        };
        for (var dm of config.Domain) {
            logHelper.log(`准备更新：${dm.domain} -> ${ip.address}`);
            var record = await updateRecord(dm.domain, ip.address, ip, aliHelper);
           if (record) records.push(record);
        }
    }
    else {
        ips = ifcHelper.getIpv6Address();
        if (ips === null || ips.size==0 ) {
            console.log("获取解析的ip地址失败！无法更新解析记录.");
            return;
        }
        var ip = null;
		console.log(lps);
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
            logHelper.log(`准备更新：${dm.domain} -> ${ip.address}`);
			var record = await updateData(dm.domain, ip.address, ip, aliHelper);
            if (record) records.push(record);
        }
    }
    return records;
}

