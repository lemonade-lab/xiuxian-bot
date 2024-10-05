import { getHash as hash } from 'chat-space'
import React from 'react'
import { ThemesEmun } from '../core/index.js'
import ListTable from './con/ListTable.js'
import { killInformationType } from '@xiuxian/statistics/index'

type PropsType = {
  data: killInformationType
  theme?: ThemesEmun
}

export default function App({ data, theme }: PropsType) {
  return (
    <ListTable data={data} theme={theme}>
      {item => (
        <div className="flex-1 flex  flex-col justify-center  text-white px-8">
          <div className="flex  flex-col">
            <div className="  text-2xl p-[5px]   ">
              {item.id}#{isNaN(Number(item.UID)) ? hash(item.UID) : item.UID}
            </div>
            <div className="  text-2xl  p-[5px]">道号: {item.lifeName}</div>
            <div className="  text-2xl p-[5px]">煞气: {item.prestige}</div>
            <div className="  text-2xl  p-[5px]">战力: {item.power}</div>
          </div>
        </div>
      )}
    </ListTable>
  )
}
