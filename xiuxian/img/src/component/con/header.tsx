import React from 'react'

const Tip = ({ children }: React.PropsWithChildren) => {
  return (
    <span className="bg-[#f9f2f2de] text-[#635b5bfa] rounded-md text-xl px-[2px] py-[8px] m-[6px]">
      {children}
    </span>
  )
}

/**
 *
 * @returns
 */
export default function App() {
  return (
    <div className="p-4">
      <span className="nav-menu-title font-bold">凡人修仙</span>
      <Tip>/更换主题</Tip>
      <Tip>/改名+字符</Tip>
    </div>
  )
}
