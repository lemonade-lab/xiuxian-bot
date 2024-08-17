import React from 'react'
import { dirname } from 'path'
import { createRequire, defineConfig } from 'react-puppeteer'
import * as Component from './xiuxian/img/src/component/index.js'

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

export default defineConfig([
  {
    url: '/BagComponent',
    options: {
      ...options,
      // body 内容
      html_body: (
        <Component.BagComponent
          theme={'dark'}
          data={{
            UID: '测试',
            avatar:
              'https://pics3.baidu.com/feed/b8389b504fc2d562d417d89c9917eae176c66cbc.jpeg@f_auto?token=cb1b616daecae01ebacf0f2b68fc75d9',
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
    url: '/Defsetcomponent',
    options: {
      ...options,
      // body 内容
      html_body: <Component.Defsetcomponent theme={'dark'} data={{}} />
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
          data={{
            UID: '测试',
            avatar:
              'https://pics3.baidu.com/feed/b8389b504fc2d562d417d89c9917eae176c66cbc.jpeg@f_auto?token=cb1b616daecae01ebacf0f2b68fc75d9',
            battle_attack: 9999,
            battle_critical_damage: 9999,
            battle_blood_limit: 9999,
            battle_critical_hit: 9999,
            battle_defense: 9999,
            battle_power: 9999,
            battle_speed: 9999,
            equipment: [],
            fate: []
          }}
        />
      )
    }
  },
  {
    url: '/HelpComponent',
    options: {
      ...options,
      // body 内容
      html_body: <Component.HelpComponent theme={'dark'} data={{}} />
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
          data={{
            UID: '测试',
            age: '测试',
            age_limit: '测试',
            autograph: '测试',
            avatar:
              'https://pics3.baidu.com/feed/b8389b504fc2d562d417d89c9917eae176c66cbc.jpeg@f_auto?token=cb1b616daecae01ebacf0f2b68fc75d9',
            battle_blood_limit: '测试',
            battle_blood_now: 9999,
            battle_power: 9999,
            level: {
              bodypractice: {
                Experience: 9999,
                ExperienceLimit: 9999,
                Name: '测试'
              },
              gaspractice: {
                Experience: 9999,
                ExperienceLimit: 9999,
                Name: '测试'
              },
              soul: {
                Experience: 9999,
                ExperienceLimit: 9999,
                Name: '测试'
              }
            },
            linggenName: '测试',
            name: '测试',
            skills: [],
            special_prestige: 9999,
            special_reputation: 9999,
            special_spiritual: '',
            special_spiritual_limit: '测试',
            talent: [],
            talent_show: 9999,
            talentsize: '',
            theme: 'dark'
          }}
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
              'https://pics3.baidu.com/feed/b8389b504fc2d562d417d89c9917eae176c66cbc.jpeg@f_auto?token=cb1b616daecae01ebacf0f2b68fc75d9',
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
              'https://pics3.baidu.com/feed/b8389b504fc2d562d417d89c9917eae176c66cbc.jpeg@f_auto?token=cb1b616daecae01ebacf0f2b68fc75d9',
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
