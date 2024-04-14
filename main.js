import {
  hash,
  importPath,
  Puppeteer,
  ABuffer,
  Controllers,
  APlugin,
  createApp
} from 'alemonjs'
import { mkdirSync, writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Sequelize, DataTypes, literal, Op } from 'sequelize'
import redisClient from 'ioredis'
import { Queue, Worker } from 'bullmq'
import axios from 'axios'

const nameMap = {
  boolere_covery: '回血',
  exp_gaspractice: '修为',
  exp_bodypractice: '气血',
  exp_soul: '魂念'
}

function App$b({ data }) {
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
      React.createElement('link', { rel: 'stylesheet', href: '../css/bag.css' })
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
              {
                className: 'user_top_right_font1 font_control Horizontal_grid'
              },
              '\u9053\u53F7: ',
              data.name
            ),
            React.createElement(
              'div',
              { className: 'user_top_right_font font_control Horizontal_grid' },
              '\u7B49\u7EA7: ',
              data.bag_grade
            ),
            React.createElement(
              'div',
              {
                className: 'user_top_right_font2 font_control Horizontal_grid',
                style: { borderBottomRightRadius: '0px' }
              },
              '\u683C\u5B50: ',
              data.length,
              '/',
              data.bag_grade * 10
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
            data.bag.map((item, index) =>
              React.createElement(
                'div',
                { key: index },
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
                    null,
                    '\u653B\u51FB: ',
                    item['good.attack'],
                    '%'
                  ),
                  React.createElement(
                    'div',
                    null,
                    '\u9632\u5FA1: ',
                    item['good.defense'],
                    '%'
                  ),
                  React.createElement(
                    'div',
                    null,
                    '\u8840\u91CF: ',
                    item['good.blood'],
                    '%'
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'user_top_right_font font_control lattice' },
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
                    '\u66B4\u51FB: ',
                    item['good.critical_hit'],
                    '%'
                  ),
                  React.createElement(
                    'div',
                    null,
                    '\u66B4\u4F24: ',
                    item['good.critical_damage'],
                    '%'
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'user_top_right_font1 font_control lattice' },
                  React.createElement(
                    'div',
                    null,
                    '\u654F\u6377: ',
                    item['good.speed']
                  ),
                  React.createElement(
                    'div',
                    null,
                    nameMap[item['good.addition']],
                    ':',
                    ' ',
                    item[`good.${item['good.addition']}`],
                    item['good.addition'] === 'boolere_covery' &&
                      React.createElement('span', null, ' % ')
                  ),
                  React.createElement('div', null, '\u4E94\u884C: ???')
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
                    '\u7B49\u7EA7: ',
                    item['good.grade']
                  ),
                  React.createElement(
                    'div',
                    null,
                    '\u6570\u91CF: ',
                    item['acount']
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

function App$a({ data }) {
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
        href: '../css/defset.css'
      })
    ),
    React.createElement(
      'body',
      null,
      React.createElement(
        'div',
        { id: 'app', className: 'defset' },
        React.createElement('div', { className: 'defset-c' }),
        React.createElement(
          'div',
          { className: 'Config-body' },
          React.createElement(
            'div',
            { className: 'Config-body-title-re' },
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u7A81\u7834\u51B7\u5374: ',
              data.CD_Level_up,
              'm'
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u7834\u4F53\u51B7\u5374: ',
              data.CD_LevelMax_up,
              'm'
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u9053\u5BA3\u51B7\u5374: ',
              data.CD_Autograph,
              'm'
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u6539\u540D\u51B7\u5374: ',
              data.CD_Name,
              'm'
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u91CD\u751F\u51B7\u5374: ',
              data.CD_Reborn,
              'm'
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u8D60\u9001\u51B7\u5374: ',
              data.CD_Transfer,
              'm'
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u653B\u51FB\u51B7\u5374: ',
              data.CD_Attack,
              'm'
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u51FB\u6740\u51B7\u5374: ',
              data.CD_Kill,
              'm'
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u4FEE\u884C\u51B7\u5374: ',
              data.CD_Pconst_ractice,
              'm'
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u5077\u88AD\u51B7\u5374: ',
              data.CD_Sneak,
              'm'
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u53CC\u4FEE\u51B7\u5374: ',
              data.CD_Ambiguous,
              'm'
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u6BD4\u6597\u51B7\u5374: ',
              data.CD_Battle,
              'm'
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u4F20\u529F\u51B7\u5374: ',
              data.CD_transmissionPower,
              'm'
            )
          ),
          React.createElement(
            'div',
            { className: 'Config-body-title-re' },
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u95ED\u5173\u500D\u7387: ',
              data.biguan_size
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u953B\u4F53\u500D\u7387: ',
              data.work_size
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u6700\u591A\u529F\u6CD5\u6301\u6709\u6570: ',
              data.myconfig_gongfa
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u6700\u591A\u88C5\u5907\u6301\u6709\u6570: ',
              data.myconfig_equipment
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u5E74\u9F84\u6BCF\u5C0F\u65F6\u589E\u52A0: ',
              data.Age_size
            ),
            React.createElement(
              'div',
              { className: 'Config-body-font' },
              '\u50A8\u7269\u888B\u6700\u9AD8\u7B49\u7EA7: ',
              data.Price.length - 1
            )
          )
        )
      )
    )
  )
}

function App$9({ data }) {
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

function App$8({ data }) {
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
        href: '../css/help.css'
      })
    ),
    React.createElement(
      'body',
      null,
      React.createElement(
        'div',
        { id: 'app', className: 'help' },
        React.createElement('div', { style: { height: '350px' } }),
        data.map(val =>
          React.createElement(
            'div',
            { key: val.group, className: 'cont-box' },
            React.createElement('div', { className: 'help-group' }, val.group),
            React.createElement(
              'div',
              { className: 'help-table' },
              React.createElement(
                'div',
                { className: 'tr' },
                val.list.map(item =>
                  React.createElement(
                    'div',
                    { key: item.title, className: 'td' },
                    React.createElement('span', {
                      className: `help-icon help-icon-${item.icon}`
                    }),
                    React.createElement(
                      'strong',
                      { className: 'help-title' },
                      item.title
                    ),
                    React.createElement(
                      'span',
                      { className: 'help-desc' },
                      item.desc
                    )
                  )
                )
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'copyright' },
          React.createElement(
            'span',
            { className: 'version' },
            'https://alemonjs.com/'
          )
        ),
        React.createElement(
          'div',
          { className: 'copyright' },
          React.createElement('span', { className: 'version' }, '806943302')
        )
      )
    )
  )
}

function App$7({ data }) {
  return React.createElement(
    'head',
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
        href: '../css/kill.css'
      })
    ),
    React.createElement(
      'body',
      null,
      React.createElement(
        'div',
        { id: 'app', className: 'user' },
        data.map(item =>
          React.createElement(
            'div',
            { key: item.UID, style: { display: 'grid' } },
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
                  isNaN(Number(item.UID)) ? hash(item.UID) : item.UID
                ),
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font1 font_control Horizontal_grid',
                    style: { padding: '5px' }
                  },
                  '\u9053\u53F7: ',
                  item.lifeName
                ),
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font2 font_control Horizontal_grid',
                    style: { padding: '5px' }
                  },
                  '\u715E\u6C14: ',
                  item.prestige
                ),
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font1 font_control Horizontal_grid',
                    style: { padding: '5px' }
                  },
                  '\u6218\u529B: ',
                  item.power
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
                    src: item.user_avatar
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
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font0 font_control Horizontal_grid'
                  },
                  '[修心道宣]'
                ),
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font2 font_control Horizontal_grid'
                  },
                  item.autograph
                )
              )
            )
          )
        )
      )
    )
  )
}

function App$6({ data }) {
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
        href: '../css/list.css'
      })
    ),
    React.createElement(
      'body',
      null,
      React.createElement(
        'div',
        { id: 'app', className: 'user' },
        data.map(item =>
          React.createElement(
            'div',
            { key: item.UID, style: { display: 'grid' } },
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
                  isNaN(Number(item.UID)) ? hash(item.UID) : item.UID
                ),
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font1 font_control Horizontal_grid',
                    style: { padding: '5px' }
                  },
                  '\u9053\u53F7: ',
                  item.lifeName
                ),
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font2 font_control Horizontal_grid',
                    style: { padding: '5px' }
                  },
                  '\u5883\u754C: ',
                  item.levelName
                ),
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font1 font_control Horizontal_grid',
                    style: { padding: '5px' }
                  },
                  '\u6218\u529B: ',
                  item.power
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
                    src: item.user_avatar,
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
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font0 font_control Horizontal_grid'
                  },
                  '[修心道宣]'
                ),
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font2 font_control Horizontal_grid'
                  },
                  item.autograph
                )
              )
            )
          )
        )
      )
    )
  )
}

function App$5({ data }) {
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
        href: '../css/ring.css'
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
              {
                className: 'user_top_right_font1 font_control Horizontal_grid'
              },
              '\u9053\u53F7: ',
              data.name
            ),
            React.createElement(
              'div',
              { className: 'user_top_right_font font_control Horizontal_grid' },
              '\u7B49\u7EA7: ',
              data.bag_grade
            ),
            React.createElement(
              'div',
              {
                className: 'user_top_right_font2 font_control Horizontal_grid',
                style: { borderBottomRightRadius: '0px' }
              },
              '\u683C\u5B50: ',
              data.length,
              '/',
              data.bag_grade * 10
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
            data.bag.map(item =>
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
                  { className: 'user_top_right_font1 font_control lattice' },
                  React.createElement(
                    'div',
                    null,
                    '\u653B\u51FB: ',
                    item['good.attack'],
                    '%'
                  ),
                  React.createElement(
                    'div',
                    null,
                    '\u9632\u5FA1: ',
                    item['good.defense'],
                    '%'
                  ),
                  React.createElement(
                    'div',
                    null,
                    '\u8840\u91CF: ',
                    item['good.blood'],
                    '%'
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'user_top_right_font font_control lattice' },
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
                    '\u66B4\u51FB: ',
                    item['good.critical_hit'],
                    '%'
                  ),
                  React.createElement(
                    'div',
                    null,
                    '\u66B4\u4F24: ',
                    item['good.critical_damage'],
                    '%'
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'user_top_right_font1 font_control lattice' },
                  React.createElement(
                    'div',
                    null,
                    '\u654F\u6377: ',
                    item['good.speed']
                  ),
                  React.createElement(
                    'div',
                    null,
                    nameMap[item['good.addition']],
                    ':',
                    ' ',
                    item[`good.${item['good.addition']}`],
                    item['good.addition'] === 'boolere_covery' && ' %'
                  ),
                  React.createElement('div', null, '\u4E94\u884C: ???')
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
                    '\u7B49\u7EA7: ',
                    item['good.grade']
                  ),
                  React.createElement(
                    'div',
                    null,
                    '\u6570\u91CF: ',
                    item['acount']
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

function App$4({ data }) {
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

function App$3({ data }) {
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
      React.createElement('link', { rel: 'stylesheet', href: '../css/sky.css' })
    ),
    React.createElement(
      'body',
      null,
      React.createElement(
        'div',
        { id: 'app', className: 'user' },
        data.map(item =>
          React.createElement(
            'div',
            { key: item.id },
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
                    isNaN(Number(item.UID)) ? hash(item.UID) : item.UID
                  ),
                  React.createElement(
                    'div',
                    {
                      className:
                        'user_top_right_font1 font_control Horizontal_grid',
                      style: { padding: '5px' }
                    },
                    '\u9053\u53F7: ',
                    item.name
                  ),
                  React.createElement(
                    'div',
                    {
                      className:
                        'user_top_right_font2 font_control Horizontal_grid',
                      style: { padding: '5px' }
                    },
                    '\u6392\u540D: ',
                    item.id
                  ),
                  React.createElement(
                    'div',
                    {
                      className:
                        'user_top_right_font1 font_control Horizontal_grid',
                      style: { padding: '5px' }
                    },
                    '\u6218\u529B: ',
                    item.power
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
                      src: item.avatar,
                      alt: 'User Avatar'
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
                    className:
                      'user_top_right_font0 font_control Horizontal_grid'
                  },
                  '[修心道宣]'
                ),
                React.createElement(
                  'div',
                  {
                    className:
                      'user_top_right_font2 font_control Horizontal_grid'
                  },
                  item.autograph
                )
              )
            )
          )
        )
      )
    )
  )
}

function App$2() {
  return React.createElement(
    'div',
    { className: 'nav-menu' },
    React.createElement(
      'span',
      { className: 'nav-menu-title' },
      '\u51E1\u4EBA\u4FEE\u4ED9'
    ),
    React.createElement(
      'span',
      { className: 'menu-button' },
      '#\u518D\u5165\u4ED9\u9014'
    ),
    React.createElement(
      'span',
      { className: 'menu-button' },
      '#\u66F4\u6362\u4E3B\u9898'
    ),
    React.createElement(
      'span',
      { className: 'menu-button' },
      '#\u66F4\u6539\u9053\u53F7+\u5B57\u7B26'
    )
  )
}

var _ = src => `../../${src}`

const ThemesColor = {
  dark: {
    left: '#f3d109a6',
    right: '#ff0000ba'
  },
  red: {
    left: '#f7da2fa6',
    right: '#ff6800ba'
  },
  purple: {
    left: '#83e139ba',
    right: '#f72020cc'
  },
  blue: {
    left: '#aadb03ba',
    right: '#f72020ba'
  }
}

function App$1({ data }) {
  const pro = Math.floor((data.battle_blood_now / data.battle_blood_now) * 100)
  const color = `linear-gradient(to right, ${ThemesColor[data.theme].left} ${pro}%,${ThemesColor[data.theme].right}  ${pro}%)`
  const show = (a, b) => {
    if (
      data.talent_show &&
      (data.talent.includes(a) || data.talent.includes(b))
    ) {
      return 'initial'
    } else {
      return 'grayscale(100%)'
    }
  }
  return React.createElement(
    'div',
    { className: 'nav' },
    React.createElement(App$2, null),
    React.createElement(
      'div',
      { className: 'nav-box' },
      React.createElement(
        'span',
        { className: 'menu-button-flat' },
        '#\u4E2A\u4EBA\u4FE1\u606F'
      ),
      React.createElement(
        'span',
        {
          className: 'nav-talent',
          style: {
            filter: data.talent_show ? 'initial' : 'grayscale(100%)'
          }
        },
        React.createElement(
          'span',
          {
            className: 'nav-talent-item nav-talent-item-1',
            style: {
              filter: show(1, 6)
            }
          },
          '\u91D1'
        ),
        React.createElement(
          'span',
          {
            className: 'nav-talent-item nav-talent-item-2',
            style: {
              filter: show(2, 7)
            }
          },
          '\u6728'
        ),
        React.createElement(
          'span',
          {
            className: 'nav-talent-item nav-talent-item-3',
            style: {
              filter: show(3, 8)
            }
          },
          '\u6C34'
        ),
        React.createElement(
          'span',
          {
            className: 'nav-talent-item nav-talent-item-4',
            style: {
              filter: show(4, 9)
            }
          },
          '\u706B'
        ),
        React.createElement(
          'span',
          {
            className: 'nav-talent-item nav-talent-item-5',
            style: {
              filter: show(5, 10)
            }
          },
          '\u571F'
        )
      ),
      React.createElement(
        'div',
        { className: 'nav-box-flex' },
        React.createElement(
          'div',
          { className: 'nav-box-item' },
          React.createElement('img', {
            className: 'nav-box-item-img',
            src: _('svg/name.svg')
          }),
          React.createElement('span', null, data.name)
        ),
        React.createElement(
          'div',
          { className: 'nav-box-item' },
          React.createElement('img', {
            className: 'nav-box-item-img',
            src: _('svg/level.svg')
          }),
          React.createElement('span', null, data.level?.gaspractice?.Name)
        ),
        React.createElement(
          'div',
          { className: 'nav-box-item' },
          data.level?.gaspractice?.Experience,
          '/',
          data.level?.gaspractice?.ExperienceLimit
        )
      ),
      React.createElement(
        'div',
        { className: 'nav-box-flex nav-box-avatar' },
        React.createElement('img', {
          className: 'nav-box-img',
          src: data.avatar
        }),
        React.createElement(
          'div',
          {
            className: 'nav-box-uid',
            style: {
              background: color
            }
          },
          data.UID
        ),
        React.createElement(
          'span',
          { className: 'nav-box-blool' },
          `${data.battle_blood_now}/${data.battle_blood_limit}-${pro}%`
        )
      ),
      React.createElement(
        'div',
        { className: 'nav-box-flex' },
        React.createElement(
          'div',
          { className: 'nav-box-item' },
          React.createElement('img', {
            className: 'nav-box-item-img',
            src: _('svg/power.svg')
          }),
          React.createElement('span', null, data.battle_power)
        ),
        React.createElement(
          'div',
          { className: 'nav-box-item' },
          React.createElement('img', {
            className: 'nav-box-item-img',
            src: _('svg/efficiency.svg')
          }),
          React.createElement('span', null, data.talentsize),
          ' '
        ),
        React.createElement(
          'div',
          { className: 'nav-box-item' },
          data.special_spiritual,
          '/',
          data.special_spiritual_limit
        )
      )
    )
  )
}

