import React from 'react'
import { join } from 'path'
import { defineConfig } from 'react-puppeteer'
import { readFileSync } from 'fs'
import { PictureOptions, Component } from 'xiuxian-img'
import {
  personalInformation,
  backpackInformation,
  equipmentInformation,
  getKillList,
  showSky
} from 'xiuxian-statistics'
import { Goods, Cooling } from 'xiuxian-core'

const e = {
  user_id: '563384AF707685C9A82DA5DDFAF96D8A',
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
          data={await equipmentInformation(e.user_id, e.user_avatar)}
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
    url: '/KillComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: (
        <Component.KillComponent theme={'dark'} data={await getKillList()} />
      )
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
          data={await personalInformation(e.user_id, e.user_avatar)}
        />
      )
    }
  },
  {
    url: '/SkyComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: (
        <Component.SkyComponent
          theme={'dark'}
          data={await showSky(e.user_id, e.user_avatar)}
        />
      )
    }
  }
])
