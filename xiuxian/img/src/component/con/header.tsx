import React from 'react'

/**
 *
 * @returns
 */
export default function App() {
  const Title = '凡人修仙'
  return (
    <div className="py-4">
      <span
        style={{ textShadow: 'var(--title-text-shadow)' }}
        className="text-[var(--title-color)] text-3xl font-bold mr-3"
      >
        {Title}
      </span>
      {['/更换主题', '/改名+字符'].map((item, index) => (
        <span
          key={index}
          className="bg-[#f9f2f2de] shadow-md text-[#635b5bfa] rounded-md text-md px-2 py-1 mx-1"
        >
          {item}
        </span>
      ))}
    </div>
  )
}
