import React from 'react'
import { renderToString } from 'react-dom/server'
import { Puppeteer, importPath } from 'alemonjs'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
// component
import BagComponent from './conponent/bag.tsx'
import DefsetComponent from './conponent/defset.tsx'
import EquipmentComponent from './conponent/equipment.tsx'
import HelpComponent from './conponent/help.tsx'
import InformationComponent from './conponent/information.tsx'
import KillComponent from './conponent/kill.tsx'
import ListComponent from './conponent/list.tsx'
import RingComponent from './conponent/ring.tsx'
import SkillsComponent from './conponent/skills.tsx'
import SkyComponent from './conponent/sky.tsx'

// getPath
const app = importPath(import.meta.url)
// cwd
const cwd = app.cwd()
// dir
const dir = join(cwd, 'public/html')
// init
const p = new Puppeteer()

/**
 *
 * @param dom
 * @param key
 * @param uid
 * @returns
 */
function create(dom, key, uid) {
  const html = renderToString(dom)
  const add = join(dir, key)
  mkdirSync(add, { recursive: true })
  const address = join(dir, `${uid}.html`)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return address
}

/**
 * 修仙配置
 * @param data
 * @param name
 * @returns
 */
export function getDefsetComponent(data) {
  return p.toFile(create(<DefsetComponent data={data} />, 'defset', 'defset'))
}

/**
 * 修仙帮助
 * @param data
 * @param name
 * @returns
 */
export function getHelpComponent(data) {
  return p.toFile(create(<HelpComponent data={data} />, 'help', 'help'))
}

/**
 * 杀神榜
 * @param data
 * @param name
 * @returns
 */
export function getKillComponent(data, uid) {
  return p.toFile(create(<KillComponent data={data} />, 'kill', uid))
}

/**
 * 天命榜？？
 * @param data
 * @param name
 * @returns
 */
export function getListComponent(data, uid) {
  return p.toFile(create(<ListComponent data={data} />, 'list', uid))
}

/**
 * 储物袋
 * @param data
 * @param name
 * @returns
 */
export function getBagComponent(data, uid) {
  return p.toFile(create(<BagComponent data={data} />, 'bag', uid))
}

/**
 * 面板信息
 * @param data
 * @param uid
 * @returns
 */
export function getEquipmentComponent(data, uid) {
  return p.toFile(create(<EquipmentComponent data={data} />, 'equipment', uid))
}

/**
 * 个人信息
 * @param data
 * @param name
 * @returns
 */
export function getInformationComponent(data, uid) {
  return p.toFile(
    create(<InformationComponent data={data} />, 'information', uid)
  )
}

/**
 * 纳戒
 * @param data
 * @param name
 * @returns
 */
export function getRingComponent(data, uid) {
  return p.toFile(create(<RingComponent data={data} />, 'ring', uid))
}

/**
 * 功法信息
 * @param data
 * @param name
 * @returns
 */
export function getSkillsComponent(data, uid) {
  return p.toFile(create(<SkillsComponent data={data} />, 'skills', uid))
}

/**
 * 通天塔
 * @param data
 * @param name
 * @returns
 */
export function getSkyComponent(data, uid) {
  return p.toFile(create(<SkyComponent data={data} />, 'sky', uid))
}
