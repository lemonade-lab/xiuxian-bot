import React from 'react'
import { ShowSkyType } from '@xiuxian/statistics/index'
import ListTable from './con/ListTable.js'
import css_output from './XSky.scss'
import { LinkStyleSheet } from 'jsxp'
import { ThemesEmun } from './con/ThemeBackground.js'
//
type PropsType = {
  data: ShowSkyType
  theme?: ThemesEmun
}

export default function App({ data, theme }: PropsType) {
  return (
    <html>
      <head>
        <LinkStyleSheet src={css_output} />
      </head>
      <body>
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
      </body>
    </html>
  )
}
