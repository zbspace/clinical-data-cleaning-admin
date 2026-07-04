//#region Imports
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import App from './App.vue';
import './index.css';
//#endregion

//#region App
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(TDesign);
app.mount('#root');
//#endregion
