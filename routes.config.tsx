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
  showSky,
  skillInformation
} from 'xiuxian-statistics'
import { Goods, Cooling } from 'xiuxian-core'
import { ass, ass_typing, user_ass } from 'xiuxian-db'

const e = {
  UserId: '563384AF707685C9A82DA5DDFAF96D8A',
  UserAvatar:
    'http://thirdqq.qlogo.cn/g?b=oidb&k=Gc4MLAaGWH3cV3Fxg9vTqQ&kti=ZJ2Q5gAAAAA&s=0&t=1687682796'
}

export default defineConfig([
  {
    url: '/AssMessage',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: (
        <Component.AssMessage
          theme={'dark'}
          data={await user_ass
            .findAll({
              include: [
                {
                  model: ass,
                  include: [
                    {
                      model: ass_typing
                    }
                  ]
                }
              ]
            })
            .then(res => res.map(item => item.dataValues))}
        />
      )
    }
  },
  {
    url: '/BagComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: (
        <Component.BagComponent
          theme={'dark'}
          data={await backpackInformation(
            e.UserId,
            e.UserAvatar,
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
          data={await equipmentInformation(e.UserId, e.UserAvatar)}
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
    url: '/UpdateComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: (
        <Component.UpdateComponent
          theme={'dark'}
          data={JSON.parse(
            readFileSync(
              join(process.cwd(), 'public', 'defset', 'update.json'),
              'utf-8'
            )
          )}
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
          data={await skillInformation(e.UserId, e.UserAvatar)}
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
          data={await personalInformation(e.UserId, e.UserAvatar)}
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
        <Component.SkyComponent theme={'dark'} data={await showSky(e.UserId)} />
      )
    }
  }
])