function App({ data }) {
  return React.createElement(
    'html',
    null,
    React.createElement(
      'head',
      null,
      React.createElement('link', {
        rel: 'stylesheet',
        href: _('css/new-root.css')
      }),
      React.createElement('link', {
        rel: 'stylesheet',
        href: _(`css/root-${data.theme}.css`)
      }),
      React.createElement('link', {
        rel: 'stylesheet',
        href: _(`css/new-nav.css`)
      }),
      React.createElement('link', {
        rel: 'stylesheet',
        href: _(`css/new-message.css`)
      })
    ),
    React.createElement(
      'body',
      null,
      React.createElement(
        'div',
        { id: 'root' },
        React.createElement(App$1, { data: data }),
        React.createElement(
          'div',
          { className: 'autograph' },
          React.createElement(
            'div',
            { className: 'autograph-box' },
            React.createElement('span', null, data.autograph),
            React.createElement(
              'span',
              { className: 'menu-button-flat' },
              '#\u66F4\u6539\u9053\u5BA3+\u5B57\u7B26'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'level' },
          React.createElement(
            'div',
            { className: 'level-box' },
            React.createElement(
              'span',
              { className: 'menu-button-flat' },
              '#\u88C5\u5907\u4FE1\u606F'
            ),
            React.createElement(
              'div',
              { className: 'level-box-item' },
              '\u58F0\u671B: ',
              data.special_reputation
            ),
            React.createElement(
              'div',
              { className: 'level-box-item' },
              '\u715E\u6C14: ',
              data.special_prestige,
              '/100'
            ),
            React.createElement(
              'div',
              { className: 'level-box-item' },
              React.createElement(
                'span',
                null,
                '\u4F53\u5883: ',
                data.level?.bodypractice?.Name
              )
            ),
            React.createElement(
              'div',
              { className: 'level-box-item' },
              '\u6C14\u8840: ',
              data.level?.bodypractice?.Experience,
              '/',
              data.level?.bodypractice?.ExperienceLimit
            ),
            React.createElement(
              'div',
              { className: 'level-box-item' },
              '\u9B42\u5883: ',
              data.level?.soul?.Name
            ),
            React.createElement(
              'div',
              { className: 'level-box-item' },
              '\u795E\u5FF5: ',
              data.level?.soul?.Experience,
              '/',
              data.level?.soul?.ExperienceLimit
            )
          )
        ),
        data.skills.length > 0 &&
          React.createElement(
            'div',
            { className: 'kills' },
            React.createElement(
              'div',
              { className: 'kills-box' },
              data.skills.map((item, index) =>
                React.createElement(
                  'span',
                  { key: item['good.name'] },
                  '\u300A',
                  item['good.name'],
                  '\u300B '
                )
              ),
              React.createElement(
                'span',
                { className: 'menu-button-flat' },
                '#\u529F\u6CD5\u4FE1\u606F'
              )
            )
          ),
        React.createElement(
          'div',
          { className: 'box-help' },
          React.createElement(
            'div',
            { className: 'box-help-box' },
            React.createElement(
              'span',
              { className: 'menu-button-flat' },
              '#\u4FEE\u4ED9\u5E2E\u52A9'
            ),
            React.createElement(
              'span',
              { className: 'menu-button' },
              '#\u7A81\u7834'
            ),
            React.createElement(
              'span',
              { className: 'menu-button' },
              '#\u95ED\u5173'
            ),
            React.createElement(
              'span',
              { className: 'menu-button' },
              '#\u51FA\u5173'
            ),
            React.createElement(
              'span',
              { className: 'menu-button' },
              '#\u50A8\u7269\u888B'
            ),
            React.createElement(
              'span',
              { className: 'menu-button' },
              '#\u4E07\u5B9D\u697C'
            ),
            React.createElement(
              'span',
              { className: 'menu-button' },
              '#\u6253\u52AB@\u9053\u53CB'
            )
          )
        )
      )
    )
  )
}

const app$1 = importPath(import.meta.url)
const cwd = app$1.cwd()
const dir$1 = join(cwd, 'public/html')
const p = new Puppeteer()
function create$4(dom, key, uid) {
  const html = renderToString(dom)
  const add = join(dir$1, key)
  mkdirSync(add, { recursive: true })
  const address = join(dir$1, `${uid}.html`)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return address
}
class Component {
  puppeteer
  #dir = ''
  constructor(dir) {
    this.puppeteer = new Puppeteer()
    this.#dir = dir
    mkdirSync(this.#dir, {
      recursive: true
    })
  }
  create(element, dirs, name) {
    const html = renderToString(element)
    const dir = join(this.#dir, dirs)
    mkdirSync(dir, {
      recursive: true
    })
    const address = join(dir, name)
    writeFileSync(address, `<!DOCTYPE html>${html}`)
    return address
  }
  async message(data, uid) {
    return this.puppeteer.toFile(
      this.create(
        React.createElement(App, { data: data }),
        'message',
        `${uid}.html`
      )
    )
  }
}
var ImageComponent = new Component(join(cwd, 'resources', 'cache'))
function getDefsetComponent(data) {
  return p.toFile(
    create$4(React.createElement(App$a, { data: data }), 'defset', 'defset')
  )
}
function getHelpComponent(data) {
  return p.toFile(
    create$4(React.createElement(App$8, { data: data }), 'help', 'help')
  )
}
function getKillComponent(data, uid) {
  return p.toFile(
    create$4(React.createElement(App$7, { data: data }), 'kill', uid)
  )
}
function getListComponent(data, uid) {
  return p.toFile(
    create$4(React.createElement(App$6, { data: data }), 'list', uid)
  )
}
function getBagComponent(data, uid) {
  return p.toFile(
    create$4(React.createElement(App$b, { data: data }), 'bag', uid)
  )
}
function getEquipmentComponent(data, uid) {
  return p.toFile(
    create$4(React.createElement(App$9, { data: data }), 'equipment', uid)
  )
}
function getRingComponent(data, uid) {
  return p.toFile(
    create$4(React.createElement(App$5, { data: data }), 'ring', uid)
  )
}
function getSkillsComponent(data, uid) {
  return p.toFile(
    create$4(React.createElement(App$4, { data: data }), 'skills', uid)
  )
}
function getSkyComponent(data, uid) {
  return p.toFile(
    create$4(React.createElement(App$3, { data: data }), 'sky', uid)
  )
}

const helpData = {}
const app = importPath(import.meta.url)
const dir = app.cwd()
function getJson(name) {
  return JSON.parse(
    readFileSync(join(dir, 'public', 'defset', `${name}.json`), 'utf-8')
  )
}
async function urlHelpCache(name) {
  if (!Object.prototype.hasOwnProperty.call(helpData, name)) {
    helpData[name] = await getHelpComponent(getJson(name)).catch(err => {
      console.error(err)
      return false
    })
  }
  return helpData[name]
}
function lcalCacheImage(name) {
  if (!Object.prototype.hasOwnProperty.call(helpData, name)) {
    const img = ABuffer.getPath(`${dir}${name}`)
    if (!img) return
    helpData[name] = img
  }
  return helpData[name]
}

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
const fate_level = sequelize.define(TableName$5, TableBase$5, TableConfig)

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
const map_point = sequelize.define(TableName$3, TableBase$3, TableConfig)

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
const txt = sequelize.define(TableName, TableBase, TableConfig)

const auction = sequelize.define(
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

const exchange = sequelize.define(
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

const board = sequelize.define(
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

const map_treasure = sequelize.define(
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

const activity = sequelize.define(
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

const sky = sequelize.define(
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

const user_log = sequelize.define(
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

const user_compensate = sequelize.define(
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

const ACTIONMAP = {
  0: '空闲',
  1: '闭关',
  2: '锻体',
  3: '赶路',
  4: '传送',
  5: '渡劫',
  6: '扩建',
  7: '秘境',
  8: '打坐'
}
async function set$4(UID, { actionID = 0, startTime = 0, endTime = 0 }) {
  await user.update(
    {
      state: actionID,
      state_start_time: startTime,
      state_end_time: endTime
    },
    {
      where: {
        uid: UID
      }
    }
  )
}
async function del$7(UID) {
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
async function Go(UserData) {
  if (UserData.state == 0) {
    return {
      state: 2000,
      msg: '成功'
    }
  }
  if (
    new Date().getTime() >=
    UserData.state_end_time + UserData.state_start_time
  ) {
    del$7(UserData.uid)
    return {
      state: 2000,
      msg: '通过'
    }
  }
  return {
    state: 4001,
    msg: `${ACTIONMAP[UserData.state]}中...`
  }
}
async function goByBlood(UserData) {
  if (UserData.state == 0) {
    if (UserData.battle_blood_now >= 1) {
      return {
        state: 2000,
        msg: '成功'
      }
    }
    return {
      state: 4001,
      msg: '血量不足'
    }
  }
  if (
    new Date().getTime() >=
    UserData.state_end_time + UserData.state_start_time
  ) {
    del$7(UserData.uid)
    return {
      state: 2000,
      msg: '通过'
    }
  }
  return {
    state: 4001,
    msg: `${ACTIONMAP[UserData.state]}中...`
  }
}

const map$2 = {
  1: (item, name, size) => {
    return `\n[${item.name}]_攻击:${item.attack}%_${name}:${Math.floor(item.price * size)}`
  },
  2: (item, name, size) => {
    return `\n[${item.name}]_防御:${item.defense}%_${name}:${Math.floor(item.price * size)}`
  },
  3: (item, name, size) => {
    return `\n[${item.name}]_暴伤:${item.critical_damage}%_${name}:${Math.floor(item.price * size)}`
  },
  4: (item, name, size) => {
    if (item.addition == 'blood') {
      return `\n[${item.name}]_血量:${item.blood}%_${name}:${Math.floor(item.price * size)}`
    } else {
      return `\n[${item.name}]_修为:${item.exp_gaspractice}_${name}:${Math.floor(item.price * size)}`
    }
  },
  5: (item, name, size) => {
    return `\n[${item.name}]_天赋:${item.size}%_${name}:${Math.floor(item.price * size)}`
  },
  6: (item, name, size) => {
    return `\n[${item.name}]_类型:道具_${name}:${Math.floor(item.price * size)}`
  }
}
const mapType = {
  武器: 1,
  护具: 2,
  法宝: 3,
  丹药: 4,
  功法: 5,
  道具: 6,
  材料: 7,
  装备: [1, 2, 3]
}
function getListMsg(list, name = '价格', size = 1) {
  const msg = []
  for (const item of list) {
    msg.push(map$2[item?.type](item, name, size))
  }
  return msg
}
async function getRandomThing(where) {
  const data = await goods.findOne({
    where,
    order: literal('RAND()'),
    raw: true
  })
  return data
}
async function searchAllThing(name) {
  const da = await goods.findOne({
    where: {
      name
    },
    raw: true
  })
  return da
}

async function getLength$1(UID) {
  return await user_bag.count({
    where: {
      uid: UID
    }
  })
}
async function del$6(UID, type = undefined) {
  if (type) {
    await user_bag.destroy({
      where: {
        uid: UID,
        type
      }
    })
  } else {
    await user_bag.destroy({
      where: {
        uid: UID
      }
    })
  }
}
async function backpackFull$1(UID, grade) {
  const length = await getLength$1(UID)
  const size = grade * 10
  const n = size - length
  return n >= 1 ? n : false
}
async function addBagThing(UID, grade, arr) {
  for (const { name, acount } of arr) {
    const THING = await searchAllThing(name)
    if (!THING) continue
    const length = await user_bag.count({
      where: {
        uid: UID,
        name: name
      }
    })
    if (length >= grade * 10) break
    const existingItem = await user_bag.findOne({
      where: {
        uid: UID,
        name: name
      },
      raw: true
    })
    if (existingItem) {
      await user_bag.update(
        {
          acount: Number(existingItem.acount) + Number(acount)
        },
        {
          where: {
            uid: UID,
            name: THING.name
          }
        }
      )
    } else {
      await user_bag.create({
        uid: UID,
        tid: THING.id,
        type: THING.type,
        name: THING.name,
        acount: acount
      })
    }
  }
  return
}
async function reduceBagThing(UID, arr) {
  for (const { name, acount } of arr) {
    const data = await searchBagByName(UID, name)
    if (!data) continue
    const ACCOUNT = Number(data.acount) - Number(acount)
    if (ACCOUNT >= 1) {
      await user_bag.update(
        {
          acount: ACCOUNT
        },
        {
          where: {
            uid: UID,
            name: name
          }
        }
      )
      continue
    }
    await user_bag.destroy({
      where: {
        uid: UID,
        name: name
      }
    })
  }
  return true
}
async function searchBagByName(UID, name, acount = 1) {
  const data = await user_bag.findOne({
    where: {
      uid: UID,
      name
    },
    raw: true
  })
  if (data && data.acount >= acount)
    return {
      ...(await searchAllThing(name)),
      acount: data.acount
    }
  return false
}
async function delThing(UID, size = 100, t = false) {
  const data = await user_bag.findOne({
    where: {
      uid: UID
    },
    order: literal('RAND()'),
    raw: true
  })
  if (!data) return []
  if (t) {
    if (data.acount <= 11) {
      reduceBagThing(UID, [
        {
          name: data.name,
          acount: data.acount
        }
      ])
    } else if (data.acount >= 102 && data.acount >= 12) {
      reduceBagThing(UID, [
        {
          name: data.name,
          acount: Math.floor(data.acount / 10)
        }
      ])
    } else {
      reduceBagThing(UID, [
        {
          name: data.name,
          acount: Math.floor(data.acount / size) + 100
        }
      ])
    }
  } else {
    reduceBagThing(UID, [
      {
        name: data.name,
        acount: data.acount
      }
    ])
  }
  return [data]
}

async function mapExistence(x, y, addressName) {
  const PointData = await map_point.findOne({
    where: {
      name: {
        [Op.like]: `%${addressName}%`
      },
      x: x,
      y: y
    },
    raw: true
  })
  if (PointData) return true
  return false
}
async function mapAction(x, y, addressName) {
  return await mapExistence(x, y, addressName)
}
async function getPlaceName(type, attribute) {
  const PositionData = await map_position.findOne({
    where: {
      type: type,
      attribute: attribute
    },
    raw: true
  })
  if (PositionData) return PositionData.name
  return '未知地点'
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

function Anyarray(ARR) {
  const randindex = Math.trunc(Math.random() * ARR.length)
  return ARR[randindex]
}
function leastOne(value) {
  let size = value
  if (isNaN(parseFloat(size)) && !isFinite(size)) {
    return Number(1)
  }
  size = Number(Math.trunc(size))
  if (size == null || size == undefined || size < 1 || isNaN(size)) {
    return Number(1)
  }
  return Number(size)
}
function timeChange(timestamp) {
  const date = new Date(timestamp)
  const M =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  return `${date.getFullYear()}-${M}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
function isProbability(P) {
  if (P > 100) {
    return true
  }
  if (P < 0) return false
  const rand = Math.floor(Math.random() * (100 - 1) + 1)
  if (P > rand) {
    return true
  }
  return false
}
function isTrueInRange(min = 1, max = 100, percent = 0) {
  if (percent <= 0) {
    return false
  }
  if (percent >= 100) {
    return true
  }
  const p = (percent / 100) * (max - min + 1) + min
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min
  if (randomNum <= p) {
    return true
  }
  return false
}
function convertTime(time) {
  const ms = time % 1000
  time = (time - ms) / 1000
  const secs = time % 60
  time = (time - secs) / 60
  const mins = time % 60
  time = (time - mins) / 60
  const hrs = time % 24
  const days = (time - hrs) / 24
  return `${days}d${hrs}h${mins}m${secs}s`
}

async function add$3(NAME, TYPE, ACOUNT) {
  const name = String(NAME)
  if (Number(TYPE) == 6 || ACOUNT < 10 || name.indexOf('灵石') != -1) {
    await create$3(NAME, ACOUNT)
    return
  }
  const totalCount = ACOUNT
  let remainingCount = totalCount
  while (remainingCount > 0) {
    const count = Math.min(remainingCount, 10)
    remainingCount -= count
    await create$3(NAME, count)
  }
}
async function create$3(NAME, count) {
  const da = await map_position.findOne({
    where: {
      type: [2, 3, 4, 5, 6, 8, 9, 10, 11]
    },
    order: [literal('rand()')],
    limit: 1,
    raw: true
  })
  const position = da[0]
  if (!position) return
  const mx =
      Math.floor(Math.random() * (position.x2 - position.x1)) +
      Number(position.x1),
    my =
      Math.floor(Math.random() * (position.y2 - position.y1)) +
      Number(position.y1),
    mz =
      Math.floor(Math.random() * (position.z2 - position.z1)) +
      Number(position.z1)
  await map_treasure.create({
    name: NAME,
    acount: count,
    type: position.type,
    attribute: position.attribute,
    x: mx,
    y: my,
    z: mz
  })
}

async function update$1(UID, data) {
  await user.update(data, {
    where: {
      uid: UID
    }
  })
}
async function read$7(UID) {
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

const ASS_TYPING_MAP = {
  宗: 0,
  派: 1,
  门: 2,
  阁: 3,
  宫: 4,
  教: 5,
  国: 6,
  谷: 7,
  洞: 8,
  组: 9,
  堡: 10,
  城: 11,
  会: 12
}
const ASS_IDENTITY_MAP = {
  0: 'master',
  1: 'vice_master',
  2: 'super_admin',
  3: 'admin',
  4: 'core_member',
  5: 'senior_menber',
  6: 'intermediate_member',
  7: 'lowerlevel_member',
  8: 'tagged_member',
  9: 'reviewed_member'
}
const CD_MAP = {
  0: '攻击',
  1: '锻体',
  2: '闭关',
  3: '改名',
  4: '道宣',
  5: '赠送',
  6: '突破',
  7: '破体',
  8: '转世',
  9: '行为',
  10: '击杀',
  11: '决斗',
  12: '修行',
  13: '渡劫',
  14: '双修',
  15: '偷药',
  16: '占领矿场',
  17: '偷动物',
  18: '做饭',
  19: '顿悟',
  20: '比斗',
  21: '偷袭',
  22: '采集',
  23: '挑战'
}
const ReadiName = 'xiuxian-plugin'
const RedisMonster = 'xiuxian:monsters5'
const RedisExplore = 'xiuxian:explore6'
const RedisBull = 'xiuxian:bull'
const RedisBullAction = 'xiuxian:bull:Action'

function set$3(UID, CDID, CDTime) {
  Redis.set(
    `${ReadiName}:${UID}:${CDID}`,
    JSON.stringify({
      val: new Date().getTime(),
      expire: CDTime * 60000
    })
  )
}
async function cooling(UID, CDID) {
  const data = await Redis.get(`${ReadiName}:${UID}:${CDID}`)
  if (data) {
    const { val, expire } = JSON.parse(data)
    const NowTime = new Date().getTime()
    const onTime = val + expire
    if (NowTime >= onTime) {
      Redis.del(`${ReadiName}:${UID}:${CDID}`)
      return {
        state: 2000,
        msg: '通过'
      }
    }
    const theTime = onTime - NowTime
    return {
      state: 4001,
      msg: `${CD_MAP[CDID]}冷却:${convertTime(theTime)}`
    }
  }
  return {
    state: 2000,
    msg: '通过'
  }
}

const NAMEMAP = {
    1: '修为',
    2: '气血',
    3: '神念'
  },
  CopywritingLevel = {
    0: '🤪突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美!险些走火入魔,丧失了size[name]',
    1: '🤪突破时想到鸡哥了,险些走火入魔,丧失了size[name]',
    2: '🤪突破时突然想起后花园种有药草,强行打断突破,嘴角流血,丧失了size[name]',
    3: '🤪突破失败,丧失了size[name]',
    4: '🤪突破失败,你刚刚气沉丹田就被一口老痰差点噎死,丧失了size[name]',
    5: '🤪噗～你一口老血喷了出,突破失败,丧失了size[name]',
    6: '🤪砰!你突破时身后的柜子动了一下,吓得你一时不敢突破并丧失了size[name]',
    7: '🤪突破失败,你也不知道为啥,并且丧失了size[name]',
    8: '🤪突破失败,可能是因为姿势不对吧,你尝试换了个姿势,发现丧失了size[name]',
    9: '🤪突破失败,你差一点就成功了,你决定再试一次,可惜刚入定就被反噬,丧失了size[name]',
    10: '🤪突破失败,因为今天是KFC疯狂星期四,决定不突破了去吃了KFC,回来直接变身喷射战士,并丧失了size[name]'
  }
async function write$2(UID, type, DATA) {
  await user_level.update(DATA, {
    where: {
      type,
      uid: UID
    }
  })
}
async function read$6(UID, type) {
  return user_level
    .findOne({
      attributes: ['addition', 'realm', 'experience'],
      where: {
        uid: UID,
        type
      },
      raw: true
    })
    .then(res => res)
}
function getRandomKey() {
  const keyArray = Object.keys(CopywritingLevel)
  const randomKey = keyArray[Math.floor(Math.random() * keyArray.length)]
  return Number(randomKey)
}
function getCopywriting(id, randomKey, size) {
  const name = NAMEMAP[id]
  const copywriting = CopywritingLevel[randomKey]
  const result = copywriting.replace('size[name]', `${size}[${name}]`)
  return result
}
async function enhanceRealm(UID, type) {
  const UserLevel = await read$6(UID, type)
  const realm = UserLevel.realm
  const LevelListMax = await levels.findAll({
    attributes: ['id', 'exp_needed', 'grade', 'type', 'name'],
    where: {
      type
    },
    order: [['grade', 'DESC']],
    limit: 3,
    raw: true
  })
  const data = LevelListMax[1]
  if (!data || UserLevel.realm == data.grade) {
    return {
      state: 4001,
      msg: `道友已至瓶颈,唯寻得真理,方成大道`
    }
  }
  const LevelList = await levels.findAll({
    attributes: ['id', 'exp_needed', 'grade', 'type', 'name'],
    where: {
      type,
      grade: [realm + 1, realm]
    },
    order: [['grade', 'DESC']],
    limit: 3,
    raw: true
  })
  const next = LevelList[0]
  const now = LevelList[1]
  if (!next || !now) {
    return {
      state: 4001,
      msg: '已看破天机'
    }
  }
  if (UserLevel.experience < now.exp_needed) {
    return {
      state: 4001,
      msg: `${NAMEMAP[type]}不足`
    }
  }
  UserLevel.experience -= now.exp_needed
  UserLevel.realm += 1
  if (type == 1) {
    update$1(UID, {
      special_spiritual_limit: 100 + UserLevel.realm
    })
  }
  UserLevel.addition = 0
  await write$2(UID, type, UserLevel)
  return {
    state: 2000,
    msg: `境界提升至${next.name}`
  }
}
async function fallingRealm(UID, type, size = 1) {
  const UserLevel = await read$6(UID, type)
  const realm = UserLevel.realm
  const data = await levels.findOne({
    attributes: ['id', 'exp_needed', 'name'],
    where: {
      grade: realm - size,
      type
    },
    raw: true
  })
  if (!data) {
    return {
      state: 4001,
      msg: null
    }
  }
  UserLevel.realm -= 1
  if (type == 1) {
    update$1(UID, {
      special_spiritual_limit: 100 + UserLevel.realm
    })
  }
  await write$2(UID, type, UserLevel)
  return {
    state: 2000,
    msg: `境界跌落至${data.name}`
  }
}
async function addExperience$1(UID, type, size, number = 5) {
  const UserLevel = await read$6(UID, type)
  if (isNaN(UserLevel.experience)) {
    UserLevel.experience = 0
  }
  UserLevel.experience += size ?? 0
  if (UserLevel.experience > 999999999) UserLevel.experience = 999999999
  if (number) {
    const size = Number(UserLevel.addition)
    UserLevel.addition = size + number
  }
  await write$2(UID, type, UserLevel)
  return {
    state: 2000,
    msg: `[${NAMEMAP[type]}]+${size}`
  }
}
async function reduceExperience(UID, type, size) {
  const UserLevel = await read$6(UID, type)
  UserLevel.experience -= size
  if (UserLevel.experience < 0) UserLevel.experience = 0
  await write$2(UID, type, UserLevel)
  return {
    state: 2000,
    msg: `[${NAMEMAP[type]}]+${size}`
  }
}
async function isLevelPoint(UID, type) {
  const UserLevel = await read$6(UID, type)
  const LevelList = await levels.findAll({
    attributes: ['exp_needed', 'grade'],
    where: {
      type
    },
    order: [['grade', 'DESC']],
    limit: 3,
    raw: true
  })
  const data = LevelList[1]
  if (!data) return false
  if (UserLevel.realm != data.grade) return false
  if (UserLevel.experience < data.exp_needed) return false
  return true
}

async function add$2(UID, name) {
  await user_equipment.create({
    uid: UID,
    name
  })
}
async function del$5(UID, name, id) {
  await user_equipment.destroy({
    where: {
      uid: UID,
      id,
      name
    }
  })
}
async function get$3(UID) {
  const tda = await user_equipment.findAll({
    where: {
      uid: UID
    },
    raw: true
  })
  return tda
}
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
  await update$1(UID, panel)
  return
}
async function addBlood(BattleData, SIZE) {
  if (isNaN(BattleData.battle_blood_now)) {
    BattleData.battle_blood_now = 100
  }
  BattleData.battle_blood_now += Math.floor(
    (BattleData.battle_blood_limit * SIZE) / 100
  )
  if (BattleData.battle_blood_now > BattleData.battle_blood_limit) {
    BattleData.battle_blood_now = BattleData.battle_blood_limit
  }
  await update$1(BattleData.uid, {
    battle_blood_now: BattleData.battle_blood_now
  })
  return BattleData.battle_blood_now
}
function valculateNumerical(val, grade) {
  return val + (val / 10) * grade
}

const CD_Level_up = 1
const CD_LevelMax_up = 1
const CD_Autograph = 1
const CD_Name = 1
const CD_Reborn = 1440
const CD_Transfer = 1
const CD_Attack = 1
const CD_Sneak = 1
const CD_Kill = 1
const CD_Mine = 1
const CD_Pconst_ractice = 1
const CD_Ambiguous = 1
const CD_Battle = 1
const CD_B = 1
const CD_transmissionPower = 5
const Age_size = 1
const myconfig_gongfa = 12
const myconfig_equipment = 4
const biguan_size = 8
const work_size = 4
const delivery_size = 2000
const Price = [
  0, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000,
  20000000, 50000000, 100000000, 200000000, 500000000, 1000000000, 2000000000,
  5000000000, 10000000000
]
const ExchangeStart = 1.2
const ExchangeEnd = 0.8
const pageSize = 6
const AssLevel = 24
const AssNumer = 5000000
const upgradeass = [4, 8, 16, 32, 64]
const MAXpropety = [
  5000000, 8000000, 11000000, 15000000, 20000000, 25000000, 30000000
]

var Cooling = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  Age_size: Age_size,
  AssLevel: AssLevel,
  AssNumer: AssNumer,
  CD_Ambiguous: CD_Ambiguous,
  CD_Attack: CD_Attack,
  CD_Autograph: CD_Autograph,
  CD_B: CD_B,
  CD_Battle: CD_Battle,
  CD_Kill: CD_Kill,
  CD_LevelMax_up: CD_LevelMax_up,
  CD_Level_up: CD_Level_up,
  CD_Mine: CD_Mine,
  CD_Name: CD_Name,
  CD_Pconst_ractice: CD_Pconst_ractice,
  CD_Reborn: CD_Reborn,
  CD_Sneak: CD_Sneak,
  CD_Transfer: CD_Transfer,
  CD_transmissionPower: CD_transmissionPower,
  ExchangeEnd: ExchangeEnd,
  ExchangeStart: ExchangeStart,
  MAXpropety: MAXpropety,
  Price: Price,
  biguan_size: biguan_size,
  delivery_size: delivery_size,
  myconfig_equipment: myconfig_equipment,
  myconfig_gongfa: myconfig_gongfa,
  pageSize: pageSize,
  upgradeass: upgradeass,
  work_size: work_size
})

async function write$1(UID, data) {
  await user_blessing.update(data, {
    where: {
      uid: UID
    }
  })
}
async function read$5(UID) {
  const data = await user_blessing.findOne({
    where: {
      uid: UID
    },
    raw: true
  })
  return data
}
async function isVip(UID) {
  const BlessingData = await read$5(UID)
  if (!BlessingData || !BlessingData.day || BlessingData.day <= 0) {
    return false
  }
  return true
}
async function collectItems(UID) {
  const BlessingData = await read$5(UID)
  if (!BlessingData) return false
  const time = formatDate(new Date())
  if (BlessingData.receive[time]) {
    return false
  }
  let size = 1
  if (BlessingData.time) {
    const TIME = formatDate(new Date(BlessingData.time))
    if (BlessingData.receive[TIME]) {
      size = getTimeSize(BlessingData.time)
    }
  }
  if (size > 1) {
    BlessingData.time = 0
  }
  BlessingData.day -= size
  if (!determine(UID, BlessingData)) {
    return false
  }
  BlessingData.time = new Date().getTime()
  BlessingData.receive[time] = true
  await write$1(UID, BlessingData)
  return true
}
function getTimeSize(time) {
  const oneDay = 24 * 60 * 60 * 1000
  const lastSignInDate = new Date(time).getTime()
  const currentDate = new Date().getTime()
  const daysDiff = Math.round(Math.abs((currentDate - lastSignInDate) / oneDay))
  return daysDiff
}
function determine(UID, BlessingData) {
  if (BlessingData.day <= 0) {
    BlessingData.day = 0
    BlessingData.time = 0
    write$1(UID, BlessingData)
    return false
  }
  return true
}
function formatDate(date) {
  const isoString = date.toISOString()
  const datePart = isoString.substring(0, 10)
  return datePart.replace(/-/g, '-')
}

async function getLength(UID) {
  return await user_ring.count({
    where: {
      uid: UID
    }
  })
}
async function backpackFull(UID, grade = 1) {
  const length = await getLength(UID)
  const size = grade * 10
  const n = size - length
  return n >= 1 ? n : false
}
async function addRingThing(UID, arr, grade = 1) {
  for (const { name, acount } of arr) {
    const THING = await searchAllThing(name)
    if (!THING) continue
    const length = await user_ring.count({
      where: {
        uid: UID,
        name: name
      }
    })
    if (length >= grade * 10) break
    const existingItem = await user_ring.findOne({
      where: {
        uid: UID,
        name: name
      },
      raw: true
    })
    if (existingItem) {
      await user_ring.update(
        {
          acount: Number(existingItem.acount) + Number(acount)
        },
        {
          where: {
            uid: UID,
            name: THING.name
          }
        }
      )
    } else {
      await user_ring.create({
        uid: UID,
        tid: THING.id,
        type: THING.type,
        name: THING.name,
        acount: acount
      })
    }
  }
  return
}
async function reduceRingThing(UID, arr) {
  for (const { name, acount } of arr) {
    const data = await searchRingByName(UID, name)
    if (!data) continue
    const ACCOUNT = Number(data.acount) - Number(acount)
    if (ACCOUNT >= 1) {
      await user_ring.update(
        {
          acount: ACCOUNT
        },
        {
          where: {
            uid: UID,
            name: name
          }
        }
      )
      continue
    }
    await user_ring.destroy({
      where: {
        uid: UID,
        name: name
      }
    })
  }
  return true
}
async function searchRingByName(UID, name) {
  const data = await user_ring.findOne({
    where: {
      uid: UID,
      name
    },
    raw: true
  })
  if (data)
    return {
      ...(await searchAllThing(name)),
      acount: data.acount
    }
  return false
}

function talentSize(data) {
  let talentSize = 600
  for (const item of data) {
    if (item <= 5) talentSize -= 120
    if (item >= 6) talentSize -= 50
  }
  return talentSize
}
function getTalent() {
  const newtalent = []
  const talentCount = Math.floor(Math.random() * 5) + 1
  while (newtalent.length < talentCount) {
    const x = Math.floor(Math.random() * 10) + 1
    if (
      newtalent.indexOf(x) !== -1 ||
      (x <= 5 && newtalent.includes(x + 5)) ||
      (x > 5 && newtalent.includes(x - 5))
    ) {
      continue
    }
    newtalent.push(x)
  }
  return newtalent
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
  const UserData = await read$7(UID)
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
    UID: UID,
    avatar: avatar,
    linggenName: name,
    talentsize: size,
    talent_show: UserData.talent_show,
    talent: UserData.talent,
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
    skills: skills,
    theme: 'dark'
  }
}
async function equipmentInformation(UID, user_avatar) {
  const UserData = await read$7(UID)
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
  const UserData = await read$7(UID)
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
async function backpackInformation(UID, user_avatar, type) {
  const UserData = await read$7(UID)
  const length = await getLength$1(UID)
  const bag = await user_bag.findAll({
    where: {
      uid: UID
    },
    include: {
      model: goods,
      where: {
        type: type
      }
    },
    raw: true
  })
  let avatar = user_avatar == '' ? UserData.avatar : user_avatar
  if (UserData.phone) {
    avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UserData.phone}`
  }
  return {
    UID,
    name: UserData.name,
    bag_grade: UserData.bag_grade,
    length: length,
    bag: bag,
    avatar: avatar
  }
}
async function ringInformation(UID, user_avatar) {
  const UserData = await read$7(UID)
  const length = await getLength(UID)
  const bag = await user_ring.findAll({
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
    UID,
    name: UserData.name,
    bag_grade: 1,
    length: length,
    bag: bag,
    avatar: avatar
  }
}
async function showSky(UID) {
  const data = await sky.findOne({
    where: {
      uid: UID
    },
    raw: true
  })
  const list = await sky.findAll({
    limit: 3,
    raw: true
  })
  const T = list.find(item => item.id == data.id)
  const arr = []
  for await (const item of list) {
    arr.push(item)
  }
  const reply = async () => {
    const msg = []
    for await (const item of arr) {
      const UserData = await user.findOne({
        attributes: ['uid', 'name', 'battle_power', 'autograph', 'avatar'],
        where: {
          uid: item.uid
        },
        raw: true
      })
      msg.push({
        id: item.id,
        UID: UserData.uid,
        name: UserData.name,
        power: UserData.battle_power,
        autograph: UserData.autograph,
        avatar: UserData.avatar
      })
    }
    return msg
  }
  if (T) {
    return await reply()
  }
  const data_S = await sky.findOne({
    where: {
      id: data.id - 1
    },
    raw: true
  })
  if (!data_S || data_S.id == data.id) {
    arr.push(data)
    return await reply()
  }
  arr.push(data_S)
  arr.push(data)
  return await reply()
}

function showUserMsg(e) {
  const UID = e.user_id
  personalInformation(UID, e.user_avatar).then(res => {
    ImageComponent.message(res, UID).then(img => {
      if (typeof img != 'boolean') {
        e.reply(img).then(() => {
          Controllers(e).Message.reply(
            'buttons',
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
        })
      }
    })
  })
}
async function dualVerification(e, UserData, UserDataB) {
  if (UserData.uid == UserDataB.uid) {
    e.reply(['咦惹'])
    return false
  }
  const { state: stateA, msg: msgA } = await goByBlood(UserData)
  if (stateA == 4001) {
    e.reply(msgA)
    return false
  }
  const { state: stateB, msg: msgB } = await goByBlood(UserDataB)
  if (stateB == 4001) {
    e.reply([msgB])
    return false
  }
  return true
}
function dualVerificationAction(e, region, regionB) {
  if (region != regionB) {
    e.reply(['此地未找到此人'])
    return false
  }
  return true
}
async function sendReply(e, title, msg = [], size = 8) {
  for (let i = 0; i < msg.length; i += size) {
    const slicedMsg = msg.slice(i, i + size)
    slicedMsg.unshift(title)
    setTimeout(async () => {
      await e.reply(slicedMsg)
    }, i * 300)
  }
  return
}
async function Control(e, UserData) {
  const { state, msg } = await Go(UserData)
  if (state == 4001) {
    e.reply([msg])
    return false
  }
  return true
}
async function ControlByBlood(e, UserData) {
  const { state, msg } = await goByBlood(UserData)
  if (state == 4001) {
    e.reply([msg])
    return false
  }
  return true
}
async function controlByName(e, UserData, addressName) {
  if (!(await ControlByBlood(e, UserData))) return false
  if (!(await mapAction(UserData.pont_x, UserData.pont_y, addressName))) {
    e.reply([`需[(#|/)前往${addressName}]`])
    return false
  }
  return true
}
async function postHelp(e, name) {
  const img = await urlHelpCache(name).catch(err => {
    console.error(err)
    return '图片缓存错误'
  })
  Controllers(e).Message.reply(
    '按钮',
    [
      { label: '战斗帮助', value: '/战斗帮助' },
      { label: '地图帮助', value: '/地图帮助' },
      { label: '职业帮助', value: '/职业帮助' }
    ],
    [
      { label: '天机帮助', value: '/天机帮助' },
      { label: '黑市帮助', value: '/黑市帮助' },
      { label: '联盟帮助', value: '/联盟帮助' }
    ],
    [
      { label: '修炼帮助', value: '/修炼帮助' },
      { label: '虚空帮助', value: '/虚空帮助' },
      { label: '势力帮助', value: '/势力帮助' }
    ],
    [
      {
        label: '加入官群',
        value: '/加入官群',
        link: 'https://qm.qq.com/q/BUXl2xKabe'
      },
      { label: '控制板', value: '/控制板' }
    ]
  )
  e.reply(img)
  return false
}
const npcName = [
  '巡逻军',
  '城主',
  '柠檬冲水',
  '百里寻晴',
  '联盟',
  '修仙联盟',
  '联盟商会',
  '玄玉天宫',
  '玉贞子',
  '玉炎子',
  '天机门',
  '东方无极'
]
async function killNPC(e, Mname, UID, prestige) {
  if (!npcName.find(item => Mname.includes(item))) return true
  e.reply(`[${Mname}]:狂妄!`)
  await update$1(UID, {
    battle_blood_now: 0
  })
  if (!isTrueInRange(1, 100, Math.floor(prestige + 10))) {
    return false
  }
  const data = await delThing(UID)
  if (data[0]) {
    await add$3(data[0].name, data[0].type, data[0].acount)
    e.reply(
      [`[${Mname}]击碎了你的的[${data[0].name}]`, `\n你重伤倒地,奄奄一息~`],
      {
        quote: e.msg_id
      }
    )
  } else {
    e.reply([`被[${Mname}]重伤倒地!`])
  }
  return false
}
async function isUser(UID) {
  return user.findOne({
    where: {
      uid: UID
    },
    raw: true
  })
}
async function isThereAUserPresent(e, UID) {
  const UserData = await user.findOne({
    attributes: ['uid'],
    where: {
      uid: UID
    },
    raw: true
  })
  if (UserData) return true
  e.reply('请先[/踏入仙途]')
  return false
}
async function isThereAUserPresentB(e, UID) {
  const UserData = await user.findOne({
    attributes: ['uid'],
    where: {
      uid: UID
    },
    raw: true
  })
  if (UserData) return true
  e.reply('查无此人')
  return false
}
async function victoryCooling(e, UID, CDID) {
  const { state, msg } = await cooling(UID, CDID)
  if (state == 4001) {
    e.reply(msg)
    return false
  }
  return true
}
async function activityCooling(e, UID, name) {
  const at = await activity.findOne({
    where: {
      name: name
    },
    raw: true
  })
  const time = new Date().getTime()
  if (time <= at.start_time || time >= at.end_time) {
    e.reply(`${name}已关闭`)
    return false
  }
  const gaspractice = await read$6(UID, 1).then(item => item.realm)
  const bodypractice = await read$6(UID, 2).then(item => item.realm)
  const soul = await read$6(UID, 3).then(item => item.realm)
  if (
    gaspractice < at.gaspractice ||
    bodypractice < at.bodypractice ||
    soul < at.soul
  ) {
    e.reply('境界不足')
    return false
  }
  return true
}
async function activityCoolingNot(UID, name) {
  const at = await activity.findOne({
    where: {
      name: name
    },
    raw: true
  })
  const time = new Date().getTime()
  if (time <= at.start_time || time >= at.end_time) {
    return false
  }
  const gaspractice = await read$6(UID, 1).then(item => item.realm)
  const bodypractice = await read$6(UID, 2).then(item => item.realm)
  const soul = await read$6(UID, 3).then(item => item.realm)
  if (
    gaspractice < at.gaspractice ||
    bodypractice < at.bodypractice ||
    soul < at.soul
  ) {
    return false
  }
  return true
}
async function endAllWord(e, UID, UserData) {
  const mapText = {
    1: '只是呆了一会儿',
    2: '走累了,就停一停吧',
    8: '不太专注的放弃了'
  }
  if (!mapText[UserData.state]) {
    setTimeout(() => {
      e.reply(['哎哟', '你干嘛'])
    }, 1000)
    return true
  }
  const startTime = UserData.state_start_time
  let time = Math.floor((new Date().getTime() - startTime) / 60000)
  if (isNaN(time)) time = 10
  if (time <= 1) {
    setTimeout(() => {
      e.reply([`${mapText[UserData.state]}...`])
    }, 1000)
    await del$7(UID)
    return true
  }
  const map = {
    1: async () => {
      await upgrade(e, UID, time, 0, 1, UserData)
    },
    2: async () => {
      await upgrade(e, UID, time, 1, 2, UserData)
    },
    8: async () => {
      await condensateGas(e, UID, time, UserData)
    }
  }
  await map[UserData.state]()
  await del$7(UID)
  return true
}
async function condensateGas(e, UID, time, UserData) {
  const size = Math.floor((time * (UserData.talent_size + 100)) / 100)
  const limit = UserData.special_spiritual_limit
  let special_spiritual = UserData.special_spiritual
  special_spiritual += size
  if (special_spiritual >= limit) {
    special_spiritual = limit
  }
  await update$1(UID, {
    special_spiritual: special_spiritual
  })
  setTimeout(() => {
    e.reply([`聚灵成功\n当前灵力${special_spiritual}/${limit}`])
  }, 1000)
}
async function upgrade(e, UID, time, key, type, UserData) {
  const config = {
    1: work_size,
    0: biguan_size
  }
  let other = Math.floor(
    (config[key] * time * (UserData.talent_size + 100)) / 100
  )
  if (Math.random() * (100 - 1) + 1 < 20) {
    other -= Math.floor(other / 3)
  }
  if (isNaN(other)) {
    other = 1
  }
  const msg = []
  if (type != 1) {
    msg.push(`锻体凝脉\n[气血]*${other}`)
  } else {
    msg.push(`闭关结束\n[修为]*${other}`)
    const blood = await addBlood(UserData, time * 10)
    msg.push(`\n[血量]恢复了${time * 10 >= 100 ? 100 : time * 10}%`)
    msg.push(`\n🩸${blood}`)
  }
  await addExperience$1(UID, type, other)
  setTimeout(() => {
    e.reply(msg, {
      quote: e.msg_id
    })
  }, 1000)
}

async function write(UID, DATA) {
  await user_log.create({
    ...DATA,
    uid: UID
  })
}
async function del$4(UID) {
  await user_log.destroy({
    where: {
      uid: UID
    }
  })
}
async function read$4(UID) {
  const da = await user_log.findAll({
    attributes: ['type', 'create_time', 'message'],
    where: {
      uid: UID
    },
    order: [['create_time', 'DESC']],
    limit: 10,
    raw: true
  })
  const arr = []
  for await (const item of da) {
    arr.push({
      type: item.type,
      create_time: timeChange(item.create_time),
      message: item.message
    })
  }
  return arr
}

async function add$1(UID, name) {
  await user_skills.create({
    uid: UID,
    name
  })
}
async function del$3(UID, name) {
  await user_skills.destroy({
    where: {
      uid: UID,
      name
    }
  })
}
async function get$2(UID) {
  const data = await user_skills.findAll({
    where: {
      uid: UID
    },
    raw: true
  })
  return data
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
  await update$1(UID, {
    talent: talent,
    talent_size: size + skill
  })
  return true
}

const start_time$1 = '2023-10-02 12:00'
const end_time = '2023-10-02 23:59'
async function add(UID, time) {
  await user_compensate.create({
    uid: UID,
    time: time
  })
}
async function read$3(UID, time) {
  const data = await user_compensate.findOne({
    where: {
      time,
      uid: UID
    },
    raw: true
  })
  return data
}
async function verify(UID) {
  const currentTime = new Date().getTime(),
    startTime = new Date(start_time$1).getTime(),
    endTime = new Date(end_time).getTime()
  if (currentTime < startTime || currentTime > endTime) {
    return false
  }
  const CompensateData = await read$3(UID, start_time$1)
  if (CompensateData) return false
  await add(UID, start_time$1)
  return true
}

async function read$2(ID) {
  const data = await auction.findOne({
    where: {
      id: Number(ID)
    },
    raw: true
  })
  return data
}
async function del$2(ID) {
  await auction.destroy({
    where: {
      id: Number(ID)
    }
  })
}
async function update(ID, val) {
  await auction.update(val, {
    where: {
      id: Number(ID)
    }
  })
}
async function create$2(val) {
  await auction.create(val)
}

async function read$1(ID) {
  const data = await exchange.findOne({
    where: {
      id: Number(ID)
    },
    raw: true
  })
  return data
}
async function del$1(ID) {
  await exchange.destroy({
    where: {
      id: Number(ID)
    }
  })
}
async function create$1(val) {
  await exchange.create(val)
}

async function read(ID) {
  const data = await board.findOne({
    where: {
      id: Number(ID)
    },
    raw: true
  })
  return data
}
async function del(ID) {
  await board.destroy({
    where: {
      id: Number(ID)
    }
  })
}
async function create(val) {
  await board.create(val)
}

async function setPlayer(UID, user_avatar) {
  return levels
    .findAll({
      attributes: ['blood'],
      where: {
        grade: 0,
        type: [1, 2]
      },
      order: [['type', 'DESC']],
      raw: true
    })
    .then(async res => {
      const levelist = res
      if (!levelist || levelist.length == 0) return false
      const [gaspractice, bodypractice] = levelist
      return map_point
        .findOne({
          where: {
            name: '极西传送阵'
          },
          raw: true
        })
        .then(async res => {
          const point = res
          if (!point || !point?.type) return false
          return Promise.all([
            user.create({
              uid: UID,
              name: Anyarray([
                '甲',
                '乙',
                '丙',
                '丁',
                '戊',
                '己',
                '庚',
                '辛',
                '壬',
                '癸'
              ]),
              avatar: user_avatar,
              state: 0,
              state_start_time: 9999999999,
              state_end_time: 9999999999,
              age: 1,
              age_limit: 100,
              point_type: point.type,
              pont_attribute: point.attribute,
              pont_x: point.x,
              pont_y: point.y,
              pont_z: point.z,
              battle_blood_now: gaspractice.blood + bodypractice.blood,
              battle_blood_limit: gaspractice.blood + bodypractice.blood,
              battle_attack: 0,
              battle_defense: 0,
              battle_speed: 0,
              battle_power: 0,
              talent: getTalent(),
              create_time: new Date().getTime()
            }),
            user_level.create({
              uid: UID,
              type: 1,
              addition: 0,
              realm: 0,
              experience: 0
            }),
            user_level.create({
              uid: UID,
              type: 2,
              addition: 0,
              realm: 0,
              experience: 0
            }),
            user_level.create({
              uid: UID,
              type: 3,
              addition: 0,
              realm: 0,
              experience: 0
            })
          ])
        })
    })
}
async function updatePlayer(UID, user_avatar) {
  return Promise.all([
    user.destroy({
      where: {
        uid: UID
      }
    }),
    user_level.destroy({
      where: {
        uid: UID
      }
    }),
    user_equipment.destroy({
      where: {
        uid: UID
      }
    }),
    user_skills.destroy({
      where: {
        uid: UID
      }
    }),
    user_bag.destroy({
      where: {
        uid: UID
      }
    }),
    user_log.destroy({
      where: {
        uid: UID
      }
    }),
    user_fate.destroy({
      where: {
        uid: UID
      }
    }),
    user_ring.destroy({
      where: {
        uid: UID
      }
    })
  ]).then(() => setPlayer(UID, user_avatar))
}

const Sneakattack = [
  '[A]想偷袭,[B]一个转身就躲过去了',
  '[A]偷袭,可刹那间连[B]的影子都看不到',
  '[A]找准时机,突然暴起冲向[B],但是[B]反应及时,[B]反手就把[A]打死了',
  '[A]突然一个左勾拳,谁料[B]揭化发,击败了[A]',
  '[A]一拳挥出,如流云遁日般迅疾轻捷,风声呼啸,草飞沙走,看似灵巧散漫,实则花里胡哨,[B]把[A]打得口吐鲜血,身影急退,掉落山崖而亡',
  '[A]拳之上凝结了庞大的气势,金色的光芒遮天蔽日,一条宛若黄金浇铸的真龙形成,浩浩荡荡地冲向[B],但[A]招式过于花里胡哨,[B]一个喷嚏就把[A]吹晕了',
  '[A]打的山崩地裂，河水倒卷，余波万里,可恶,是幻境,什么时候![B]突然偷袭,背后一刀捅死了[A]'
]
function start(UserA, UserB) {
  const msg = [],
    HurtA = {
      original: 0,
      outbreak: 0
    },
    HurtB = {
      original: 0,
      outbreak: 0
    }
  let victory = '0'
  const sizeA = UserA.battle_attack - UserB.battle_defense
  HurtA.original = sizeA > 50 ? sizeA : 50
  HurtA.outbreak = Math.floor(
    (HurtA.original * (100 + UserA.battle_critical_damage)) / 100
  )
  const Aac = () => {
    if (isProbability(UserA.battle_critical_hit)) {
      UserB.battle_blood_now -= HurtA.outbreak
      msg.push(
        `\n老六[${UserA.name}]偷袭成功,对[${UserB.name}]造成 ${HurtA.outbreak} 暴击伤害`
      )
    } else {
      UserB.battle_blood_now -= HurtA.original
      msg.push(
        `\n老六[${UserA.name}]偷袭成功,对[${UserB.name}]造成 ${HurtA.original} 普通伤害`
      )
    }
  }
  if (UserA.battle_speed < UserB.battle_speed - 5) {
    msg.push(
      `\n${Sneakattack[Math.floor(Math.random() * 2)]
        .replace('A', UserA.name)
        .replace('B', UserB.name)}`
    )
  } else {
    Aac()
    if (UserB.battle_blood_now < 1) {
      msg.push(`\n[${UserA.name}]仅出此招,就击败了[${UserB.name}]!`)
      UserB.battle_blood_now = 0
      return {
        battle_blood_now: {
          a: UserA.battle_blood_now,
          b: UserB.battle_blood_now
        },
        victory: UserA.uid,
        msg
      }
    }
  }
  const sizeB = UserB.battle_attack - UserA.battle_defense
  HurtB.original = sizeB > 50 ? sizeB : 50
  HurtB.outbreak = Math.floor(
    (HurtB.original * (100 + UserB.battle_critical_damage)) / 100
  )
  const Bac = () => {
    if (isProbability(UserB.battle_critical_hit)) {
      UserA.battle_blood_now -= HurtB.outbreak
      msg.push(
        `\n第${round}回合,[${UserB.name}]对[${UserA.name}]造成 ${HurtB.outbreak} 暴击伤害`
      )
    } else {
      UserA.battle_blood_now -= HurtB.original
      msg.push(
        `\n第${round}回合,[${UserB.name}]对[${UserA.name}]造成 ${HurtB.original} 普通伤害`
      )
    }
  }
  let round = 0,
    T = true
  while (T) {
    round++
    Bac()
    if (UserA.battle_blood_now <= 0) {
      const replacements = {
        A: UserA.name,
        B: UserB.name
      }
      victory = UserB.uid
      UserB.battle_blood_now =
        UserB.battle_blood_now >= 0 ? UserB.battle_blood_now : 0
      UserA.battle_blood_now = 0
      msg.push(
        `\n${Sneakattack[Math.ceil(Math.random() * 5) + 1].replace(/A|B/g, match => replacements[match])}`
      )
      T = false
      break
    }
    if (round >= 16) {
      msg.push(
        `\n[${UserA.name}]与[${UserB.name}]势均力敌.经过了${round}回合都奈何不了对方`
      )
      T = false
      break
    }
    Aac()
    if (UserB.battle_blood_now <= 0) {
      const replacements = {
        A: UserB.name,
        B: UserA.name
      }
      victory = UserA.uid
      UserA.battle_blood_now =
        UserA.battle_blood_now >= 0 ? UserA.battle_blood_now : 0
      UserB.battle_blood_now = 0
      msg.push(
        `\n${Sneakattack[Math.ceil(Math.random() * 5) + 1].replace(/A|B/g, match => replacements[match])}`
      )
      T = false
      break
    }
  }
  return {
    battle_blood_now: {
      a: UserA.battle_blood_now,
      b: UserB.battle_blood_now
    },
    victory,
    msg
  }
}

async function get$1(key) {
  const data = await Redis.get(key)
  if (data) {
    return convert(data)
  }
  return convert('{"time": 99, "resources": {}}')
}
function convert(data) {
  const db = JSON.parse(data)
  if (typeof db == 'string') {
    return JSON.parse(db)
  }
  return db
}
async function set$2(key, data) {
  Redis.set(key, JSON.stringify(data))
}
async function cache(key, i, create) {
  const data = await get$1(`${key}:${i}`)
  if (data.time == new Date().getHours()) {
    return data.resources
  }
  data.time = new Date().getHours()
  data.resources = create(i)
  set$2(`${key}:${i}`, JSON.stringify(data))
  return data.resources
}

const map$1 = {
    1: '1.4',
    2: '1.8',
    3: '2.11',
    4: '4.14',
    5: '7.17',
    6: '10.20',
    7: '10.23',
    8: '10.26',
    9: '10.29',
    10: '20.32',
    11: '20.35',
    12: '20.38',
    13: '30.42'
  },
  full = await monster
    .findAll({
      raw: true
    })
    .then(res => {
      const data = res
      return data
    })
function createMonster(i) {
  const [mini, max] = map$1[i].split('.')
  const monsters = {}
  const maxSize = max > 10 ? 10 : max
  for (let j = 0; j < maxSize; j++) {
    const alevel = Math.floor(Math.random() * (max - mini + 1) + Number(mini))
    const now = full.filter(item => alevel > item.grade)
    const mon = now[Math.floor(Math.random() * now.length)]
    if (!Object.prototype.hasOwnProperty.call(monsters, mon.name)) {
      monsters[mon.name] = {
        type: mon.type,
        level: alevel,
        acount: 150 - alevel * 2
      }
    }
  }
  return monsters
}
async function reduce$1(i, name, size = 1) {
  const data = await get$1(`${RedisMonster}:${i}`)
  if (!data.resources[name]) return
  data.resources[name].acount -= size
  if (data.resources[name].acount <= 1) {
    delete data.resources[name]
  }
  set$2(`${RedisMonster}:${i}`, data)
  return
}
async function monsterscache(i) {
  return await cache(RedisMonster, i, createMonster)
}

const amap = {
    1: '1.2',
    2: '1.2',
    3: '1.2',
    4: '1.2',
    5: '1.3',
    6: '1.3',
    7: '1.3',
    8: '1.4',
    9: '1.4',
    10: '1.4',
    11: '2.4',
    12: '2.4',
    13: '2.4'
  },
  map = {
    1: '12000.15000',
    2: '1100.1400',
    3: '100.130',
    4: '9.12'
  },
  cmap = {
    1: '25.35',
    2: '25.35',
    3: '25.35',
    4: '25.35',
    5: '20.30',
    6: '20.30',
    7: '20.30',
    8: '15.25',
    9: '15.25',
    10: '15.25',
    11: '10.20',
    12: '10.20',
    13: '10.20'
  }
function createExplore(i) {
  const data = {},
    size = i > 8 ? 8 : i
  for (let j = 0; j < size; j++) {
    const [amini, amax] = amap[i].split('.')
    const grade = Math.floor(Math.random() * (amax - amini + 1)) + Number(amini)
    const [mini, max] = map[grade].split('.')
    const money = Math.floor(Math.random() * (max - mini + 1)) + Number(mini)
    const [cmini, cmax] = cmap[i].split('.')
    const acount =
      Math.floor(Math.random() * (cmax - cmini + 1)) + Number(cmini)
    const dmini = 1000,
      dmax = 9999
    const a = Math.floor(Math.random() * (dmax - dmini + 1)) + Number(dmini)
    data[a] = {
      money: money,
      grade: grade,
      spiritual: grade + 2,
      acount: acount
    }
  }
  return data
}
async function reduce(i, name, size = 1) {
  const data = await get$1(`${RedisExplore}:${i}`)
  if (!data.resources[name]) return
  data.resources[name].acount -= size
  if (data.resources[name].acount <= 1) {
    delete data.resources[name]
  }
  set$2(`${RedisExplore}:${i}`, data)
  return
}
async function explorecache(i) {
  return await cache(RedisExplore, i, createExplore)
}

const v = async (UID, name, size = 4) => {
  const aData = await ass.findOne({
    where: {
      name: name
    },
    include: [
      {
        model: ass_typing
      }
    ],
    raw: true
  })
  if (!aData) {
    return false
  }
  const UserAss = await user_ass.findOne({
    where: {
      uid: UID,
      aid: aData.id
    },
    raw: true
  })
  if (!UserAss || UserAss?.authentication == 9) {
    return false
  }
  if (UserAss.authentication >= size) {
    return '权能不足'
  }
  return { aData, UserAss }
}

async function get(key) {
  return await Redis.get(`${ReadiName}:${key}:lace`)
}
function set$1(key, val) {
  Redis.set(`${ReadiName}:${key}:lace`, val)
}

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
async function setJob(UID, x, y, z, size) {
  await set$4(UID, {
    actionID: 3,
    startTime: new Date().getTime(),
    endTime: 99999999999
  })
  await QUEUE.add(
    UID,
    {
      UID,
      x,
      y,
      z,
      size: Math.floor(size)
    },
    {
      jobId: UID,
      repeat: {
        pattern: '*/3 * * * * *'
      }
    }
  )
  Redis.set(`${RedisBullAction}:${UID}:action`, '0')
  return
}
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
  del$7(UID)
  return
}
function estimateTotalExecutionTime(pont_x, pont_y, x, y, size, stepTime) {
  const distanceX = Math.abs(x - pont_x)
  const distanceY = Math.abs(y - pont_y)
  const stepsX = Math.ceil(distanceX / size)
  const stepsY = Math.ceil(distanceY / size)
  const totalSteps = stepsX + stepsY
  const totalExecutionTime = totalSteps * stepTime
  const hours = Math.floor(totalExecutionTime / (1000 * 60 * 60))
  const minutes = Math.floor(
    (totalExecutionTime % (1000 * 60 * 60)) / (1000 * 60)
  )
  const seconds = Math.floor((totalExecutionTime % (1000 * 60)) / 1000)
  const milliseconds = totalExecutionTime % 1000
  return {
    hours,
    minutes,
    seconds,
    milliseconds,
    totalMilliseconds: totalExecutionTime
  }
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

class SkyTower extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?进入通天塔$/,
          fnc: 'join'
        },
        {
          reg: /^(#|\/)?通天塔$/,
          fnc: 'showSky'
        },
        {
          reg: /^(#|\/)?挑战\d+$/,
          fnc: 'battle'
        }
      ]
    })
  }
  async join(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    if (!(await activityCooling(e, UID, '通天塔'))) return
    const data = await sky.findOne({
      where: {
        uid: UID
      },
      raw: true
    })
    if (data) {
      e.reply('已进入', {
        quote: e.msg_id
      })
      return
    }
    if (await activityCoolingNot(UID, '通天塔奖励')) {
      const UserData = await user.findOne({
        where: {
          uid: UID
        },
        raw: true
      })
      const BagSize = await backpackFull$1(UID, UserData.bag_grade)
      if (!BagSize) {
        e.reply(['储物袋空间不足'], {
          quote: e.msg_id
        })
        return
      }
      await addBagThing(UID, UserData.bag_grade, [
        {
          name: '月中剑',
          acount: 1
        }
      ])
      e.reply(['进入[通天塔]\n获得[月中剑]*1'], {
        quote: e.msg_id
      })
    } else {
      e.reply(['进入[通天塔]'], {
        quote: e.msg_id
      })
    }
    await sky.create({
      uid: UID
    })
    return
  }
  async showSky(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    if (!(await activityCooling(e, UID, '通天塔'))) return
    const data = await sky.findOne({
      where: {
        uid: UID
      },
      raw: true
    })
    if (!data) {
      e.reply('未进入', {
        quote: e.msg_id
      })
      return
    }
    const img = await getSkyComponent(await showSky(UID), UID)
    if (typeof img != 'boolean') e.reply(img)
    return
  }
  async battle(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    if (!(await activityCooling(e, UID, '通天塔'))) return
    const CDID = 23,
      CDTime = CD_B
    if (!(await victoryCooling(e, UID, CDID))) return
    const data = await sky.findOne({
      where: {
        uid: UID
      },
      raw: true
    })
    if (!data) {
      e.reply('😃未进入', {
        quote: e.msg_id
      })
      return
    }
    const id = Number(e.msg.replace(/^(#|\/)?挑战/, ''))
    if (id == data.id) {
      e.reply('😅你干嘛', {
        quote: e.msg_id
      })
      return
    }
    set$3(UID, CDID, CDTime)
    const list = await sky.findAll({
      where: {
        id: [1, 2, 3, data.id - 1]
      },
      raw: true
    })
    const udata = list.find(item => item.id == id)
    if (!udata) {
      e.reply('😃该位置无法发起挑战', {
        quote: e.msg_id
      })
      return
    }
    const UserData = await user.findOne({
      where: {
        uid: UID
      }
    })
    const UserDataB = await user.findOne({
      where: {
        uid: udata.uid
      }
    })
    const BMSG = start(UserData, UserDataB)
    if (UserData.battle_show || UserDataB.battle_show) {
      sendReply(e, '[战斗结果]', BMSG.msg)
    }
    if (BMSG.victory == '0') {
      e.reply('🤪挑战失败,你与对方打成了平手', {
        quote: e.msg_id
      })
      return
    }
    if (BMSG.victory != UID) {
      e.reply('🤪挑战失败,你被对方击败了', {
        quote: e.msg_id
      })
      return
    }
    await sky.update(
      {
        uid: data.uid
      },
      {
        where: {
          id: udata.id
        }
      }
    )
    await sky.update(
      {
        uid: udata.uid
      },
      {
        where: {
          id: data.id
        }
      }
    )
    e.reply(`😶挑战成功,当前排名${udata.id}`, {
      quote: e.msg_id
    })
    return
  }
}

class AssManage extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?审核[\u4e00-\u9fa5]+$/,
          fnc: 'ruleAss'
        },
        {
          reg: /^(#|\/)?通过\d+$/,
          fnc: 'decisionAss'
        },
        {
          reg: /^(#|\/)?踢出\d+$/,
          fnc: 'dismissAss'
        },
        {
          reg: /^(#|\/)?扩建$/,
          fnc: 'improreAss'
        },
        {
          reg: /^(#|\/)?扩建宝库$/,
          fnc: 'improreAssTreasure'
        },
        {
          reg: /^(#|\/)?提拔.*$/,
          fnc: 'promoteAss'
        },
        {
          reg: /^(#|\/)?贬职.*$/,
          fnc: 'demotionAss'
        }
      ]
    })
  }
  async ruleAss(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const name = e.msg.replace(/^(#|\/)?审核/, '')
    const v$1 = await v(UID, name)
    if (v$1 === false) return
    if (v$1 === '权能不足') {
      e.reply(v$1)
      return
    }
    const { aData } = v$1
    const uData = await user_ass.findAll({
      where: {
        aid: aData.id,
        identity: ASS_IDENTITY_MAP['9']
      },
      include: [
        {
          model: user
        }
      ],
      raw: true
    })
    if (!uData || uData.length == 0) {
      e.reply('暂无申请')
      return
    }
    const msg = []
    for (const item of uData) {
      msg.push(
        `\n标记:${item.id}_编号:${item['user.uid']}\n昵称:${item['user.name']}`
      )
    }
    sendReply(e, `[${aData.name}名录]`, msg)
    return
  }
  async decisionAss(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const id = Number(e.msg.replace(/^(#|\/)?通过/, ''))
    if (!id) return
    const uData = await user_ass.findOne({
      where: {
        id: Number(id),
        identity: ASS_IDENTITY_MAP['9']
      },
      include: [
        {
          model: ass
        }
      ],
      raw: true
    })
    if (!uData) return
    const v$1 = await v(UID, uData['ass.name'])
    if (v$1 === false) return
    if (v$1 === '权能不足') {
      e.reply(v$1)
      return
    }
    const { aData } = v$1
    const data = await user_ass.findAll({
      where: {
        aid: aData.id,
        identity: { [Op.ne]: ASS_IDENTITY_MAP['9'] }
      },
      raw: true
    })
    if (data.length >= (aData.grade + 1) * 5) {
      e.reply('人数已达上限', {
        quote: e.msg_id
      })
      return
    }
    await user_ass
      .update(
        {
          identity: ASS_IDENTITY_MAP['8']
        },
        {
          where: {
            id: Number(id)
          }
        }
      )
      .then(() => {
        e.reply('审核通过', {
          quote: e.msg_id
        })
      })
      .catch(() => {
        e.reply('审核失败', {
          quote: e.msg_id
        })
      })
    return
  }
  async dismissAss(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const id = Number(e.msg.replace(/^(#|\/)?踢出/, ''))
    if (!id) return
    const uData = await user_ass.findOne({
      where: {
        id: Number(id)
      },
      include: [
        {
          model: ass
        }
      ],
      raw: true
    })
    if (!uData) return
    const v$1 = await v(UID, uData['ass.name'])
    if (v$1 === false) return
    if (v$1 === '权能不足') {
      e.reply(v$1)
      return
    }
    const { UserAss } = v$1
    if (uData.authentication <= UserAss.authentication) {
      e.reply('权能过低')
      return
    }
    await user_ass
      .destroy({
        where: {
          id: Number(id)
        }
      })
      .then(() => {
        e.reply('踢出成功', {
          quote: e.msg_id
        })
      })
      .catch(() => {
        e.reply('踢出失败', {
          quote: e.msg_id
        })
      })
    return
  }
  async improreAss(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UIDData = await user_ass.findOne({
      where: {
        uid: UID
      },
      include: [
        {
          model: ass
        }
      ],
      raw: true
    })
    const v$1 = await v(UID, UIDData['ass.name'])
    if (v$1 === false) return
    if (v$1 === '权能不足') {
      e.reply(v$1)
      return
    }
    if (UIDData['ass.grade'] > 4) return e.reply('宗门等级已达最高')
    const goods = await searchBagByName(UID, '开天令')
    const num = upgradeass[UIDData['ass.grade']]
    if (!goods) return e.reply('你没有开天令')
    if (goods.acount < num) return e.reply('开天令不足')
    reduceBagThing(UID, [{ name: '开天令', acount: num }])
    await ass.update(
      { grade: UIDData['ass.grade'] + 1 },
      {
        where: {
          id: UIDData.aid
        }
      }
    )
    await e.reply('扩建成功')
    return
  }
  async improreAssTreasure(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UIDData = await user_ass.findOne({
      where: {
        uid: UID
      },
      include: [
        {
          model: ass
        }
      ],
      raw: true
    })
    const v$1 = await v(UID, UIDData['ass.name'])
    if (v$1 === false) return
    if (v$1 === '权能不足') {
      e.reply(v$1)
      return
    }
    if (UIDData['ass.bag_grade'] > 4) return e.reply('宗门宝库等级已达最高')
    const goods = await searchBagByName(UID, '开天令')
    const num = upgradeass[UIDData['ass.bag_grade']]
    if (!goods) return e.reply('你没有开天令')
    if (goods.acount < num) return e.reply('开天令不足')
    reduceBagThing(UID, [{ name: '开天令', acount: num }])
    await ass
      .update(
        {
          bag_grade: UIDData['ass.bag_grade'] + 1
        },
        {
          where: {
            id: UIDData.aid
          }
        }
      )
      .then(() => {
        e.reply('升级完成', {
          quote: e.msg_id
        })
      })
      .catch(() => {
        e.reply('升级失败', {
          quote: e.msg_id
        })
      })
    return
  }
  async promoteAss(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const id = e.msg.replace(/^(#|\/)?提拔/, '')
    if (!id) return
    const uData = await user_ass.findOne({
      where: {
        uid: id
      },
      include: [
        {
          model: ass
        }
      ],
      raw: true
    })
    if (!uData) return
    if (!(uData.authentication - 1)) return e.reply('权能已达最高')
    const v$1 = await v(UID, uData['ass.name'])
    if (v$1 === false) return
    if (v$1 === '权能不足') {
      e.reply(v$1)
      return
    }
    const { UserAss } = v$1
    if (uData.authentication <= UserAss.authentication) {
      e.reply('权能过低')
      return
    }
    uData.authentication -= 1
    uData.identity = ASS_IDENTITY_MAP[uData.authentication]
    await user_ass
      .update(uData, {
        where: {
          uid: id
        }
      })
      .then(() => {
        e.reply('提拔成功', {
          quote: e.msg_id
        })
      })
      .catch(() => {
        e.reply('提拔失败', {
          quote: e.msg_id
        })
      })
    return
  }
  async demotionAss(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const id = e.msg.replace(/^(#|\/)?贬职/, '')
    if (!id) return
    const uData = await user_ass.findOne({
      where: {
        uid: id
      },
      include: [
        {
          model: ass
        }
      ],
      raw: true
    })
    if (!uData) return
    if (uData.authentication == 9) return e.reply('权能已达最低')
    const v$1 = await v(UID, uData['ass.name'])
    if (v$1 === false) return
    if (v$1 === '权能不足') {
      e.reply(v$1)
      return
    }
    const { UserAss } = v$1
    if (uData.authentication <= UserAss.authentication) {
      e.reply('权能过低')
      return
    }
    uData.authentication += 1
    await user_ass
      .update(uData, {
        where: {
          uid: id
        }
      })
      .then(() => {
        e.reply('贬职成功', {
          quote: e.msg_id
        })
      })
      .catch(() => {
        e.reply('贬职失败', {
          quote: e.msg_id
        })
      })
    return
  }
}

class AssStart extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?建立[\u4e00-\u9fa5]+$/,
          fnc: 'createAss'
        },
        {
          reg: /^(#|\/)?解散$/,
          fnc: 'delAss'
        },
        {
          reg: /^(#|\/)?加入[\u4e00-\u9fa5]+$/,
          fnc: 'joinAss'
        },
        {
          reg: /^(#|\/)?退出[\u4e00-\u9fa5]+$/,
          fnc: 'exitAss'
        }
      ]
    })
  }
  async createAss(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const gaspractice = await read$6(UID, 1).then(item => item.realm)
    if (gaspractice <= AssLevel) {
      e.reply('境界不足', {
        quote: e.msg_id
      })
      return false
    }
    const UserAss = await user_ass.findOne({
      where: {
        uid: UID,
        identity: ASS_IDENTITY_MAP['0']
      },
      raw: true
    })
    if (UserAss) {
      e.reply('已创立个人势力', {
        quote: e.msg_id
      })
      return
    }
    const NAME = e.msg.replace(/^(#|\/)?建立/, '')
    const typing = NAME.match(/.$/)[0]
    if (!Object.prototype.hasOwnProperty.call(ASS_TYPING_MAP, typing)) {
      e.reply([
        '该类型势力不可建立:',
        typing,
        '\n仅可建立(宗|派|门|峰|教|谷|洞|阁|组|堡|城|宫|国|会)'
      ])
      return
    }
    const aData = await ass.findOne({
      where: {
        name: NAME
      },
      raw: true
    })
    if (aData) {
      e.reply('该势力已存在', {
        quote: e.msg_id
      })
      return
    }
    const lingshi = await searchBagByName(UID, '下品灵石')
    const number = AssNumer
    if (!lingshi || lingshi.acount < number) {
      e.reply([`\n需要确保拥有[下品灵石]*${number}`], {
        quote: e.msg_id
      })
      return
    } else {
      e.reply([`扣除[下品灵石]*${number}`], {
        quote: e.msg_id
      })
    }
    await reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: number
      }
    ])
    await ass
      .create({
        create_time: new Date().getTime(),
        name: NAME,
        property: number,
        typing: ASS_TYPING_MAP[typing]
      })
      .then(async res => {
        const aData = await ass.findOne({
          where: {
            name: NAME
          },
          raw: true
        })
        if (!aData) {
          e.reply('创建失败', {
            quote: e.msg_id
          })
          return
        }
        await user_ass.create({
          create_tiime: new Date().getTime(),
          uid: UID,
          aid: aData.id,
          authentication: 0,
          identity: ASS_IDENTITY_MAP['0']
        })
        e.reply(['成功建立', NAME], {
          quote: e.msg_id
        })
      })
    return
  }
  async delAss(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserAss = await user_ass.findOne({
      where: {
        uid: UID,
        identity: ASS_IDENTITY_MAP['0']
      },
      raw: true
    })
    if (!UserAss) {
      e.reply('未创立个人势力', {
        quote: e.msg_id
      })
      return
    }
    if (!delCooling[UID] || delCooling[UID] + 30000 < new Date().getTime()) {
      delCooling[UID] = new Date().getTime()
      e.reply(
        [
          '[重要提示]',
          '\n解散将清除所有数据且不可恢复',
          '\n请30s内再次发送',
          '\n[(#|/)解散]',
          '\n以确认解散'
        ],
        {
          quote: e.msg_id
        }
      )
      return
    }
    const id = UserAss.aid
    await user_ass.destroy({
      where: {
        aid: id
      }
    })
    await ass_bag.destroy({
      where: {
        aid: id
      }
    })
    await ass.destroy({
      where: {
        id: id
      }
    })
    e.reply(['成功解散'], {
      quote: e.msg_id
    })
    return
  }
  async joinAss(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserAss = await user_ass.findOne({
      where: {
        uid: UID,
        identity: ASS_IDENTITY_MAP['0']
      },
      raw: true
    })
    if (UserAss) {
      e.reply('已创立个人势力', {
        quote: e.msg_id
      })
      return
    }
    const name = e.msg.replace(/^(#|\/)?加入/, '')
    const aData = await ass.findOne({
      where: {
        name: name
      },
      raw: true
    })
    if (!aData) {
      e.reply('该势力不存在', {
        quote: e.msg_id
      })
      return
    }
    await user_ass.create({
      create_tiime: new Date().getTime(),
      uid: UID,
      aid: aData.id,
      authentication: 9,
      identity: ASS_IDENTITY_MAP['9']
    })
    e.reply('已提交申请', {
      quote: e.msg_id
    })
    return
  }
  async exitAss(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const name = e.msg.replace(/^(#|\/)?退出/, '')
    const aData = await ass.findOne({
      where: {
        name: name
      },
      raw: true
    })
    if (!aData) {
      e.reply('该势力不存在', {
        quote: e.msg_id
      })
      return
    }
    const UserAss = await user_ass.findOne({
      where: {
        uid: UID,
        aid: aData.id,
        identity: ASS_IDENTITY_MAP['0']
      },
      raw: true
    })
    if (UserAss) {
      e.reply('个人势力不可退出', {
        quote: e.msg_id
      })
      return
    }
    if (
      !exiteCooling[UID] ||
      exiteCooling[UID] + 30000 < new Date().getTime()
    ) {
      exiteCooling[UID] = new Date().getTime()
      e.reply(['[重要提示]', '\n请30s内再次发送', '\n以确认退出'], {
        quote: e.msg_id
      })
      return
    }
    await user_ass
      .destroy({
        where: {
          uid: UID,
          aid: aData.id
        }
      })
      .then(() => {
        e.reply('已退出' + name, {
          quote: e.msg_id
        })
      })
  }
}
const delCooling = {}
const exiteCooling = {}

class AssSsers extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?势力信息$/,
          fnc: 'messageAss'
        },
        {
          reg: /^(#|\/)?查看[\u4e00-\u9fa5]+$/,
          fnc: 'mAss'
        },
        {
          reg: /^(#|\/)?天下\d*$/,
          fnc: 'world'
        }
      ]
    })
  }
  async world(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const p = e.msg.replace(/^(#|\/)?天下/, '')
    const page = p == '' ? 1 : Number(p)
    const pageSize$1 = pageSize
    const totalCount = await ass.count()
    const totalPages = Math.ceil(totalCount / pageSize$1)
    if (page > totalPages) return
    const AuctionData = await ass.findAll({
      raw: true,
      limit: pageSize,
      offset: (page - 1) * pageSize
    })
    const msg = []
    for (const item of AuctionData) {
      msg.push(
        `\n🏹[${item.name}]-${item.grade ?? 0}\n⚔活跃:${item.activation}🗡名气:${item.fame}`
      )
    }
    sendReply(e, `___[天下]___(${page}/${totalPages})`, msg)
    return
  }
  async messageAss(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserAss = await user_ass.findAll({
      where: {
        uid: UID
      },
      include: [
        {
          model: ass,
          include: [
            {
              model: ass_typing
            }
          ]
        }
      ],
      raw: true
    })
    if (!UserAss || UserAss?.length == 0) {
      e.reply('未加入任何势力', {
        quote: e.msg_id
      })
      return
    }
    for (const item of UserAss) {
      if (item.identity == ASS_IDENTITY_MAP['9']) {
        e.reply([
          `🏹[${item['ass.name']}]-${item[`ass.ass_typing.${item.identity}`]}`
        ])
      } else {
        e.reply([
          `🏹[${item['ass.name']}]-${item['ass.grade']}`,
          `\n身份:${item[`ass.ass_typing.${item.identity}`]}`,
          `\n灵池:${item[`ass.property`]}`,
          `\n活跃:${item['ass.activation']}`,
          `\n名气:${item['ass.fame']}`,
          `\n贡献:${item['contribute']}`
        ])
      }
    }
    return
  }
  async mAss(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const name = e.msg.replace(/^(#|\/)?查看/, '')
    const v$1 = await v(UID, name)
    if (v$1 == false) return
    if (v$1 == '权能不足') {
      e.reply(v$1)
      return
    }
    const { aData } = v$1
    e.reply([
      `🏹[${aData['name']}]-${aData['grade']}`,
      `\n灵池:${aData[`property`]}`,
      `\n活跃:${aData['activation']}`,
      `\n名气:${aData['fame']}`
    ])
    const uData = await user_ass.findAll({
      where: {
        aid: aData.id,
        identity: { [Op.ne]: ASS_IDENTITY_MAP['9'] }
      },
      include: [
        {
          model: user
        }
      ],
      raw: true
    })
    const msg = []
    for (const item of uData) {
      console.log(item)
      msg.push(
        `\n🔹标记:${item.id}_道号[${item['user.name']}]\n身份:${aData[`ass_typing.${item.identity}`]}_贡献:${item['contribute']}`
      )
    }
    sendReply(e, `🏹[${aData['name']}]-${aData['grade']}`, msg)
    return
  }
}

class ClaimCareer extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?协会$/,
          fnc: 'association'
        },
        {
          reg: /^(#|\/)?炼器师学徒$/,
          fnc: 'craftsmanApprentice'
        },
        {
          reg: /^(#|\/)?炼丹师学徒$/,
          fnc: 'alchemistApprentice'
        },
        {
          reg: /^(#|\/)?阵法师学徒$/,
          fnc: 'masterApprentice'
        },
        {
          reg: /^(#|\/)?徽章信息$/,
          fnc: 'emblemInformation'
        }
      ]
    })
  }
  async association(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '协会'))) return
    e.reply([
      '[协会执事]😳叶子凡\n',
      '欢迎来到修仙协会\n',
      '化神境之后,可交付灵石获得学徒身份\n',
      '当前可领取[/炼器师学徒]'
    ])
    return
  }
  async craftsmanApprentice(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '协会'))) return
    e.reply(['[协会执事]😳叶子凡\n', '目前职业炼丹师\n'])
    return
  }
  async alchemistApprentice(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '协会'))) return
    e.reply(['[协会执事]😳叶子凡\n', '待开放'])
    return
  }
  async masterApprentice(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '协会'))) return
    e.reply(['[协会执事]😳叶子凡\n', '待开放'])
    return
  }
  async emblemInformation(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    e.reply('[协会执事]😳叶子凡\n暂未开放...')
    return
  }
}

class Auction extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?虚空灯\d*$/, fnc: 'voidLamp' },
        {
          reg: /^(#|\/)?拍卖[\u4e00-\u9fa5]+\*\d+\*\d+$/,
          fnc: 'onAuctionThing'
        },
        { reg: /^(#|\/)?收回物品$/, fnc: 'retrieveItems' },
        { reg: /^(#|\/)?竞价\d+\*\d+$/, fnc: 'bidding' },
        { reg: /^(#|\/)?结算拍卖$/, fnc: 'sellingItems' },
        { reg: /^(#|\/)?拍走物品\d+$/, fnc: 'competition' }
      ]
    })
  }
  async voidLamp(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const p = e.msg.replace(/^(#|\/)?虚空灯/, '')
    const page = p == '' ? 1 : Number(p)
    const pageSize$1 = pageSize
    const totalCount = await auction.count()
    const totalPages = Math.ceil(totalCount / pageSize$1)
    if (page > totalPages) {
      return
    }
    const AuctionData = await auction.findAll({
      attributes: ['id', 'name', 'account', 'price'],
      raw: true,
      limit: pageSize,
      offset: (page - 1) * pageSize
    })
    const msg = []
    for await (const item of AuctionData) {
      msg.push(
        `\n🔸[${item?.id}]\n📦[${item?.name}]*${item?.account}\n💰${item?.price}`
      )
    }
    sendReply(e, `___[虚空灯]___(${page}/${totalPages})`, msg, 6)
    return
  }
  async onAuctionThing(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const [thingName, acount, money] = e.msg
      .replace(/^(#|\/)?拍卖/, '')
      .split('*')
    const bagThing = await searchBagByName(UID, thingName)
    if (bagThing && bagThing.grade >= 40) return e.reply('无法出售')
    if (!bagThing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    if (bagThing.acount < Number(acount)) {
      e.reply([`[${thingName}]不够${acount}`], {
        quote: e.msg_id
      })
      return
    }
    if (Number(money) < 1000) {
      e.reply('价格不低于1000', {
        quote: e.msg_id
      })
      return
    }
    const AuctionThing = await read$2(UserData.create_time)
    if (AuctionThing) {
      e.reply(['有待拍卖物品未处理'], {
        quote: e.msg_id
      })
      return
    }
    if (Number(money) > bagThing.price * 66 * Number(acount)) {
      e.reply(['错误价位'], {
        quote: e.msg_id
      })
      return
    }
    const lingshi = await searchBagByName(UID, '下品灵石')
    const number = Math.floor(Number(money) * 0.05)
    if (!lingshi || lingshi.acount < number) {
      e.reply([`\n需要扣除[下品灵石]*${number}`], {
        quote: e.msg_id
      })
      return
    } else {
      e.reply([`扣除[下品灵石]*${number}`], {
        quote: e.msg_id
      })
    }
    await create$2({
      id: UserData.create_time,
      state: 1,
      start_time: new Date().getTime(),
      party_a: {
        id: UID,
        create_time: UserData.create_time
      },
      party_b: {
        id: 0,
        create_time: 0
      },
      party_all: {},
      name: thingName,
      account: Number(acount),
      price: Number(money),
      doc: null
    })
    await reduceBagThing(UID, [
      {
        name: thingName,
        acount: Number(acount)
      },
      {
        name: '下品灵石',
        acount: number
      }
    ])
    e.reply(
      [
        `成功发布:\n${thingName}*${acount}*${money}\n编号:${UserData.create_time}`
      ],
      {
        quote: e.msg_id
      }
    )
    return
  }
  async retrieveItems(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    const AuctionThing = await read$2(UserData.create_time)
    if (!AuctionThing) {
      e.reply(['未有正在拍卖的物品'], {
        quote: e.msg_id
      })
      return
    }
    if (AuctionThing.party_b.id != '0') {
      e.reply(['的物品\n在竞价中,无法收回'], {
        quote: e.msg_id
      })
      return
    }
    await del$2(UserData.create_time)
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: AuctionThing.name,
        acount: AuctionThing.account
      }
    ])
    e.reply([`成功收回竞拍物品`], {
      quote: e.msg_id
    })
    return
  }
  async bidding(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const [ID, size] = e.msg.replace(/^(#|\/)?竞价/, '').split('*')
    const AuctionThing = await read$2(Number(ID))
    if (!AuctionThing) {
      e.reply([`找不到${ID}`], {
        quote: e.msg_id
      })
      return
    }
    if (Number(size) < AuctionThing.price + 100) {
      e.reply(['需要价高100才可加价'], {
        quote: e.msg_id
      })
      return
    }
    const party_all = AuctionThing.party_all
    if (!party_all[UserData.create_time]) {
      party_all[UserData.create_time] = {
        uid: UID,
        price: 0
      }
    }
    const number = Number(size) - party_all[UserData.create_time].price
    const lingshi = await searchBagByName(UID, '下品灵石')
    if (!lingshi || lingshi.acount < number) {
      e.reply([`似乎没有[下品灵石]*${number}`], {
        quote: e.msg_id
      })
      return
    }
    await reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: number
      }
    ])
    e.reply([`对竞品${ID}\n出价[下品灵石]${size}`], {
      quote: e.msg_id
    })
    party_all[UserData.create_time].price += number
    await update(Number(ID), {
      start_time: new Date().getTime(),
      price: party_all[UserData.create_time].price,
      party_all,
      party_b: {
        id: UID,
        create_time: UserData.create_time
      }
    })
    return
  }
  async sellingItems(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    const AuctionThing = await read$2(UserData.create_time)
    if (!AuctionThing) {
      e.reply(['未有正在拍卖的物品'], {
        quote: e.msg_id
      })
      return
    }
    if (AuctionThing.party_b.id == '0') {
      e.reply(['的物品\n无人竞价'], {
        quote: e.msg_id
      })
      return
    }
    const UserDataB = await read$7(AuctionThing.party_b.id)
    if (UserDataB.create_time == AuctionThing.party_b.create_time) {
      const BagSize = await backpackFull$1(
        AuctionThing.party_b.id,
        UserDataB.bag_grade
      )
      if (!BagSize) {
        e.reply('对方储物袋已满', {
          quote: e.msg_id
        })
        return
      }
      await addBagThing(AuctionThing.party_b.id, UserDataB.bag_grade, [
        {
          name: AuctionThing.name,
          acount: AuctionThing.account
        }
      ])
    }
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: '下品灵石',
        acount: AuctionThing.price
      }
    ])
    e.reply(['成功竞拍物品'], {
      quote: e.msg_id
    })
    await del$2(UserData.create_time)
    const ListData = AuctionThing.party_all
    delete ListData[AuctionThing.party_b.create_time]
    for (const item in ListData) {
      const UserDataS = await read$7(ListData[item].uid)
      if (UserDataS.create_time == Number(item)) {
        await addBagThing(ListData[item].uid, UserDataS.bag_grade, [
          {
            name: '下品灵石',
            acount: ListData[item].price
          }
        ])
      }
    }
    return
  }
  async competition(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const ID = e.msg.replace(/^(#|\/)?拍走物品/, '')
    const AuctionThing = await read$2(Number(ID))
    if (!AuctionThing) {
      e.reply([`找不到${ID}`])
      return
    }
    if (AuctionThing.party_b.id == '0') {
      e.reply(['未出价'])
      return
    }
    if (
      AuctionThing.party_b.id != UID ||
      AuctionThing.party_b.create_time != UserData.create_time
    ) {
      e.reply(['无权结算该物品'])
      return
    }
    const end_time = AuctionThing.start_time + 600000
    const now_time = new Date().getTime()
    if (end_time > new Date().getTime()) {
      e.reply([
        `物品冷却:${convertTime(end_time - now_time)}\n`,
        `可联系竞拍物主结算~`
      ])
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'])
      return
    }
    const UserDataB = await read$7(AuctionThing.party_a.id)
    if (UserDataB.create_time == AuctionThing.party_a.create_time) {
      const BagSize = await backpackFull$1(
        AuctionThing.party_a.id,
        UserDataB.bag_grade
      )
      if (!BagSize) {
        e.reply('物主储物袋已满')
        return
      }
      await addBagThing(AuctionThing.party_a.id, UserDataB.bag_grade, [
        {
          name: '下品灵石',
          acount: AuctionThing.price
        }
      ])
    }
    await addBagThing(AuctionThing.party_b.id, UserData.bag_grade, [
      {
        name: AuctionThing.name,
        acount: AuctionThing.account
      }
    ])
    e.reply([`成功拍走了物品~`])
    await del$2(Number(ID))
    const ListData = AuctionThing.party_all
    delete ListData[AuctionThing.party_b.create_time]
    for (const item in ListData) {
      const UserDataS = await read$7(ListData[item].uid)
      if (UserDataS.create_time == Number(item)) {
        await addBagThing(ListData[item].uid, UserDataS.bag_grade, [
          {
            name: '下品灵石',
            acount: ListData[item].price
          }
        ])
      }
    }
    return
  }
}

class Bank extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?(金银置换|金銀置換)\d+\*[\u4e00-\u9fa5]+\*[\u4e00-\u9fa5]+$/,
          fnc: 'substitution'
        },
        {
          reg: /^(#|\/)?治炼仙石\d+$/,
          fnc: 'treatrefining'
        }
      ]
    })
  }
  async substitution(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '金银坊'))) return
    const [account, LeftName, RightName] = e.msg
      .replace(/^(#|\/)?(金银置换|金銀置換)/, '')
      .split('*')
    const quantity = convertStoneQuantity(Number(account), LeftName, RightName)
    if (!quantity) {
      e.reply(`[金银坊]金老三\n?你玩我呢?`)
      return
    }
    const lingshi = await searchBagByName(UID, LeftName)
    if (!lingshi || lingshi.acount < Number(account)) {
      e.reply(`[金银坊]金老三\n?哪儿来的穷鬼!`)
      return
    }
    if (LeftName == '极品灵石' && Number(account) < 20) {
      postMsg(e, 20)
      return
    }
    if (LeftName == '上品灵石' && Number(account) < 100) {
      postMsg(e, 100)
      return
    }
    if (LeftName == '中品灵石' && Number(account) < 500) {
      postMsg(e, 500)
      return
    }
    if (LeftName == '下品灵石' && Number(account) < 2500) {
      postMsg(e, 2500)
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    await reduceBagThing(UID, [
      {
        name: LeftName,
        acount: Number(account)
      }
    ])
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: RightName,
        acount: quantity
      }
    ])
    e.reply([`[${LeftName}]*${account}\n置换成\n[${RightName}]*${quantity}`])
    return
  }
  async treatrefining(e) {
    const UID = e.user_id
    let msg = []
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    let account = Number(e.msg.replace(/^(#|\/)?治炼仙石/, '')) || 1
    if (account > 10) account = 10
    const Userleve = await user_level.findOne({
      where: { uid: UID, type: 1 },
      raw: true
    })
    if (Userleve.realm < 42) return e.reply('境界不足')
    let lingshi = await searchBagByName(UID, '极品灵石')
    if (!lingshi || lingshi.acount < Number(account) * 10000) {
      e.reply(`请确保您有足够的极品灵石再试一次呢~`)
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    for (let i = 0; i < Number(account); i++) {
      const P1 = isProbability(60)
      if (P1) {
        msg.push('炼制成功获得仙石*1\n')
        await addBagThing(UID, UserData.bag_grade, [
          {
            name: '仙石',
            acount: 1
          }
        ])
      } else {
        msg.push('炼制失败\n')
      }
      await reduceBagThing(UID, [
        {
          name: '极品灵石',
          acount: 10000
        }
      ])
    }
    e.reply(msg)
  }
}
function postMsg(e, size) {
  e.reply(`[金银坊]金老三\n少于${size}不换`)
}
const stones = ['下品灵石', '中品灵石', '上品灵石', '极品灵石']
function convertStoneQuantity(quantity, sourceStone, targetStone) {
  const sourceIndex = stones.indexOf(sourceStone),
    targetIndex = stones.indexOf(targetStone)
  const size = Math.abs(targetIndex - sourceIndex)
  const onSize = 10 ** size
  if (sourceIndex === -1 || targetIndex === -1) {
    return false
  } else if (sourceIndex < targetIndex) {
    return Math.floor((quantity / onSize) * 0.9)
  } else if (sourceIndex > targetIndex) {
    return quantity * onSize
  } else {
    return quantity
  }
}

class Board extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?虚空板\d*$/, fnc: 'coidBoard' },
        {
          reg: /^(#|\/)?收购[\u4e00-\u9fa5]+\*\d+\*\d+$/,
          fnc: 'onsacquisitionell'
        },
        { reg: /^(#|\/)?收回留言$/, fnc: 'recallMessage' },
        { reg: /^(#|\/)?交付\d+$/, fnc: 'deliver' }
      ]
    })
  }
  async coidBoard(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const p = e.msg.replace(/^(#|\/)?虚空板/, '')
    const page = p == '' ? 1 : Number(p)
    const pageSize$1 = pageSize
    const totalCount = await auction.count()
    const totalPages = Math.ceil(totalCount / pageSize$1)
    if (page > totalPages) {
      return
    }
    const BoardData = await board.findAll({
      attributes: ['id', 'name', 'account', 'price'],
      raw: true,
      limit: pageSize,
      offset: (page - 1) * pageSize
    })
    const msg = []
    for await (const item of BoardData) {
      msg.push(
        `\n🔸[${item?.id}]\n📦[${item?.name}]*${item?.account}\n💰${item?.price}`
      )
    }
    sendReply(e, `___[虚空板]___(${page}/${totalPages})`, msg, 6)
    return
  }
  async onsacquisitionell(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const [thingName, acount, money] = e.msg
      .replace(/^(#|\/)?收购/, '')
      .split('*')
    if (
      (
        await goods.findOne({
          where: { name: thingName },
          raw: true
        })
      ).grade >= 40
    )
      return e.reply('无法交易')
    if (Number(money) < 1000) {
      e.reply(['价格不低于1000'], {
        quote: e.msg_id
      })
      return
    }
    const Board = await read(UserData.create_time)
    if (Board) {
      e.reply(['有待处理留言'], {
        quote: e.msg_id
      })
      return
    }
    const search = await searchAllThing(thingName)
    if (!search) {
      e.reply([`此方世界没有 ${thingName}`], {
        quote: e.msg_id
      })
      return
    }
    const lingshi = await searchBagByName(UID, '下品灵石')
    if (!lingshi || lingshi.acount < Number(money)) {
      e.reply([`似乎没有[下品灵石]*${money}`], {
        quote: e.msg_id
      })
      return
    }
    await reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: Number(money)
      }
    ])
    await create({
      id: UserData.create_time,
      state: 1,
      party_a: {
        id: UID,
        create_time: UserData.create_time
      },
      party_b: {
        id: 0,
        create_time: 0
      },
      name: thingName,
      account: Number(acount),
      price: Number(money),
      doc: null
    })
    e.reply(
      [
        `成功留言\n${thingName}*${acount}*${money}\n编号:${UserData.create_time}`
      ],
      {
        quote: e.msg_id
      }
    )
    return
  }
  async recallMessage(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const Board = await read(UserData.create_time)
    if (!Board) {
      e.reply(['未有留言'], {
        quote: e.msg_id
      })
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    await del(UserData.create_time)
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: '下品灵石',
        acount: Board.price
      }
    ])
    e.reply(['已收回留言'], {
      quote: e.msg_id
    })
    return
  }
  async deliver(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const ID = e.msg.replace(/^(#|\/)?交付/, '')
    const Board = await read(Number(ID))
    if (!Board) {
      e.reply([`${ID}非留言记录`], {
        quote: e.msg_id
      })
      return
    }
    const lingshi = await searchBagByName(UID, Board.name)
    if (!lingshi || lingshi.acount < Board.account) {
      e.reply([`似乎没有[${Board.name}]*${Board.account}`], {
        quote: e.msg_id
      })
      return
    }
    const UserData = await read$7(UID)
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    const UserDataB = await read$7(Board.party_a.id)
    const BagSizeB = await backpackFull$1(Board.party_a.id, UserDataB.bag_grade)
    if (!BagSizeB) {
      e.reply('对方储物袋空间不足', {
        quote: e.msg_id
      })
      return
    }
    await del(Number(ID))
    await reduceBagThing(UID, [
      {
        name: Board.name,
        acount: Board.account
      }
    ])
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: '下品灵石',
        acount: Board.price
      }
    ])
    await addBagThing(Board.party_a.id, UserDataB.bag_grade, [
      {
        name: Board.name,
        acount: Board.account
      }
    ])
    e.reply([`成功交付${ID}`], {
      quote: e.msg_id
    })
    return
  }
}

class Dice extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(万花坊|萬花坊)$/, fnc: 'userDice' },
        {
          reg: /^(#|\/)?(命运转盘|命運轉盤)[\u4e00-\u9fa5]+\*\d+$$/,
          fnc: 'wheelDestiny'
        }
      ]
    })
  }
  async userDice(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '万花坊'))) return
    const start_msg = []
    start_msg.push('\n[(#|/)命运转盘+物品名*数量]')
    const commoditiesList = await goods.findAll({
      where: {
        wheeldisc: 1
      },
      raw: true
    })
    const end_msg = getListMsg(commoditiesList)
    const msg = [...start_msg, ...end_msg]
    sendReply(e, '___[万花坊]___', msg)
    return
  }
  async wheelDestiny(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '万花坊'))) return
    const thingName = e.msg.replace(/^(#|\/)?(命运转盘|命運轉盤)/, '')
    const [NAME, ACCOUNT] = thingName.split('*')
    const FindData = await goods.findOne({
      where: {
        wheeldisc: 1,
        name: NAME
      },
      raw: true
    })
    if (!FindData) {
      e.reply('[万花坊]千变子\n此物品不可为也')
      return
    }
    const goods$1 = await searchBagByName(UID, NAME)
    if (!goods$1 || goods$1.acount < Number(ACCOUNT)) {
      e.reply([`\n似乎没有[${NAME}]*${ACCOUNT}`], {
        quote: e.msg_id
      })
      return
    }
    const LevelData = await read$6(UID, 1)
    if (!LevelData) {
      return
    }
    if (LevelData.realm < 1) {
      e.reply('[万花坊]千变\nn凡人不可捷越')
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    await reduceBagThing(UID, [
      {
        name: NAME,
        acount: Number(ACCOUNT)
      }
    ])
    if (!isTrueInRange(1, 100, 30)) {
      e.reply('[万花坊]千变\n一无所获')
      return
    }
    const randomthing = await getRandomThing({
      wheeldisc: 1
    })
    if (!randomthing) {
      e.reply('随机物品错误', {
        quote: e.msg_id
      })
      return
    }
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: randomthing.name,
        acount: Number(ACCOUNT)
      }
    ])
    e.reply(`[万花坊]千变子\n${NAME}成功转化为${randomthing.name}`)
    return
  }
}

