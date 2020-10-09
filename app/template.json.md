# 启动模板
### 这里配置启动需要的信息，配置文件config.json不从这里产生
### 启动默认会加载 CacheMoudle 和 TablesService
### (logger) 日志模块如果不开启的话，产生的日志数据会自动丢弃 
### (db) 数据库模块如果不开启的话，将失去数据库访问能力，前端服务可以考虑关闭数据库模块

## 示例配置信息
### 下面是一个 开启了日志模块，数据库模块的 全量配置信息
```
{
    "port": 10153,
    "host":"127.0.0.1",
    "proto":"http",
    "logger": true,
    "db": true,
    "center": [
        "centerServe"
    ],
    "backend": [
        "activeServe",
        "itemcodeServe",
        "mallServe",
        "redpackServe",
        "serverEventServe",
        "ShopServe",
        "roleServe"
    ],
    "frontend": ["webServe"]
}
```
### port rpc调用使用的端口号
### host rpcCenter 的地址