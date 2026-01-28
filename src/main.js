import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import MultCascader from './components/MultCascader.vue'
export default MultCascader
new Vue({
  render: h => h(App),
}).$mount('#app')
