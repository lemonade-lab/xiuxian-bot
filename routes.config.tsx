import React from 'react'
import { dirname, join } from 'path'
import { createRequire, defineConfig } from 'react-puppeteer'
import * as Component from './xiuxian/img/src/component/index.js'
import * as Cooling from './xiuxian/core/config/cooling.js'
import { readFileSync } from 'fs'
import {
  personalInformation,
  backpackInformation,
  equipmentInformation
} from 'xiuxian-statistics'

const require = createRequire(import.meta.url)

const options = {
  // 别名
  file_paths: {
    // 定位自身的 md文件，并获取目录地址
    '@xiuxian': dirname(require('./README.md'))
  },
  // 别名资源
  html_files: [require('./public/css/root.css')],
  // 头部插入其他资源（ 数组或字符串）
  html_head: <link rel="stylesheet" href={require('./public/output.css')} />
}

const UID = '3230607280'

const e = {
  user_id: '3230607280',
  user_avatar:
    'http://thirdqq.qlogo.cn/g?b=oidb&k=Gc4MLAaGWH3cV3Fxg9vTqQ&kti=ZJ2Q5gAAAAA&s=0&t=1687682796'
}
import { Goods } from 'xiuxian-core'

export default defineConfig([
  {
    url: '/BagComponent',
    options: {
      ...options,
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
      ...options,
      // body 内容
      html_body: <Component.Defsetcomponent theme={'dark'} data={Cooling} />
    }
  },
  {
    url: '/Equipmentcomponent',
    options: {
      ...options,
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
      ...options,
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
      ...options,
      // body 内容
      html_body: <Component.InformationComponent theme={'dark'} data={{}} />
    }
  },
  {
    url: '/KillComponent',
    options: {
      ...options,
      // body 内容
      html_body: <Component.KillComponent theme={'dark'} data={{}} />
    }
  },
  {
    url: '/ListComponent',
    options: {
      ...options,
      // body 内容
      html_body: <Component.ListComponent theme={'dark'} data={{}} />
    }
  },
  {
    url: '/MessageComponent',
    options: {
      ...options,
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
      ...options,
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
      ...options,
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
      ...options,
      // body 内容
      html_body: <Component.SkyComponent theme={'dark'} data={[]} />
    }
  }
])
