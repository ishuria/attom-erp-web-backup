import i18n from '/@/i18n'

export function translate(title: string) {
  const { te, t }: any = i18n.global
  if (te(`vabI18n['${title}']`)) return t(`vabI18n['${title}']`)
  return title
}
