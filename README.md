# 修仙机器人

## 环境

NodeJS > 18, Redis > 5, MySQL 8

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
yarn dev
```

- 打包

```sh
yarn build
```

- 图片调试

```sh
yarn server
```

## 目录结构

```ts
src/                // 源代码目录
    |--apps/        // 开发应用
    |--assets/
    |--xiuxian/
        |--api/
        |--core/
        |--db/
        |--img/
        |--statistics/
        |--utils/
index.ts            // 文件入口
package.json   // 工程配置文件
```
