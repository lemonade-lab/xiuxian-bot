import img_root from '@src/assets/img/24.jpg'
import img_red from '@src/assets/img/00.jpg'
import img_blue from '@src/assets/img/03.jpg'
import img_purple from '@src/assets/img/28.jpg'
import { BackgroundImage } from 'jsxp'
import React from 'react'
export const Themes = ['dark', 'red', 'blue', 'purple'] as const
export type ThemesEmun = (typeof Themes)[number]
const getBG = (theme: ThemesEmun = 'dark') => {
  switch (theme) {
    case 'dark':
      return img_root
    case 'red':
      return img_red
    case 'blue':
      return img_blue
    case 'purple':
      return img_purple
    default:
      return img_root
  }
}
type DivBackgroundImageProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  theme: ThemesEmun
}
export default function ThemeBackground({
  children,
  theme,
  ...props
}: DivBackgroundImageProps) {
  return (
    <BackgroundImage id="root" data-theme={theme} url={getBG(theme)} {...props}>
      {children}
    </BackgroundImage>
  )
}
