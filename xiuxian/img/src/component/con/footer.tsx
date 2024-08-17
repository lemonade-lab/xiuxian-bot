import React from 'react'
export default ({
  list = [
    '/突破',
    '/闭关',
    '/出关',
    '/打坐',
    '/聚灵',
    '/纳戒',
    '/本命',
    '/打劫@道友',
    '/双修@道友',
    '/比斗@道友',
    '/探索怪物',
    '/释放神识',
    '/储物袋',
    '/学习+功法名',
    '/服用+丹药名',
    '/装备+装备名'
  ],
  docs = '新手指引：闭关提升修为，打怪可得丰富资源，采集灵矿获得大量灵石，也可通过灵石辅助修炼'
}: {
  list?: string[]
  docs?: string
}) => {
  return (
    <div className="p-4  text-white   pt-8 pr-4 pb-4 pl-4   relative">
      <div className=" bg-[var(--bg-color)] shadow-md   rounded-md p-1 relative flex flex-wrap box-help-box">
        <div className=" px-2 py-1 rounded-t-lg text-lg bg-slate-400 absolute top-[-36px] flex left-[12px]  shadow-md">
          /修仙帮助
        </div>
        {
          // 展示其他指令，最好能带解释
        }
        {list.map((item, index) => (
          <div
            key={index}
            className="bg-[#f9f2f2de] my-1 shadow-md text-[#635b5bfa] rounded-md text-md px-2 py-1 mx-1"
          >
            {item}
          </div>
        ))}
        {docs && (
          <div className="bg-[#f9f2f2de] my-1 w-full shadow-md text-[#635b5bfa] rounded-md text-md px-2 py-1 mx-1">
            {docs}
          </div>
        )}
      </div>
    </div>
  )
}
