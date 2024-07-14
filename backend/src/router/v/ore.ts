import koaRouter from 'koa-router'

import { Bag, Method, Users } from 'xiuxian-core'

import * as GameApi from 'xiuxian-core'

import { State } from 'xiuxian-core'

import { ERROE_CODE, OK_CODE } from '../../config/ajax'
import { user } from 'xiuxian-db'
const router = new koaRouter({ prefix: '/api/v1/ore' })

router.get('/1', async ctx => {
  console.log(1)
  ctx.body = {
    code: 'ERROR_CODE',
    msg: '查询错误',
    data: null
  }
  return
})

// /**
//  * 开采灵矿
//  */
// router.post("/gather",async ctx=>{
//     console.log(1);
//     const UID = ctx.state.user.uid
//     const UserData = await user.findOne({
//         where:{
//             uid:UID
//         }
//     }) as any
//     console.log(2);

//     //判断用户是否存在
//     if (!UserData) {
//       ctx.body = {
//         code: 'ERROR_CODE',
//         msg: '查询错误',
//         data: null
//       }
//       return
//     }
//     console.log(3);
//     const { msg1 }=ctx.request.body as any
//     console.log(4);
//     const [id, size] = msg1.replace(/^(#|\/)?采集/, '').split('*')
//     console.log();

//     // 看看境界
//     const gaspractice = await GameApi.Levels.read(UID, 1).then(
//       item => item.realm
//     )

//     const acount = Number(
//       size == '' || size == undefined || gaspractice < 25 || Number(size) > 2
//         ? 1
//         : size
//     )

//     // 检查
//     if (!(await GameApi.Bag.searchBagByName(UID, '开灵铲', acount))) {
//      ctx.body = {
//         code: 'OK_CODE',
//         msg: `开灵铲不足${acount}个`,
//         data: null
//       }
//       return
//     }

//     // 冷却检查
//     const CDID = 22
//     const falg=false;
//     const { state,msg} = await Burial.cooling(UID, CDID)
//     if (state == 4001) {
//         ctx.body = {
//         code: 'OK_CODE',
//         msg: msg,
//         data: null
//       }
//         return
//     }

//     //杀死npc
//     if (!killNPC(id, UID, UserData.special_prestige)){
//         ctx.body = {
//         code: 'OK_CODE',
//         msg: "守卫击破了你的防御\n你重伤倒地,奄奄一息",
//         data: null
//       }
//       return
//     }

//     // 得到灵矿
//     const explore = await GameApi.explore.explorecache(UserData.point_type)

//     const ep = explore[id]

//     // 是否在城里 是否存在  是否充足
//     if (UserData.pont_attribute == 1 || !ep || ep.acount < 1) {
//         ctx.body = {
//         code: 'OK_CODE',
//         msg: `这里没有[${id}],去别处看看吧`,
//         data: null
//       }
//       return
//     }

//     // 灵力不足
//     if (UserData.special_spiritual <= ep.spiritual * acount) {
//         ctx.body = {
//         code: 'OK_CODE',
//         msg: `灵力不足${ep.spiritual * acount}`,
//         data: null
//       }
//       return
//     }
//     // 减少灵矿
//     await GameApi.explore.reduce(UserData.point_type, id, acount)

//     // 减少铲子
//     await GameApi.Bag.reduceBagThing(UID, [
//       {
//         name: '开灵铲',
//         acount: 1 * acount
//       }
//     ])

//      // 得到该灵矿的数据
//     const name = `${getMoneyGrade(ep.grade)}灵石`
//     // 增加物品
//     await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
//       {
//         name: name,
//         acount: ep.money * acount
//       }
//     ])

//     // 减少灵力 保存灵力信息
//     await GameApi.Users.update(UID, {
//       special_spiritual: UserData.special_spiritual - ep.spiritual * acount
//     } as DB.UserType)

//     // 设置冷却
//     GameApi.Burial.set(UID, CDID, GameApi.Cooling.CD_Mine)

//     //
//     ctx.body = {
//         code: 'OK_CODE',
//         msg: `采得[${name}]*${ep.money * acount}`,
//         data: null
//       }
//     return
// })

/**
 * 探索灵矿
 */
router.get('/search', async ctx => {
  const UID = ctx.state.user.uid
  const UserData = (await user.findOne({
    where: {
      uid: UID
    }
  })) as any
  //判断用户是否存在
  if (!UserData) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '查询错误',
      data: null
    }
    return
  }
  //判断血量
  const { state } = await State.goByBlood(UserData)
  if (state == 4001) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '血量不足',
      data: null
    }
    return
  }
  //判断位置
  if (UserData.pont_attribute == 1) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '[城主府]巡逻军:\n城内切莫释放神识!',
      data: null
    }
    return
  }
  //得到位置名
  const name = await GameApi.Map.getPlaceName(
    UserData.point_type,
    UserData.pont_attribute
  )
  // 消息
  const msg: string[] = [`[${name}]的灵矿`]
  // 得到灵矿
  const explore = await GameApi.explore.explorecache(UserData.point_type)
  for (const item in explore) {
    msg.push(
      `\n🔹标记:${item}(${getMoneyGrade(explore[item].grade)}灵矿)*${
        explore[item].acount
      }`
    )
  }
  ctx.body = {
    code: OK_CODE,
    msg: msg,
    data: null
  }
})

function getMoneyGrade(grade: number) {
  if (grade == 1) return '下品'
  if (grade == 2) return '中品'
  if (grade == 3) return '上品'
  if (grade == 4) return '极品'
}

const npcName = [
  '巡逻军',
  '城主',
  '柠檬冲水',
  '百里寻晴',
  '联盟',
  '修仙联盟',
  '联盟商会',
  '玄玉天宫',
  '玉贞子',
  '玉炎子',
  '天机门',
  '东方无极'
]

async function killNPC(Mname: string, UID: string, prestige: number) {
  if (!npcName.find(item => Mname.includes(item))) return true

  await Users.update(UID, {
    battle_blood_now: 0
  })

  // 不触发
  if (!Method.isTrueInRange(1, 100, Math.floor(prestige + 10))) {
    return false
  }

  // 随机去掉一个物品
  await Bag.delThing(UID)
  return false
}

export default router
