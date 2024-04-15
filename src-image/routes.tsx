import React from 'react'
import { personalInformation } from '../src/server/information.ts'
import MessageComponent from '../src/component/message.tsx'
import HelpComponent from '../src/component/help.tsx'
import { readFileSync } from 'fs'
import { join } from 'path'
import { importPath } from 'alemonjs'
const uid = '13348342918169126729'
const data = await personalInformation(uid, '')
const app = importPath(import.meta.url)
const dir = app.cwd()

function getJson(name: string) {
  return JSON.parse(
    readFileSync(join(dir, 'public', 'defset', `${name}.json`), 'utf-8')
  )
}
const helpDAta = getJson('base_help')

export const routes = [
  {
    url: '/message',
    element: <MessageComponent data={data} />
  },
  {
    url: '/help',
    element: <HelpComponent data={helpDAta} />
  }
]
