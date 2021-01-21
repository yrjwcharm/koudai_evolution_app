/*
 * @Date: 2021-01-19 16:48:52
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-19 17:42:12
 * @Description: 输入框校验
 */
import Toast from '../components/Toast'
export const verify = (type, value) => {
  if (type == 'mobile') {
    if (!value || value.length != 11) {
      Toast.show('请输入正确手机号')
      return false
    }
  }
  if (type == 'password') {
    if (!value || value.length < 6) {
      Toast.show('请输入6位以上密码')
      return false
    }
  }
  if (type == 'code') {
    if (!value || value.length < 6) {
      Toast.show('请输入6位验证码')
      return false
    }
  }
  return true
}
export const formCheck = (data) => {
  var flag = true;
  for (var i = 0; i < data.length; i++) {
    if (!data[i].append) {
      if (flag && data[i].field == '') {
        Toast.show(data[i].text)
        flag = false;
        break;
      } else {
        flag = true;
      }
    } else {
      if (data[i].append == "!") {
        if (flag && !data[i].field) {
          Toast.show(data[i].text)
          flag = false;
          break;
        } else {
          flag = true;
        }
      } else {
        flag = data[i].append.test(data[i].field);
        if (!flag) {
          Toast.show(data[i].text)
          break;
        }
      }
    }
  }
  return flag;
}