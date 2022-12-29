# ddns-aliyun

提供阿里云的DDNS设置，支持多网卡多域名绑定。

## 特性

- 支持阿里云DDNS设置
- 支持针对多个线路多个网卡单独设置域名
- 支持IPv4,IPv6
- 支持Docker
## 说明
每次运行时，会打印本地适配器信息，推荐根据网卡名绑定域名

必须在阿里云后台建立域名，`记录值`填写什么无所谓。

阿里云AccessKey开通：https://help.aliyun.com/document_detail/38738.html

必要权限：UpdateDomainRecord,DescribeDomainRecords

node版本>=16

多网卡有什么用， 一些设备有可能接入多条线路，如：电信、联通、移动、海外线等，对每条线提供一个独立的域名很有必要～。

## 安装方式

```
npm i -g sa-Royd.ddns
```

## 命令执行方式

参数之间只能有一个空格, 如果是win环境需要在powershell中执行。

网卡查看命令 `ifconfig`,一般为en0，en1等，选择有本地IP，如192.168.xx.xx的的进行绑定

多网卡绑定多域名方式：

``` sh
ddns-aliyun -e --accessKey 123 --accessKeySecret 123 --domain 'eth0&eth0.xxx.com,eth1&eth1.xxx.com'
```

单域名方式
不指定网卡，会根据你当前的外网IP动态绑定，如果支持IPv6,会优先绑定
``` sh
ddns-aliyun -e --accessKey 123 --accessKeySecret 123 --domain  'eth0.xxx.com'
```

指定IPv6方式
``` sh
ddns-aliyun -e --ip 6 --accessKey 123 --accessKeySecret 123 --domain  '网卡名&eth0.xxx.com'
```

## 参数

- -e, --execute 执行域名更新动作
- -p, --print 打印机出本地所有的网卡信息。
- -v, --version 版本号
- --ip `4或6` 指定要绑定的的ip类型【默认取值6】
- --accessKey 阿里分配的key
- --accessKeySecret 阿里分配的密码
- --domain `'网卡名1&域名1，网卡名2&域名2'`, 网卡名与域名通过‘&’进行连接，多个域名使用','分割 

## 定时执行

程序不包含定时执行，现在各种系统都有定时任务。没必要在多此一举。节省系统资源。

1. 编写一个run.sh命令文件

```
#!/bin/bash
ddns-aliyun -e --accessKey 123 --accessKeySecret 123 --domain  'eth0&eth0.xxx.com,eth1&eth1.xxx.com'
# read
```

2. win `计划任务中`添加 `run.sh` ，mac/linux 可以在`crontab`中添加 `run.sh`

## 更新日志

### v1.1.0

- 修复多个域名无法同时更新为一个ip的Bug
- 修复参数中部分有网卡名和无网卡名的域名混合时会出现Bug.
- 修复一些其它的bug.

### v1.0.10

完善ipv6支持

版本发布
