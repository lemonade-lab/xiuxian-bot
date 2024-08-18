import React from 'react'
import { createRequire, BackgroundImage } from 'react-puppeteer'
import { ThemesEmun } from '../../core'
const require = createRequire(import.meta.url)
export default <
  T extends {
    user_avatar: string
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
}) => {
  return (
    <div id="root" data-theme={theme}>
      <BackgroundImage
        className="w-full"
        url={require('../../../../../public/img/information.jpg')}
      >
        <div className="min-h-10"></div>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col my-8">
            {
              // 人物信息
            }
            <BackgroundImage
              className="flex"
              url={require('../../../../../public/img/left.jpg')}
              size={'100% 100%'}
            >
              {children(item)}
              <div className="size-80">
                <BackgroundImage
                  className="flex w-full  h-full"
                  size={'100% 100%'}
                  url={require('../../../../../public/img/right.jpg')}
                >
                  <img
                    className="rounded-full size-48 m-auto"
                    src={item.user_avatar}
                  />
                </BackgroundImage>
              </div>
            </BackgroundImage>
            {
              // 个性签名
            }
            {item?.autograph && (
              <div className="w-full my-8 px-8 text-white text-2xl">
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
    </div>
  )
}