class Exchange extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?虚空(镜|鏡)\d*$/, fnc: 'supermarket' },
        { reg: /^(#|\/)?上架[\u4e00-\u9fa5]+\*\d+\*\d+$/, fnc: 'onsell' },
        { reg: /^(#|\/)?下架物品$/, fnc: 'Offsell' },
        { reg: /^(#|\/)?(选购|選購)\d+$/, fnc: 'purchase' }
      ]
    })
  }
  async supermarket(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const p = e.msg.replace(/^(#|\/)?虚空(镜|鏡)/, '')
    const page = p == '' ? 1 : Number(p)
    const pageSize$1 = pageSize
    const totalCount = await auction.count()
    const totalPages = Math.ceil(totalCount / pageSize$1)
    if (page > totalPages) {
      return
    }
    const exchange$1 = await exchange.findAll({
      attributes: ['id', 'name', 'account', 'price'],
      raw: true,
      limit: pageSize,
      offset: (page - 1) * pageSize
    })
    const msg = []
    for await (const item of exchange$1) {
      msg.push(
        `\n🔸[${item?.id}]\n📦[${item?.name}]*${item?.account}\n💰${item?.price}`
      )
    }
    sendReply(e, `___[虚空镜]___(${page}/${totalPages})`, msg, 6)
    return
  }
  async onsell(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const [thingName, acount, money] = e.msg
      .replace(/^(#|\/)?上架/, '')
      .split('*')
    const bagThing = await searchBagByName(UID, thingName)
    if (Number(money) < 1000) {
      e.reply(['价格不低于1000'], {
        quote: e.msg_id
      })
      return
    }
    if (bagThing && bagThing.grade >= 40) return e.reply('无法交易')
    if (!bagThing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    if (bagThing.acount < Number(acount)) {
      e.reply([`[${thingName}]不够`], {
        quote: e.msg_id
      })
      return
    }
    const exchange = await read$1(UserData.create_time)
    if (exchange) {
      e.reply(['有待出售物品未成功出售'], {
        quote: e.msg_id
      })
      return
    }
    if (Number(money) > bagThing.price * 66 * Number(acount)) {
      e.reply(['错误价位'], {
        quote: e.msg_id
      })
      return
    }
    const lingshi = await searchBagByName(UID, '下品灵石')
    const number = Math.floor(Number(money) * 0.05)
    if (!lingshi || lingshi.acount < number) {
      e.reply([`\n需要扣除[下品灵石]*${number}`], {
        quote: e.msg_id
      })
      return
    } else {
      e.reply([`扣除[下品灵石]*${number}`], {
        quote: e.msg_id
      })
    }
    await create$1({
      id: UserData.create_time,
      state: 1,
      party_a: {
        id: UID,
        create_time: UserData.create_time
      },
      party_b: {
        id: 0,
        create_time: 0
      },
      name: thingName,
      account: Number(acount),
      price: Number(money),
      doc: null
    })
    await reduceBagThing(UID, [
      {
        name: thingName,
        acount: Number(acount)
      },
      {
        name: '下品灵石',
        acount: number
      }
    ])
    e.reply(
      [
        `成功上架\n${thingName}*${acount}*${money}\n编号:${UserData.create_time}`
      ],
      {
        quote: e.msg_id
      }
    )
    return
  }
  async Offsell(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const exchange = await read$1(UserData.create_time)
    if (!exchange) {
      e.reply(['未有上架物品'], {
        quote: e.msg_id
      })
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    await del$1(UserData.create_time)
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: exchange.name,
        acount: exchange.account
      }
    ])
    e.reply([`成功下架个人物品`], {
      quote: e.msg_id
    })
    return
  }
  async purchase(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const ID = e.msg.replace(/^(#|\/)?(选购|選購)/, '')
    const exchange = await read$1(Number(ID))
    if (!exchange) {
      e.reply([`找不到${ID}`], {
        quote: e.msg_id
      })
      return
    }
    const lingshi = await searchBagByName(UID, '下品灵石')
    if (!lingshi || lingshi.acount < exchange.price) {
      e.reply([`似乎没有${exchange.price}下品灵石`], {
        quote: e.msg_id
      })
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    const UserDataB = await read$7(exchange.party_a.id)
    const BagSizeB = await backpackFull$1(
      exchange.party_a.id,
      UserDataB.bag_grade
    )
    if (!BagSizeB) {
      e.reply('对方储物袋已满', {
        quote: e.msg_id
      })
      return
    }
    await del$1(Number(ID))
    await reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: exchange.price
      }
    ])
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: exchange.name,
        acount: exchange.account
      }
    ])
    await addBagThing(exchange.party_a.id, UserDataB.bag_grade, [
      {
        name: '下品灵石',
        acount: exchange.price
      }
    ])
    e.reply([`成功选购${ID}`], {
      quote: e.msg_id
    })
    return
  }
}

class Battle extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?战斗过程(开启|关闭)$/, fnc: 'battelShow' },
        { reg: /^(#|\/)?打劫$/, fnc: 'duel' },
        { reg: /^(#|\/)?(比斗|比鬥)$/, fnc: 'combat' }
      ]
    })
  }
  async battelShow(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (new RegExp(/战斗过程开启/).test(e.msg)) {
      UserData.battle_show = 1
    } else {
      UserData.battle_show = 0
    }
    await update$1(UID, {
      battle_show: UserData.battle_show
    })
    if (UserData.battle_show == 1) {
      e.reply(['战斗过程开启'], {
        quote: e.msg_id
      })
      return
    } else {
      e.reply(['战斗过程关闭'], {
        quote: e.msg_id
      })
      return
    }
  }
  async combat(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const UIDB = e?.at_user?.id
    if (!UIDB) return
    if (!(await isThereAUserPresentB(e, UIDB))) return
    const UserDataB = await read$7(UIDB)
    if (!(await dualVerification(e, UserData, UserDataB))) return
    if (UserData.special_spiritual < 5) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      return
    }
    if (UserDataB.special_spiritual < 5) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      return
    }
    if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type))
      return
    const CDID = 14,
      CDTime = CD_Ambiguous
    if (!(await victoryCooling(e, UID, CDID))) return
    set$3(UID, CDID, CDTime)
    const BMSG = start(UserData, UserDataB)
    if (UserData.battle_show || UserDataB.battle_show) {
      sendReply(e, '[战斗结果]', BMSG.msg)
    }
    e.reply(
      [
        `你的🩸${BMSG.battle_blood_now.a}\n`,
        `对方🩸${BMSG.battle_blood_now.b}`
      ],
      {
        quote: e.msg_id
      }
    )
    const LevelDataA = await read$6(UID, 1),
      LevelDataB = await read$6(UIDB, 1)
    const sizeA = LevelDataA.experience * 0.15,
      sizeB = LevelDataB.experience * 0.1
    const expA = sizeA > 648 ? 648 : sizeA,
      expB = sizeB > 648 ? 648 : sizeB
    await update$1(UID, {
      battle_blood_now: BMSG.battle_blood_now.a,
      special_spiritual: UserData.special_spiritual - 5
    })
    await update$1(UIDB, {
      battle_blood_now: BMSG.battle_blood_now.b,
      special_spiritual: UserDataB.special_spiritual - 5
    })
    const exA = Math.floor((expA * (UserDataB.talent_size + 100)) / 100),
      exB = Math.floor((expB * (UserDataB.talent_size + 100)) / 100)
    const eA = exA < 3280 ? exA : 3280,
      eB = exB < 3280 ? exB : 3280
    await addExperience$1(UID, 2, eA)
    await addExperience$1(UIDB, 2, eB)
    e.reply(
      [
        '🤺🤺',
        '经过一番畅快的比斗~\n',
        `你激昂的气血增加了${eA}~\n`,
        `对方坚毅的气血增加了${eB}`
      ],
      {
        quote: e.msg_id
      }
    )
    return
  }
  async duel(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const UIDB = e?.at_user?.id
    if (!UIDB) return
    if (!(await isThereAUserPresentB(e, UIDB))) return
    const UserDataB = await read$7(UIDB)
    if (!(await dualVerification(e, UserData, UserDataB))) return
    if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type))
      return
    const CDID = 20,
      CDTime = CD_Battle
    if (!(await victoryCooling(e, UID, CDID))) return
    const create_time = new Date().getTime()
    if (UserData.point_type == 2) {
      await update$1(UID, {
        battle_blood_now: 0
      })
      write(UIDB, {
        type: 1,
        create_time,
        message: `${UserData.name}攻击了你,被[玄玉天宫]修士拦住了~`
      })
      e.reply('[玄玉天宫]玉贞子:\n何人在此造次!')
      let thing = []
      if (
        await isTrueInRange(1, 100, Math.floor(UserData.special_prestige + 50))
      ) {
        thing = await delThing(UID)
      }
      setTimeout(() => {
        e.reply('[玄玉天宫]副宫主对你降下逐杀令..', {
          quote: e.msg_id
        })
      }, 1000)
      setTimeout(() => {
        e.reply('你已[玄玉天宫]的一众修士锁定位置', {
          quote: e.msg_id
        })
      }, 2000)
      setTimeout(() => {
        e.reply('[玄玉天宫]的众修士:\n猖狂!')
      }, 3000)
      setTimeout(() => {
        e.reply([`你被[玄玉天宫]重伤!`], {
          quote: e.msg_id
        })
      }, 4000)
      if (thing.length != 0) {
        setTimeout(() => {
          e.reply([`[玄玉天宫]的众修士击碎了你的[${thing[0]?.name}]`], {
            quote: e.msg_id
          })
        }, 5000)
      }
      return
    }
    if (UserData.pont_attribute == 1) {
      const thing = await searchBagByName(UID, '决斗令')
      if (!thing) {
        write(UIDB, {
          type: 2,
          create_time,
          message: `${UserData.name}攻击了你,被卫兵拦住了~`
        })
        e.reply('[城主府]普通卫兵:\n城内不可出手!')
        return
      }
      await reduceBagThing(UID, [
        {
          name: thing.name,
          acount: 1
        }
      ])
    }
    const levelsB = await read$6(UIDB, 1)
    if (UserData.special_spiritual < levelsB.realm) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      return
    }
    set$3(UID, CDID, CDTime)
    if (UserDataB.special_prestige < 100) {
      UserData.special_prestige += 1
    }
    const BMSG = start(UserData, UserDataB)
    await update$1(UID, {
      special_prestige: UserData.special_prestige,
      special_spiritual:
        UserData.special_spiritual - Math.floor(levelsB.realm / 2),
      battle_blood_now: BMSG.battle_blood_now.a
    })
    await update$1(UIDB, {
      battle_blood_now: BMSG.battle_blood_now.b
    })
    e.reply(
      [
        `你的🩸${BMSG.battle_blood_now.a}\n`,
        `对方🩸${BMSG.battle_blood_now.b}`
      ],
      {
        quote: e.msg_id
      }
    )
    if (UserData.battle_show || UserDataB.battle_show) {
      sendReply(e, '[战斗结果]', BMSG.msg)
    }
    if (BMSG.victory == '0') {
      write(UIDB, {
        type: 2,
        create_time,
        message: `${UserData.name}攻击了你,你跟他打成了平手~`
      })
      e.reply([`你与对方打成了平手`], {
        quote: e.msg_id
      })
      return
    }
    const NameMap = {}
    NameMap[UID] = UserData.name
    NameMap[UIDB] = UserDataB.name
    const user = {
      PartyA: UID,
      PartyB: UIDB,
      prestige: UserDataB.special_prestige
    }
    if (BMSG.victory == UIDB) {
      user.PartyA = UIDB
      user.PartyB = UID
      user.prestige = UserData.special_prestige
    }
    if (!isTrueInRange(1, 100, Math.floor(user.prestige))) {
      write(UIDB, {
        type: 2,
        create_time,
        message: `[${UserData.name}]攻击了你,你重伤在地`
      })
      e.reply([`未抢到的物品`], {
        quote: e.msg_id
      })
      return
    }
    const data = await delThing(user.PartyB)
    if (!data) {
      write(UIDB, {
        type: 2,
        create_time,
        message: `[${UserData.name}]攻击了你,你重伤在地`
      })
      e.reply([`穷的都吃不起灵石了`], {
        quote: e.msg_id
      })
      return
    }
    if (user.PartyA == UID) {
      write(UIDB, {
        type: 2,
        create_time,
        message: `[${UserData.name}]夺走了你的[${data[0].name}]*${data[0].acount}~`
      })
    } else {
      write(UIDB, {
        type: 2,
        create_time,
        message: `你夺走了[${UserData.name}]的[${data[0].name}]*${data[0].acount}~`
      })
    }
    const dada = await read$7(user.PartyA)
    const BagSize = await backpackFull$1(user.PartyA, dada.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    e.reply(
      [
        NameMap[user.PartyA],
        '夺走了',
        NameMap[user.PartyB],
        `的[${data[0].name}]*${data[0].acount}~`
      ],
      {
        quote: e.msg_id
      }
    )
    await addBagThing(user.PartyA, dada.bag_grade, [
      {
        name: data[0].name,
        acount: data[0].acount
      }
    ])
    return
  }
}

