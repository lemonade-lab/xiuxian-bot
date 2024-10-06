import React from 'react'
import { BackgroundImage } from 'jsxp'
import { ThemesEmun } from './ThemeBackground.js'
import Header from './header.js'
import img_information from '@src/assets/img/information.jpg'
import img_left from '@src/assets/img/left.jpg'
import img_right from '@src/assets/img/right.jpg'
export default function ListTable<
  T extends {
    UserAvatar: string
    autograph?: string
    // 其他可能的属性
  }
>({
  data,
  theme,
  children
}: {
  data: T[]
  children: (props: T) => React.ReactNode
  theme: ThemesEmun
}) {
  return (
    <BackgroundImage
      id="root"
      data-theme={theme}
      className="w-full"
      url={img_information}
    >
      <div className="p-4">
        <Header list={['/通天塔', '/杀神榜']} />
      </div>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col ">
          {
            // 人物信息
          }
          <BackgroundImage className="flex" url={img_left} size={'100% 100%'}>
            {children(item)}
            <div className="size-80">
              <BackgroundImage
                className="flex w-full  h-full"
                size={'100% 100%'}
                url={img_right}
              >
                <img
                  className="rounded-full size-48 m-auto"
                  src={item.UserAvatar}
                />
              </BackgroundImage>
            </div>
          </BackgroundImage>
          {
            // 个性签名
          }
          {item?.autograph && (
            <div className="w-full  px-8 text-white text-2xl">
              <div className="pb-5    ">
                <div className="bg-black rounded-t-xl bg-opacity-40 p-3">
                  {'[修心道宣]'}
                </div>
                <div className="bg-black rounded-b-xl   bg-opacity-20  p-3">
                  {item.autograph}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="min-h-10"></div>
    </BackgroundImage>
  )
}
