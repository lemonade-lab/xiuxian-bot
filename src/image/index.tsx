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
mkdirSync(dir, { recursive: true })

// init
const p = new Puppeteer()

/**
 * 储物袋
 * @param data
 * @param name
 * @returns
 */
export function getBagComponent(data, name = 'bag.html') {
  const html = renderToString(<BagComponent data={data} />)
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}

/**
 * 修仙配置
 * @param data
 * @param name
 * @returns
 */
export function getDefsetComponent(data, name = 'defset.html') {
  const html = renderToString(<DefsetComponent data={data} />)
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}

/**
 * 面板信息
 * @param data
 * @param name
 * @returns
 */
export function getEquipmentComponent(data, name = 'equipment.html') {
  const html = renderToString(<EquipmentComponent data={data} />)
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}

/**
 * 修仙帮助
 * @param data
 * @param name
 * @returns
 */
export function getHelpComponent(data, name = 'help.html') {
  const html = renderToString(<HelpComponent data={data} />)
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}

/**
 * 个人信息
 * @param data
 * @param name
 * @returns
 */
export function getInformationComponent(data, name = 'information.html') {
  const html = renderToString(<InformationComponent data={data} />)
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}

/**
 * 杀神榜
 * @param data
 * @param name
 * @returns
 */
export function getKillComponent(data, name = 'kill.html') {
  const html = renderToString(<KillComponent data={data} />)
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}

/**
 * 天命榜？？
 * @param data
 * @param name
 * @returns
 */
export function getListComponent(data, name = 'list.html') {
  const html = renderToString(<ListComponent data={data} />)
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}

/**
 * 纳戒
 * @param data
 * @param name
 * @returns
 */
export function getRingComponent(data, name = 'ring.html') {
  const html = renderToString(<RingComponent data={data} />)
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}

/**
 * 功法信息
 * @param data
 * @param name
 * @returns
 */
export function getSkillsComponent(data, name = 'skills.html') {
  const html = renderToString(<SkillsComponent data={data} />)
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}

/**
 * 通天塔
 * @param data
 * @param name
 * @returns
 */
export function getSkyComponent(data, name = 'sky.html') {
  const html = renderToString(<SkyComponent data={data} />)
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}