class ControllLevel extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(传功|傳功)$/, fnc: 'transmissionPower' },
        { reg: /^(#|\/)?(雙修|双修)$/, fnc: 'ambiguous' }
      ]
    })
  }
  async ambiguous(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const UIDB = e?.at_user?.id
    if (!UIDB) return
    if (!(await isThereAUserPresentB(e, UIDB))) return
    const UserDataB = await read$7(UIDB)
    if (!(await dualVerification(e, UserData, UserDataB))) return
    if (UserData.special_spiritual < 5) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      return
    }
    if (UserDataB.special_spiritual < 5) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      return
    }
    if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type))
      return
    const CDID = 20,
      CDTime = CD_transmissionPower
    if (!(await victoryCooling(e, UID, CDID))) return
    set$3(UID, CDID, CDTime)
    const LevelDataA = await read$6(UID, 1),
      LevelDataB = await read$6(UIDB, 1)
    const sizeA = LevelDataA.experience * 0.15,
      sizeB = LevelDataB.experience * 0.1
    const expA = sizeA > 648 ? 648 : sizeA,
      expB = sizeB > 648 ? 648 : sizeB
    await update$1(UID, {
      special_spiritual: UserData.special_spiritual - 5
    })
    await update$1(UIDB, {
      special_spiritual: UserDataB.special_spiritual - 5
    })
    const exA = Math.floor((expA * (UserData.talent_size + 100)) / 100),
      exB = Math.floor((expB * (UserDataB.talent_size + 100)) / 100)
    const eA = exA < 3280 ? exA : 3280,
      eB = exB < 3280 ? exB : 3280
    await addExperience$1(UID, 1, eA)
    await addExperience$1(UIDB, 1, eB)
    e.reply(
      [
        '❤️',
        '情投意合~\n',
        `你激动的修为增加了${eA}~\n`,
        `对方奇怪的修为增加了${eB}`
      ],
      {
        quote: e.msg_id
      }
    )
    return
  }
  async transmissionPower(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const UIDB = e?.at_user?.id
    if (!UIDB) return
    if (!(await isThereAUserPresentB(e, UIDB))) return
    const UserDataB = await read$7(UIDB)
    if (!(await dualVerification(e, UserData, UserDataB))) return
    if (UserData.special_spiritual < 5) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      return
    }
    if (UserDataB.special_spiritual < 5) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      return
    }
    if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type))
      return
    const LevelDataA = await read$6(UID, 1),
      LevelDataB = await read$6(UIDB, 1)
    if (!LevelDataA || !LevelDataB) return
    if (LevelDataA.realm < 21) {
      e.reply(['未到元婴期'], {
        quote: e.msg_id
      })
      return
    }
    if (LevelDataA.experience <= 2000) {
      e.reply(['所剩修为低于2000'], {
        quote: e.msg_id
      })
      return
    }
    const LevelSize = 9
    if (
      LevelDataB.realm < LevelDataA.realm - LevelSize ||
      LevelDataB.realm > LevelDataA.realm + LevelSize
    ) {
      e.reply(['与', '最多可相差9个境界'], {
        quote: e.msg_id
      })
      return
    }
    await update$1(UID, {
      special_spiritual: UserData.special_spiritual - 5
    })
    await update$1(UIDB, {
      special_spiritual: UserDataB.special_spiritual - 5
    })
    if (!isTrueInRange(1, 100, 85)) {
      await reduceExperience(UID, 1, LevelDataA.experience)
      await fallingRealm(UID, 1)
      e.reply(['🤪传功失败了', '掉落了一个境界！'], {
        quote: e.msg_id
      })
      return
    }
    await reduceExperience(UID, 1, LevelDataA.experience)
    const size = Math.floor(LevelDataA.experience * 0.6)
    await addExperience$1(UIDB, 1, size)
    e.reply(['成功传', `[修为]*${size}给`, UIDB], {
      quote: e.msg_id
    })
    return
  }
}

