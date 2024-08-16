# 修仙机器人

## 环境

- Centos Node

```sh
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
node -v
```

- redis

```sh
sudo yum update
sudo yum install epel-release
# install
sudo yum install redis
# start
sudo systemctl start redis
# status
sudo systemctl status redis
# enable 开启自启动
sudo systemctl enable redis
```

- mysql

```sh

```

### 本地调试

- 源码安装

```sh
git clone --depth=1  https://github.com/lemonade-lab/xiuxian.bot.git
cd xiuxian.bot
```

- 依赖加载

```sh
npm install yarn@1.12.1 -g
yarn --ignore-engines
```

- 配置环境

配置`alemon.env`文件

```env
ALEMONJS_REDIS_HOST = 'localhost'
ALEMONJS_REDIS_PORT = '6379'
ALEMONJS_REDIS_PASSWORD = ''
ALEMONJS_REDIS_DB = '3'

ALEMONJS_MYSQL_HOST = 'locahost'
ALEMONJS_MYSQL_PROT = '3306'
ALEMONJS_MYSQL_USER = 'root'
ALEMONJS_MYSQL_PASSWORD = ''
ALEMONJS_MYSQL_DATABASE = 'xiuxian_bak'

APP_SERVER_PORT = '9090'
APP_SERVER_KEY = 'xiuxian'
```

- MySQL80

> 阅读 xiuxian/db/src/models 建表

数据库名 `xiuxian_bak`
字符集 `utf8mb4`
排序规则 `utf8mb4_german2_ci`

- 应用调试

```sh
yarn app
```

## dev

- xiuxian-api

针对于 alemonjs 做消息处理函数的抽简

- xiuxian-db

数据库模型调用

- xiuxian-component

tsx组件及截图

- xiuxian-core

游戏核心处理模型

- xiuxian-statistics

数据统计函数

- xiuxian-utils

工具类

## Centos

- redis
