import React from 'react'

export default function App({ data }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="../css/help.css" />
      </head>
      <body>
        <div id="app" className="help">
          <div style={{ height: '350px' }}></div>
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
          <div className="copyright">
            <span>Xiuxian-Plugin @2.2.0 | 柠檬冲水</span>
          </div>
          <div className="copyrigh">
            <span>基于</span>
            <span className="version">{'[https://alemonjs.com/]'}</span>
            <span>开发</span>
          </div>
          <div className="copyrigh">
            <span>反馈</span>
            <span className="version">806943302</span>
          </div>
        </div>
      </body>
    </html>
  )
}