class ControlPlayer extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(闭关|閉關)$/, fnc: 'biguan' },
        { reg: /^(#|\/)?(锻体|降妖)$/, fnc: 'dagong' },
        { reg: /^(#|\/)?打坐$/, fnc: 'concise' },
        { reg: /^(#|\/)?(归来|歸來|凝脉|出关|出關|聚灵|聚靈)$/, fnc: 'endWork' }
      ]
    })
  }
  async concise(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (UserData.state == 8) {
      e.reply('打坐中...', {
        quote: e.msg_id
      })
      return
    }
    if (UserData.state == 1 || UserData.state == 2) {
      await endAllWord(e, UID, UserData)
    }
    const { state, msg } = await Go(UserData)
    if (state == 4001) {
      e.reply(msg)
      return
    }
    setTimeout(async () => {
      await set$4(UID, {
        actionID: 8,
        startTime: new Date().getTime(),
        endTime: 9999999999999
      })
      e.reply(['开始吐纳灵气...'], {
        quote: e.msg_id
      })
    }, 2000)
    return
  }
  async biguan(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (UserData.state == 1) {
      e.reply('闭关中...', {
        quote: e.msg_id
      })
      return
    }
    if (UserData.state == 2 || UserData.state == 8) {
      await endAllWord(e, UID, UserData)
    }
    const { state, msg } = await Go(UserData)
    if (state == 4001) {
      e.reply(msg)
      return
    }
    setTimeout(async () => {
      await set$4(UID, {
        actionID: 1,
        startTime: new Date().getTime(),
        endTime: 9999999999999
      })
      e.reply(['开始两耳不闻窗外事...'], {
        quote: e.msg_id
      })
    }, 2000)
    return
  }
  async dagong(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (UserData.state == 2) {
      e.reply('锻体中...', {
        quote: e.msg_id
      })
      return
    }
    if (UserData.state == 1 || UserData.state == 8) {
      await endAllWord(e, UID, UserData)
    }
    const { state, msg } = await Go(UserData)
    if (state == 4001) {
      e.reply(msg)
      return
    }
    setTimeout(async () => {
      await set$4(UID, {
        actionID: 2,
        startTime: new Date().getTime(),
        endTime: 9999999999999
      })
      e.reply(['开始爬山越岭,负重前行...'], {
        quote: e.msg_id
      })
    }, 2000)
    return
  }
  async endWork(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    await endAllWord(e, UID, UserData)
    return
  }
}

class fairyland extends APlugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)?渡劫$/, fnc: 'breakLevel' }]
    })
  }
  async breakLevel(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    if (!(await isLevelPoint(UID, 1))) {
      e.reply(['尚未感知到雷劫'], {
        quote: e.msg_id
      })
      return
    }
    const UserData = await read$7(UID)
    setTimeout(() => {
      e.reply('“云聚霞散露真形，天雷滚滚预兆生....')
    }, 1500)
    setTimeout(() => {
      e.reply('忽然间风云变幻,乌云密布,竟然是九九灭世之雷悬于苍穹之上！')
    }, 3000)
    setTimeout(() => {
      e.reply(`${UserData.name}屹立于此，眼含决意。灵气凝聚，雷霆万钧`)
    }, 4500)
    let time = setInterval(async function () {
      set$4(UID, {
        actionID: 5,
        startTime: 7,
        endTime: 6
      })
      if (UserData.battle_blood_now > 0) {
        {
          del$7(UID)
          e.reply(`${UserData.name}成功渡过最后一道雷劫,渡劫成仙`)
          await user_level.update(
            { realm: 42 },
            { where: { uid: UID, type: 1 } }
          )
          clearInterval(time)
        }
      } else {
        del$7(UID)
        await punishLevel(e, UID, UserData)
        punishLevel(e, UID, UserData)
      }
    }, 60000)
  }
}
async function punishLevel(e, UID, UserData) {
  const Userexp = await read$6(UID, 1)
  const Userbool = await read$6(UID, 2)
  const Usershen = await read$6(UID, 2)
  await update$1(UID, {
    battle_blood_now: 0
  })
  switch (UserData.talent.length) {
    case 1: {
      setTimeout(async () => {
        write$2(UID, 1, {
          experience: 0
        })
        write$2(UID, 2, {
          experience: 0
        })
        write$2(UID, 3, {
          experience: 0
        })
        e.reply(['[灭世之雷]击中了你的道韵,修为清空,化作尘埃'], {
          quote: e.msg_id
        })
      }, 6000)
      break
    }
    case 2: {
      setTimeout(async () => {
        write$2(UID, 1, {
          experience: Math.floor(Userexp.experience * 0.75)
        })
        write$2(UID, 2, {
          experience: Math.floor(Userbool.experience * 0.75)
        })
        write$2(UID, 3, {
          experience: Math.floor(Usershen.experience * 0.75)
        })
        e.reply(['[灭世之雷]击中了你的命魂,损失大量修为'], {
          quote: e.msg_id
        })
      }, 6000)
      break
    }
    case 3: {
      setTimeout(async () => {
        write$2(UID, 1, {
          experience: Math.floor(Usershen.experience * 0.5)
        })
        write$2(UID, 2, {
          experience: Math.floor(Usershen.experience * 0.5)
        })
        write$2(UID, 3, {
          experience: Math.floor(Usershen.experience * 0.5)
        })
        e.reply(['[灭世之雷]击中了你的命魂,损失一半修为'], {
          quote: e.msg_id
        })
      }, 6000)
      break
    }
    case 4: {
      setTimeout(async () => {
        write$2(UID, 1, {
          experience: Math.floor(Usershen.experience * 0.25)
        })
        write$2(UID, 2, {
          experience: Math.floor(Usershen.experience * 0.25)
        })
        write$2(UID, 3, {
          experience: Math.floor(Usershen.experience * 0.25)
        })
        fallingRealm(UID, 1)
        e.reply([`[灭世之雷]击中了你的命魂,损失部分修为`], {
          quote: e.msg_id
        })
      }, 6000)
      break
    }
    case 5: {
      setTimeout(async () => {
        write$2(UID, 1, {
          experience: Math.floor(Usershen.experience * 0.15)
        })
        write$2(UID, 2, {
          experience: Math.floor(Usershen.experience * 0.15)
        })
        write$2(UID, 3, {
          experience: Math.floor(Usershen.experience * 0.15)
        })
        fallingRealm(UID, 1)
        e.reply([`[灭世之雷]击中了你的命魂,损失修为`], {
          quote: e.msg_id
        })
      }, 6000)
      break
    }
  }
}

class Level extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?突破$/, fnc: 'breakThrough' },
        { reg: /^(#|\/)?破境$/, fnc: 'breakingTheBoundary' },
        { reg: /^(#|\/)?(顿悟|頓悟)$/, fnc: 'insight' }
      ]
    })
  }
  async breakThrough(e) {
    levelUp(e, 6, 1, 90)
    return
  }
  async breakingTheBoundary(e) {
    levelUp(e, 7, 2, 80)
    return
  }
  async insight(e) {
    levelUp(e, 19, 3, 80)
    return
  }
}
async function levelUp(e, CDID, ID, p) {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  if (!(await victoryCooling(e, UID, CDID))) return
  const LevelMsg = await read$6(UID, ID)
  if (LevelMsg.experience <= 100) {
    e.reply(['毫无自知之明'], {
      quote: e.msg_id
    })
    return
  }
  const number = LevelMsg.realm ?? 0
  if (!isTrueInRange(1, 100, p - LevelMsg.realm + number)) {
    set$3(UID, CDID, CD_Level_up)
    const randomKey = getRandomKey()
    const size = Math.floor(LevelMsg.experience / (randomKey + 1))
    await reduceExperience(UID, ID, size)
    const msg = await getCopywriting(
      ID,
      randomKey,
      size > 999999 ? 999999 : size
    )
    e.reply([msg], {
      quote: e.msg_id
    })
    return
  }
  const { msg } = await enhanceRealm(UID, ID)
  e.reply([msg], {
    quote: e.msg_id
  })
  set$3(UID, CDID, CD_Level_up)
  setTimeout(async () => {
    const UserData = await read$7(UID)
    await updatePanel(UID, UserData.battle_blood_now)
  }, 1500)
  return
}

