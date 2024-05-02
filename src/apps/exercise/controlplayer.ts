import { APlugin, Controllers, type AEvent } from 'alemonjs'
import {
  isThereAUserPresent,
  GameApi,
  endAllWord,
  postHelp
} from '../../api/index.js'
export class ControlPlayer extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(闭关|閉關)$/, fnc: 'biguan' },
        { reg: /^(#|\/)?(锻体|降妖)$/, fnc: 'dagong' },
        { reg: /^(#|\/)?打坐$/, fnc: 'concise' },
        { reg: /^(#|\/)?(归来|歸來|凝脉|出关|出關|聚灵|聚靈)$/, fnc: 'endWork' }
      ]
    })
  }

  /**
   * 凝练灵气
   * @param e
   * @returns
   */
  async concise(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    // 已经是打坐了
    if (UserData.state == 8) {
      e.reply('打坐中...', {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"出去逛逛","list":[{"icon":52,"title":"/万宝楼+类型","desc":"/万宝楼装备"},{"icon":52,"title":"/购买+物品名*数量","desc":"/购买烂铁匕首*1"},{"icon":52,"title":"/售出所有物品","desc":"出售储物袋中所有物品"},{"icon":52,"title":"/售出所有+类型名","desc":"/售出所以武器"},{"icon":74,"title":"/赠送+物品*数量@道友","desc":"/赠送下品灵石*10"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
      return
    }
    // 如果是 闭关 和 降妖
    if (UserData.state == 1 || UserData.state == 2) {
      // 调用计算
      await endAllWord(e, UID, UserData)
    }
    // 没有调用计算,而是其他行为
    const { state, msg } = await GameApi.State.Go(UserData)
    if (state == 4001) {
      e.reply(msg)
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"出去逛逛","list":[{"icon":52,"title":"/万宝楼+类型","desc":"/万宝楼装备"},{"icon":52,"title":"/购买+物品名*数量","desc":"/购买烂铁匕首*1"},{"icon":52,"title":"/售出所有物品","desc":"出售储物袋中所有物品"},{"icon":52,"title":"/售出所有+类型名","desc":"/售出所以武器"},{"icon":74,"title":"/赠送+物品*数量@道友","desc":"/赠送下品灵石*10"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
      return
    }
    // 切换为打坐
    setTimeout(async () => {
      await GameApi.State.set(UID, {
        actionID: 8,
        startTime: new Date().getTime(), // 记录了现在的时间
        endTime: 9999999999999
      })
      e.reply(['开始吐纳灵气...'], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"出去逛逛","list":[{"icon":52,"title":"/万宝楼+类型","desc":"/万宝楼装备"},{"icon":52,"title":"/购买+物品名*数量","desc":"/购买烂铁匕首*1"},{"icon":52,"title":"/售出所有物品","desc":"出售储物袋中所有物品"},{"icon":52,"title":"/售出所有+类型名","desc":"/售出所以武器"},{"icon":74,"title":"/赠送+物品*数量@道友","desc":"/赠送下品灵石*10"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
    }, 2000)
    return
  }

  /**
   * 闭关
   * @param e
   * @returns
   */
  async biguan(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)

    // 已经是闭关了
    if (UserData.state == 1) {
      e.reply('闭关中...', {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"出去逛逛","list":[{"icon":52,"title":"/万宝楼+类型","desc":"/万宝楼装备"},{"icon":52,"title":"/购买+物品名*数量","desc":"/购买烂铁匕首*1"},{"icon":52,"title":"/售出所有物品","desc":"出售储物袋中所有物品"},{"icon":52,"title":"/售出所有+类型名","desc":"/售出所以武器"},{"icon":74,"title":"/赠送+物品*数量@道友","desc":"/赠送下品灵石*10"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
      return
    }
    // 锻体2 聚灵3
    if (UserData.state == 2 || UserData.state == 8) {
      //调用计算
      await endAllWord(e, UID, UserData)
    }
    // 没有调用计算,而是其他行为
    const { state, msg } = await GameApi.State.Go(UserData)
    if (state == 4001) {
      e.reply(msg)
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"出去逛逛","list":[{"icon":52,"title":"/万宝楼+类型","desc":"/万宝楼装备"},{"icon":52,"title":"/购买+物品名*数量","desc":"/购买烂铁匕首*1"},{"icon":52,"title":"/售出所有物品","desc":"出售储物袋中所有物品"},{"icon":52,"title":"/售出所有+类型名","desc":"/售出所以武器"},{"icon":74,"title":"/赠送+物品*数量@道友","desc":"/赠送下品灵石*10"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
      return
    }
    setTimeout(async () => {
      await GameApi.State.set(UID, {
        actionID: 1,
        startTime: new Date().getTime(), // 记录了现在的时间
        endTime: 9999999999999 // 结束时间应该是无限的
      })
      e.reply(['开始两耳不闻窗外事...'], {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"出去逛逛","list":[{"icon":52,"title":"/万宝楼+类型","desc":"/万宝楼装备"},{"icon":52,"title":"/购买+物品名*数量","desc":"/购买烂铁匕首*1"},{"icon":52,"title":"/售出所有物品","desc":"出售储物袋中所有物品"},{"icon":52,"title":"/售出所有+类型名","desc":"/售出所以武器"},{"icon":74,"title":"/赠送+物品*数量@道友","desc":"/赠送下品灵石*10"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
    }, 2000)
    return
  }

  /**
   * 锻体
   * @param e
   * @returns
   */
  async dagong(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (UserData.state == 2) {
      e.reply('锻体中...', {
        quote: e.msg_id
      })
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"出去逛逛","list":[{"icon":52,"title":"/万宝楼+类型","desc":"/万宝楼装备"},{"icon":52,"title":"/购买+物品名*数量","desc":"/购买烂铁匕首*1"},{"icon":52,"title":"/售出所有物品","desc":"出售储物袋中所有物品"},{"icon":52,"title":"/售出所有+类型名","desc":"/售出所以武器"},{"icon":74,"title":"/赠送+物品*数量@道友","desc":"/赠送下品灵石*10"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )

      return
    }
    if (UserData.state == 1 || UserData.state == 8) {
      //调用计算
      await endAllWord(e, UID, UserData)
    }
    // 其他状态
    const { state, msg } = await GameApi.State.Go(UserData)
    if (state == 4001) {
      e.reply(msg)
      postHelp(
        e,
        '[{"group":"战斗","list":[{"icon":21,"title":"/打劫@道友","desc":"若在城里需决斗令"},{"icon":39,"title":"/击杀+怪物名","desc":"随机掉落物品"},{"icon":68,"title":"/探索怪物","desc":"查看所在地的怪物"},{"icon":68,"title":"/战斗过程(开启|关闭)","desc":"默认关闭战斗过程"},{"icon":68,"title":"/挑战妖塔","desc":"刷取渡劫材料"}]},{"group":"出去逛逛","list":[{"icon":52,"title":"/万宝楼+类型","desc":"/万宝楼装备"},{"icon":52,"title":"/购买+物品名*数量","desc":"/购买烂铁匕首*1"},{"icon":52,"title":"/售出所有物品","desc":"出售储物袋中所有物品"},{"icon":52,"title":"/售出所有+类型名","desc":"/售出所以武器"},{"icon":74,"title":"/赠送+物品*数量@道友","desc":"/赠送下品灵石*10"}]},{"group":"其它","list":[{"icon":16,"title":"/战斗帮助","desc":"战斗系统"},{"icon":16,"title":"/地图帮助","desc":"地图系统"},{"icon":16,"title":"/联盟帮助","desc":"联盟系统"},{"icon":8,"title":"/黑市帮助","desc":"交易系统"},{"icon":16,"title":"/修炼帮助","desc":"修炼系统"},{"icon":16,"title":"/职业帮助","desc":"职业系统"},{"icon":16,"title":"/势力帮助","desc":"势力系统"}]}]'
      )
      return
    }
    setTimeout(async () => {
      await GameApi.State.set(UID, {
        actionID: 2,
        startTime: new Date().getTime(), // 记录了现在的时间
        endTime: 9999999999999
      })
      e.reply(['开始爬山越岭,负重前行...'], {
        quote: e.msg_id
      })
    }, 2000)
    return
  }

  async endWork(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    await endAllWord(e, UID, UserData)
    if (e.platform == 'ntqq') {
      Controllers(e).Message.reply(
        '',
        [
          { label: '探索怪物', value: '/探索怪物' },
          { label: '突破', value: '/突破' },
          { label: '破境', value: '/破境' }
        ],
        [
          { label: '地图', value: '/地图' },
          { label: '控制板', value: '/控制板' }
        ]
      )
    }
    return
  }
}
