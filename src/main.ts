import { Player } from '@xiuxian/core'
import {
  user,
  user_bag,
  user_bag_message,
  user_equipment,
  user_fate,
  user_level,
  user_ring,
  user_skills
} from '@xiuxian/db'
import {
  user as DCUser,
  user_bag as DCUserBag,
  user_ring as DCUserRing,
  user_equipment as DCUserEquipment,
  user_level as DCUserLevel,
  user_fate as DCUserFate,
  user_skills as DCUserSkills
} from '@xiuxian/db-dc'

/**
 * 恢复数据
 * @param uid
 */
const update = async (uid: string) => {
  let bag_grade = 1

  // 用户数据
  await DCUser.findOne({
    where: {
      uid: uid
    }
  })
    .then(data => data.dataValues)
    .then(async data => {
      console.log('DCUser data', data)

      bag_grade = data.bag_grade

      // 恢复
      await user.update(
        {
          name: data.name,
          // 恢复
          autograph: data.autograph,
          // 声望
          special_reputation: data.special_reputation,
          // 煞气
          special_prestige: data.special_prestige,
          // 灵力
          special_spiritual: data.special_spiritual,
          // 灵力上限
          special_spiritual_limit: data.special_spiritual_limit,
          // 功德
          special_virtues: data.special_virtues,
          // 是否显示灵根
          talent_show: data.talent_show,
          //
          talent: data.talent,
          //
          talent_size: data.talent_size
        },
        {
          where: {
            uid: uid
          }
        }
      )

      //
    })
    .catch(err => {
      console.error('err', err)
    })

  // 恢复基础数据
  await DCUserBag.findAll({
    where: {
      uid: uid
    }
  })
    .then(data => data.map(item => item.dataValues))
    .then(data => {
      //
      console.log('DCUserBag data', data)
      //
      data.forEach(item => {
        user_bag.create({
          uid: uid,
          name: item.name,
          acount: item.acount,
          tid: item.tid,
          type: item.type
        })
        //
      })
      // 恢复
    })
    .catch(err => {
      console.error('err', err)
    })

  // ....
  await DCUserRing.findAll({
    where: {
      uid: uid
    }
  })
    .then(data => data.map(item => item.dataValues))
    .then(data => {
      console.log('DCUserRing data', data)
      data.forEach(item => {
        user_ring.create({
          uid: uid,
          name: item.name,
          acount: item.acount,
          tid: item.tid,
          type: item.type
        })
        //
      })
    })
    .catch(err => {
      console.error('err', err)
    })

  // 恢复装备
  await DCUserEquipment.findAll({
    where: {
      uid: uid
    }
  })
    .then(data => data.map(item => item.dataValues))
    .then(data => {
      console.log('DCUserEquipment data', data)
      data.forEach(item => {
        user_equipment.create({
          uid: uid,
          name: item.name
        })
        //
      })
    })
    .catch(err => {
      console.error('err', err)
    })

  // 恢复境界
  await DCUserLevel.findAll({
    where: {
      uid: uid
    }
  })
    .then(data => data.map(item => item.dataValues))
    .then(data => {
      console.log('DCUserLevel data', data)
      data.forEach(item => {
        user_level.update(
          {
            career: item.career,
            addition: item.addition,
            realm: item.realm,
            experience: item.experience
          },
          {
            where: {
              uid: uid,
              type: item.type
            }
          }
        )
      })
    })
    .catch(err => {
      console.error('err', err)
    })

  // 本命数据
  await DCUserFate.findOne({
    where: {
      uid: uid
    }
  })
    .then(data => data.dataValues)
    .then(data => {
      console.log('DCUserFate data', data)
      user_fate.create({
        uid: uid,
        name: data.name,
        grade: data.grade
      })
    })
    .catch(err => {
      console.error('err', err)
    })

  // 恢复功法
  await DCUserSkills.findAll({
    where: {
      uid: uid
    }
  })
    .then(data => data.map(item => item.dataValues))
    .then(data => {
      console.log('DCUserSkills data', data)
      data.forEach(item => {
        user_skills.create({
          uid: uid,
          name: item.name
        })
      })
    })
    .catch(err => {
      console.error('err', err)
    })

  await user_bag_message.update(
    {
      grade: bag_grade
    },
    {
      where: {
        uid: uid
      }
    }
  )
}

/**
 *
 */
export function main(UID: string) {
  console.log('重生', UID)
  Player.updatePlayer(UID, '')
    .then(() => {
      console.log('重生成功')
      setTimeout(() => {
        update(UID)
      }, 3000)
    })
    .catch(err => {
      console.error('err', err)
    })
}