class SneakAttack extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?偷袭\d+$/, fnc: 'attackUser' },
        { reg: /^(#|\/)?释放神识$/, fnc: 'releaseEye' },
        { reg: /^(#|\/)?状态记录$/, fnc: 'getLogs' },
        { reg: /^(#|\/)?删除记录$/, fnc: 'delLogs' }
      ]
    })
  }
  async delLogs(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    await del$4(UID)
    e.reply(['你的的状态记录\n已删除'], {
      quote: e.msg_id
    })
    return
  }
  async getLogs(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const logsData = await read$4(UID)
    const msg = ['[状态记录]']
    if (logsData.length == 0) {
      e.reply('未存在任何记录', {
        quote: e.msg_id
      })
      return
    }
    const map = {
      1: '偷袭',
      2: '打劫',
      3: '窃取'
    }
    for await (const item of logsData) {
      msg.push(`\n[${map[item.type]}][${item.create_time}]${item.message}`)
    }
    e.reply(msg)
    return
  }
  async attackUser(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const minBattleBlood = 1
    const ID = e.msg.replace(/^(#|\/)?偷袭/, '')
    const userDataB = await user.findOne({
      attributes: [
        'id',
        'uid',
        'state',
        'battle_blood_now',
        'point_type',
        'battle_power',
        'name'
      ],
      where: {
        id: ID,
        uid: {
          [Op.ne]: UID
        },
        point_type: UserData.point_type,
        age_state: 1,
        state: 0,
        battle_blood_now: {
          [Op.gt]: minBattleBlood
        }
      },
      raw: true
    })
    if (!userDataB) {
      e.reply('对方消失了', {
        quote: e.msg_id
      })
      return
    }
    const UIDB = userDataB.uid
    if (!UIDB) return
    if (!(await isThereAUserPresentB(e, UIDB))) return
    const UserDataB = await read$7(UIDB)
    if (!(await dualVerification(e, UserData, UserDataB))) return
    if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type))
      return
    const CDID = 20,
      CDTime = CD_Sneak
    if (!(await victoryCooling(e, UID, CDID))) return
    const create_time = new Date().getTime()
    if (UserData.point_type == 2) {
      await update$1(UID, {
        battle_blood_now: 0
      })
      write(UIDB, {
        type: 1,
        create_time,
        message: `${UserData.name}攻击了你,被[玄玉天宫]修士拦住了~`
      })
      e.reply('[玄玉天宫]:玉贞子\n何人在此造次!')
      let thing = []
      if (
        await isTrueInRange(1, 100, Math.floor(UserData.special_prestige + 50))
      ) {
        thing = await delThing(UID)
      }
      setTimeout(() => {
        e.reply('[玄玉天宫]副宫主对你降下逐杀令..', {
          quote: e.msg_id
        })
      }, 1000)
      setTimeout(() => {
        e.reply('你已[玄玉天宫]的一众修士锁定位置', {
          quote: e.msg_id
        })
      }, 2000)
      setTimeout(() => {
        e.reply('[玄玉天宫]的众修士:\n猖狂!')
      }, 3000)
      setTimeout(() => {
        e.reply([`你被[玄玉天宫]重伤!`], {
          quote: e.msg_id
        })
      }, 4000)
      if (thing.length != 0) {
        setTimeout(() => {
          if (thing.length != 0) {
            e.reply([`[玄玉天宫]的众修士击碎了你的[${thing[0].name}]`], {
              quote: e.msg_id
            })
          }
        }, 5000)
      }
      return
    }
    if (UserData.pont_attribute == 1) {
      const thing = await searchBagByName(UID, '决斗令')
      if (!thing) {
        write(UIDB, {
          type: 1,
          create_time,
          message: `${UserData.name}攻击了你,被卫兵拦住了~`
        })
        e.reply('[城主府]普通卫兵:\n城内不可出手!', {
          quote: e.msg_id
        })
        return
      }
      await reduceBagThing(UID, [
        {
          name: thing.name,
          acount: 1
        }
      ])
    }
    const levelsB = await read$6(UIDB, 1)
    if (UserData.special_spiritual < levelsB.realm) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      return
    }
    set$3(UID, CDID, CDTime)
    if (UserDataB.special_prestige < 100) {
      UserData.special_prestige += 1
    }
    const BMSG = start(UserData, UserDataB)
    await update$1(UID, {
      battle_blood_now: BMSG.battle_blood_now.a,
      special_spiritual:
        UserData.special_spiritual - Math.floor(levelsB.realm / 2),
      special_prestige: UserData.special_prestige
    })
    await update$1(UIDB, {
      battle_blood_now: BMSG.battle_blood_now.b
    })
    const BooldMsg = `${UserData.name}当前剩余:${BMSG.battle_blood_now.a}[血量]\n${UserDataB.name}当前剩余:${BMSG.battle_blood_now.b}[血量]`
    if (UserData.battle_show || UserDataB.battle_show) {
      sendReply(e, '[战斗结果]', BMSG.msg)
    }
    if (BMSG.victory == '0') {
      write(UIDB, {
        type: 1,
        create_time,
        message: `${UserData.name}攻击了你,你跟他打成了平手~`
      })
      e.reply([`你跟他两打成了平手\n${BooldMsg}`], {
        quote: e.msg_id
      })
      return
    }
    const NameMap = {}
    NameMap[UID] = UserData.name
    NameMap[UIDB] = UserDataB.name
    const user$1 = {
      PartyA: UID,
      PartyB: UIDB,
      prestige: UserDataB.special_prestige
    }
    if (BMSG.victory == UIDB) {
      user$1.PartyA = UIDB
      user$1.PartyB = UID
      user$1.prestige = UserData.special_prestige
    }
    if (!isTrueInRange(1, 100, Math.floor(user$1.prestige))) {
      write(UIDB, {
        type: 1,
        create_time,
        message: `[${UserData.name}]攻击了你,你重伤在地`
      })
      e.reply([`并未抢到他的物品~\n${BooldMsg}`], {
        quote: e.msg_id
      })
      return
    }
    const data = await delThing(user$1.PartyB)
    if (!data) {
      write(UIDB, {
        type: 2,
        create_time,
        message: `[${UserData.name}]攻击了你,你重伤在地`
      })
      e.reply([`穷的都吃不起灵石了`], {
        quote: e.msg_id
      })
      return
    }
    const dsds = await read$7(user$1.PartyA)
    const BagSize = await backpackFull$1(user$1.PartyA, dsds.bag_grade)
    if (!BagSize) {
      e.reply([NameMap[user$1.PartyA], '储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    const thine = data[0]
    if (thine) {
      await addBagThing(user$1.PartyA, dsds.bag_grade, [
        {
          name: thine.name,
          acount: thine.acount
        }
      ])
    }
    if (user$1.PartyA == UID) {
      const msg = `[${UserData.name}]夺走了[${UserDataB.name}]的[${thine.name}]*${thine.acount}~`
      write(UIDB, {
        type: 1,
        create_time,
        message: msg
      })
      e.reply(`${msg}\n${BooldMsg}`, {
        quote: e.msg_id
      })
    } else {
      const msg = `[${UserDataB.name}]夺走了[${UserData.name}]的[${thine.name}]*${thine.acount}~`
      write(UIDB, {
        type: 1,
        create_time,
        message: msg
      })
      e.reply(`${msg}\n${BooldMsg}`, {
        quote: e.msg_id
      })
    }
    return
  }
  async releaseEye(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    if (UserData.pont_attribute == 1) {
      e.reply('[城主府]巡逻军:\n城内切莫释放神识!')
      return
    }
    const battle_power = UserData.battle_power ?? 20
    const LevelData = await read$6(UID, 3)
    const distanceThreshold = (LevelData.realm ?? 1) * 10 + 50
    const minBattleBlood = 1
    const AllUser = await user.findAll({
      attributes: [
        'id',
        'uid',
        'state',
        'battle_blood_now',
        'battle_power',
        'pont_x',
        'pont_y',
        'point_type',
        'name'
      ],
      where: {
        uid: {
          [Op.ne]: UID
        },
        point_type: UserData.point_type,
        age_state: 1,
        state: 0,
        battle_blood_now: {
          [Op.gt]: minBattleBlood
        },
        battle_power: {
          [Op.lte]: battle_power + 3280
        },
        pont_x: {
          [Op.between]: [
            UserData.pont_x - distanceThreshold,
            UserData.pont_x + distanceThreshold
          ]
        },
        pont_y: {
          [Op.between]: [
            UserData.pont_y - distanceThreshold,
            UserData.pont_y + distanceThreshold
          ]
        },
        pont_z: {
          [Op.between]: [
            UserData.pont_z - distanceThreshold,
            UserData.pont_z + distanceThreshold
          ]
        }
      },
      order: [['battle_power', 'DESC']],
      limit: 10,
      raw: true
    })
    const msg = ['[附近道友]']
    for (const item of AllUser) {
      msg.push(
        `\n🔹标记:${item?.id},道号:${item.name}\n🩸${item?.battle_blood_now},战力:${item?.battle_power}`
      )
    }
    e.reply(msg)
    return
  }
}

const reStart$1 = {}
class Monster extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(击杀|擊殺)[\u4e00-\u9fa5]+$/, fnc: 'userKill' },
        { reg: /^(#|\/)?探索怪物$/, fnc: 'userExploremonsters' },
        { reg: /^(#|\/)?挑战妖塔$/, fnc: 'demontower' }
      ]
    })
  }
  async userKill(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    const CDID = 10
    if (!(await victoryCooling(e, UID, CDID))) return
    const Mname = e.msg.replace(/^(#|\/)?(击杀|擊殺)/, '')
    if (!killNPC(e, Mname, UID, UserData.special_prestige)) return
    const monstersdata = await monsterscache(UserData.point_type)
    const mon = monstersdata[Mname]
    if (UserData.pont_attribute == 1 || !mon || mon.acount < 1) {
      e.reply([`这里没有[${Mname}],去别处看看吧`], {
        quote: e.msg_id
      })
      return
    }
    const need_spiritual = Math.floor((mon.level + 20) / 3)
    if (UserData.special_spiritual < need_spiritual) {
      e.reply(['灵力不足'], {
        quote: e.msg_id
      })
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    const LevelMax = await levels.findOne({
      where: {
        id: Number(mon.level),
        type: 0
      },
      raw: true
    })
    const BMSG = start(UserData, {
      uid: '1',
      name: Mname,
      battle_show: 0,
      battle_blood_now: Math.floor(
        LevelMax.blood * ((mon.level + 1) * 0.01 + 1)
      ),
      battle_attack: Math.floor(LevelMax.attack * ((mon.level + 1) * 0.05 + 1)),
      battle_defense: Math.floor(
        LevelMax.defense * ((mon.level + 1) * 0.01 + 1)
      ),
      battle_blood_limit: Math.floor(
        LevelMax.blood * ((mon.level + 1) * 0.01 + 1)
      ),
      battle_critical_hit: mon.level + 30,
      battle_critical_damage: LevelMax.critical_damage + mon.level,
      battle_speed: LevelMax.speed + 10,
      battle_power: 0
    })
    await update$1(UID, {
      battle_blood_now: BMSG.battle_blood_now.a,
      special_spiritual: UserData.special_spiritual - need_spiritual,
      special_reputation: UserData.special_reputation + mon.level
    })
    const BooldMsg = `\n🩸${BMSG.battle_blood_now.a}`
    if (UserData.battle_show) {
      sendReply(e, '[战斗结果]', BMSG.msg)
    }
    const msgRight = []
    if (BMSG.victory == '0') {
      e.reply([`与${Mname}打成了平手${BooldMsg}`], {
        quote: e.msg_id
      })
      return
    } else if (BMSG.victory == '1') {
      let thing = []
      if (
        await isTrueInRange(1, 100, Math.floor(UserData.special_prestige + 10))
      ) {
        thing = await delThing(UID)
      }
      if (thing.length != 0) {
        e.reply(
          [`[${Mname}]击碎了你的[${thing[0]?.name}]\n你重伤倒地,奄奄一息~`],
          {
            quote: e.msg_id
          }
        )
        return
      } else {
        e.reply([`你被${Mname}重伤倒地!`], {
          quote: e.msg_id
        })
        return
      }
    } else {
      msgRight.push(`${UserData.name}击败了[${Mname}]`)
    }
    const p = getMonsterProbability(mon.level)
    const size = 10 - Math.floor(p / 10)
    const s = (mon.level * size * (UserData.talent_size + 100)) / 100
    if (p > 45) {
      const SIZE = Math.floor(s + 800)
      msgRight.push(`\n[气血]增加了${SIZE}`)
      await addExperience$1(UID, 2, SIZE)
    }
    if (p > 30) {
      const SIZE = Math.floor(s + 400)
      msgRight.push(`\n[气血]增加了*${SIZE}`)
      await addExperience$1(UID, 2, SIZE)
    }
    if (p > 20) {
      const SIZE = Math.floor(s + 200)
      msgRight.push(`\n[气血]增加了*${SIZE}`)
      await addExperience$1(UID, 2, SIZE)
    }
    const ThingArr = []
    if (p > 30) {
      const obj = {}
      if (p > 60) {
        const type = isProbability(mon.level)
        const thing = await getRandomThing({
          commodities: 1,
          type: type ? 1 : 4
        })
        const acount = leastOne(Math.floor(mon.level / mon.type))
        ThingArr.push({
          name: thing.name,
          acount: acount > 16 ? (type ? 17 : 13) : acount
        })
      }
      if (p > 50) {
        const thing = await getRandomThing({
          drops: 1,
          type: 7,
          monster_type: mon.type ?? 1
        })
        if (thing) {
          obj[thing.name] = leastOne(Math.floor(mon.level / mon.type))
        }
      }
      const thing = await getRandomThing({
        drops: 1,
        type: 7,
        monster_type: mon.type ?? 1
      })
      if (thing) {
        const acount = leastOne(Math.floor(mon.level / mon.type / 2))
        if (obj[thing.name]) {
          obj[thing.name] += acount
        } else {
          obj[thing.name] = acount
        }
        for (const item in obj) {
          ThingArr.push({
            name: item,
            acount: obj[item]
          })
        }
      }
    }
    if (p > 20) {
      const lingshi = leastOne(mon.level * size + 100)
      ThingArr.push({
        name: '中品灵石',
        acount: lingshi
      })
    }
    if (p > 10) {
      const lingshi = leastOne(mon.level * size + 300)
      ThingArr.push({
        name: '下品灵石',
        acount: lingshi
      })
    }
    const P1 = isProbability(5)
    if (P1) {
      ThingArr.push({
        name: '开天令',
        acount: 1
      })
    }
    await addBagThing(UID, UserData.bag_grade, ThingArr)
    msgRight.push(`\n${randomTxt()}`)
    for await (const item of ThingArr) {
      const T = await searchBagByName(UID, item.name)
      if (T) msgRight.push(`\n[${item.name}]*${item.acount}`)
    }
    msgRight.push(BooldMsg)
    set$3(UID, CDID, CD_Kill)
    await reduce$1(UserData.point_type, Mname)
    await e.reply(msgRight)
    return
  }
  async userExploremonsters(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    if (UserData.pont_attribute == 1) {
      e.reply('[城主府]巡逻军:\n城内切莫释放神识!')
      return
    }
    const name = await getPlaceName(
      UserData.point_type,
      UserData.pont_attribute
    )
    const MonsterData = await levels.findAll({
      attributes: ['name'],
      where: {
        type: 0
      },
      raw: true
    })
    const monster = await monsterscache(UserData.point_type)
    const sortedMonsters = Object.keys(monster).sort(
      (a, b) => monster[a].level - monster[b].level
    )
    if (sortedMonsters.length == 0) {
      e.reply('附近无怪物', {
        quote: e.msg_id
      })
      return
    }
    const msg = [`[${name}]的妖怪`]
    for (const item of sortedMonsters) {
      msg.push(
        `\n${item}(${MonsterData[monster[item].level]?.name})*${monster[item].acount}`
      )
    }
    e.reply(msg)
    return
  }
  async demontower(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!reStart$1[UID] || reStart$1[UID] + 60000 < new Date().getTime()) {
      reStart$1[UID] = new Date().getTime()
      e.reply([e.segment.at(e.user_id), `CD中`]).catch(err => {
        console.error(err)
        return
      })
      return
    }
    if (!(await controlByName(e, UserData, '星海'))) return
    if (!(await ControlByBlood(e, UserData))) return
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    const bag = await searchBagByName(UID, '下品灵石')
    if (!bag || bag.acount < 100000) {
      return e.reply('下品灵石不足')
    }
    reduceBagThing(UID, [{ name: '下品灵石', acount: 100000 }])
    const p = Math.floor(Math.random() * (100 - 1) + 1)
    let addpower = 0
    if (p < 25) {
      addpower = 0
    } else if (p > 25 && p < 50) {
      addpower = 1 + 0.25
    } else if (p > 50 && p < 75) {
      addpower = 1 + 0.3
    } else if (p > 75 && p <= 100) {
      addpower = 1 + 0.4
    }
    const BMSG = start(UserData, {
      uid: '1',
      name: '守塔人',
      battle_show: 0,
      battle_blood_now: Math.floor(366791 + addpower),
      battle_attack: Math.floor(52114 + addpower),
      battle_defense: Math.floor(25525 + addpower),
      battle_blood_limit: Math.floor(366791 + addpower),
      battle_critical_hit: 10 + 30,
      battle_critical_damage: Math.floor(50 + addpower),
      battle_speed: Math.floor(41 + addpower),
      battle_power: 0
    })
    const BooldMsg = `\n🩸${BMSG.battle_blood_now.a}`
    if (UserData.battle_show) {
      sendReply(e, '[战斗结果]', BMSG.msg)
    }
    if (BMSG.victory == '0') {
      e.reply([`与${'守塔人'}打成了平手${BooldMsg}`], {
        quote: e.msg_id
      })
      return
    } else if (BMSG.victory == '1') {
      e.reply('你被守塔人击败了,未获得任何物品')
    } else {
      if (p < 25) {
        if (p < 5) {
          addBagThing(UID, 6, [{ name: '养魂木', acount: 1 }])
          return e.reply('获得养魂木*1')
        } else if (p < 10) {
          addBagThing(UID, 6, [{ name: '金焰石', acount: 1 }])
          return e.reply('获得金焰石*1')
        } else if (p < 15) {
          addBagThing(UID, 6, [{ name: '息壤之土', acount: 1 }])
          return e.reply('获得息壤之土*1')
        } else if (p < 20) {
          addBagThing(UID, 6, [{ name: '灵烛果', acount: 1 }])
          return e.reply('获得灵烛果*1')
        } else {
          addBagThing(UID, 6, [{ name: '长生泉', acount: 1 }])
          return e.reply('获得长生泉*1')
        }
      } else if (p > 25 && p < 50) {
        return e.reply(
          '虽然你勇敢地战胜了守塔的守卫,但这次战斗似乎没有找到任何物品'
        )
      } else if (p > 50 && p <= 100) {
        addBagThing(UID, 6, [{ name: '还春丹', acount: 2 }])
        return e.reply('获得还春丹*2')
      }
    }
    return
  }
}
function getMonsterProbability(level) {
  level = level < 0 ? 0 : level
  const baseProbability = 20
  const probabilityIncrease = Math.floor(Math.random() * 3) + 1
  const probability =
    baseProbability +
    level * probabilityIncrease -
    Math.floor(Math.random() * 10) +
    5
  const size = probability < 95 ? probability : 95
  return size
}
const treasureMessages = [
  '瞅了一眼身旁的草丛,看到了',
  '在身后的洞穴中发现了',
  '在一片杂草中发现了',
  '从树洞里捡到了',
  '在河边捡到了',
  '在怪物身上找到了'
]
function randomTxt() {
  return treasureMessages[Math.floor(Math.random() * treasureMessages.length)]
}

class Ore extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?采集\d+\*?(1|2)?$/, fnc: 'gather' },
        { reg: /^(#|\/)?探索灵矿$/, fnc: 'userSearchOre' }
      ]
    })
  }
  async gather(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    const [id, size] = e.msg.replace(/^(#|\/)?采集/, '').split('*')
    const gaspractice = await read$6(UID, 1).then(item => item.realm)
    const acount = Number(
      size == '' || size == undefined || gaspractice < 25 || Number(size) > 2
        ? 1
        : size
    )
    if (!(await searchBagByName(UID, '开灵铲', acount))) {
      e.reply([`开灵铲不足${acount}个`], {
        quote: e.msg_id
      })
      return
    }
    const CDID = 22
    if (!(await victoryCooling(e, UID, CDID))) return
    if (!killNPC(e, id, UID, UserData.special_prestige)) return
    const explore = await explorecache(UserData.point_type)
    const ep = explore[id]
    if (UserData.pont_attribute == 1 || !ep || ep.acount < 1) {
      e.reply([`这里没有[${id}],去别处看看吧`], {
        quote: e.msg_id
      })
      return
    }
    if (UserData.special_spiritual <= ep.spiritual * acount) {
      e.reply([`灵力不足${ep.spiritual * acount}`], {
        quote: e.msg_id
      })
      return
    }
    await reduce(UserData.point_type, id, acount)
    await reduceBagThing(UID, [
      {
        name: '开灵铲',
        acount: 1 * acount
      }
    ])
    const name = `${getMoneyGrade(ep.grade)}灵石`
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: name,
        acount: ep.money * acount
      }
    ])
    await update$1(UID, {
      special_spiritual: UserData.special_spiritual - ep.spiritual * acount
    })
    set$3(UID, CDID, CD_Mine)
    e.reply([`采得[${name}]*${ep.money * acount}`], {
      quote: e.msg_id
    })
    return
  }
  async userSearchOre(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    if (UserData.pont_attribute == 1) {
      e.reply('[城主府]巡逻军:\n城内切莫释放神识!')
      return
    }
    const name = await getPlaceName(
      UserData.point_type,
      UserData.pont_attribute
    )
    const msg = [`[${name}]的灵矿`]
    const explore = await explorecache(UserData.point_type)
    for (const item in explore) {
      msg.push(
        `\n🔹标记:${item}(${getMoneyGrade(explore[item].grade)}灵矿)*${explore[item].acount}`
      )
    }
    e.reply(msg)
  }
}
function getMoneyGrade(grade) {
  if (grade == 1) return '下品'
  if (grade == 2) return '中品'
  if (grade == 3) return '上品'
  if (grade == 4) return '极品'
}

class Treasure extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?探索宝物$/, fnc: 'exploringTreasures' },
        { reg: /^(#|\/)?拾取\d+$/, fnc: 'pickup' }
      ]
    })
  }
  async exploringTreasures(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    if (UserData.pont_attribute == 1) {
      e.reply('[城主府]巡逻军:\n城内切莫释放神识!')
      return
    }
    const LevelData = await read$6(UID, 3)
    const distanceThreshold = (LevelData.realm ?? 1) * 10 + 50
    const da = await map_treasure.findAll({
      attributes: ['id', 'type', 'x', 'y', 'z', 'name', 'acount'],
      where: {
        type: UserData.point_type,
        x: {
          [Op.between]: [
            UserData.pont_x - distanceThreshold,
            UserData.pont_x + distanceThreshold
          ]
        },
        y: {
          [Op.between]: [
            UserData.pont_y - distanceThreshold,
            UserData.pont_y + distanceThreshold
          ]
        },
        z: {
          [Op.between]: [
            UserData.pont_z - distanceThreshold,
            UserData.pont_z + distanceThreshold
          ]
        }
      },
      limit: 10,
      raw: true
    })
    if (da.length == 0) {
      e.reply('附近没有宝物')
      return
    }
    const msg = ['[附近宝物]']
    for await (const item of da) {
      msg.push(`\n🔹标记:${item.id} 物品:${item.name} 数量:${item.acount}`)
    }
    e.reply(msg)
    return
  }
  async pickup(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    const LevelData = await read$6(UID, 3)
    const distanceThreshold = (LevelData.realm ?? 1) * 10 + 50
    const ID = e.msg.replace(/^(#|\/)?拾取/, '')
    const data = await map_treasure.findOne({
      attributes: ['id', 'type', 'x', 'y', 'z', 'name', 'acount'],
      where: {
        id: ID,
        type: UserData.point_type,
        x: {
          [Op.between]: [
            UserData.pont_x - distanceThreshold,
            UserData.pont_x + distanceThreshold
          ]
        },
        y: {
          [Op.between]: [
            UserData.pont_y - distanceThreshold,
            UserData.pont_y + distanceThreshold
          ]
        },
        z: {
          [Op.between]: [
            UserData.pont_z - distanceThreshold,
            UserData.pont_z + distanceThreshold
          ]
        }
      },
      raw: true
    })
    if (!data) {
      e.reply(['在想屁吃?'], {
        quote: e.msg_id
      })
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: data.name,
        acount: data.acount
      }
    ])
    await map_treasure.destroy({
      where: {
        id: ID
      }
    })
    e.reply([`你拾取了[${data.name}]*${data.acount}`], {
      quote: e.msg_id
    })
    return
  }
}

class Bag extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?(储物袋|儲物袋|背包)(武器|护具|法宝|丹药|功法|道具|材料|装备)?$/,
          fnc: 'showBagType'
        },
        { reg: /^(#|\/)?(储物袋|儲物袋|背包)(升级|升級)$/, fnc: 'bagUp' },
        {
          reg: /^(#|\/)?(储物袋|儲物袋|背包)(丢弃|丟棄)[\u4e00-\u9fa5]+\*\d+$/,
          fnc: 'discard'
        }
      ]
    })
  }
  async showBagType(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const type = e.msg.replace(/^(#|\/)?(储物袋|儲物袋|背包)/, '')
    const img = await getBagComponent(
      await backpackInformation(
        e.user_id,
        e.user_avatar,
        mapType[type] ?? mapType['道具']
      ),
      UID
    )
    if (typeof img != 'boolean') e.reply(img)
    return
  }
  async discard(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const [thingName, quantity] = e.msg
      .replace(/^(#|\/)?(储物袋|儲物袋|背包)(丢弃|丟棄)/, '')
      .split('*')
    const thing = await searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    await reduceBagThing(UID, [
      {
        name: thing.name,
        acount: Number(quantity)
      }
    ])
    e.reply([`丢弃[${thingName}]*${Number(quantity)}`], {
      quote: e.msg_id
    })
    return
  }
  async bagUp(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    let grade = UserData.bag_grade
    const Price$1 = Price[grade]
    if (!Price$1) {
      e.reply(['已是极品储物袋'], {
        quote: e.msg_id
      })
      return
    }
    const thing = await searchBagByName(UID, '下品灵石')
    if (!thing || thing.acount < Price$1) {
      e.reply([`灵石不足\n需要准备[下品灵石]*${Price$1}`], {
        quote: e.msg_id
      })
      return
    }
    grade++
    await update$1(UID, {
      bag_grade: grade
    })
    await reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: Price$1
      }
    ])
    e.reply([`花了${Price$1}*[下品灵石]升级\n目前储物袋等级为${grade}`], {
      quote: e.msg_id
    })
    return
  }
}

class MoneyOperation extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(赠送|贈送)[\u4e00-\u9fa5]+\*\d+$/, fnc: 'giveMoney' }
      ]
    })
  }
  async giveMoney(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const UIDB = e?.at_user?.id
    if (!UIDB) return
    if (!(await isThereAUserPresentB(e, UIDB))) return
    const UserDataB = await read$7(UIDB)
    if (!(await dualVerification(e, UserData, UserDataB))) return
    if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type))
      return
    const [name, acount] = e.msg.replace(/^(#|\/)?(赠送|贈送)/, '').split('*')
    const thing = await searchBagByName(UID, name)
    if (thing && thing.grade >= 40) return e.reply('无法赠送')
    if (!thing || thing.acount < Number(acount)) {
      e.reply([`似乎没有[${name}]*${acount}`], {
        quote: e.msg_id
      })
      return
    }
    const BagSize = await backpackFull$1(UIDB, UserDataB.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    const CDID = 5,
      CDTime = CD_Transfer
    if (!(await victoryCooling(e, UID, CDID))) return
    set$3(UID, CDID, CDTime)
    await reduceBagThing(UID, [
      {
        name: name,
        acount: Number(acount)
      }
    ])
    await addBagThing(UIDB, UserDataB.bag_grade, [
      {
        name,
        acount: Number(acount)
      }
    ])
    e.reply(['你赠送了', `[${name}]*${acount}`], {
      quote: e.msg_id
    })
    return
  }
}

class Ring extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))$/,
          fnc: 'showRing'
        },
        {
          reg: /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))取出[\u4e00-\u9fa5]+\*\d+$/,
          fnc: 'takeOut'
        },
        {
          reg: /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))存入[\u4e00-\u9fa5]+\*\d+$/,
          fnc: 'deposit'
        }
      ]
    })
  }
  async showRing(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const img = await getRingComponent(
      await ringInformation(UID, e.user_avatar),
      UID
    )
    if (typeof img != 'boolean') e.reply(img)
    return
  }
  async takeOut(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const [thingName, thingAcount] = e.msg
      .replace(/^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))取出/, '')
      .split('*')
    const thing = await searchRingByName(UID, thingName)
    if (!thing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    if (thing.acount < Number(thingAcount)) {
      e.reply(['数量不足'], {
        quote: e.msg_id
      })
      return
    }
    const UserData = await read$7(UID)
    const BagThing = await searchBagByName(UID, thingName)
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagThing && !BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: thingName,
        acount: Number(thingAcount)
      }
    ])
    await reduceRingThing(UID, [
      {
        name: thingName,
        acount: Number(thingAcount)
      }
    ])
    e.reply(['取出', thingName], {
      quote: e.msg_id
    })
    return
  }
  async deposit(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const [thingName, thingAcount] = e.msg
      .replace(/^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))存入/, '')
      .split('*')
    const thing = await searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    if (thing.acount < Number(thingAcount)) {
      e.reply(['数量不足'], {
        quote: e.msg_id
      })
      return
    }
    const RingThing = await searchRingByName(UID, thingName)
    const RingSize = await backpackFull(UID)
    if (!RingThing && !RingSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    await addRingThing(UID, [
      {
        name: thingName,
        acount: Number(thingAcount)
      }
    ])
    await reduceBagThing(UID, [
      {
        name: thingName,
        acount: Number(thingAcount)
      }
    ])
    e.reply(['存入', thingName], {
      quote: e.msg_id
    })
    return
  }
}

