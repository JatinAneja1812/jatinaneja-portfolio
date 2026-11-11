import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// @ts-expect-error router is a JavaScript module without a declaration file.
import router from './router'
import { templateConfig } from './config/templateConfig'

document.title = templateConfig.site.title;

createApp(App)
    .use(router)
    .mount('#app')
