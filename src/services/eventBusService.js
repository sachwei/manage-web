/**
 * 用于组件间简单的通信定义的事件总线
 * @author sachuangwei@ygsoft.com
 * @version 2018-04-29
 */
import Vue from 'vue'

const eventBus = new Vue()

/**
 * 订阅消息事件
 * @param { String } eventName
 * @param { Function } callback
 */
function subscribeEvent (eventName, callback) {
  eventBus.$on(eventName, callback)
}

/**
 * 发布消息事件
 * @param { String } eventName
 * @param { Object } data
 */
function publicEvent (eventName, data) {
  eventBus.$emit(eventName, data)
}

export default {
  subscribe: subscribeEvent,
  public: publicEvent
}
