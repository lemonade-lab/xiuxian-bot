- 宗门

ass 宗门信息

ass_bag 藏宝阁

ass_typing 势力类型

- 活动控制

activity X

- 管理员

admin X

- 虚空神器

board X
auction X
exchange X

- 物品

goods 物品

- 境界

levels 境界基本信息

fate_level 境界所需经验

- 配置

cooling X 冷却

- 地图

map_point 点位
map_position 区域

- 宝物

map_treasure X

- 怪物

monster

- x

order ？？？

redemption_codes

- 通天塔

skys 通天塔物品奖励
sky 通天塔排名

```sql
# 创建事件 -- 每个月清空指定表
CREATE EVENT clear_table_sky_event
ON SCHEDULE
    EVERY 1 MONTH
    STARTS CURRENT_TIMESTAMP
DO
    TRUNCATE TABLE table_sky;
```

skys_times

- 灵根

talent

- 称号

titles

- 文案

txt X

- 背包

bags

- 兑换码

redemption_codes

- 交易

transactions 交易物品
transactions_logs 购入记录

- 用户

user 基本信息
user_ass 宗门
user_bag 储物袋
user_blessing X
user_buy_log 购买记录
user_compensate ？？
user_damage ？？
user_equipment 装备
user_fate 本命
user_level 境界
user_log 状态记录
user_ring 戒指
user_skills 功法
user_title 头衔
user_talent 灵根
user_sky 通天塔领取记录 -- 根据deleteAT来判断是否领取。时间固定为当月零点
