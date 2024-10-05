import React from 'react'
import { defineConfig } from 'react-puppeteer'
import { PictureOptions, Component } from '@xiuxian/img/index'
import {
  personalInformation,
  backpackInformation,
  equipmentInformation,
  getKillList,
  showSky,
  skillInformation
} from '@xiuxian/statistics/index.ts'
import { Goods, Cooling } from '@xiuxian/core/index.ts'
import { ass, ass_typing, user_ass } from '@xiuxian/db/index'
import update_josn from '@public/defset/update.json'
import json_base_help from '@public/defset/base_help.json'
import e from '@public/defset/user.json'
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
            .then(res => res.map(item => item?.dataValues))}
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
        <Component.HelpComponent theme={'dark'} data={json_base_help as any} />
      )
    }
  },
  {
    url: '/UpdateComponent',
    options: {
      ...PictureOptions,
      // body 内容
      html_body: <Component.UpdateComponent theme={'dark'} data={update_josn} />
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
