export const Themes = ['dark', 'red', 'blue', 'purple'] as const
export type ThemesEmun = (typeof Themes)[number]
