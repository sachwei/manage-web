import Panel from './Panel.vue'
import EwCard from './ewCard'
const myPanel = {
  install: function (Vue) {
    Vue.component('panel', Panel)
    Vue.component('ewCard', EwCard)
  }
}
export default myPanel
