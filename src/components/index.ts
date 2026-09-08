// export { default as MTable } from './MTable/index.vue'

import MTable from './MTable/index.vue'
import FormTip from './FormTip/index.vue'

const components = { MTable, FormTip }

export default {
  install(app: import('vue').App) {
    for (const key in components) {
      app.component(key, components[key as keyof typeof components])
    }
  },
}
