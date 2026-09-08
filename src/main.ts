import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import TDesign from 'tdesign-vue-next';
// import 'tdesign-vue-next/es/style/index.css';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'virtual:uno.css';
import './styles/index.scss';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import App from './App.vue';
import router from './router';

const app = createApp(App);

// 注册全局组件
import components from './components';
app.use(components);

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(createPinia());
app.use(router);
app.use(TDesign);
app.use(ElementPlus, {
  locale: zhCn,
});
app.mount('#app');
