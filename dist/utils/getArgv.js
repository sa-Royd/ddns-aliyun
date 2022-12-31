function createArgv(){
	var argv = new Map();
	argv.set("--program",process.argv[0]);
	argv.set("--name",process.argv[1]);
	var name = "";
	var value = "";
	for(let i=2;i<process.argv.length;i++){
		if (process.argv[i].indexOf('-')===0)
			name = process.argv[i];

		// 这里的条件不可以 == -1 如果是这样的话，域名中有 - 的话，这个代码就会出bug了, 
		// 只要-这个符号不出现在第一个字符，就认为是参数值，而不是参数名
		if(i+1<process.argv.length && process.argv[i+1].indexOf("-")!==0){ 
			value = process.argv[i+1];
			i++;
		}
		argv.set(name,value);

		name="";
		value="";
	}
	return argv;
}

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

export default { createArgv, getDomain };
