import pinia from '/@/store'
import { useSettingsStore } from '/@/store/modules/settings'
import { createI18n } from 'vue-i18n'
import enLocale from 'element-plus/dist/locale/en.mjs'
import zhLocale from 'element-plus/dist/locale/zh-cn.mjs'
import en from './en.json'

const messages = {
  en: {
    ...{
      vabI18n: en,
    },
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
}

function getLanguage() {
  const { getLanguage } = useSettingsStore(pinia)
  return getLanguage || 'zh'
}

const i18n = createI18n({
  locale: getLanguage(),
  messages,
})

export default i18n
