## 修仙机器人

### 基础环境

> [https://alemonjs.com/](https://alemonjs.com/)

> 必要环境 Windows>=7/Linux>=7.6 + Chrome/Chromium/Edge

> 必要环境 18.18.2>Node.js>16.14.0 + Redis>5.0.0

### 本地调试

```sh
|-- .vscode/ vs配置
|-- public/  公共文件
    |-- defset/   配置
    |-- img/      图片
|-- sql/     sql文件
|-- src/
    |-- api/   应用接口
    |-- apps/  应用
    |-- db/   数据层
    |-- image/   图片
    |-- model  应用模型
    |-- server 服务端
    |-- utils  通用工具
    |-- apps.ts  应用导出
afloat.config.ts 开发配置
alemon.config.js 调试配置
main.ts          应用入口
deploy.sh        打包脚本
```

- 安装

```sh
git clone --depth=1  git@github.com:ningmengchongshui/xiuxian-bot.git
```

- 依赖加载

```sh
npm install
```

- 登录

新建`alemon.login.ts`

```ts
import { ALoginOptions } from 'alemonjs'
export default ALoginOptions({
  test: {
    qq: {}
  }
})
```

- 数据库

> ? 什么mysql和redis都不会装,自己百度

[点击下载redis5.0](https://github.com/tporadowski/redis/releases)

[点击下载mysql8.0](https://www.mysql.com/)

创建数据库`xiuxian`

字符集`utf8mb4`

排序规则`utf8mb4_general_ci`

执行`sql/xiuxian.sql` 结构文件

执行`sql/data` 文件夹里的数据文件

- 配置环境

配置`alemon.env`文件

```env
ALEMONJS_REDIS_HOST = 'localhost'
ALEMONJS_REDIS_PORT = '6379'
ALEMONJS_REDIS_PASSWORD = ''
ALEMONJS_REDIS_DB = '3'
ALEMONJS_MYSQL_DATABASE = 'xiuxian'
ALEMONJS_MYSQL_USER = 'root'
ALEMONJS_MYSQL_PASSWORD = ''
ALEMONJS_MYSQL_HOST = 'locahost'
ALEMONJS_MYSQL_PROT = '3306'
```

- 应用调试

```sh
npm run dev
```

- 打包(不部署可跳过)

```sh
sh -x ./deploy.sh #推送到打包分支
```

### 部署

> Version: AlemonJS @ 1.2.0-rc.23 --> @ 1.2.0

- 安装

```sh
npm install pnpm  -g
pnpm create alemonjs@latest -y
cd alemonb
```

- 登录(同上)

- 依赖加载

```sh
npm i  bullmq ioredis mysql2 sequelize -W
```

- 应用安装

```sh
git clone --depth=1 -b build https://github.com/ningmengchongshui/xiuxian-bot.git ./plugins/xiuxian-plugin
```

> 先装依赖再装插件,防止依赖仅在插件内node_modules

- 配置环境(同上)

- 启动应用(同上)

- 结构

```sh
|-- public/  公共文件
    |-- defset/   配置
    |-- img/      图片
|-- sql/     sql文件
export.json      导出说明
main.js          应用入口
package.json     包管理
```

### 数据层

mysql 存储数据、使用大量链表查询

redis 状态缓存、排名缓存、队列任务

### 交互层

整体文字交互,响应#和/开发的消息

使用了模型抽象，有`背包`/`用户`/`商店` 等,交互时调用行为api
