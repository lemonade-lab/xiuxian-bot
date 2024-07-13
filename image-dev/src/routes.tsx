import React from 'react'
import { readFileSync } from 'fs'
import { join } from 'path'
import { importPath } from 'alemonjs'
import { Goods } from 'xiuxian-core'

import { backpackInformation, personalInformation } from 'xiuxian-statistics'

import {
  MessageComponent,
  HelpComponent,
  BagComponent
} from 'xiuxian-component'

const uid = '13348342918169126729'
const data = await personalInformation(uid, '')
const app = importPath(import.meta.url)
const dir = app.cwd()

function getJson(name: string) {
  return JSON.parse(
    readFileSync(join(dir, 'public', 'defset', `${name}.json`), 'utf-8')
  )
}

//
const helpDAta = getJson('base_help')

const bagDAta = await backpackInformation(uid, '', Goods.mapType['道具'])

export const routes = [
  {
    url: '/message',
    element: <MessageComponent data={data} />
  },
  {
    url: '/help',
    element: <HelpComponent data={helpDAta} />
  },
  {
    url: '/bag',
    element: <BagComponent data={bagDAta} />
  }
]
