#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 获取传递的变量
variable="1.0.0"

if [ "$1" ]; then
    variable=$1
fi

npm run build

#--------------
# 推送
#--------------
cd ./dist
git init
git add -A
git commit -m $variable
git push -f git@github.com:ningmengchongshui/xiuxian-plugin.git master:build
cd ..
