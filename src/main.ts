import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { templateConfig } from './config/templateConfig'

document.title = templateConfig.site.title;

createApp(App)
    .use(router)
    .mount('#app')
