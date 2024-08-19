import { Messages } from 'alemonjs'
import { isThereAUserPresent, controlByName } from 'xiuxian-api'
import { user } from 'xiuxian-db'
/**
 * 职业经验够了之后
 * 需要前往协会交付灵石来考核
 * 考核也就是造出一定等级的装备
 * 成功则颁发徽章
 * 失败则重新考核
 * 所有人默认没有职业
 * 可以前往协会领取职业徽章
 * 筑基期就可以领取职业
 * 领取职业后不可洗根
 * 拥有多灵根可领取的职业更多
 * 同时灵根变异可对炼丹有加成
 * 灵根多，加成的下降
 */
export default new Messages().response(/^(#|\/)?协会$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)
  if (!(await controlByName(e, UserData, '协会'))) return
  e.reply([
    '[协会执事]😳叶子凡\n',
    '欢迎来到修仙协会\n',
    '化神境之后,可交付灵石获得学徒身份\n',
    '当前可领取[/炼器师学徒]'
  ])
})