class Help extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?修仙(帮|幫)助$/, fnc: 'getBaseHelp' },
        { reg: /^(#|\/)?黑市(帮|幫)助$/, fnc: 'getDarkHelp' },
        { reg: /^(#|\/)?地图(帮|幫)助$/, fnc: 'getMapHelp' },
        { reg: /^(#|\/)?天机(帮|幫)助$/, fnc: 'getHeavenlyHelp' },
        { reg: /^(#|\/)?联盟(帮|幫)助$/, fnc: 'getUnionHelp' },
        { reg: /^(#|\/)?战斗(帮|幫)助$/, fnc: 'getFightHelp' },
        { reg: /^(#|\/)?修炼(帮|幫)助$/, fnc: 'getPracticeHelp' },
        { reg: /^(#|\/)?虚空(帮|幫)助$/, fnc: 'getImitateHelp' },
        { reg: /^(#|\/)?势力(帮|幫)助$/, fnc: 'getAssHelp' },
        { reg: /^(#|\/)?职业(帮|幫)助$/, fnc: 'getCareerHelp' }
      ]
    })
  }
  async getBaseHelp(e) {
    postHelp(e, 'base_help')
    return true
  }
  async getCareerHelp(e) {
    postHelp(e, 'career_help')
    return
  }
  async getAssHelp(e) {
    postHelp(e, 'ass_help')
    return
  }
  async getImitateHelp(e) {
    postHelp(e, 'imitate_help')
    return
  }
  async getPracticeHelp(e) {
    postHelp(e, 'practice_help')
    return
  }
  async getDarkHelp(e) {
    postHelp(e, 'dark_help')
    return
  }
  async getMapHelp(e) {
    postHelp(e, 'map_help')
    return
  }
  async getHeavenlyHelp(e) {
    postHelp(e, 'heavenly_help')
    return
  }
  async getUnionHelp(e) {
    postHelp(e, 'union_help')
    return
  }
  async getFightHelp(e) {
    postHelp(e, 'fight_help')
    return
  }
}

class MapHelp extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(修仙地图|修仙地圖)$/, fnc: 'showMap' },
        { reg: /^(#|\/)?修仙配置$/, fnc: 'boxDefset' }
      ]
    })
  }
  async showMap(e) {
    const img = lcalCacheImage(`/public/img/map.jpg`)
    if (img) e.reply(img)
    return
  }
  async boxDefset(e) {
    const img = await getDefsetComponent(Cooling)
    if (typeof img != 'boolean') e.reply(img)
    return
  }
}

class Action extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?服用[\u4e00-\u9fa5]+\*\d+$/, fnc: 'take' },
        { reg: /^(#|\/)?(学习|學習)[\u4e00-\u9fa5]+$/, fnc: 'study' },
        { reg: /^(#|\/)?忘掉[\u4e00-\u9fa5]+$/, fnc: 'forget' },
        { reg: /^(#|\/)?消耗[\u4e00-\u9fa5]+\*\d+$/, fnc: 'consumption' }
      ]
    })
  }
  async take(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const [thingName, thingAcount] = e.msg
      .replace(/^(#|\/)?服用/, '')
      .split('*')
    const thing = await searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    if (thing.acount < Number(thingAcount)) {
      e.reply(['数量不足'], {
        quote: e.msg_id
      })
      return
    }
    const UserData = await read$7(UID)
    switch (thing.addition) {
      case 'boolere_covery': {
        let size = thing.boolere_covery * Number(thingAcount)
        size = size > 100 ? 100 : size
        const blood = await addBlood(UserData, size)
        e.reply([`💊${thingName}\n恢复了${size}%的血量\n🩸${blood}`], {
          quote: e.msg_id
        })
        break
      }
      case 'exp_gaspractice': {
        if (thing.exp_gaspractice <= 0) {
          e.reply([`[修为]+${0}`], {
            quote: e.msg_id
          })
          break
        }
        const size = Math.floor(
          (Number(thingAcount) *
            thing.exp_gaspractice *
            (UserData.talent_size + 100)) /
            100
        )
        const { msg } = await addExperience$1(UID, 1, size)
        e.reply([msg], {
          quote: e.msg_id
        })
        break
      }
      case 'exp_bodypractice': {
        const size = Math.floor(
          (Number(thingAcount) *
            thing.exp_bodypractice *
            (UserData.talent_size + 100)) /
            100
        )
        const { msg } = await addExperience$1(UID, 2, size)
        e.reply([msg], {
          quote: e.msg_id
        })
        break
      }
      case 'exp_soul': {
        const size = Math.floor(
          (Number(thingAcount) *
            thing.exp_soul *
            (UserData.talent_size + 100)) /
            100
        )
        const { msg } = await addExperience$1(UID, 3, size)
        e.reply([msg], {
          quote: e.msg_id
        })
        break
      }
      default: {
        e.reply([`啥也不是的东东,丢了~`], {
          quote: e.msg_id
        })
      }
    }
    await reduceBagThing(UID, [
      {
        name: thing.name,
        acount: Number(thingAcount)
      }
    ])
    return
  }
  async study(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const thingName = e.msg.replace(/^(#|\/)?(学习|學習)/, '')
    const thing = await searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    const AllSorcery = await get$2(UID)
    const islearned = AllSorcery.find(item => item.name == thing.name)
    if (islearned) {
      e.reply(['学过了'], {
        quote: e.msg_id
      })
      return
    }
    if (AllSorcery.length >= myconfig_gongfa) {
      e.reply(['反复看了又看\n却怎么也学不进'], {
        quote: e.msg_id
      })
      return
    }
    await add$1(UID, thing.name)
    setTimeout(async () => {
      const UserData = await read$7(UID)
      await updataEfficiency(UID, UserData.talent)
    }, 1000)
    await reduceBagThing(UID, [
      {
        name: thing.name,
        acount: 1
      }
    ])
    e.reply([`学习[${thingName}]`], {
      quote: e.msg_id
    })
    return
  }
  async forget(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const thingName = e.msg.replace(/^(#|\/)?忘掉/, '')
    const AllSorcery = await get$2(UID)
    const islearned = AllSorcery.find(item => item.name == thingName)
    if (!islearned) {
      e.reply([`没学过[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    const UserData = await read$7(UID)
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    await del$3(UID, thingName)
    setTimeout(async () => {
      const UserData = await read$7(UID)
      await updataEfficiency(UID, UserData.talent)
    }, 500)
    await addBagThing(UID, UserData.bag_grade, [
      { name: islearned.name, acount: 1 }
    ])
    e.reply([`忘了[${thingName}]`], {
      quote: e.msg_id
    })
    return
  }
  async consumption(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const [thingName, thingAcount] = e.msg
      .replace(/^(#|\/)?消耗/, '')
      .split('*')
    const thing = await searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    if (thing.acount < Number(thingAcount)) {
      e.reply(['数量不足'], {
        quote: e.msg_id
      })
      return
    }
    if (thing.type != 6) {
      await reduceBagThing(UID, [
        {
          name: thing.name,
          acount: Number(thingAcount)
        }
      ])
      e.reply([`[${thingName}]损坏`], {
        quote: e.msg_id
      })
      return
    }
    const UserData = await read$7(UID)
    switch (thing.id) {
      case 600201: {
        addExperience(
          e,
          UID,
          12,
          UserData.talent_size,
          {
            name: thing.name,
            experience: thing.exp_gaspractice
          },
          Number(thingAcount)
        )
        break
      }
      case 600202: {
        addExperience(
          e,
          UID,
          20,
          UserData.talent_size,
          {
            name: thing.name,
            experience: thing.exp_gaspractice
          },
          Number(thingAcount)
        )
        break
      }
      case 600203: {
        addExperience(
          e,
          UID,
          28,
          UserData.talent_size,
          {
            name: thing.name,
            experience: thing.exp_gaspractice
          },
          Number(thingAcount)
        )
        break
      }
      case 600204: {
        addExperience(
          e,
          UID,
          36,
          UserData.talent_size,
          {
            name: thing.name,
            experience: thing.exp_gaspractice
          },
          Number(thingAcount)
        )
        break
      }
      case 600301: {
        const LevelData = await read$6(UID, 1)
        if (!LevelData) {
          break
        }
        if (LevelData.realm > 24) {
          e.reply(['灵根已定\n此生不可再洗髓'], {
            quote: e.msg_id
          })
          break
        }
        UserData.talent = getTalent()
        await update$1(UID, {
          talent: UserData.talent
        })
        setTimeout(async () => {
          await updataEfficiency(UID, UserData.talent)
        }, 500)
        await reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        setTimeout(() => {
          showUserMsg(e)
        }, 1000)
        break
      }
      case 600302: {
        UserData.talent_show = 1
        await update$1(UID, {
          talent_show: UserData.talent_show
        })
        await reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        setTimeout(() => {
          showUserMsg(e)
        }, 500)
        break
      }
      case 600304: {
        const soul = thing.exp_soul * Number(thingAcount)
        await reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        const { msg } = await addExperience$1(UID, 3, soul)
        e.reply([msg])
        break
      }
      case 600306: {
        const soul = thing.exp_soul * Number(thingAcount)
        await reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        const { msg } = await addExperience$1(UID, 3, soul)
        e.reply([msg])
        break
      }
      case 600305: {
        if (UserData.special_prestige <= 0) {
          e.reply(['已心无杂念'], {
            quote: e.msg_id
          })
          break
        }
        UserData.special_prestige -= Number(thingAcount)
        if (UserData.special_prestige <= 0) {
          UserData.special_prestige = 0
        }
        await update$1(UID, {
          special_prestige: UserData.special_prestige
        })
        await reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        e.reply([`成功洗去[煞气]*${thingAcount}~`])
        break
      }
      case 600402: {
        const PositionData = await map_position.findAll({
          where: {
            attribute: [1, 6]
          },
          raw: true
        })
        const point = {
          type: 0,
          attribute: 0,
          name: '记录',
          x: 0,
          y: 0,
          z: 0
        }
        let closestPosition = null
        for await (const item of PositionData) {
          const x = (item?.x1 + item?.x2) / 2,
            y = (item?.y1 + item?.y2) / 2,
            z = (item?.z1 + item?.z1) / 2
          const distance = Math.sqrt(
            Math.pow(x - UserData.pont_x, 2) +
              Math.pow(y - UserData.pont_y, 2) +
              Math.pow(z - UserData.pont_z, 2)
          )
          if (!closestPosition || distance < closestPosition) {
            closestPosition = distance
            point.type = item?.type
            point.name = item?.name
            point.attribute = item?.attribute
            point.x = x
            point.y = y
            point.z = z
          }
        }
        await update$1(UID, {
          pont_x: point.x,
          pont_y: point.y,
          pont_z: point.z,
          point_type: point.type,
          pont_attribute: point.attribute
        })
        e.reply([`${UserData.name}成功传送至${point.name}`], {
          quote: e.msg_id
        })
        await reduceBagThing(UID, [
          {
            name: thing.name,
            acount: Number(thingAcount)
          }
        ])
        break
      }
      case 600403: {
        e.reply(['暂不可使用'], {
          quote: e.msg_id
        })
        break
      }
      case 600401: {
        e.reply(['暂不可使用'], {
          quote: e.msg_id
        })
        break
      }
    }
    return
  }
}
async function addExperience(e, UID, grade, talentsize, thing, acount) {
  const ling = await sendLing(e, UID, acount)
  if (!ling) {
    return
  }
  const { dividend, realm } = ling
  if (realm > grade) {
    e.reply(['该灵石已不足以提升修为'], {
      quote: e.msg_id
    })
    return
  }
  const size = Math.floor(
    (acount * thing.experience * (talentsize + 100)) / 100 / dividend
  )
  await reduceBagThing(UID, [
    {
      name: thing.name,
      acount: acount
    }
  ])
  const { msg } = await addExperience$1(UID, 1, size)
  e.reply([msg])
  return
}
async function sendLing(e, UID, acount) {
  let dividend = 1
  if (acount > 2200) {
    e.reply(['最多仅能2200'], {
      quote: e.msg_id
    })
    return false
  }
  const CDID = 12,
    CDTime = CD_Pconst_ractice
  if (!(await victoryCooling(e, UID, CDID))) return false
  set$3(UID, CDID, CDTime)
  const LevelData = await read$6(UID, 1)
  if (LevelData.realm > 12) {
    dividend = LevelData.realm - 10
    dividend = dividend > 8 ? 8 : dividend
  }
  return {
    realm: LevelData.realm,
    dividend
  }
}

const reGiveup = {}
class Destiny extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?炼化[\u4e00-\u9fa5]+$/, fnc: 'refining' },
        { reg: /^(#|\/)?本命$/, fnc: 'benming' },
        { reg: /^(#|\/)?精炼$/, fnc: 'refine' },
        { reg: /^(#|\/)?命解$/, fnc: 'giveup' }
      ]
    })
  }
  async refining(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const T = await user_fate.findOne({
      where: {
        uid: UID
      },
      raw: true
    })
    if (T) {
      e.reply(['已有本命物品'], {
        quote: e.msg_id
      })
      return
    }
    const thingName = e.msg.replace(/^(#|\/)?炼化/, '')
    const bagThing = await searchBagByName(UID, thingName)
    if (!bagThing) {
      e.reply([`没[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    const size = bagThing.grade * 1000
    const LevelMsg = await read$6(UID, 1)
    if (LevelMsg.experience < size) {
      e.reply([`需要消耗[修为]*${size}~`], {
        quote: e.msg_id
      })
      return
    }
    await reduceExperience(UID, 1, size)
    await user_fate.create({
      uid: UID,
      name: bagThing.name,
      grade: 0
    })
    const UserData = await read$7(UID)
    await reduceBagThing(UID, [{ name: thingName, acount: 1 }])
    await updatePanel(UID, UserData.battle_blood_now)
    e.reply([`成功炼化[${bagThing.name}]`], {
      quote: e.msg_id
    })
    return
  }
  async benming(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const thing = await user_fate.findOne({
      where: {
        uid: UID
      },
      include: {
        model: goods
      },
      raw: true
    })
    if (!thing) {
      e.reply(['未有本命物品'], {
        quote: e.msg_id
      })
      return
    }
    const data = await fate_level.findOne({
      where: {
        grade: thing.grade
      },
      raw: true
    })
    const exp_gaspractice = await read$6(UID, 1).then(res => res.experience)
    const exp_bodypractice = await read$6(UID, 2).then(res => res.experience)
    const exp_soul = await read$6(UID, 3).then(res => res.experience)
    const goodThing = await searchAllThing(thing.name)
    const size = 1000 * goodThing.grade
    e.reply([
      `\n本命物:${thing.name}`,
      `\n等级:${thing.grade}`,
      `\n属性:${await getTalentName(thing['good.talent'])}`,
      `\n精炼所需物品:${thing.name}`,
      `\n精炼所需灵石:${size}`,
      `\n精炼所需修为:${exp_gaspractice}/${data.exp_gaspractice}`,
      `\n精炼所需气血:${exp_bodypractice}/${data.exp_bodypractice}`,
      `\n精炼所需魂念:${exp_soul}/${data.exp_soul}`
    ])
    return
  }
  async refine(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const thing = await user_fate.findOne({
      where: {
        uid: UID
      },
      raw: true
    })
    if (!thing) {
      e.reply(['未有本命物品'], {
        quote: e.msg_id
      })
      return
    }
    if (thing.grade == 10) {
      e.reply(['本命物品品质已至仙品'], {
        quote: e.msg_id
      })
      return
    }
    const bagThing = await searchBagByName(UID, thing.name)
    if (!bagThing) {
      e.reply([`没[${thing.name}]`], {
        quote: e.msg_id
      })
      return
    }
    const size = 1000 * bagThing.grade
    const lingshi = await searchBagByName(UID, '下品灵石')
    if (!lingshi || lingshi.acount < size) {
      e.reply([`需要[下品灵石]*${size}] `])
      return
    }
    const udata = await fate_level.findOne({
      where: {
        grade: thing.grade
      }
    })
    const exp_gaspractice = await read$6(UID, 1).then(res => res.experience)
    const exp_bodypractice = await read$6(UID, 2).then(res => res.experience)
    const exp_soul = await read$6(UID, 3).then(res => res.experience)
    if (
      exp_gaspractice < udata.exp_gaspractice ||
      exp_bodypractice < udata.exp_bodypractice ||
      exp_soul < udata.exp_soul
    ) {
      e.reply(['当前[修为/气血/神念]不足以精炼本名物品'], {
        quote: e.msg_id
      })
      return
    }
    await reduceBagThing(UID, [
      {
        name: thing.name,
        acount: 1
      },
      {
        name: '下品灵石',
        acount: size
      }
    ])
    await reduceExperience(UID, 1, udata.exp_gaspractice)
    await reduceExperience(UID, 2, udata.exp_bodypractice)
    await reduceExperience(UID, 3, udata.exp_soul)
    const grade = thing.grade + 1
    await user_fate.update(
      {
        grade: grade
      },
      {
        where: {
          uid: UID
        }
      }
    )
    e.reply([`[${thing.name}]精炼至${grade}级`], {
      quote: e.msg_id
    })
    return
  }
  async giveup(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const thing = await user_fate.findOne({
      where: {
        uid: UID
      },
      raw: true
    })
    if (!thing) {
      e.reply(['未有本命物品'], {
        quote: e.msg_id
      })
      return
    }
    if (!reGiveup[UID] || reGiveup[UID] + 30000 < new Date().getTime()) {
      reGiveup[UID] = new Date().getTime()
      e.reply(['[重要提示]\n请30s内再次发送[(#|/)命解]', '\n以确认命解'], {
        quote: e.msg_id
      })
      return
    }
    const size = thing.grade * 1000
    const LevelMsg = await read$6(UID, 2)
    if (LevelMsg.experience < size) {
      e.reply([`需要消耗[气血]*${size}~`], {
        quote: e.msg_id
      })
      return
    }
    const UserData = await read$7(UID)
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    delete reGiveup[UID]
    await reduceExperience(UID, 1, size)
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: thing.name,
        acount: thing.grade + 1
      }
    ])
    await user_fate.destroy({
      where: {
        uid: UID
      }
    })
    e.reply([`成功从灵根处取出[${thing.name}]`], {
      quote: e.msg_id
    })
    return
  }
}

class Equipment extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(装备|裝備)[\u4e00-\u9fa5]+$/, fnc: 'addEquipment' },
        { reg: /^(#|\/)?卸下[\u4e00-\u9fa5]+$/, fnc: 'deleteEquipment' }
      ]
    })
  }
  async addEquipment(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const thingName = e.msg.replace(/^(#|\/)?(装备|裝備)/, '')
    const thing = await searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    const equipment = await get$3(UID)
    if (equipment.length >= myconfig_equipment) {
      e.reply(['拿不下了'], {
        quote: e.msg_id
      })
      return
    }
    await add$2(UID, thing.name)
    await reduceBagThing(UID, [
      {
        name: thing.name,
        acount: 1
      }
    ])
    setTimeout(async () => {
      const UserData = await read$7(UID)
      await updatePanel(UID, UserData.battle_blood_now)
      e.reply([`装备[${thingName}]`], {
        quote: e.msg_id
      })
    }, 1500)
    return
  }
  async deleteEquipment(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const thingName = e.msg.replace(/^(#|\/)?卸下/, '')
    const equipment = await get$3(UID)
    const islearned = equipment.find(item => item.name == thingName)
    if (!islearned) return
    const UserData = await read$7(UID)
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    await del$5(UID, thingName, islearned.id)
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: thingName,
        acount: 1
      }
    ])
    setTimeout(async () => {
      const UserData = await read$7(UID)
      await updatePanel(UID, UserData.battle_blood_now)
      e.reply([`卸下[${thingName}]`], {
        quote: e.msg_id
      })
    }, 1500)
    return
  }
}

class Move extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(坐标信息|坐標信息)$/, fnc: 'xyzaddress' },
        { reg: /^(#|\/)?向上$/, fnc: 'mapW' },
        { reg: /^(#|\/)?向左$/, fnc: 'mapA' },
        { reg: /^(#|\/)?向下$/, fnc: 'mapS' },
        { reg: /^(#|\/)?向右$/, fnc: 'mapD' }
      ]
    })
  }
  async xyzaddress(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    e.reply([`坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`])
    return
  }
  async mapW(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    UserData.pont_y += 10
    showAction(e, UID, UserData)
    return
  }
  async mapA(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    UserData.pont_x -= 10
    showAction(e, UID, UserData)
    return
  }
  async mapS(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    UserData.pont_y -= 10
    showAction(e, UID, UserData)
    return
  }
  async mapD(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    UserData.pont_x += 10
    showAction(e, UID, UserData)
    return
  }
}
async function showAction(e, UID, UserData) {
  const mData = await getRecordsByXYZ(
    UserData.pont_x,
    UserData.pont_y,
    UserData.pont_z
  )
  if (mData) {
    await update$1(UID, {
      point_type: mData.type,
      pont_attribute: mData.attribute,
      pont_x: UserData.pont_x,
      pont_y: UserData.pont_y,
      pont_z: UserData.pont_z
    })
    e.reply(`(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`)
  }
  return
}

class Secretplace extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?位置信息$/, fnc: 'showCity' },
        { reg: /^(#|\/)?前往[\u4e00-\u9fa5]+$/, fnc: 'forward' },
        { reg: /^(#|\/)?返回$/, fnc: 'falsePiont' },
        { reg: /^(#|\/)?(传送|傳送)[\u4e00-\u9fa5]+$/, fnc: 'delivery' }
      ]
    })
  }
  async showCity(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const PositionData = await map_point.findAll({
      raw: true
    })
    const msg = []
    for await (const item of PositionData) {
      if (
        item?.z == UserData.pont_z &&
        item?.attribute == UserData.pont_attribute &&
        item?.type == UserData.point_type
      ) {
        msg.push(
          `\n地点名:${item?.name}\n坐标(${item?.x},${item?.y},${item?.z})`
        )
      }
    }
    sendReply(e, '[位置信息]', msg)
    return
  }
  async falsePiont(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (UserData.state == 3) {
      const id = await get(UID)
      if (id) clearTimeout(id)
      cancelJob(UID)
      e.reply(['已站在原地'], {
        quote: e.msg_id
      })
      return
    }
    if (UserData.state == 4) {
      await del$7(UID)
      const id = await get(UID)
      if (id) {
        clearTimeout(id)
      }
      e.reply(['已取消传送'], {
        quote: e.msg_id
      })
      return
    }
    return
  }
  async forward(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (UserData.state == 1 || UserData.state == 2 || UserData.state == 8) {
      await endAllWord(e, UID, UserData)
      e.reply('[自动结束]闭关/打坐/锻体', {
        quote: e.msg_id
      })
      return
    }
    if (!(await ControlByBlood(e, UserData))) return
    const address = e.msg.replace(/^(#|\/)?前往/, '')
    const point = await map_point.findOne({
      order: [
        [
          literal(`CASE
          WHEN x >= ${UserData.pont_x - 200} AND x <= ${UserData.pont_x + 200} THEN 0
          ELSE ABS(x - ${UserData.pont_x})
        END`),
          'ASC'
        ],
        [
          literal(`CASE
          WHEN y >= ${UserData.pont_y - 200} AND y <= ${UserData.pont_y + 200} THEN 0
          ELSE ABS(y - ${UserData.pont_y})
        END`),
          'ASC'
        ]
      ],
      where: {
        name: {
          [Op.like]: `%${address}%`
        }
      },
      raw: true
    })
    if (!point) {
      e.reply([`未知地点[${address}]`], {
        quote: e.msg_id
      })
      return
    }
    const LevelsMsg = await read$6(UID, 1)
    if (LevelsMsg.realm < point.grade - 1) {
      e.reply('[修仙联盟]守境者:\n道友境界不足,请留步')
      return
    }
    const time = 3000
    const size = 15 + UserData.battle_speed / 5
    await setJob(UID, point.x, point.y, point.z, size)
    const { hours, minutes, seconds, totalMilliseconds } =
      estimateTotalExecutionTime(
        UserData.pont_x,
        UserData.pont_y,
        point.x,
        point.y,
        size,
        time
      )
    const msg = timeChange(new Date().getTime() + totalMilliseconds)
    e.reply(
      [
        `正在前往,${point.name}...`,
        `\n预计到达时间(${hours}h${minutes}m${seconds}s):`,
        `\n${msg}`
      ],
      {
        quote: e.msg_id
      }
    )
    return
  }
  async delivery(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await ControlByBlood(e, UserData))) return
    const address = e.msg.replace(/^(#|\/)?(传送|傳送)/, '')
    const position = await map_position.findOne({
      where: {
        name: address
      },
      raw: true
    })
    if (!position) {
      e.reply(['未知地点'], {
        quote: e.msg_id
      })
      return
    }
    const LevelData = await read$6(UID, 1)
    if (!LevelData) return
    if (LevelData.realm < position.grade - 1) {
      e.reply('[修仙联盟]守阵老者\n道友请留步', {
        quote: e.msg_id
      })
      return
    }
    const PointData = await map_point.findOne({
      where: {
        x: UserData.pont_x,
        y: UserData.pont_y,
        z: UserData.pont_z
      }
    })
    if (!PointData) {
      e.reply(['请前往传送阵'], {
        quote: e.msg_id
      })
      return
    }
    if (LevelData.realm > 12) {
      const acount = delivery_size
      const lingshi = await searchBagByName(UID, '下品灵石')
      if (!lingshi || lingshi.acount < acount) {
        e.reply(`[修仙联盟]守阵老者:\n需要花费${acount}*[下品灵石]`)
        return
      }
      await reduceBagThing(UID, [
        {
          name: '下品灵石',
          acount: acount
        }
      ])
    }
    const mx =
        Math.floor(Math.random() * (position.x2 - position.x1)) +
        Number(position.x1),
      my =
        Math.floor(Math.random() * (position.y2 - position.y1)) +
        Number(position.y1),
      mz =
        Math.floor(Math.random() * (position.z2 - position.z1)) +
        Number(position.z1)
    const x = UserData.pont_x
    const y = UserData.pont_y
    const the = Math.floor(
      ((x - mx >= 0 ? x - mx : mx - x) + (y - my >= 0 ? y - my : my - y)) / 100
    )
    const time = the > 0 ? the : 1
    await set$1(
      UID,
      setTimeout(async () => {
        await del$7(UID)
        await update$1(UID, {
          pont_x: mx,
          pont_y: my,
          pont_z: mz,
          point_type: position.type,
          pont_attribute: position.attribute
        })
        e.reply([`成功传送至${address}`], {
          quote: e.msg_id
        })
      }, 1000 * time)
    )
    await set$4(UID, {
      actionID: 4,
      startTime: new Date().getTime(),
      endTime: 1000 * time
    })
    e.reply(`[修仙联盟]守阵老者:\n传送对接${address}\n需要${time}秒`)
    return
  }
}

class Tianjigate extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?洗手$/, fnc: 'handWashing' },
        { reg: /^(#|\/)?天道祝福$/, fnc: 'blessing' },
        { reg: /^(#|\/)?天道降临$/, fnc: 'heavenlyWayComes' },
        { reg: /^(#|\/)?查阅[\u4e00-\u9fa5]+$/, fnc: 'serchTxt' },
        { reg: /^(#|\/)?天机资料$/, fnc: 'serchIf' }
      ]
    })
  }
  async serchIf(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '天机门'))) return
    const data = await txt.findAll({
      raw: true
    })
    const txt$1 = data
    if (txt$1.length == 0) {
      e.reply('[天机门]朴声\n无记载')
    }
    const arr = ['[天机资料]']
    for await (const item of txt$1) {
      arr.push(`\n${item.name}`)
    }
    e.reply(arr)
    return
  }
  async serchTxt(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '天机门'))) return
    const name = e.msg.replace(/^(#|\/)?查阅/, '')
    const data = await txt.findAll({
      where: {
        name: name
      },
      raw: true
    })
    const txt$1 = data
    if (txt$1.length == 0) {
      e.reply('[天机门]朴声\n无记载')
    }
    for await (const item of txt$1) {
      e.reply(`[${item.name}]\n${item.doc}`, {
        quote: e.msg_id
      })
    }
    return
  }
  async handWashing(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '天机门'))) return
    const LevelData = await read$6(UID, 1)
    if (LevelData.realm == 0) {
      e.reply('[天机门]李逍遥\n凡人不可捷越')
      return
    }
    if (UserData.special_prestige <= 0) {
      e.reply('[天机门]李逍遥\n你一身清廉')
      return
    }
    const size = 100 - UserData.special_prestige
    const r = LevelData.realm / 2
    const money = 98 * Math.floor(r < 1 ? 1 : r) * (size > 1 ? size : 1)
    const lingshi = await searchBagByName(UID, '下品灵石')
    if (!lingshi || lingshi.acount < money) {
      e.reply(`[天机门]韩立\n清煞气需要[下品灵石]*${money}`)
      return
    }
    await reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: money
      }
    ])
    await update$1(UID, {
      special_prestige: UserData.special_prestige - 1
    })
    e.reply('[天机门]南宫问天\n为你清除[煞气]*1')
    return
  }
  async blessing(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    if (!(await collectItems(UID))) {
      e.reply('[天机门]秦羽\n放肆')
      return
    }
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: '极品灵石',
        acount: 500
      }
    ])
    e.reply([`天地之灵渐渐凝成了[极品灵石]*500`], {
      quote: e.msg_id
    })
    return
  }
  async heavenlyWayComes(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    if (!(await verify(UID))) {
      e.reply('[天机门]秦羽\n放肆')
      return
    }
    const realm = await read$6(UID, 1).then(item => item.realm)
    const size = (realm ?? 1) * 25
    const Size = size < 1000 ? size : 1000
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: '极品灵石',
        acount: Size
      }
    ])
    e.reply([`[天机门]秦羽:\n领取成功~`])
    e.reply(`天道之锁渐渐凝成了[极品灵石]*${Size}`, {
      quote: e.msg_id
    })
  }
}

class Information extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(个人|個人)信息$/, fnc: 'personalInformation' },
        { reg: /^(#|\/)?面板信息$/, fnc: 'equipmentInformation' },
        { reg: /^(#|\/)?功法信息$/, fnc: 'skillInformation' },
        { reg: /^(#|\/)?我的编号$/, fnc: 'myUserID' },
        { reg: /^(#|\/)?(帮助|控制板)$/, fnc: 'controllers' }
      ]
    })
  }
  async controllers(e) {
    Controllers(e).Message.reply(
      '按钮',
      [
        { label: '个人信息', value: '/个人信息' },
        { label: '面板信息', value: '/面板信息' },
        { label: '功法信息', value: '/功法信息' }
      ],
      [
        { label: '闭关', value: '/闭关' },
        { label: '出关', value: '/出关' },
        { label: '前往', value: '/前往', enter: false }
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
      ],
      [
        { label: '探索怪物', value: '/探索怪物' },
        { label: '释放神识', value: '/释放神识' },
        {
          label: '加入官群',
          value: '/加入官群',
          link: 'https://qm.qq.com/q/BUXl2xKabe'
        }
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
        update$1(UID, {
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
            getEquipmentComponent(res, UID).then(img => {
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
            getSkillsComponent(res, UID).then(img => {
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

class List extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(天命榜|至尊榜|帝魂榜)$/, fnc: 'showList' },
        { reg: /^(#|\/)?杀神榜$/, fnc: 'killGodChart' }
      ]
    })
  }
  async showList(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const img = await getListComponent(await getList(), UID)
    if (typeof img != 'boolean') e.reply(img)
  }
  async killGodChart(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const img = await getKillComponent(await getKillList(), UID)
    if (typeof img != 'boolean') e.reply(img)
  }
}

class Modify extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?(更改道号|更改道號)[\u4e00-\u9fa5]+$/,
          fnc: 'changeName'
        },
        { reg: /^(#|\/)?更改道宣[\u4e00-\u9fa5]+$/, fnc: 'changeAutograph' }
      ]
    })
  }
  async changeName(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await Control(e, UserData))) return
    const name = e.msg.replace(/^(#|\/)?(更改道号|更改道號)/, '')
    if (name.length == 0) return
    if (name.length > 8) {
      e.reply(['你这名字\n可真是稀奇'], {
        quote: e.msg_id
      })
      return
    }
    const CDID = 3,
      CDTime = CD_Name
    if (!(await victoryCooling(e, UID, CDID))) return
    set$3(UID, CDID, CDTime)
    await update$1(UID, {
      name: name
    })
    setTimeout(() => {
      showUserMsg(e)
    }, 500)
    return
  }
  async changeAutograph(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await Control(e, UserData))) return
    const autograph = e.msg.replace(/^(#|\/)?更改道宣/, '')
    if (autograph.length == 0 || autograph.length > 50) {
      e.reply(['请正确设置\n且道宣最多50字符'], {
        quote: e.msg_id
      })
      return
    }
    const CDID = 4,
      CDTime = CD_Autograph
    if (!(await victoryCooling(e, UID, CDID))) return
    set$3(UID, CDID, CDTime)
    await update$1(UID, {
      autograph: autograph
    })
    setTimeout(() => {
      showUserMsg(e)
    }, 500)
    return
  }
}

class Start extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?踏入仙途$/, fnc: 'createMsg' },
        { reg: /^(#|\/)?再入仙途$/, fnc: 'reCreateMsg' },
        { reg: /^(#|\/)?绑定企鹅\d+$/, fnc: 'binding' },
        { reg: /^(#|\/)?解绑企鹅$/, fnc: 'delBinding' }
      ]
    })
  }
  async createMsg(e) {
    const UID = e.user_id
    user
      .findOne({
        attributes: ['uid'],
        where: {
          uid: e.user_id
        },
        raw: true
      })
      .then(res => res)
      .then(async res => {
        if (!res) {
          updatePlayer(UID, e.user_avatar)
            .then(() => {
              set$3(UID, 8, CD_Reborn)
              e.reply(
                [
                  `修仙大陆第${res.id}位萌新`,
                  '\n记得去联盟报到开宝箱噢',
                  '\n签到还有特殊奖励'
                ],
                {
                  quote: e.msg_id
                }
              )
              if (e.platform == 'ntqq') {
                e.reply(['可使用[/绑定企鹅+QQ]切换头像'], {
                  quote: e.msg_id
                })
              }
              e.reply(['发送[/修仙帮助]了解更多'], {
                quote: e.msg_id
              })
              showUserMsg(e)
            })
            .catch(err => {
              e.reply(['未寻得仙缘'], {
                quote: e.msg_id
              })
            })
        } else {
          showUserMsg(e)
        }
      })
      .catch(err => {
        e.reply('数据查询错误')
      })
    return
  }
  async reCreateMsg(e) {
    const UID = e.user_id
    isUser(UID)
      .then(res => {
        if (!res) {
          e.reply('请先[/踏入仙途]')
          return
        }
        if (!reStart[UID] || reStart[UID] + 30000 < new Date().getTime()) {
          reStart[UID] = new Date().getTime()
          e.reply(
            ['[重要提示]\n请30s内再次发送[(#|/)再入仙途]', '\n以确认转世'],
            {
              quote: e.msg_id
            }
          )
          return
        }
        const CDID = 8
        const CDTime = CD_Reborn
        victoryCooling(e, UID, CDID).then(res => {
          if (!res) return
          updatePlayer(UID, e.user_avatar)
            .then(res => {
              set$3(UID, CDID, CDTime)
              isUser(UID)
                .then(UserData => {
                  e.reply(
                    [
                      `修仙大陆第${UserData.id}位萌新`,
                      '\n记得去联盟报到开宝箱噢',
                      '\n签到还有特殊奖励'
                    ],
                    {
                      quote: e.msg_id
                    }
                  )
                  if (e.platform == 'ntqq') {
                    e.reply(['可使用[/绑定企鹅+QQ]切换头像'], {
                      quote: e.msg_id
                    })
                  }
                  e.reply(['发送[/修仙帮助]了解更多'], {
                    quote: e.msg_id
                  })
                  Promise.all([
                    updatePanel(UID, UserData.battle_blood_now),
                    updataEfficiency(UID, UserData.talent),
                    showUserMsg(e)
                  ])
                  delete reStart[UID]
                })
                .catch(() => {
                  e.reply('数据查询失败')
                })
            })
            .catch(err => {
              e.reply('冷却检查错误')
            })
        })
      })
      .catch(() => {
        e.reply('数据查询失败')
      })
    return
  }
  async delBinding(e) {
    const UID = e.user_id
    isUser(UID)
      .then(res => {
        if (!res) {
          e.reply('请先[/踏入仙途]')
          return
        }
        update$1(UID, {
          phone: null
        })
          .then(() => {
            e.reply([`绑定成功`], {
              quote: e.msg_id
            })
          })
          .catch(() => {
            e.reply('数据变更错误')
          })
      })
      .catch(() => {
        e.reply('数据查询错误')
      })
    return
  }
  async binding(e) {
    const UID = e.user_id
    isUser(UID)
      .then(res => {
        if (!res) {
          e.reply('请先[/踏入仙途]')
          return
        }
        const qq = e.msg.replace(/^(#|\/)?绑定企鹅/, '').split('*')
        if (qq.length >= 20) {
          e.reply('错误长度', {
            quote: e.msg_id
          })
          return
        }
        update$1(UID, {
          phone: Number(qq)
        })
          .then(res => {
            e.reply([`绑定${qq}成功`], {
              quote: e.msg_id
            })
          })
          .catch(() => {
            e.reply('绑定失败')
          })
      })
      .catch(() => {
        e.reply('数据查询错误')
      })
    return
  }
}
const reStart = {}

class Palace extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?浩瀚仙宫$/,
          fnc: 'showPalace'
        },
        {
          reg: /^(#|\/)?南天宫$/,
          fnc: 'nantian'
        },
        {
          reg: /^(#|\/)?东湖宫$/,
          fnc: 'donhu'
        },
        {
          reg: /^(#|\/)?使用(沉香|玉香)兑换[\u4e00-\u9fa5]+\*\d+$/,
          fnc: 'usePalace'
        },
        {
          reg: /^(#|\/)?祈福(沉香|玉香)\*\d+$/,
          fnc: 'blessings'
        }
      ]
    })
  }
  async blessings(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const [thingName, quantity] = e.msg.replace(/^(#|\/)?祈福/, '').split('*')
    const ifexist = await goods.findOne({
      where: {
        name: thingName
      },
      raw: true
    })
    if (!ifexist) {
      e.reply(`无[${thingName}]`, {
        quote: e.msg_id
      })
      return
    }
    const lingshi = await searchBagByName(UID, '极品灵石')
    const price = ifexist.price * Number(quantity)
    if (!lingshi || lingshi.acount < price) {
      e.reply([`似乎没有${price}*[极品灵石]`], {
        quote: e.msg_id
      })
      return
    }
    const UserData = await read$7(UID)
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'])
      return
    }
    await reduceBagThing(UID, [
      {
        name: '极品灵石',
        acount: price
      }
    ])
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: ifexist.name,
        acount: Number(quantity)
      }
    ])
    e.reply(`消耗了[极品灵石]*${price}祈福了[${thingName}]*${quantity},`, {
      quote: e.msg_id
    })
    return
  }
  async usePalace(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const [thingName, thingAcount] = e.msg
      .replace(/^(#|\/)?使用(沉香|玉香)兑换/, '')
      .split('*')
    const UserData = await read$7(UID)
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    if (/玉香/.test(e.msg)) {
      const palace = await goods.findOne({
        where: {
          palace: 1,
          name: thingName
        },
        raw: true
      })
      if (!palace) {
        e.reply(`南天宫中没有${thingName}`)
        return
      }
      const number = palace.price * Number(thingAcount)
      const lingshi = await searchBagByName(UID, '玉香')
      if (!lingshi || lingshi.acount < number) {
        e.reply([`似乎没有[玉香]*${number}`], {
          quote: e.msg_id
        })
        return
      } else {
        e.reply([`使用[玉香]*${number}`], {
          quote: e.msg_id
        })
      }
      await reduceBagThing(UID, [
        {
          name: '玉香',
          acount: number
        }
      ])
      await addBagThing(UID, UserData.bag_grade, [
        {
          name: palace.name,
          acount: Number(thingAcount)
        }
      ])
      e.reply(`获得[${thingName}]*${thingAcount}`)
      return
    }
    const at = await activity.findOne({
      where: {
        name: '东湖宫'
      },
      raw: true
    })
    const time = new Date().getTime()
    if (time <= at.start_time || time >= at.end_time) {
      e.reply('东湖宫暂未显世~')
      return
    }
    const limit = await goods.findOne({
      where: {
        limit: [1, 3],
        name: thingName
      },
      raw: true
    })
    if (!limit) {
      e.reply(`南天宫中没有${thingName}`)
      return
    }
    const number = limit.price * Number(thingAcount)
    const lingshi = await searchBagByName(UID, '沉香')
    if (!lingshi || lingshi.acount < number) {
      e.reply([`似乎没有[沉香]*${number}`], {
        quote: e.msg_id
      })
      return
    } else {
      e.reply([`使用[沉香]*${number}`], {
        quote: e.msg_id
      })
    }
    await reduceBagThing(UID, [
      {
        name: '沉香',
        acount: number
      }
    ])
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: limit.name,
        acount: Number(thingAcount)
      }
    ])
    e.reply(`获得[${thingName}]*${thingAcount}`)
    return
  }
  async donhu(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const start_msg = [
      '\n阿了:哈哈哈哈~你是在找我吗?',
      '\n阿了:好饿好饿,你好像有灵石哎'
    ]
    const limit = await goods.findAll({
      where: {
        limit: [1, 3]
      },
      raw: true
    })
    const end_msg = getListMsg(limit, '沉香')
    sendReply(e, '___[东湖宫]___', [...start_msg, ...end_msg])
    return
  }
  async nantian(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const start_msg = [
      '\n阿了:哈哈哈哈~你是在找我吗?',
      '\n阿了:好饿好饿,你好像有灵石哎'
    ]
    const palace = await goods.findAll({
      where: {
        palace: 1
      },
      raw: true
    })
    const end_msg = getListMsg(palace, '玉香')
    sendReply(e, '___[南天宫]___', [...start_msg, ...end_msg])
    return
  }
  async showPalace(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const start_msg = [
      '\n阿了:哈哈哈哈~你是在找我吗?',
      '\n阿了:好饿好饿,你好像有灵石哎'
    ]
    const palace = await goods.findAll({
      where: {
        palace: 1
      },
      raw: true
    })
    const limit = await goods.findAll({
      where: {
        limit: [1, 3]
      },
      raw: true
    })
    const limit_end_msg = getListMsg(limit, '沉香')
    const palace_end_msg = getListMsg(palace, '玉香')
    sendReply(e, '___[浩瀚宫殿]___', [
      ...start_msg,
      ...palace_end_msg,
      ...limit_end_msg
    ])
    return
  }
}

class Transaction extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?(万宝楼|萬寶樓)(武器|护具|法宝|丹药|功法|道具|材料|装备)?$/,
          fnc: 'showComodities'
        },
        {
          reg: /^(#|\/)?(购买|購買)[\u4e00-\u9fa5]+\*\d+$/,
          fnc: 'buyComodities'
        },
        { reg: /^(#|\/)?出售[\u4e00-\u9fa5]+\*\d+$/, fnc: 'sellComodities' },
        {
          reg: /^(#|\/)?售出所有(武器|护具|法宝|丹药|功法|道具|材料|装备)$/,
          fnc: 'shellAllType'
        },
        {
          reg: /^(#|\/)?售出所有物品$/,
          fnc: 'shellAllGoods'
        }
      ]
    })
  }
  async showComodities(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    const start_msg = []
    start_msg.push('\n欢迎关顾本店')
    const type = e.msg.replace(/^(#|\/)?(万宝楼|萬寶樓)/, '')
    const commoditiesList = await goods.findAll({
      where: {
        commodities: 1,
        type: mapType[type] ?? mapType['道具']
      },
      raw: true
    })
    const end_msg = getListMsg(commoditiesList, '价格', ExchangeStart)
    sendReply(e, '___[万宝楼]___', [...start_msg, ...end_msg])
    return
  }
  async sellComodities(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    const [thingName, quantity] = e.msg.replace(/^(#|\/)?出售/, '').split('*')
    const thing = await searchBagByName(UID, thingName)
    if (!thing) {
      e.reply(`没[${thingName}]`, {
        quote: e.msg_id
      })
      return
    }
    if (thing.acount < Number(quantity)) {
      e.reply('数量不足', {
        quote: e.msg_id
      })
      return
    }
    await reduceBagThing(UID, [
      {
        name: thing.name,
        acount: Number(quantity)
      }
    ])
    const commoditiesPrice = Math.floor(
      thing.price * Number(quantity) * ExchangeEnd
    )
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: '下品灵石',
        acount: commoditiesPrice
      }
    ])
    e.reply(`[万宝楼]欧阳峰:\n出售得${commoditiesPrice}*[下品灵石]`)
    return
  }
  async buyComodities(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    const [thingName, quantity] = e.msg
      .replace(/^(#|\/)?(购买|購買)/, '')
      .split('*')
    const ifexist = await goods.findOne({
      where: {
        commodities: 1,
        name: thingName
      },
      raw: true
    })
    if (!ifexist) {
      e.reply(`[万宝楼]小二:\n不卖[${thingName}]`)
      return
    }
    const lingshi = await searchBagByName(UID, '下品灵石')
    const price = Math.floor(ifexist.price * Number(quantity) * ExchangeStart)
    if (!lingshi || lingshi.acount < price) {
      e.reply([`似乎没有${price}*[下品灵石]`], {
        quote: e.msg_id
      })
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    await reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: price
      }
    ])
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: ifexist.name,
        acount: Number(quantity)
      }
    ])
    e.reply(
      `[万宝楼]薛仁贵\n你花[下品灵石]*${price}购买了[${thingName}]*${quantity},`
    )
    return
  }
  async shellAllType(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    const type = e.msg.replace(/^(#|\/)?售出所有/, '')
    let money = 0
    if (!Object.prototype.hasOwnProperty.call(mapType, type)) {
      e.reply('错误类型', {
        quote: e.msg_id
      })
      return
    }
    const bag = await user_bag.findAll({
      where: {
        uid: UID
      },
      include: {
        model: goods,
        where: {
          type: mapType[type]
        }
      },
      raw: true
    })
    for await (const item of bag) {
      money += item.acount * item['good.price']
    }
    money = Math.floor(money * ExchangeEnd)
    if (isNaN(money) || money == 0) {
      e.reply('[蜀山派]叶铭\n一边去')
      return
    }
    await del$6(UID, [mapType[type]])
    await addBagThing(UID, UserData.bag_grade, [
      { name: '下品灵石', acount: money }
    ])
    e.reply(`[蜀山派]叶铭\n这是${money}*[下品灵石],道友慢走`)
    return
  }
  async shellAllGoods(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    let money = 0
    const bag = await user_bag.findAll({
      where: {
        uid: UID
      },
      include: {
        model: goods
      },
      raw: true
    })
    for await (const item of bag) {
      money += item.acount * item['good.price']
    }
    money = Math.floor(money * ExchangeEnd)
    if (isNaN(money) || money == 0) {
      e.reply('[蜀山派]叶铭\n一边去')
      return
    }
    await del$6(UID)
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: '下品灵石',
        acount: money
      }
    ])
    e.reply(`[蜀山派]叶铭\n这是${money}*[下品灵石],道友慢走`)
    return
  }
}

