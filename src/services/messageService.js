import Vue from 'vue'

let MessageService = () => {
}

/**
 * 发送项目任务更新提醒.
 */
MessageService.prototype.itemUpdateRemind = (item) => {
  return new Promise((resolve, reject) => {
    Vue.http.post('/message/itemUpdateRemind', item).then((res) => {
      if (res && res.data) {
        resolve(res.data)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 发送个人文本消息.
 * @param {*接收人邮箱} toEmail
 * @param {*消息内容} content
 */
MessageService.prototype.sendMessage = (toEmail, content) => {
  return new Promise((resolve, reject) => {
    let mess = {
      toEmail: toEmail,
      content: content
    }
    Vue.http.post('/message/sendMessage', mess).then((res) => {
      if (res && res.data) {
        resolve(res.data)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 发送个人文本消息.
 * @param {*接收人邮箱列表} emails
 * @param {*消息内容} content
 */
MessageService.prototype.sendMessages = (emails, content) => {
  return new Promise((resolve, reject) => {
    let mess = {
      'emails': emails,
      'content': content
    }
    Vue.http.post('/message/sendMessages', mess).then((res) => {
      if (res && res.data) {
        resolve(res.data)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 发送Url消息.
 * @param {*接收人邮箱} toEmail
 * @param {*地址} url
 */
MessageService.prototype.sendCiciUrl = (toEmail, url) => {
  return new Promise((resolve, reject) => {
    let mess = {
      toEmail: toEmail,
      url: url
    }
    Vue.http.post('/message/remindUrl', mess).then((res) => {
      if (res && res.data) {
        resolve(res.data)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 发送邮件
 * @demo messageService.sendMail('490232365@qq.com', 'test', 'hello');
 * @param {*接收人邮箱} toEmail
 * @param {*主题} subject
 * @param {*内容(html格式)} content
 */
MessageService.prototype.sendMail = (toEmail, subject, content) => {
  return new Promise((resolve, reject) => {
    let mail = {
      toEmail: toEmail,
      subject: subject,
      content: content
    }
    Vue.http.post('/message/sendEmail', mail).then((res) => {
      if (res && res.data) {
        resolve(res.data)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

export default new MessageService()
