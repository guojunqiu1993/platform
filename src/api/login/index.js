// import axios from 'axios'
import API_URL from '@/config/api-url'

// 获取登录验证码图片url
function getCaptchaCode() {
  return API_URL.getCaptchaCode + '?' + Date.parse(new Date())
}

// 获取统一模块列表
function getModuleList() {
  return API_URL.getModulelist
}

// 登陆
function login() {
  return API_URL.login
}

// 获取手机验证码
function phoneCode() {
  return API_URL.phoneCode
}

// 身份验证
function authen() {
  return API_URL.authen
}

// 新密码确认
function password() {
  return API_URL.password
}

// 获得key值  在登陆验证
function key() {
  return API_URL.key + '?' + Date.parse(new Date())
}

//点击具体模块
function signName() {
  return API_URL.signName
}

export { getCaptchaCode,getModuleList,login,phoneCode,authen,password,key,signName}
