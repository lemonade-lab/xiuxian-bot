## 修仙机器人

### 基础环境

> [https://alemonjs.com/](https://alemonjs.com/)

> 必要环境 Windows>=7/Linux>=7.6 + Chrome/Chromium/Edge

> 必要环境 Node.js 18.18.2 + Redis 6.0.0

### 本地调试

- 源码安装

```sh
git clone --depth=1  git@github.com:ningmengchongshui/xiuxian-bot.git
cd xiuxian-bot
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
ALEMONJS_MYSQL_DATABASE = 'xiuxian'
```

- 应用调试

```sh
yarn app
#
yarn dev
```
