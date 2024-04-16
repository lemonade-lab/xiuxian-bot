import { APlugin, Controllers, type AEvent } from 'alemonjs'
import {
  DB,
  isThereAUserPresent,
  GameApi,
  controlByName,
  sendReply
} from '../../api/index.js'
export class Dice extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(万花坊|萬花坊)$/, fnc: 'userDice' },
        {
          reg: /^(#|\/)?(命运转盘|命運轉盤)[\u4e00-\u9fa5]+\*\d+$$/,
          fnc: 'wheelDestiny'
        }
      ]
    })
  }

  /**
   * 万花坊
   * @param e
   * @returns
   */
  async userDice(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '万花坊'))) return
    const start_msg = []
    start_msg.push('\n[/命运转盘+物品名*数量]')
    const commoditiesList: DB.GoodsType[] = (await DB.goods.findAll({
      where: {
        wheeldisc: 1
      },
      raw: true
    })) as any
    const end_msg = GameApi.Goods.getListMsg(commoditiesList)
    const msg: string[] = [...start_msg, ...end_msg]
    sendReply(e, '___[万花坊]___', msg)
    Controllers(e).Message.reply('', [
      {
        label: '转盘',
        value: '/命运转盘'
      },
      {
        label: '控制板',
        value: '/控制板'
      }
    ])
    return
  }

  /**
   * 命运转盘
   * @param e
   * @returns
   */
  async wheelDestiny(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '万花坊'))) return
    const thingName = e.msg.replace(/^(#|\/)?(命运转盘|命運轉盤)/, '')
    const [NAME, ACCOUNT] = thingName.split('*')
    const FindData: DB.GoodsType = (await DB.goods.findOne({
      where: {
        wheeldisc: 1,
        name: NAME
      },
      raw: true
    })) as any
    if (!FindData) {
      e.reply('[万花坊]千变子\n此物品不可为也')

      return
    }
    const goods = await GameApi.Bag.searchBagByName(UID, NAME)
    if (!goods || goods.acount < Number(ACCOUNT)) {
      e.reply([`\n似乎没有[${NAME}]*${ACCOUNT}`], {
        quote: e.msg_id
      })

      return
    }
    const LevelData = await GameApi.Levels.read(UID, 1)
    if (!LevelData) {
      return
    }
    if (LevelData.realm < 1) {
      e.reply('[万花坊]千变\nn凡人不可捷越')
      return
    }
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })

      return
    }
    // 扣除
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: NAME,
        acount: Number(ACCOUNT)
      }
    ])
    if (!GameApi.Method.isTrueInRange(1, 100, 30)) {
      e.reply('[万花坊]千变\n一无所获')

      return
    }
    // 随机物品
    const randomthing = await GameApi.Goods.getRandomThing({
      wheeldisc: 1
    })
    if (!randomthing) {
      e.reply('随机物品错误', {
        quote: e.msg_id
      })
      return
    }
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: randomthing.name,
        acount: Number(ACCOUNT)
      }
    ])
    e.reply(`[万花坊]千变子\n${NAME}成功转化为${randomthing.name}`)
    return
  }
}
