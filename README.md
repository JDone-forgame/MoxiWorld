# moxiworld

# 抽离游戏基础框架

## 启动游戏模块时模块不能为空文件夹；
## tsconfig中配置记得更新；
## package.json中关于数据库的位置记得根据项目改变；
## config.json中关于数据库的接口记得根据项目改变；
## app/all.json中配置了启动时所需要的信息,启动时需要带上；

# config.json
## "web": "web 中 prot 是端口号，每一个部署的项目端口号需要【唯一】、【规律】",
## "Swagger": "swagger 开启接口文档，方便查看提供的各种类型(get/post)各种组(group)的接口",
## "db": "数据库配置文件，根据项目而定",
## "gm": "是否开启管理员权限模式",
## "platformUrl": "接入平台的 Url 访问地址",
## "validate": "加密协议",
## "rank": "排行榜服务器",