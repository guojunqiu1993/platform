let loginUrl='http://192.168.2.165:8080'
// let loginUrl='http://192.168.2.106:8080'
const API_URL = {
  'getCaptchaCode': loginUrl+'/api/v1/login/captchaCode',  //验证码
  'getModulelist': loginUrl+'/api/v1/product/list', //模块列表
  'login': loginUrl+'/api/v1/ubc/login', //登录
  'phoneCode': loginUrl+'/api/v1/login/send/sms', //获取手机验证码
  'authen': loginUrl+'/api/v1/login/sms/confirm', //身份验证
  'password': loginUrl+'/api/v1/login/pwd/reset', //新密码确认
  'key': loginUrl+'/api/v1/login/generate/param', //key
  'signName': loginUrl+'/api/v1/product/one', //点击模块具体
}
export default API_URL
