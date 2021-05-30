import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

window.onbeforeunload = () => '确认离开管理页面？页面数据将不会保留！'

window.localStorage['web-admin-version'] = (import.meta.env.VITE_VERSION || 'develop').substr(0, 7)
console.log('web-admin-version: ' + import.meta.env.VITE_VERSION)
