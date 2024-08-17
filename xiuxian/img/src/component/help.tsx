import React from 'react'
import { createRequire, BackgroundImage } from 'react-puppeteer'
import { ThemesEmun } from '../core'

const require = createRequire(import.meta.url)

type PropsType = {
  data: any
  theme?: ThemesEmun
}

export default function App({ data, theme }: PropsType) {
  return (
    <div
      id="root"
      data-theme={theme}
      // style={{ backgroundImage: 'var(--background-image)' }}
    >
      <BackgroundImage url={require('../../../../public/img/equipment.jpg')}>
        <div className="text-2xl text-center text-white relative pl-4 shadow-lg mt-4 font-semibold">
          官网{' '}
          <span className="text-lg text-yellow-300 inline-block px-3 font-semibold">
            {'http://xiuxian.uk/'}
          </span>
        </div>
        <div className="text-2xl text-center text-white relative pl-4 shadow-lg mt-4 font-semibold">
          官群{' '}
          <span className="text-lg text-yellow-300 inline-block px-3 font-semibold">
            744893244
          </span>
        </div>
        {data.map(val => (
          <div
            key={val.group}
            className="rounded-md mb-5 ml-10 mr-10 px-4 py-1 overflow-hidden shadow-md relative bg-black bg-opacity-60"
          >
            <div className="text-white text-lg font-bold pt-2 pb-1 pl-10">
              {val.group}
            </div>
            <div
              className="text-center border-collapse overflow-hidden w-full bg-white rounded-b-lg mt-5 ml-0 mr-0 mb-0 py-2 px-3"
              style={{
                margin: '5px -10px -10px -15px'
              }}
            >
              <div className="tr">
                {val.list.map(item => (
                  <div key={item.title} className="td">
                    <span
                      className={`w-10 h-10 block absolute rounded-md left-1/6 top-3 transform scale-85 bg-contain`}
                    ></span>
                    <strong className="block pl-6 text-white text-base leading-6">
                      {item.title}
                    </strong>
                    <span className="block pl-6 text-white text-xs leading-4">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </BackgroundImage>
    </div>
  )
}
