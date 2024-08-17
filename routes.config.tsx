import React from 'react'
import { join } from 'path'
import { defineConfig } from 'react-puppeteer'
import { readFileSync } from 'fs'
import { PictureOptions, Component } from 'xiuxian-img'
import {
  personalInformation,
  backpackInformation,
  equipmentInformation
} from 'xiuxian-statistics'
import { Goods, Cooling } from 'xiuxian-core'

const UID = '3230607280'
const e = {
  user_id: '3230607280',
  user_avatar:
    'http://thirdqq.qlogo.cn/g?b=oidb&k=Gc4MLAaGWH3cV3Fxg9vTqQ&kti=ZJ2Q5gAAAAA&s=0&t=1687682796'
}

export default defineConfig([
  {
    url: '/BagComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: (
        <Component.BagComponent
          theme={'dark'}
          data={await backpackInformation(
            e.user_id,
            e.user_avatar,
            Goods.mapType['道具']
          )}
        />
      )
    }
  },
  {
    url: '/Defsetcomponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: <Component.Defsetcomponent theme={'dark'} data={Cooling} />
    }
  },
  {
    url: '/Equipmentcomponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: (
        <Component.Equipmentcomponent
          theme={'dark'}
          data={await equipmentInformation(UID, e.user_avatar)}
        />
      )
    }
  },
  {
    url: '/HelpComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: (
        <Component.HelpComponent
          theme={'dark'}
          data={JSON.parse(
            readFileSync(
              join(process.cwd(), 'public', 'defset', 'base_help.json'),
              'utf-8'
            )
          )}
        />
      )
    }
  },
  {
    url: '/InformationComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: <Component.InformationComponent theme={'dark'} data={{}} />
    }
  },
  {
    url: '/KillComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: <Component.KillComponent theme={'dark'} data={{}} />
    }
  },
  {
    url: '/ListComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: <Component.ListComponent theme={'dark'} data={{}} />
    }
  },
  {
    url: '/MessageComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: (
        <Component.MessageComponent
          theme={'dark'}
          data={await personalInformation(UID, e.user_avatar)}
        />
      )
    }
  },
  {
    url: '/RingComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: (
        <Component.RingComponent
          theme={'dark'}
          data={{
            UID: '测试',
            avatar:
              'http://thirdqq.qlogo.cn/g?b=oidb&k=Gc4MLAaGWH3cV3Fxg9vTqQ&kti=ZJ2Q5gAAAAA&s=0&t=1687682796',
            bag: [],
            bag_grade: 9999,
            length: 9999,
            name: '测试'
          }}
        />
      )
    }
  },
  {
    url: '/SkillsComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: (
        <Component.SkillsComponent
          theme={'dark'}
          data={{
            UID: '测试',
            avatar:
              'http://thirdqq.qlogo.cn/g?b=oidb&k=Gc4MLAaGWH3cV3Fxg9vTqQ&kti=ZJ2Q5gAAAAA&s=0&t=1687682796',
            linggenName: '测试',
            name: '测试',
            skills: [],
            talentsize: '测试'
          }}
        />
      )
    }
  },
  {
    url: '/SkyComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: <Component.SkyComponent theme={'dark'} data={[]} />
    }
  }
])
