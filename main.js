import {
  hash,
  importPath,
  Puppeteer,
  Controllers,
  APlugin,
  createApp
} from 'alemonjs'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Sequelize, DataTypes, Op } from 'sequelize'
import redisClient from 'ioredis'
import { Queue, Worker } from 'bullmq'
import axios from 'axios'

function App$2({ data }) {
  const UID = isNaN(Number(data.UID)) ? hash(data.UID) : data.UID
  return React.createElement(
    'html',
    null,
    React.createElement(
      'head',
      null,
      React.createElement('link', {
        rel: 'stylesheet',
        href: '../css/root.css'
      }),
      React.createElement('link', {
        rel: 'stylesheet',
        href: '../css/equipment.css'
      })
    ),
    React.createElement(
      'body',
      null,
      React.createElement(
        'div',
        { id: 'app', className: 'user' },
        React.createElement('div', { style: { height: '30px' } }),
        React.createElement(
          'div',
          { className: 'user_top' },
          React.createElement(
            'div',
            { className: 'user_top_left' },
            React.createElement(
              'div',
              {
                className: 'user_top_right_font0 font_control Horizontal_grid',
                style: { borderTopRightRadius: '0px' }
              },
              UID
            ),
            React.createElement(
              'div',
              {
                className: 'user_top_right_font font_control Horizontal_grid',
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 50%)'
                }
              },
              React.createElement(
                'div',
                { className: 'font' },
                '\u653B\u51FB : ',
                data.battle_attack
              ),
              React.createElement(
                'div',
                { className: 'font' },
                '\u8840\u91CF : ',
                data.battle_blood_limit
              )
            ),
            React.createElement(
              'div',
              {
                className: 'user_top_right_font1 font_control Horizontal_grid',
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 50%)'
                }
              },
              React.createElement(
                'div',
                { className: 'font' },
                '\u9632\u5FA1 : ',
                data.battle_defense
              ),
              React.createElement(
                'div',
                { className: 'font' },
                '\u654F\u6377 : ',
                data.battle_speed
              )
            ),
            React.createElement(
              'div',
              {
                className: 'user_top_right_font font_control Horizontal_grid',
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 50%)'
                }
              },
              React.createElement(
                'div',
                { className: 'font' },
                '\u66B4\u51FB : ',
                data.battle_critical_hit,
                '%'
              ),
              React.createElement(
                'div',
                { className: 'font' },
                '\u66B4\u4F24 : ',
                data.battle_critical_damage,
                '%'
              )
            ),
            React.createElement(
              'div',
              {
                className: 'user_top_right_font2 font_control Horizontal_grid',
                style: { borderBottomRightRadius: '0px' }
              },
              '\u6218\u529B : ',
              data.battle_power
            )
          ),
          React.createElement(
            'div',
            { className: 'user_top_right' },
            React.createElement(
              'div',
              { className: 'user_top_img_bottom' },
              React.createElement('img', {
                className: 'user_top_img',
                src: data.avatar
              })
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'user_bottom1' },
          React.createElement(
            'div',
            { className: 'use_data' },
            data.fate.map(item =>
              React.createElement(
                'div',
                { key: item.name },
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font0 font_control Horizontal_grid',
                    style: { backgroundColor: 'rgb(61 18 12 / 84%)' }
                  },
                  item.name,
                  '[',
                  item.grade,
                  ']'
                ),
                React.createElement(
                  'div',
                  {
                    className: 'user_top_right_font1 font_control lattice',
                    style: { backgroundColor: 'rgb(109 75 47 / 56%)' }
                  },
                  React.createElement(
                    'div',
                    { className: 'font' },
                    '\u653B\u51FB : ',
                    item.attack,
                    '%'
                  ),
                  React.createElement(
                    'div',
                    { className: 'font' },
                    '\u9632\u5FA1 : ',
                    item.defense,
                    '%'
                  ),
                  React.createElement(
                    'div',
                    { className: 'font' },
                    '\u8840\u91CF : ',
                    item.blood,
                    '%'
                  )
                ),
                React.createElement(
                  'div',
                  {
                    className: 'user_top_right_font2 font_control lattice',
                    style: {
                      marginBottom: '5px',
                      backgroundColor: 'rgb(191 178 145 / 67%)'
                    }
                  },
                  React.createElement(
                    'div',
                    { className: 'font' },
                    '\u66B4\u51FB : ',
                    item.critical_hit,
                    '%'
                  ),
                  React.createElement(
                    'div',
                    { className: 'font' },
                    '\u66B4\u4F24 : ',
                    item.critical_damage,
                    '%'
                  ),
                  React.createElement(
                    'div',
                    { className: 'font' },
                    '\u654F\u6377 : ',
                    item.speed
                  )
                )
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'user_bottom1' },
          React.createElement(
            'div',
            { className: 'use_data' },
            data.equipment.map(item =>
              React.createElement(
                'div',
                { key: item['good.name'] },
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font0 font_control Horizontal_grid'
                  },
                  item['good.name']
                ),
                React.createElement(
                  'div',
                  { className: 'user_top_right_font1 font_control lattice' },
                  React.createElement(
                    'div',
                    { className: 'font' },
                    '\u653B\u51FB : ',
                    item['good.attack'],
                    '%'
                  ),
                  React.createElement(
                    'div',
                    { className: 'font' },
                    '\u9632\u5FA1 : ',
                    item['good.defense'],
                    '%'
                  ),
                  React.createElement(
                    'div',
                    { className: 'font' },
                    '\u8840\u91CF : ',
                    item['good.blood'],
                    '%'
                  )
                ),
                React.createElement(
                  'div',
                  {
                    className: 'user_top_right_font2 font_control lattice',
                    style: { marginBottom: '5px' }
                  },
                  React.createElement(
                    'div',
                    { className: 'font' },
                    '\u66B4\u51FB : ',
                    item['good.critical_hit'],
                    '%'
                  ),
                  React.createElement(
                    'div',
                    { className: 'font' },
                    '\u66B4\u4F24 : ',
                    item['good.critical_damage'],
                    '%'
                  ),
                  React.createElement(
                    'div',
                    { className: 'font' },
                    '\u654F\u6377 : ',
                    item['good.speed']
                  )
                )
              )
            )
          )
        )
      )
    )
  )
}