class union extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?(联盟商会|聯盟商會)(武器|护具|法宝|丹药|功法|道具|材料|装备)?$/,
          fnc: 'unionShop'
        },
        { reg: /^(#|\/)?(贡献|貢獻)[\u4e00-\u9fa5]+\*\d+$/, fnc: 'contribute' },
        { reg: /^(#|\/)?(兑换|兌換)[\u4e00-\u9fa5]+\*\d+$/, fnc: 'unionBuy' },
        { reg: /^(#|\/)?(联盟|聯盟)(报|報)(到|道)$/, fnc: 'userCheckin' },
        { reg: /^(#|\/)?(联盟|聯盟)(签|簽)到$/, fnc: 'userSignIn' },
        { reg: /^(#|\/)?仙石兑换.*$/, fnc: 'exchange' }
      ]
    })
  }
  async unionShop(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '联盟'))) return
    const start_msg = []
    start_msg.push('\n[(#|/)兑换+物品名*数量]')
    const type = e.msg.replace(/^(#|\/)?(联盟商会|聯盟商會)/, '')
    const commoditiesList = await goods.findAll({
      where: {
        alliancemall: 1,
        type: mapType[type] ?? mapType['道具']
      },
      raw: true
    })
    const end_msg = getListMsg(commoditiesList, '声望')
    const msg = [...start_msg, ...end_msg]
    sendReply(e, '___[联盟商会]___', msg)
    return
  }
  async unionBuy(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '联盟'))) return
    const [thingName, quantity] = e.msg
      .replace(/^(#|\/)?(兑换|兌換)/, '')
      .split('*')
    const ifexist = await goods.findOne({
      where: {
        alliancemall: 1,
        name: thingName
      },
      raw: true
    })
    if (!ifexist) {
      e.reply(`[联盟]叶铭\n没有[${thingName}]`)
      return
    }
    const price = Math.floor(ifexist.price * Number(quantity))
    if (UserData.special_reputation < price) {
      e.reply(`[联盟]叶铭\n你似乎没有${price}*[声望]`)
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    UserData.special_reputation -= price
    await update$1(UID, {
      special_reputation: UserData.special_reputation
    })
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: ifexist.name,
        acount: Number(quantity)
      }
    ])
    e.reply(`[联盟]叶铭\n使用[声望]*${price}兑换了[${thingName}]*${quantity},`)
    return
  }
  async userSignIn(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '联盟'))) return
    const nowTime = new Date()
    const lastSignTime = new Date(UserData.sign_time)
    const lastSignDay = lastSignTime.toDateString()
    if (lastSignDay === nowTime.toDateString()) {
      e.reply('[联盟]叶铭\n今日已签到')
      return
    }
    if (lastSignTime.getMonth() !== nowTime.getMonth()) {
      UserData.sign_size = 0
    }
    UserData.sign_size += 1
    UserData.sign_time = nowTime.getTime()
    if (UserData.sign_size > 28) {
      e.reply('[联盟]叶铭\n本月签到已满28天')
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    const spiritual = 100
    const size = UserData.special_spiritual + spiritual
    const limit = UserData.special_spiritual_limit
    const reputation = 20
    await update$1(UID, {
      special_reputation: UserData.special_reputation + reputation,
      special_spiritual: size <= limit ? size : limit
    })
    let ACCOUNT = 1
    const arr = []
    let name = '极品灵石'
    if (UserData.sign_size % 7 === 0) {
      name = '三转金丹'
      arr.push({
        name,
        acount: ACCOUNT
      })
    } else {
      ACCOUNT = 2 * (UserData.sign_size % 7)
      arr.push({
        name,
        acount: ACCOUNT
      })
      arr.push()
    }
    const sky = await activity.findOne({
      where: {
        name: '签到'
      },
      raw: true
    })
    const time = new Date().getTime()
    if (time <= sky.start_time || time >= sky.end_time) {
      arr.push({
        name: '玉香',
        acount: 1
      })
      await addBagThing(UID, UserData.bag_grade, arr)
      await update$1(UID, {
        sign_size: UserData.sign_size,
        sign_time: UserData.sign_time
      })
      e.reply(
        `[联盟]叶铭\n本月连续签到${UserData.sign_size}天~\n[${name}]*${ACCOUNT}\n[灵力]*${spiritual}\n[声望]*${reputation}\n[玉香]*1`
      )
      return
    }
    const gaspractice = await read$6(UID, 1).then(item => item.realm)
    const bodypractice = await read$6(UID, 2).then(item => item.realm)
    const soul = await read$6(UID, 3).then(item => item.realm)
    if (
      gaspractice < sky.gaspractice ||
      bodypractice < sky.bodypractice ||
      soul < sky.soul
    ) {
      arr.push({
        name: '玉香',
        acount: 2
      })
      await addBagThing(UID, UserData.bag_grade, arr)
      await update$1(UID, {
        sign_size: UserData.sign_size,
        sign_time: UserData.sign_time
      })
      e.reply(
        `[联盟]叶铭\n本月连续签到${UserData.sign_size}天~\n[${name}]*${ACCOUNT}\n[灵力]*${spiritual}\n[声望]*${reputation}\n[玉香]*2`
      )
      return
    }
    arr.push({
      name: '玉香',
      acount: 2
    })
    arr.push({
      name: '沉香',
      acount: 3
    })
    await addBagThing(UID, UserData.bag_grade, arr)
    e.reply(
      `[联盟]叶铭\n本月连续签到${UserData.sign_size}天~\n[${name}]*${ACCOUNT}\n[灵力]*${spiritual}\n[声望]*${reputation}\n[玉香]*1\n[沉香]*3`
    )
    await update$1(UID, {
      sign_size: UserData.sign_size,
      sign_time: UserData.sign_time
    })
    return
  }
  async contribute(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '联盟'))) return
    const [thingName, quantity] = e.msg
      .replace(/^(#|\/)?(贡献|貢獻)/, '')
      .split('*')
    const thing = await searchBagByName(UID, thingName)
    if (!thing) {
      e.reply(`[联盟]黄天霸\n你没[${thingName}]`)
      return
    }
    if (thing.acount < Number(quantity)) {
      e.reply('[联盟]黄天霸\n数量不足')
      return
    }
    if (thing.price * Number(quantity) < 2000) {
      e.reply('[联盟]黄天霸\n物品价值不足2000')
      return
    }
    await reduceBagThing(UID, [
      {
        name: thing.name,
        acount: Number(quantity)
      }
    ])
    const size = Math.floor((thing.price * Number(quantity)) / 66)
    update$1(UID, {
      special_reputation: UserData.special_reputation + size
    })
    e.reply(`[联盟]黄天霸\n贡献成功,奖励[声望]*${size}`)
    return
  }
  async userCheckin(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await read$7(UID)
    if (!(await controlByName(e, UserData, '联盟'))) return
    const LevelData = await read$6(UID, 1)
    if (LevelData.realm > 12) {
      e.reply('[修仙联盟]方正\n前辈莫要开玩笑')
      return
    }
    if (UserData.newcomer_gift != 0) {
      e.reply('[修仙联盟]方正\n道友要不仔细看看自己的储物袋')
      return
    }
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    await update$1(UID, {
      newcomer_gift: 1
    })
    const randomthing = await getRandomThing({
      commodities: 1
    })
    if (!randomthing) {
      e.reply('随机物品错误', {
        quote: e.msg_id
      })
      return
    }
    await addBagThing(UID, UserData.bag_grade, [
      {
        name: randomthing.name,
        acount: 1
      }
    ])
    e.reply(`[修仙联盟]方正\n看你骨骼惊奇\n就送你[${randomthing.name}]吧`)
    return
  }
  async exchange(e) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    if (
      !(
        Date.now() >= new Date('2024-04-08').getTime() &&
        Date.now() <= new Date('2024-04-11').getTime()
      )
    ) {
      return e.reply('未开放')
    }
    const UserData = await read$7(UID)
    const thingName = e.msg.replace(/^(#|\/)?仙石兑换/, '')
    const BagSize = await backpackFull$1(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
    }
    if (thingName == '天道剑') {
      const bag = await searchBagByName(UID, '仙石')
      if (!bag || bag.acount < 4) {
        return e.reply('仙石不足')
      }
      const bagdata = await searchBagByName(UID, '沉香')
      if (!bagdata || bagdata.acount < 50) {
        return e.reply('沉香不足')
      }
      reduceBagThing(UID, [
        { name: '仙石', acount: 4 },
        { name: '沉香', acount: 50 }
      ])
      addBagThing(UID, 99, [{ name: '天道剑', acount: 1 }])
    } else if (thingName == '天罡神盾袍') {
      const bag = await searchBagByName(UID, '仙石')
      if (!bag || bag.acount < 4) {
        return e.reply('仙石不足')
      }
      const bagdata = await searchBagByName(UID, '沉香')
      if (!bagdata || bagdata.acount < 40) {
        return e.reply('沉香不足')
      }
      reduceBagThing(UID, [
        { name: '仙石', acount: 4 },
        { name: '沉香', acount: 40 }
      ])
      addBagThing(UID, 50, [{ name: '天罡神盾袍', acount: 1 }])
    } else {
      e.reply(`哪来的${thingName}`)
    }
    return
  }
}

class Admins extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?切换绑定(.*)*$/,
          fnc: 'switch'
        }
      ]
    })
  }
  async switch(e) {
    e.user_id
    const didian = e.msg.replace(/(#|\/)?切换绑定/, '')
    const [switchuid, bindinguid] = didian.split('*')
    if (!switchuid || !bindinguid) return
    const user$1 = await user.findOne({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid']
      },
      raw: true
    })
    if (!user$1) return e.reply('查无此人')
    const user_blessing$1 = await user_blessing.findOne({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid']
      },
      raw: true
    })
    const user_bag$1 = await user_bag.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id']
      },
      raw: true
    })
    const user_ass$1 = await user_ass.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid']
      },
      raw: true
    })
    const user_equipment$1 = await user_equipment.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid']
      },
      raw: true
    })
    const user_compensate$1 = await user_compensate.findOne({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid']
      },
      raw: true
    })
    const user_fate$1 = await user_fate.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid']
      },
      raw: true
    })
    const user_ring$1 = await user_ring.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid']
      },
      raw: true
    })
    const user_level$1 = await user_level.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid']
      },
      raw: true
    })
    const user_skill = await user_skills.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id']
      },
      raw: true
    })
    await user.update({ uid: switchuid + '-1' }, { where: { uid: switchuid } })
    await user.update(user$1, { where: { uid: bindinguid } })
    await user_blessing.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    await user_blessing.update(user_blessing$1, { where: { uid: bindinguid } })
    await user_ring.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_ring$1.length; index++) {
      user_ring$1[index].uid = bindinguid
      await user_ring.create(user_ring$1[index])
    }
    await user_fate.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_fate$1.length; index++) {
      user_fate$1[index].uid = bindinguid
      await user_fate.create(user_fate$1[index])
    }
    await user_compensate.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    await user_compensate.update(user_compensate$1, {
      where: { uid: bindinguid }
    })
    await user_equipment.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_equipment$1.length; index++) {
      user_equipment$1[index].uid = bindinguid
      await user_equipment.create(user_equipment$1[index])
    }
    await user_ass.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_ass$1.length; index++) {
      user_ass$1[index].uid = bindinguid
      await user_ass.create(user_ass$1[index])
    }
    await user_bag.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_bag$1.length; index++) {
      user_bag$1[index].uid = bindinguid
      await user_bag.create(user_bag$1[index])
    }
    await user_level.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_level$1.length; index++) {
      await user_level.update(user_level$1[index], {
        where: { uid: bindinguid, type: user_level$1[index].type }
      })
    }
    await user_skills.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_skill.length; index++) {
      user_skill[index].uid = bindinguid
      await user_skills.create(user_skill[index])
    }
    e.reply(`已切换至${bindinguid}`)
    return
  }
}

var apps = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  Action: Action,
  Admins: Admins,
  AssManage: AssManage,
  AssSsers: AssSsers,
  AssStart: AssStart,
  Auction: Auction,
  Bag: Bag,
  Bank: Bank,
  Battle: Battle,
  Board: Board,
  ClaimCareer: ClaimCareer,
  ControlPlayer: ControlPlayer,
  ControllLevel: ControllLevel,
  Destiny: Destiny,
  Dice: Dice,
  Equipment: Equipment,
  Exchange: Exchange,
  Help: Help,
  Information: Information,
  Level: Level,
  List: List,
  MapHelp: MapHelp,
  Modify: Modify,
  MoneyOperation: MoneyOperation,
  Monster: Monster,
  Move: Move,
  Ore: Ore,
  Palace: Palace,
  Ring: Ring,
  Secretplace: Secretplace,
  SkyTower: SkyTower,
  SneakAttack: SneakAttack,
  Start: Start,
  Tianjigate: Tianjigate,
  Transaction: Transaction,
  Treasure: Treasure,
  fairyland: fairyland,
  union: union
})

createApp(import.meta.url)
  .use(apps)
  .mount()
console.info('[APP] 凡人修仙 启动')
