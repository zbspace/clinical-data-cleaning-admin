import { defineConfig, presetAttributify, presetUno } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
  transformers: [transformerDirectives()],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'wh-full': 'w-full h-full',
  },
})