function App$1({ data }) {
  const UID = isNaN(Number(data.uid)) ? hash(data.uid) : data.uid
  return React.createElement(
    'html',
    null,
    React.createElement(
      'head',
      null,
      React.createElement('link', {
        rel: 'stylesheet',
        href: '../css/root.css'
      }),
      React.createElement('link', {
        rel: 'stylesheet',
        href: '../css/information.css'
      })
    ),
    React.createElement(
      'body',
      null,
      React.createElement(
        'div',
        { id: 'app', className: 'user' },
        React.createElement(
          'div',
          { style: { display: 'grid' } },
          React.createElement(
            'div',
            { className: 'user_top' },
            React.createElement(
              'div',
              { className: 'user_top_left' },
              React.createElement(
                'div',
                {
                  className:
                    'user_top_right_font0 font_control Horizontal_grid',
                  style: { padding: '5px' }
                },
                UID
              ),
              React.createElement(
                'div',
                {
                  className:
                    'user_top_right_font1 font_control Horizontal_grid',
                  style: { padding: '5px' }
                },
                '\u9053\u53F7: ',
                data.name
              ),
              React.createElement(
                'div',
                {
                  className:
                    'user_top_right_font1 font_control Horizontal_grid',
                  style: { padding: '5px' }
                },
                '\u8840\u91CF: ',
                data.battle_blood_now,
                '/',
                data.battle_blood_limit
              ),
              React.createElement(
                'div',
                {
                  className:
                    'user_top_right_font2 font_control Horizontal_grid',
                  style: { padding: '5px' }
                },
                '\u5BFF\u9F84: ',
                data.age,
                '/',
                data.age_limit
              )
            ),
            React.createElement(
              'div',
              { className: 'user_top_right' },
              React.createElement(
                'div',
                { className: 'user_top_img_bottom' },
                React.createElement('img', {
                  className: 'user_top_img',
                  src: data.avatar
                })
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'user_bottom1' },
          React.createElement(
            'div',
            { className: 'use_data' },
            React.createElement(
              'div',
              {
                className: 'user_top_right_font0 font_control Horizontal_grid'
              },
              '[修心道宣]'
            ),
            React.createElement(
              'div',
              {
                className: 'user_top_right_font2 font_control Horizontal_grid'
              },
              data.autograph
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'user_bottom1' },
          React.createElement(
            'div',
            { className: 'use_data' },
            React.createElement(
              'div',
              {
                className: 'user_top_right_font0 font_control Horizontal_grid'
              },
              '[个人信息]'
            ),
            React.createElement(
              'div',
              { className: 'user_top_msg' },
              React.createElement(
                'div',
                { className: 'user_font_msg', style: { color: data.color } },
                '\u7075\u529B: ',
                data.special_spiritual,
                '/',
                data.special_spiritual_limit
              ),
              React.createElement(
                'div',
                { className: 'user_font_msg', style: { color: data.color } },
                '\u715E\u6C14: ',
                data.special_prestige,
                '/100'
              )
            ),
            React.createElement(
              'div',
              { className: 'user_top_msg' },
              React.createElement(
                'div',
                { className: 'user_font_msg', style: { color: data.color } },
                '\u6CD5\u5883: ',
                data.level?.gaspractice?.Name
              ),
              React.createElement(
                'div',
                { className: 'user_font_msg', style: { color: data.color } },
                '\u4FEE\u4E3A: ',
                data.level?.gaspractice?.Experience,
                '/',
                data.level?.gaspractice?.ExperienceLimit
              )
            ),
            React.createElement(
              'div',
              { className: 'user_top_msg' },
              React.createElement(
                'div',
                { className: 'user_font_msg', style: { color: data.color } },
                '\u4F53\u5883: ',
                data.level?.bodypractice?.Name
              ),
              React.createElement(
                'div',
                { className: 'user_font_msg', style: { color: data.color } },
                '\u6C14\u8840: ',
                data.level?.bodypractice?.Experience,
                '/',
                data.level?.bodypractice?.ExperienceLimit
              )
            ),
            React.createElement(
              'div',
              { className: 'user_top_msg' },
              React.createElement(
                'div',
                { className: 'user_font_msg', style: { color: data.color } },
                '\u9B42\u5883: ',
                data.level?.soul?.Name
              ),
              React.createElement(
                'div',
                { className: 'user_font_msg', style: { color: data.color } },
                '\u795E\u5FF5: ',
                data.level?.soul?.Experience,
                '/',
                data.level?.soul?.ExperienceLimit
              )
            ),
            React.createElement(
              'div',
              { className: 'user_top_msg' },
              React.createElement(
                'div',
                { className: 'user_font_msg', style: { color: data.color } },
                '\u58F0\u671B: ',
                data.special_reputation
              ),
              React.createElement(
                'div',
                { className: 'user_font_msg', style: { color: data.color } },
                '\u6218\u529B: ',
                data.battle_power
              )
            ),
            React.createElement(
              'div',
              { className: 'user_top_msg' },
              React.createElement(
                'div',
                { className: 'user_font_msg', style: { color: data.color } },
                '\u7075\u6839: ',
                data.linggenName
              ),
              React.createElement(
                'div',
                { className: 'user_font_msg', style: { color: data.color } },
                '\u5929\u8D4B: ',
                data.talentsize
              )
            ),
            React.createElement(
              'div',
              {
                className:
                  'user_top_right_font2 font_control Horizontal_grid grid-4'
              },
              data.equipment.map(item =>
                React.createElement(
                  'div',
                  { key: item['good.name'], style: { color: data.color } },
                  item['good.name']
                )
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'user_bottom1' },
          React.createElement(
            'div',
            { className: 'use_data' },
            React.createElement(
              'div',
              {
                className: 'user_top_right_font0 font_control Horizontal_grid',
                style: { color: data.color }
              },
              '[已学功法]'
            ),
            React.createElement(
              'div',
              {
                className:
                  'user_top_right_font2 font_control Horizontal_grid grid-4'
              },
              data.skills.map(item =>
                React.createElement(
                  'div',
                  { key: item['good.name'], style: { color: data.color } },
                  '\u300A',
                  item['good.name'],
                  '\u300B'
                )
              )
            )
          )
        )
      )
    )
  )
}

function App({ data }) {
  const UID = isNaN(Number(data.uid)) ? hash(data.uid) : data.uid
  return React.createElement(
    'html',
    null,
    React.createElement(
      'head',
      null,
      React.createElement('link', {
        rel: 'stylesheet',
        href: '../css/root.css'
      }),
      React.createElement('link', {
        rel: 'stylesheet',
        href: '../css/skills.css'
      })
    ),
    React.createElement(
      'body',
      null,
      React.createElement(
        'div',
        { id: 'app', className: 'user' },
        React.createElement('div', { style: { height: '30px' } }),
        React.createElement(
          'div',
          { className: 'user_top' },
          React.createElement(
            'div',
            { className: 'user_top_left' },
            React.createElement(
              'div',
              {
                className: 'user_top_right_font0 font_control Horizontal_grid'
              },
              UID
            ),
            React.createElement(
              'div',
              { className: 'user_top_right_font font_control Horizontal_grid' },
              '\u9053\u53F7: ',
              data.name
            ),
            React.createElement(
              'div',
              {
                className: 'user_top_right_font1 font_control Horizontal_grid'
              },
              '\u7075\u6839: ',
              data.linggenName
            ),
            React.createElement(
              'div',
              {
                className: 'user_top_right_font2 font_control Horizontal_grid'
              },
              '\u5929\u8D4B: ',
              data.talentsize
            )
          ),
          React.createElement(
            'div',
            { className: 'user_top_right' },
            React.createElement(
              'div',
              { className: 'user_top_img_bottom' },
              React.createElement('img', {
                className: 'user_top_img',
                src: data.avatar,
                alt: 'User Avatar'
              })
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'user_bottom1' },
          React.createElement(
            'div',
            { className: 'use_data' },
            data.skills.map(item =>
              React.createElement(
                'div',
                { key: item.id },
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font0 font_control Horizontal_grid'
                  },
                  item['good.name']
                ),
                React.createElement(
                  'div',
                  {
                    className: 'user_top_right_font2 font_control lattice',
                    style: { marginBottom: '5px' }
                  },
                  React.createElement(
                    'div',
                    null,
                    '\u5929\u8D4B: ',
                    item['good.size'],
                    '%'
                  ),
                  React.createElement(
                    'div',
                    null,
                    '\u4FEE\u4E3A: +',
                    item['good.exp_gaspractice']
                  ),
                  React.createElement(
                    'div',
                    null,
                    '\u4EF7\u683C: ',
                    item['good.price']
                  )
                )
              )
            )
          )
        )
      )
    )
  )
}

const app$1 = importPath(import.meta.url)
const cwd = app$1.cwd()
const dir = join(cwd, 'public/html')
mkdirSync(dir, { recursive: true })
const p = new Puppeteer()
function getEquipmentComponent(data, name = 'equipment.html') {
  const html = renderToString(React.createElement(App$2, { data: data }))
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}
function getInformationComponent(data, name = 'information.html') {
  const html = renderToString(React.createElement(App$1, { data: data }))
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}
function getSkillsComponent(data, name = 'skills.html') {
  const html = renderToString(React.createElement(App, { data: data }))
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address, {})
}

const app = importPath(import.meta.url)
app.cwd()

const sequelize = new Sequelize(
  process.env?.ALEMONJS_MYSQL_DATABASE ?? 'xiuxian',
  process.env?.ALEMONJS_MYSQL_USER ?? 'root',
  process.env?.ALEMONJS_MYSQL_PASSWORD ?? '',
  {
    host: process.env?.ALEMONJS_MYSQL_HOST ?? 'localhost',
    port: Number(process.env?.ALEMONJS_MYSQL_PROT ?? 3306),
    dialect: 'mysql',
    logging: false
  }
)
const TableConfig = {
  freezeTableName: true,
  createdAt: false,
  updatedAt: false
}

const user_bag = sequelize.define(
  'user_bag',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    tid: DataTypes.INET,
    type: DataTypes.INET,
    name: DataTypes.STRING,
    acount: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

const goods = sequelize.define(
  'goods',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    type: DataTypes.INTEGER,
    monster_type: DataTypes.INTEGER,
    name: DataTypes.STRING,
    grade: DataTypes.INTEGER,
    addition: DataTypes.STRING,
    talent: DataTypes.JSON,
    attack: DataTypes.INTEGER,
    defense: DataTypes.INTEGER,
    blood: DataTypes.INTEGER,
    boolere_covery: DataTypes.INTEGER,
    critical_hit: DataTypes.INTEGER,
    critical_damage: DataTypes.INTEGER,
    exp_bodypractice: DataTypes.INTEGER,
    exp_gaspractice: DataTypes.INTEGER,
    exp_soul: DataTypes.INTEGER,
    speed: DataTypes.INTEGER,
    size: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    drops: DataTypes.INTEGER,
    wheeldisc: DataTypes.INTEGER,
    alliancemall: DataTypes.INTEGER,
    commodities: DataTypes.INTEGER,
    palace: DataTypes.INTEGER,
    limit: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

const user_skills = sequelize.define(
  'user_skills',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    name: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  TableConfig
)

const user_equipment = sequelize.define(
  'user_equipment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    name: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  TableConfig
)

const user_fate = sequelize.define(
  'user_fate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    name: DataTypes.STRING,
    grade: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

const user_ring = sequelize.define(
  'user_ring',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    tid: DataTypes.INET,
    type: DataTypes.INET,
    name: DataTypes.STRING,
    acount: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

const user_ass = sequelize.define(
  'user_ass',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    create_tiime: DataTypes.INTEGER,
    uid: DataTypes.STRING,
    aid: DataTypes.INTEGER,
    contribute: DataTypes.INTEGER,
    authentication: DataTypes.INTEGER,
    identity: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  TableConfig
)

const ass = sequelize.define(
  'ass',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    create_time: DataTypes.INTEGER,
    name: DataTypes.STRING,
    typing: DataTypes.INTEGER,
    grade: DataTypes.INTEGER,
    bag_grade: DataTypes.INTEGER,
    property: DataTypes.INTEGER,
    fame: DataTypes.INTEGER,
    activation: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

const ass_typing = sequelize.define(
  'ass_typing',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    master: DataTypes.STRING,
    vice_master: DataTypes.STRING,
    super_admin: DataTypes.STRING,
    admin: DataTypes.STRING,
    core_member: DataTypes.STRING,
    senior_menber: DataTypes.STRING,
    intermediate_member: DataTypes.STRING,
    lowerlevel_member: DataTypes.STRING,
    tagged_member: DataTypes.STRING,
    reviewed_member: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  TableConfig
)

const ass_bag = sequelize.define(
  'ass_bag',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    aid: DataTypes.INTEGER,
    tid: DataTypes.INET,
    type: DataTypes.INET,
    name: DataTypes.STRING,
    acount: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

const user = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    autograph: DataTypes.STRING,
    phone: DataTypes.INET,
    state: DataTypes.INET,
    state_start_time: DataTypes.INTEGER,
    state_end_time: DataTypes.INTEGER,
    age: DataTypes.INTEGER,
    age_limit: DataTypes.INTEGER,
    age_state: DataTypes.INTEGER,
    point_type: DataTypes.INTEGER,
    pont_attribute: DataTypes.INTEGER,
    pont_x: DataTypes.INTEGER,
    pont_y: DataTypes.INTEGER,
    pont_z: DataTypes.INTEGER,
    battle_show: DataTypes.INTEGER,
    battle_blood_now: DataTypes.INTEGER,
    battle_blood_limit: DataTypes.INTEGER,
    battle_attack: DataTypes.INTEGER,
    battle_defense: DataTypes.INTEGER,
    battle_speed: DataTypes.INTEGER,
    battle_power: DataTypes.INTEGER,
    battle_critical_hit: DataTypes.INTEGER,
    battle_critical_damage: DataTypes.INTEGER,
    special_reputation: DataTypes.INTEGER,
    special_prestige: DataTypes.INTEGER,
    special_spiritual: DataTypes.INTEGER,
    special_spiritual_limit: DataTypes.INTEGER,
    special_virtues: DataTypes.INTEGER,
    talent: DataTypes.JSON,
    talent_size: DataTypes.INTEGER,
    talent_show: DataTypes.INTEGER,
    bag_grade: DataTypes.INET,
    sign_day: DataTypes.INTEGER,
    sign_math: DataTypes.INTEGER,
    sign_size: DataTypes.INTEGER,
    sign_time: DataTypes.INTEGER,
    newcomer_gift: DataTypes.INTEGER,
    update_time: DataTypes.DATEONLY,
    create_time: DataTypes.INTEGER,
    man_size: DataTypes.INTEGER,
    dong_size: DataTypes.INTEGER,
    dong_minit: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

const TableName$5 = 'fate_level'
const TableBase$5 = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  grade: DataTypes.INTEGER,
  exp_bodypractice: DataTypes.INTEGER,
  exp_gaspractice: DataTypes.INTEGER,
  exp_soul: DataTypes.INTEGER,
  doc: DataTypes.STRING
}
sequelize.define(TableName$5, TableBase$5, TableConfig)

const TableName$4 = 'levels'
const TableBase$4 = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  type: DataTypes.INTEGER,
  grade: DataTypes.INTEGER,
  name: DataTypes.STRING,
  attack: DataTypes.INTEGER,
  defense: DataTypes.INTEGER,
  blood: DataTypes.INTEGER,
  critical_hit: DataTypes.INTEGER,
  critical_damage: DataTypes.INTEGER,
  speed: DataTypes.INTEGER,
  size: DataTypes.INTEGER,
  soul: DataTypes.INTEGER,
  exp_needed: DataTypes.INTEGER,
  doc: DataTypes.STRING
}
const levels = sequelize.define(TableName$4, TableBase$4, TableConfig)

const TableName$3 = 'map_point'
const TableBase$3 = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING,
  type: DataTypes.INTEGER,
  grade: DataTypes.INTEGER,
  attribute: DataTypes.INTEGER,
  x: DataTypes.INTEGER,
  y: DataTypes.INTEGER,
  z: DataTypes.INTEGER,
  doc: DataTypes.STRING
}
sequelize.define(TableName$3, TableBase$3, TableConfig)

const TableName$2 = 'map_position'
const TableBase$2 = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING,
  type: DataTypes.INTEGER,
  grade: DataTypes.INTEGER,
  attribute: DataTypes.INTEGER,
  x1: DataTypes.INTEGER,
  x2: DataTypes.INTEGER,
  y1: DataTypes.INTEGER,
  y2: DataTypes.INTEGER,
  z1: DataTypes.INTEGER,
  z2: DataTypes.INTEGER,
  doc: DataTypes.STRING
}
const map_position = sequelize.define(TableName$2, TableBase$2, TableConfig)

const TableName$1 = 'talent'
const TableBase$1 = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING,
  doc: DataTypes.STRING
}
const talent = sequelize.define(TableName$1, TableBase$1, TableConfig)

const TableName = 'txt'
const TableBase = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING,
  doc: DataTypes.STRING
}
sequelize.define(TableName, TableBase, TableConfig)

sequelize.define(
  'auction',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    state: DataTypes.INTEGER,
    start_time: DataTypes.INTEGER,
    party_a: DataTypes.JSON,
    party_b: DataTypes.JSON,
    party_all: DataTypes.JSON,
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    account: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

sequelize.define(
  'exchange',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    state: DataTypes.INTEGER,
    party_a: DataTypes.JSON,
    party_b: DataTypes.JSON,
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    account: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

sequelize.define(
  'board',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    state: DataTypes.INTEGER,
    party_a: DataTypes.JSON,
    party_b: DataTypes.JSON,
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    account: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

sequelize.define(
  'order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    out_trade_no: DataTypes.STRING,
    plan_title: DataTypes.STRING,
    user_private_id: DataTypes.STRING,
    user_id: DataTypes.STRING,
    plan_id: DataTypes.STRING,
    title: DataTypes.STRING,
    month: DataTypes.INTEGER,
    total_amount: DataTypes.STRING,
    show_amount: DataTypes.STRING,
    status: DataTypes.INTEGER,
    remark: DataTypes.STRING,
    redeem_id: DataTypes.STRING,
    product_type: DataTypes.INTEGER,
    discount: DataTypes.STRING,
    sku_detail: DataTypes.JSON,
    address_phone: DataTypes.STRING,
    address_address: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  TableConfig
)

const monster = sequelize.define(
  'monster',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    type: DataTypes.INTEGER,
    grade: DataTypes.INTEGER,
    name: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  TableConfig
)

sequelize.define(
  'map_treasure',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    acount: DataTypes.INTEGER,
    attribute: DataTypes.INTEGER,
    x: DataTypes.INTEGER,
    y: DataTypes.INTEGER,
    z: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

sequelize.define(
  'activity',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    start_time: DataTypes.INTEGER,
    end_time: DataTypes.INTEGER,
    gaspractice: DataTypes.INTEGER,
    bodypractice: DataTypes.INTEGER,
    soul: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

sequelize.define(
  'sky',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  TableConfig
)

sequelize.define(
  'admin',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    type: DataTypes.INTEGER,
    grade: DataTypes.INTEGER,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  TableConfig
)

sequelize.define(
  'user_log',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    type: DataTypes.INET,
    create_time: DataTypes.BIGINT,
    message: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  TableConfig
)

const user_level = sequelize.define(
  'user_level',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    type: DataTypes.INET,
    career: DataTypes.INET,
    addition: DataTypes.INET,
    realm: DataTypes.INTEGER,
    experience: DataTypes.INTEGER,
    doc: DataTypes.STRING
  },
  TableConfig
)

const user_blessing = sequelize.define(
  'user_blessing',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    day: DataTypes.INET,
    time: DataTypes.BIGINT,
    record: DataTypes.JSON,
    receive: DataTypes.JSON,
    doc: DataTypes.STRING
  },
  TableConfig
)

sequelize.define(
  'user_compensate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    uid: DataTypes.STRING,
    time: DataTypes.STRING,
    doc: DataTypes.STRING
  },
  TableConfig
)

{
  user_ring.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  user_bag.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  user_skills.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  user_equipment.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  user_fate.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
  user_ass.belongsTo(ass, { foreignKey: 'aid', targetKey: 'id' })
  user_ass.belongsTo(user, { foreignKey: 'uid', targetKey: 'uid' })
  ass.belongsTo(ass_typing, { foreignKey: 'typing', targetKey: 'id' })
  ass_bag.belongsTo(goods, { foreignKey: 'name', targetKey: 'name' })
}

async function del(UID) {
  await user.update(
    {
      state: 0,
      state_start_time: 9999999999999,
      state_end_time: 9999999999999
    },
    {
      where: {
        uid: UID
      }
    }
  )
}

async function getRecordsByXYZ(x, y, z) {
  const records = await map_position.findOne({
    where: {
      x1: { [Op.lte]: x },
      x2: { [Op.gte]: x },
      y1: { [Op.lte]: y },
      y2: { [Op.gte]: y },
      z1: { [Op.lte]: z },
      z2: { [Op.gte]: z }
    },
    raw: true
  })
  return records
}

async function update(UID, data) {
  await user.update(data, {
    where: {
      uid: UID
    }
  })
}
async function read$1(UID) {
  const data = await user.findOne({
    where: {
      uid: UID
    },
    raw: true
  })
  return data
}

function createRedis() {
  const ALRedis = new redisClient({
    host: process.env?.ALEMONJS_REDIS_HOST ?? 'localhost',
    port: Number(process.env?.ALEMONJS_REDIS_PORT ?? 6379),
    password: process.env?.ALEMONJS_REDIS_PASSWORD ?? '',
    db: Number(process.env?.ALEMONJS_REDIS_DB ?? 3),
    maxRetriesPerRequest: null
  })
  ALRedis.on('error', err => {
    console.error('\n[REDIS]', err)
    console.error('\n[REDIS]', '请检查配置')
  })
  return ALRedis
}
const Redis = createRedis()

const RedisBull = 'xiuxian:bull'
const RedisBullAction = 'xiuxian:bull:Action'

async function updatePanel(UID, battle_blood_now) {
  const panel = {
    battle_blood_now: 0,
    battle_attack: 0,
    battle_defense: 0,
    battle_blood_limit: 0,
    battle_critical_hit: 0,
    battle_critical_damage: 0,
    battle_speed: 0,
    battle_power: 0
  }
  const userLevelData = await user_level.findAll({
    where: {
      uid: UID,
      type: [1, 2, 3]
    },
    raw: true
  })
  for await (const item of userLevelData) {
    await levels
      .findOne({
        attributes: [
          'attack',
          'defense',
          'blood',
          'critical_hit',
          'critical_damage',
          'speed'
        ],
        where: {
          grade: item?.realm,
          type: item.type
        },
        raw: true
      })
      .then(res => res)
      .then(res => {
        panel.battle_attack = panel.battle_attack + res.attack
        panel.battle_defense = panel.battle_defense + res.defense
        panel.battle_blood_limit = panel.battle_blood_limit + res.blood
        panel.battle_critical_hit = panel.battle_critical_hit + res.critical_hit
        panel.battle_critical_damage =
          panel.battle_critical_damage + res.critical_damage
        panel.battle_speed = panel.battle_speed + res.speed
      })
  }
  const equ = {
    attack: 0,
    defense: 0,
    blood: 0,
    critical_hit: 0,
    critical_damage: 0,
    speed: 0
  }
  const edata = await user_equipment.findAll({
    where: {
      uid: UID
    },
    include: {
      model: goods
    },
    raw: true
  })
  for await (const item of edata) {
    equ.attack = equ.attack + item['good.attack']
    equ.defense = equ.defense + item['good.defense']
    equ.blood = equ.blood + item['good.blood']
    equ.critical_hit = equ.critical_hit + item['good.critical_hit']
    equ.critical_damage = equ.critical_damage + item['good.critical_damage']
    equ.speed = equ.speed + item['good.speed']
  }
  const fdata = await user_fate.findOne({
    where: {
      uid: UID
    },
    include: {
      model: goods
    },
    raw: true
  })
  if (fdata) {
    equ.attack =
      equ.attack + valculateNumerical(fdata['good.attack'], fdata.grade)
    equ.defense =
      equ.defense + valculateNumerical(fdata['good.defense'], fdata.grade)
    equ.blood = equ.blood + valculateNumerical(fdata['good.blood'], fdata.grade)
    equ.critical_hit =
      equ.critical_hit +
      valculateNumerical(fdata['good.critical_hit'], fdata.grade)
    equ.critical_damage =
      equ.critical_damage +
      valculateNumerical(fdata['good.critical_damage'], fdata.grade)
    equ.speed = equ.speed + valculateNumerical(fdata['good.speed'], fdata.grade)
  }
  panel.battle_attack = Math.floor(
    panel.battle_attack * (equ.attack * 0.01 + 1)
  )
  panel.battle_defense = Math.floor(
    panel.battle_defense * (equ.defense * 0.01 + 1)
  )
  panel.battle_blood_limit = Math.floor(
    panel.battle_blood_limit * (equ.blood * 0.01 + 1)
  )
  panel.battle_critical_hit += equ.critical_hit
  panel.battle_critical_damage += equ.critical_damage
  panel.battle_speed += equ.speed
  panel.battle_power =
    panel.battle_attack +
    panel.battle_defense +
    panel.battle_blood_limit / 2 +
    panel.battle_critical_hit * panel.battle_critical_hit +
    panel.battle_speed * 50
  panel.battle_blood_now =
    battle_blood_now > panel.battle_blood_limit
      ? panel.battle_blood_limit
      : battle_blood_now
  await update(UID, panel)
  return
}
function valculateNumerical(val, grade) {
  return val + (val / 10) * grade
}

async function read(UID) {
  const data = await user_blessing.findOne({
    where: {
      uid: UID
    },
    raw: true
  })
  return data
}
async function isVip(UID) {
  const BlessingData = await read(UID)
  if (!BlessingData || !BlessingData.day || BlessingData.day <= 0) {
    return false
  }
  return true
}

function talentSize(data) {
  let talentSize = 600
  for (const item of data) {
    if (item <= 5) talentSize -= 120
    if (item >= 6) talentSize -= 50
  }
  return talentSize
}
async function getTalentName(arr) {
  let name = ''
  const TalentData = await talent.findAll({
    attributes: ['id', 'name'],
    raw: true
  })
  for await (const item of arr) {
    for await (const obj of TalentData) {
      if (obj?.id == item) {
        name += obj?.name
      }
    }
  }
  return name == '' ? '无' : name
}

async function personalInformation(UID, user_avatar) {
  const vip = await isVip(UID)
  const UserData = await read$1(UID)
  let size = '未知'
  let name = '未知'
  if (UserData?.talent_show == 1) {
    size = `+${Math.trunc(UserData.talent_size)}%`
    name = await getTalentName(UserData.talent)
  }
  const userLevelData = await user_level.findAll({
    where: {
      uid: UID,
      type: [1, 2, 3]
    },
    order: [['type', 'DESC']],
    raw: true
  })
  const GaspracticeList = await levels.findAll({
    attributes: ['name', 'type', 'exp_needed'],
    where: {
      grade: [userLevelData[2]?.realm],
      type: 1
    },
    raw: true
  })
  const BodypracticeList = await levels.findAll({
    attributes: ['name', 'type', 'exp_needed'],
    where: {
      grade: userLevelData[1]?.realm,
      type: 2
    },
    raw: true
  })
  const SoulList = await levels.findAll({
    attributes: ['name', 'type', 'exp_needed'],
    where: {
      grade: userLevelData[0]?.realm,
      type: 3
    },
    raw: true
  })
  const GaspracticeData = GaspracticeList[0],
    BodypracticeData = BodypracticeList[0],
    SoulData = SoulList[0]
  const skills = await user_skills.findAll({
    where: {
      uid: UID
    },
    include: {
      model: goods
    },
    raw: true
  })
  const equipment = await user_equipment.findAll({
    where: {
      uid: UID
    },
    include: {
      model: goods
    },
    raw: true
  })
  let avatar = user_avatar == '' ? UserData.avatar : user_avatar
  if (UserData.phone) {
    avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UserData.phone}`
  }
  return {
    vip,
    uid: UID,
    avatar: avatar,
    linggenName: name,
    talentsize: size,
    special_reputation: UserData.special_reputation,
    battle_power: UserData.battle_power,
    name: UserData.name,
    battle_blood_now: UserData.battle_blood_now,
    battle_blood_limit: UserData.battle_blood_limit,
    age: UserData.age,
    age_limit: UserData.age_limit,
    autograph: UserData.autograph,
    special_spiritual: UserData.special_spiritual,
    special_spiritual_limit: UserData.special_spiritual_limit,
    special_prestige: UserData.special_prestige,
    level: {
      gaspractice: {
        Name: GaspracticeData.name,
        Experience: userLevelData[2]?.experience,
        ExperienceLimit: GaspracticeData.exp_needed
      },
      bodypractice: {
        Name: BodypracticeData.name,
        Experience: userLevelData[1]?.experience,
        ExperienceLimit: BodypracticeData.exp_needed
      },
      soul: {
        Name: SoulData.name,
        Experience: userLevelData[0]?.experience,
        ExperienceLimit: SoulData.exp_needed
      }
    },
    equipment: equipment,
    skills: skills
  }
}
async function equipmentInformation(UID, user_avatar) {
  const UserData = await read$1(UID)
  const equipment = await user_equipment.findAll({
    where: {
      uid: UID
    },
    include: {
      model: goods
    },
    raw: true
  })
  const fdata = await user_fate.findOne({
    where: {
      uid: UID
    },
    include: {
      model: goods
    },
    raw: true
  })
  const arr = []
  if (fdata) {
    arr.push({
      name: fdata.name,
      grade: fdata.grade,
      attack: valculateNumerical(fdata['good.attack'], fdata.grade),
      defense: valculateNumerical(fdata['good.defense'], fdata.grade),
      blood: valculateNumerical(fdata['good.blood'], fdata.grade),
      critical_hit: valculateNumerical(fdata['good.critical_hit'], fdata.grade),
      critical_damage: valculateNumerical(
        fdata['good.critical_damage'],
        fdata.grade
      ),
      speed: valculateNumerical(fdata['good.speed'], fdata.grade)
    })
  }
  let avatar = user_avatar == '' ? UserData.avatar : user_avatar
  if (UserData.phone) {
    avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UserData.phone}`
  }
  return {
    UID,
    battle_power: UserData.battle_power,
    battle_attack: UserData.battle_attack,
    battle_defense: UserData.battle_defense,
    battle_blood_limit: UserData.battle_blood_limit,
    battle_speed: UserData.battle_speed,
    battle_critical_hit: UserData.battle_critical_hit,
    battle_critical_damage: UserData.battle_critical_damage,
    equipment: equipment,
    fate: arr,
    avatar: avatar
  }
}
async function skillInformation(UID, user_avatar) {
  const UserData = await read$1(UID)
  const vip = await isVip(UID)
  let size = '未知'
  let name = '未知'
  if (UserData.talent_show == 1) {
    size = `+${Math.trunc(UserData.talent_size)}%`
    name = await getTalentName(UserData.talent)
  }
  const skills = await user_skills.findAll({
    where: {
      uid: UID
    },
    include: {
      model: goods
    },
    raw: true
  })
  let avatar = user_avatar == '' ? UserData.avatar : user_avatar
  if (UserData.phone) {
    avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UserData.phone}`
  }
  return {
    vip,
    UID,
    skills: skills,
    name: UserData.name,
    linggenName: name,
    talentsize: size,
    avatar: avatar
  }
}

function showUserMsg(e) {
  const UID = e.user_id
  personalInformation(UID, e.user_avatar).then(res => {
    getInformationComponent(res).then(img => {
      if (typeof img != 'boolean') {
        e.reply(img)
        Controllers(e).Message.reply(
          '按钮',
          [
            { label: '闭关', value: '/闭关' },
            { label: '出关', value: '/出关' },
            { label: '前往', value: '/前往联盟', enter: false }
          ],
          [
            { label: '突破', value: '/突破' },
            { label: '储物袋', value: '/储物袋' },
            { label: '纳戒', value: '/纳戒' }
          ]
        )
      }
    })
  })
}
async function isUser(UID) {
  return user.findOne({
    where: {
      uid: UID
    },
    raw: true
  })
}

async function updataEfficiency(UID, talent) {
  let skill = 0
  const skills = await user_skills.findAll({
    where: {
      uid: UID
    },
    include: {
      model: goods
    },
    raw: true
  })
  for await (const item of skills) {
    skill += item['good.size']
  }
  const size = talentSize(talent)
  await update(UID, {
    talent: talent,
    talent_size: size + skill
  })
  return true
}

await monster
  .findAll({
    raw: true
  })
  .then(res => {
    const data = res
    return data
  })

const QUEUE = new Queue(RedisBull, {
  connection: Redis
})
new Worker(
  RedisBull,
  async ({ data: { UID, x, y, z, size } }) => {
    const { pont_x, pont_y } = await user.findOne({
      attributes: ['pont_x', 'pont_y'],
      where: {
        uid: UID
      },
      raw: true
    })
    const direction = await Redis.get(`${RedisBullAction}:${UID}:action`)
    if (direction == '0' || pont_x == x) {
      const distance = Math.abs(y - pont_y)
      const step = Math.min(size, distance)
      const direction = Math.sign(y - pont_y)
      const s = pont_y + step * direction
      const mData = await getRecordsByXYZ(pont_x, s, z)
      await user.update(
        {
          point_type: mData.type,
          pont_attribute: mData.attribute,
          pont_y: s
        },
        {
          where: {
            uid: UID
          }
        }
      )
      Redis.set(`${RedisBullAction}:${UID}:action`, '1')
      if (x == pont_x && y == s) {
        cancelJob(UID).catch(err => {
          console.error(err)
        })
      }
    } else if (direction == '1' || pont_y == y) {
      const distance = Math.abs(x - pont_x)
      const step = Math.min(size, distance)
      const direction = Math.sign(x - pont_x)
      const s = pont_x + step * direction
      const mData = await getRecordsByXYZ(s, pont_y, z)
      await user.update(
        {
          point_type: mData.type,
          pont_attribute: mData.attribute,
          pont_x: s
        },
        {
          where: {
            uid: UID
          }
        }
      )
      Redis.set(`${RedisBullAction}:${UID}:action`, '0')
      if (x == s && y == pont_y) {
        cancelJob(UID).catch(err => {
          console.error(err)
        })
      }
    }
  },
  {
    connection: Redis
  }
)
async function cancelJob(UID) {
  const jobs = await QUEUE.getRepeatableJobs()
  const jobsToRemove = jobs
    .filter(item => item.id == UID)
    .map(async item => {
      try {
        await QUEUE.removeRepeatableByKey(item.key)
      } catch (err) {
        console.error(err)
      }
    })
  await Promise.all(jobsToRemove)
  del(UID)
  return
}

const start_time = 30000
const continue_time = 3600000
const timeout_time = 6000
function set(i, val) {
  Redis.set(i, val)
}
async function testAvatar(url) {
  try {
    const response = await axios.head(url, { timeout: timeout_time })
    if (response.status === 200) {
      return url
    } else {
      return 'https://upload-bbs.miyoushe.com/upload/2023/07/17/304751611/71e31dcc65d3cd80f6a987a6cd476d83_6373327733590661180.jpg'
    }
  } catch (error) {
    return 'https://upload-bbs.miyoushe.com/upload/2023/07/17/304751611/71e31dcc65d3cd80f6a987a6cd476d83_6373327733590661180.jpg'
  }
}
async function getList() {
  const UserData = []
  const ALLData = await user.findAll({
    attributes: ['uid', 'battle_power', 'autograph', 'name', 'avatar'],
    order: [['battle_power', 'DESC']],
    limit: 5,
    raw: true
  })
  for await (const iten of ALLData) {
    const UID = iten?.uid
    const LData = await user_level.findAll({
      attributes: ['type', 'realm'],
      where: {
        uid: UID
      },
      order: [['type', 'ASC']],
      raw: true
    })
    let levelName = ''
    for await (const it of LData) {
      const type = it?.type
      const realm = it?.realm
      const levelsData = await levels.findAll({
        where: {
          grade: realm,
          type: type
        },
        raw: true
      })
      levelName += `[${levelsData[0]?.name}]`
    }
    UserData.push({
      UID: iten?.uid,
      autograph: iten?.autograph,
      lifeName: iten?.name,
      levelName: levelName,
      power: iten?.battle_power,
      user_avatar: await testAvatar(iten?.avatar)
    })
  }
  return UserData
}
async function getKillList() {
  const UserData = []
  const ALLData = await user.findAll({
    attributes: [
      'uid',
      'battle_power',
      'autograph',
      'special_prestige',
      'name',
      'avatar'
    ],
    order: [['special_prestige', 'DESC']],
    limit: 5,
    raw: true
  })
  for await (const iten of ALLData) {
    UserData.push({
      UID: iten?.uid,
      autograph: iten?.autograph,
      lifeName: iten?.name,
      prestige: iten?.special_prestige,
      power: iten?.battle_power,
      user_avatar: await testAvatar(iten?.avatar)
    })
  }
  return UserData
}
async function updatePowerList() {
  set(`xiuxian:list`, JSON.stringify(await getList()))
}
async function updataKillList() {
  set(`xiuxian:list:kill`, JSON.stringify(await getKillList()))
}
setTimeout(() => {
  updataKillList()
  updatePowerList()
  console.info('[list] level update')
}, start_time)
setInterval(() => {
  updataKillList()
  updatePowerList()
}, continue_time)

class Information extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(个人|個人)信息$/, fnc: 'personalInformation' },
        { reg: /^(#|\/)?面板信息$/, fnc: 'equipmentInformation' },
        { reg: /^(#|\/)?功法信息$/, fnc: 'skillInformation' },
        { reg: /^(#|\/)?我的编号$/, fnc: 'myUserID' },
        { reg: /^(#|\/)?(帮助|操作面板|面板)$/, fnc: 'controllers' }
      ]
    })
  }
  async controllers(e) {
    Controllers(e).Message.reply(
      '按钮',
      [
        { label: '个人信息', value: '/个人信息' },
        { label: '面板信息', value: '/面板信息' },
        { label: '装备信息', value: '/装备信息' }
      ],
      [
        { label: '闭关', value: '/闭关' },
        { label: '出关', value: '/出关' },
        { label: '前往', value: '/前往联盟', enter: false }
      ],
      [
        { label: '探索怪物', value: '/探索怪物' },
        { label: '探索零矿', value: '/探索零矿' },
        { label: '释放神识', value: '/释放神识' }
      ],
      [
        { label: '虚空镜', value: '/储物袋' },
        { label: '虚空板', value: '/虚空板' },
        { label: '虚空灯', value: '/虚空灯' }
      ],
      [
        { label: '突破', value: '/突破' },
        { label: '储物袋', value: '/储物袋' },
        { label: '纳戒', value: '/纳戒' }
      ]
    )
    return true
  }
  async myUserID(e) {
    e.reply(e.user_id)
    return
  }
  async personalInformation(e) {
    const UID = e.user_id
    isUser(UID)
      .then(UserData => {
        if (!UserData) {
          e.reply('请先踏入仙途')
          return
        }
        update(UID, {
          avatar: e.user_avatar
        }).then(() => {
          Promise.all([
            updataEfficiency(UID, UserData.talent),
            updatePanel(UID, UserData.battle_blood_now),
            showUserMsg(e)
          ]).catch(() => {
            e.reply('数据处理错误')
          })
        })
      })
      .catch(() => {
        e.reply('数据查询错误')
      })
    return
  }
  async equipmentInformation(e) {
    const UID = e.user_id
    isUser(UID)
      .then(UserData => {
        if (!UserData) {
          e.reply('请先踏入仙途')
          return
        }
        updatePanel(UID, UserData.battle_blood_now).then(() => {
          equipmentInformation(UID, e.user_avatar).then(res => {
            getEquipmentComponent(res).then(img => {
              if (typeof img != 'boolean') {
                e.reply(img)
              }
            })
          })
        })
      })
      .catch(() => {
        e.reply('数据查询错误')
      })
    return
  }
  async skillInformation(e) {
    const UID = e.user_id
    isUser(UID)
      .then(UserData => {
        if (!UserData) {
          e.reply('请先踏入仙途')
          return
        }
        updataEfficiency(UID, UserData.talent).then(() => {
          skillInformation(UID, e.user_avatar).then(res => {
            getSkillsComponent(res).then(img => {
              if (typeof img != 'boolean') {
                e.reply(img)
              }
            })
          })
        })
      })
      .catch(() => {
        e.reply('数据查询错误')
      })
    return
  }
}

var apps = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  Information: Information
})

createApp(import.meta.url)
  .use(apps)
  .mount()
console.info('[APP] 凡人修仙 启动')
