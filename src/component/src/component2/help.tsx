import React from 'react'
import _ from '../core/url.js'

export default function App({ data }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href={_('css/output.css')}></link>
        <link rel="stylesheet" href={_('css/new-root.css')}></link>
        <link rel="stylesheet" href={_('css/new-help.css')} />
      </head>
      <body>
        <div id="app" className="help">
          <div className="copyright">
            官网 <span className="version">{'http://xiuxian.uk/'}</span>
          </div>
          <div className="copyright">
            官群 <span className="version">744893244</span>
          </div>
          {data.map(val => (
            <div key={val.group} className="cont-box">
              <div className="help-group">{val.group}</div>
              <div className="help-table">
                <div className="tr">
                  {val.list.map(item => (
                    <div key={item.title} className="td">
                      <span
                        className={`help-icon help-icon-${item.icon}`}
                      ></span>
                      <strong className="help-title">{item.title}</strong>
                      <span className="help-desc">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </body>
    </html>
  )
}
