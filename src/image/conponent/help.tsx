import React from 'react'

export default function App({ data }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="../css/output.css"></link>
        <link rel="stylesheet" href="../css/root.css"></link>
        <link rel="stylesheet" href="../css/help.css" />
      </head>
      <body>
        <div id="app" className="help">
          <div style={{ height: '350px' }}></div>
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
