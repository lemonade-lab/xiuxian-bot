import React from 'react'
import { ThemesEmun } from '../core'
import { ShowSkyType } from 'xiuxian-statistics'
import ListTable from './con/ListTable'
type PropsType = {
  data: ShowSkyType
  theme?: ThemesEmun
}
export default function App({ data, theme }: PropsType) {
  return (
    <>
      <ListTable data={data} theme={theme}>
        {item => (
          <div className="flex-1 flex  flex-col justify-center  text-white px-8">
            <div className="flex  flex-col">
              <div className="  text-2xl  p-[5px]">道号: {item?.name}</div>
              <div className=" text-2xl  p-[5px]">排名: {item?.id}</div>
              <div className="  text-2xl  p-[5px]">战力: {item?.power}</div>
            </div>
          </div>
        )}
      </ListTable>
    </>
  )
}
