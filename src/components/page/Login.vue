<template>
    <div class="login-container">
          <div class="login-wrap" v-show="loginVisible">
            <div class="login-top">
              <img src="/static/img/main/login_logo.png">
              <span>统一平台</span>
            </div>
            <div class="login-bottom">
              <p>推荐使用火狐、谷歌浏览器;window XP SP2以上版本&nbsp;&nbsp;&nbsp;操作系统:分辨率1024*768以上</p>
              <p>开发单位:深圳中泓在线股份有限公司&nbsp;&nbsp;&nbsp;地址:广东省深圳市南山区科技园北区乌石头路天明科技大厦14楼</p>
              <p>Copyright &copy; 2006-2018 深圳中泓在线股份有限公司&nbsp;&nbsp;&nbsp;粤ICP备10008058号</p>
            </div>


              <div class="ms-login" >
                  <p>用户登录</p>
                  <el-form :model="ruleForm"  ref="ruleForm" label-width="0px" class="demo-ruleForm">
                      <el-form-item prop="username">
                          <el-input v-model="ruleForm.username" placeholder="请输入用户名">
                            <i slot="prefix" class="el-input__icon iconfont icon-yonghu2"></i>
                          </el-input>
                      </el-form-item>
                      <el-form-item prop="password">
                         <!-- @keyup.enter.native="submitForm('ruleForm')" -->
                          <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" >
                            <i slot="prefix" class="el-input__icon iconfont icon-quanxian2"></i>
                          </el-input>
                      </el-form-item>
                      <el-form-item prop="cacode">
                            <el-input style="width:150px;" placeholder="请输入验证码" v-model="ruleForm.cacode" @keyup.enter.native="submitForm('ruleForm')">
                              <i slot="prefix" class="el-input__icon iconfont icon-securityCode-b"></i>
                              <!-- <template slot="prepend"><img :src="caImg" style="cursor:pointer;height:25px;"  class='ca-image' @click="getCaImgae()" alt='服务器挂了' /></template> -->
                            </el-input>
                            <div class="cacode-div"><img :src="caImg" style="cursor:pointer;height:25px;"  class='ca-image' @click="getCaImgae()" alt='服务器挂了' /></div>
                      </el-form-item>
                      <p class="login-error">{{login_error}}</p>
                      <div class="login-btn">
                          <el-button type="primary" @click="submitForm('ruleForm')">立即登录</el-button>
                      </div>
                      <el-checkbox v-model="rememberPassword">记住密码（2周）</el-checkbox>
                      <span class="forget-password" @click="forgetPassword()">忘记密码</span>
                  </el-form>
              </div>
          </div>
          <div class="forget-container" v-show="passwordVisible" >
              <div class="forget-title">
                <!-- <img src="/static/img/main/login_logo.png"> -->
                <span>重置密码</span>
                <!-- <span @click="returnLogin()">返回登录</span> -->
                <el-button type="primary" class="mr10" @click="returnLogin()">返回登录</el-button>
              </div>
              <el-steps :active="active" finish-status="success" class="steps-all">
                <el-step title="账号验证"></el-step>
                <el-step title="设置新密码"></el-step>
                <el-step title="完成"></el-step>
              </el-steps>

              <!-- 身份手机号码验证 -->
              <div class="authenticationForm-container" v-show="authenticationFormVisible">
                <el-form class="authenticationForm"  label-width="80px" :model="authenticationForm" ref="authenticationForm" :rules="authenticationrules">
                  <el-form-item label="账号" prop="accountName" style="width:380px;">
                    <el-input v-model="authenticationForm.accountName"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号码" prop="phone" style="width:380px;">
                    <el-input v-model="authenticationForm.phone"></el-input>
                  </el-form-item>
                  <el-form-item label="验证码" prop="cacode">
                    <el-input v-model="authenticationForm.cacode" style="width:230px;"></el-input>
                    <el-button @click="getCode()" v-show="phoneCacodeShow" style="float:right;">获取</el-button>
                    <el-button v-show="!phoneCacodeShow" disabled>{{phoneCount}}</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="authenticationConfirm('authenticationForm')">确认</el-button>
                    <el-button @click="authenticationReset('authenticationForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <!-- 设置新密码 -->
              <div class="passwordSetForm-container" v-show="passwordSetFormVisible">
                <el-form class="passwordSetForm"  label-width="80px" :model="passwordSetForm" ref="passwordSetForm" :rules="passwordSetrules">
                  <el-form-item label="新密码" prop="pwd" style="width:450px;">
                    <el-input type="password" v-model="passwordSetForm.pwd"></el-input>
                  </el-form-item>
                  <el-form-item label="密码确认" prop="repwd" style="width:450px;">
                    <el-input type="password" v-model="passwordSetForm.repwd"></el-input>
                  </el-form-item>
                  <input type="hidden" v-model="passwordSetForm.accountName"></input>
                  <el-form-item>
                    <el-button type="primary" @click="passwordSetConfirm('passwordSetForm')">确认</el-button>
                    <el-button @click="passwordSetReset('passwordSetForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 密码成功跳转 -->
              <div v-show="passwordSuccessVisible" class="password-success">
                <span>重置密码成功</span>
                <span>将跳转至登录页</span>
              </div>

          </div>

          <div class="forget-container" v-show="passwordFirstVisible" >
              <div class="forget-title">
                <span>强制修改密码</span>
                <el-button type="primary" class="mr10" @click="returnLogin()">返回登录</el-button>
              </div>
              <!-- 设置新密码 -->
              <div class="passwordSetForm-container" style="margin-top:140px;">
                <el-form class="passwordSetForm"  label-width="80px" :model="passwordSetForm" ref="passwordSetForm" :rules="passwordSetrules">
                  <el-form-item label="新密码" prop="pwd" style="width:450px;">
                    <el-input type="password" v-model="passwordSetForm.pwd"></el-input>
                  </el-form-item>
                  <el-form-item label="密码确认" prop="repwd" style="width:450px;">
                    <el-input type="password" v-model="passwordSetForm.repwd"></el-input>
                  </el-form-item>
                  <input type="hidden" v-model="passwordSetForm.accountName"></input>
                  <el-form-item>
                    <el-button type="primary" @click="passwordSetFirstConfirm('passwordSetForm')">确认</el-button>
                    <el-button @click="passwordSetReset('passwordSetForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
          </div>


    </div>
</template>

<script>
// import instance from '../common/axios'
import $ from 'jquery'
import qs from 'qs'
import axios from 'axios'
import { encodeAES, decodeAES } from '@/util/md5'
import CryptoJS from 'crypto-js'
import { getCaptchaCode,login,phoneCode,authen,password,key } from '@/api/login'
axios.defaults.headers.Authorization=''
axios.defaults.withCredentials=true
export default {
    data: function(){
      var validateMobilePhone = (rule, value, callback) => {
        if (value !== '') {
          var reg=/^1[3456789]\d{9}$/;
          if(!reg.test(value)){
            callback(new Error('请输入有效的手机号码'));
          }
          callback();
        }else{
          callback(new Error('请输入手机号码'));
        }
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else {
          // if (this.formData.confirmPassword !== '') {
          //   this.$refs.formData.validateField('confirmPassword')
          // }
          if(value!=''){
              var reg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
              if(!reg.test(value)){
                callback(new Error('密码由以下三部分组成:大写字母、小写字母、数字且长度8-16'));
              }
              callback()
          }
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passwordSetForm.pwd) {
          callback(new Error('两次输入密码不一致!'))
        }else{
          var reg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
          if(!reg.test(value)){
            callback(new Error('密码由以下三部分组成:大写字母、小写字母、数字且长度8-16'));
          }
          callback()
        }
      }

        return {
            ruleForm: {
                username: '',
                password: '',
                cacode: ''
            },
            caImg: '',
            rememberPassword: false,
            login_error:'',
            authenticationForm:{
              accountName:'',
              phone:'',
              cacode:''
            },
            authenticationrules: {
                accountName: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                phone: [
                    { required: true, validator: validateMobilePhone, trigger: 'blur' }
                ],
                cacode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            },
            passwordSetForm:{
              accountName:'',
              pwd:'',
              repwd:''
            },
            passwordSetrules: {
                pwd: [
                  { required: true, trigger: 'blur',validator: validatePass }
                ],
                repwd: [
                  { required: true, trigger: 'blur',validator: validatePass2 }
                ]
            },

            passwordVisible:false,
            passwordFirstVisible:false,
            loginVisible:true,
            active:1,
            authenticationFormVisible:true,
            passwordSetFormVisible:false,
            passwordSuccessVisible:false,
            phoneCacodeShow:true,
            phoneCount:'',
            timer:null
        }
    },
    methods: {
      //DES加密 Pkcs7填充方式
      encryptByDES(message, key){
        const keyHex = CryptoJS.enc.Utf8.parse(key);
        const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
         mode: CryptoJS.mode.ECB,
         padding: CryptoJS.pad.Pkcs7
         });
        return encrypted.toString();
      },
      //DES解密
      decryptByDES(ciphertext, key){
        const keyHex = CryptoJS.enc.Utf8.parse(key);
        // direct decrypt ciphertext
        const decrypted = CryptoJS.DES.decrypt({
           ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
         }, keyHex, {
           mode: CryptoJS.mode.ECB,
           padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
      },
      submitForm(formName) {

           let submitUrl_ = login()
           let _this = this
           axios.get(key(),{
               params:{

               },
               headers: {
                 'Authorization': ''
               }
             }).then(function (response) {
               _this.key=response.data
               if(_this.ruleForm.cacode==''){
                 _this.login_error='验证码不能为空'
               }
               if(_this.ruleForm.password==''){
                 _this.login_error='密码不能为空'
               }
               if(_this.ruleForm.username==''){
                 _this.login_error='用户名不能为空'
               }
               if(_this.ruleForm.cacode!=''&&_this.ruleForm.password!=''&&_this.ruleForm.username!=''){
                 _this.login_error=''
                 let config = {
                   headers: {
                     'Authorization': ''
                   }
                 }
                 //对密码作DES加密传给后台

                 //去除所有空格
                 // let newpassword=(this.ruleForm.password).replace(/\s+/g,"")
                 // let newusername=(this.ruleForm.username).replace(/\s+/g,"")
                 let newpassword=_this.ruleForm.password
                 let newusername=_this.ruleForm.username
                 let passwords= _this.encryptByDES(newpassword,_this.key)
                 let usernames= _this.encryptByDES(newusername,_this.key)
                 axios.post(submitUrl_, {
                   postUsername: usernames,
                   postPassword: passwords,
                   captchaCode: _this.ruleForm.cacode
                 },config).then(function (response) {

                   if(response.data.errorMessage=='操作成功'){
                     if(response.data.data.token_type == 'bearer' && response.data.data.token_type){
                        _this.$message({
                          message: '欢迎回来~',
                          type: 'success'
                        })
                        let base_token = response.data.data.access_token
                        window.sessionStorage.clear()
                        window.sessionStorage.setItem('access_token', base_token)
                        localStorage.setItem('ms_username',newusername)
                        if(_this.rememberPassword == 1){
                          localStorage.setItem('ms_password', encodeAES(newpassword))
                        } else {
                          localStorage.removeItem('ms_password', '')
                        }
                        if(response.data.data.first_time==0){
                           _this.$router.push({ path: '/useChoose'})
                        }else{
                          _this.passwordFirstVisible=true
                          _this.loginVisible=false
                          _this.passwordSetForm.accountName=_this.ruleForm.username
                          _this.$refs['ruleForm'].resetFields()
                          _this.login_error=''
                        }
                     }
                   }else{
                     _this.login_error=response.data.errorMessage
                     if(response.data.errorMessage == '验证码错误') {
                       _this.ruleForm.cacode = ''
                       _this.getCaImgae()
                     }
                     if(response.data.errorMessage == '密码错误') {
                       _this.ruleForm.password = ''
                       _this.ruleForm.cacode = ''
                       _this.getCaImgae()
                     }
                     if(response.data.errorMessage == '验证码已失效,请重新输入验证码') {
                       // _this.ruleForm.username = ''
                       // _this.ruleForm.password = ''
                       _this.ruleForm.cacode = ''
                       _this.key= ''
                       _this.getCaImgae()

                     }
                     if(response.data.errorMessage == '长期未登录,请重新登录') {
                       // _this.ruleForm.username = ''
                       // _this.ruleForm.password = ''
                       _this.ruleForm.cacode = ''
                       _this.key= ''
                       _this.getCaImgae()

                     }
                   }



                 }).catch(function (error) {
                    console.log(error)
                 })
               }


             }).catch(function (error) {

             })





        },
        linkToPath(){

        },
        getCaImgae (){
           this.caImg = getCaptchaCode()
        },
        getLocal(){
          this.ruleForm.username = localStorage.getItem('ms_username')
          this.ruleForm.password = decodeAES(localStorage.getItem('ms_password'))
        },
        forgetPassword(){
          this.$refs['ruleForm'].resetFields()
          this.login_error=''
          this.rememberPassword=false
          this.passwordVisible=true
          this.loginVisible=false
          this.authenticationFormVisible=true
          this.passwordFirstVisible=false
        },
        returnLogin(){
          this.active=1
          this.authenticationReset('authenticationForm')
          this.authenticationReset('passwordSetForm')
          this.passwordVisible=false
          this.loginVisible=true
          this.authenticationFormVisible=false
          this.passwordSetFormVisible=false
          this.passwordSuccessVisible=false
          this.phoneCacodeShow=true
        },
        //身份重置
        authenticationReset(formName){
          this.$refs[formName].resetFields()
        },
        //身份确认
        authenticationConfirm(formName){
          let _this=this
          this.$refs[formName].validate((valid) => {
              if (valid) {
                let url=authen()
                let config = {
                  headers: {
                    'Authorization': ''
                  }
                }
                axios.post(url, {
                  loginName: this.authenticationForm.accountName,
                  smsCode: this.authenticationForm.cacode
                },config)
                .then(function (response) {
                  let name=JSON.parse(response.data).data.loginName
                  _this.authenticationFormVisible=false
                  _this.passwordSetFormVisible=true
                  _this.passwordSuccessVisible=false
                  _this.phoneCacodeShow=true
                  _this.active=2
                  _this.passwordSetForm.accountName=name
                }).catch(function (error) {
                  console.log(error)
                  _this.$message({
                     message: '验证码输入错误',
                     type: 'error'
                   })
                })

              }
          })
        },

        //获取手机验证码数字
        getCode(){
           const TIME_COUNT = 60
           let _this=this
           let url=phoneCode()
           let config = {
             headers: {
               'Authorization': ''
             }
           }
           axios.get(url,{
               params:{
                 loginName: this.authenticationForm.accountName,
                 phone: this.authenticationForm.phone
               }
             },config).then(function (response) {
               if (!_this.timer) {
                 _this.phoneCount = TIME_COUNT
                 _this.phoneCacodeShow = false
                 _this.timer = setInterval(() => {
                 if (_this.phoneCount > 0 && _this.phoneCount <= TIME_COUNT) {
                   _this.phoneCount--
                  } else {
                   _this.phoneCacodeShow = true
                   clearInterval(_this.timer)
                   _this.timer = null
                  }
                 }, 1000)
                }

           }).catch(function (error) {
             console.log(error)
             _this.$message({
                message: '重新检查账号和手机号码',
                type: 'error'
              })
           })


        },
        //新密码重置
        passwordSetReset(formName){
          this.$refs[formName].resetFields()
        },
        //新密码确认
        passwordSetConfirm(formName){
          let _this=this
          this.$refs[formName].validate((valid) => {
              if (valid) {
                let url=password()
                let config = {
                  headers: {
                    'Authorization': ''
                  }
                }
                axios.post(url, {
                  loginName: _this.passwordSetForm.accountName,
                  password: _this.passwordSetForm.pwd
                },config)
                .then(function (response) {
                  console.log(response)
                  _this.authenticationFormVisible=false
                  _this.passwordSetFormVisible=false
                  _this.passwordSuccessVisible=true
                  _this.phoneCacodeShow=true
                  _this.active=3
                  setTimeout(function(){
                    _this.returnLogin()
                  },3000)
                }).catch(function (error) {
                  console.log(error)
                  _this.$message({
                     message: '请检查密码输入',
                     type: 'error'
                   })
                })

              }
          })
        },
        //强制新密码确认
        passwordSetFirstConfirm(formName){
          let _this=this
          this.$refs[formName].validate((valid) => {
              if (valid) {
                let url=password()
                let config = {
                  headers: {
                    'Authorization': ''
                  }
                }
                axios.post(url, {
                  loginName: _this.passwordSetForm.accountName,
                  password: _this.passwordSetForm.pwd
                },config)
                .then(function (response) {
                  _this.passwordFirstVisible=false
                  _this.loginVisible=true
                }).catch(function (error) {
                  console.log(error)
                  _this.$message({
                     message: '请检查密码输入',
                     type: 'error'
                   })
                })

              }
          })
        },
        //获得key
        getKey(){
          let _this=this
          axios.get(key(),{
              params:{

              },
              headers: {
                'Authorization': ''
              }
            }).then(function (response) {
              console.log(response)
              _this.key=response.data
            }).catch(function (error) {

            })
        }


    },
    mounted(){
      // this.getKey()
      this.getCaImgae()
      if(localStorage.getItem('ms_password')){
        this.getLocal()
        this.rememberPassword = true
      }
      if(window.sessionStorage.getItem('access_token')){
        window.sessionStorage.clear()
      }


    }

}
</script>

<style scoped>
    .login-container{
      width:100%;
      height:100%;
    }
    .login-wrap{
        width:100%;
        height:100%;
        background-image: url(/static/img/main/login_body_bg.jpg);
        background-size: 100% 100%;
        position: relative;
    }
    .login-top{
      width: 100%;
      height: 100px;
      line-height: 100px;
      padding-left: 100px;
      background: #fff;
    }
    .login-top img{
      width:180px;
      height:auto;
      margin-right:10px;
      float:left;
      margin-top: 20px;
    }
    .login-top span{
      color:#39588f;
      font-weight: bold;
      font-size:30px;
      display: block;
      float:left;
      margin-top: 7px;
    }
    .login-bottom{
      position: absolute;
      left:0px;
      bottom:0px;
      width:100%;
      color:#fff;
      padding-bottom:20px;
      background: #fff;
      padding-top:20px
    }
    .login-bottom p{
      width: 100%;
      text-align: center;
      margin-bottom:3px;
      color:#6c6c6c;
      font-size:14px;
    }
    .cacode-div{
      position:absolute;
      right:0px;
      bottom:0px;
      width:100px;
      height:30px;
      border:1px solid #dcdfe6;
      border-radius:3px;
    }
    .login-error{
      color:#f00;
      font-size:14px;
    }
    .ms-login{
        position: absolute;
        left:75%;
        top:50%;
        width:270px;
        height:300px;
        margin:-160px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
        padding-top:15px;
        padding-bottom:15px;
        -webkit-box-shadow: rgba(0,0,0,0.6) 0px 0px 20px;
        -moz-box-shadow: rgba(0,0,0,0.6) 0px 0px 20px;
        box-shadow: rgba(0,0,0,0.6) 0px 0px 20px;
    }
    .ms-login>p{
      font-size:16px;
      margin-bottom:20px;
      font-weight: bold;
    }
    .login-btn .el-button--primary{
        text-align: center;
        background: -webkit-linear-gradient(left, #5851d5 , #347aec); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, #5851d5 , #347aec); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, #5851d5 , #347aec); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, #5851d5 , #347aec); /* 标准的语法 */
    }
    .login-btn button{
        width:100%;
        height:36px;
        font-size:16px;
        margin:10px 0 14px 0;
    }
    .el-input-group__prepend{
      width: 160px;
    }
    .ca-image{
      width: 100px;
    }
    .forget-password{
      float:right;
      font-size:14px;
      color:#606266;
      cursor:pointer;
    }
    .forget-password:hover{
      color:#409EFF;
    }
    .forget-container{
      width:100%;
      height:100%;
      background: #f6f6f6;
    }
    .forget-title{
      height:80px;
      line-height:80px;
      background: #fff;
      padding:0 40px;
      border-bottom:solid 1px #dddee1;
    }
    .forget-title img{
      float:left;
      width:160px;
      height: auto;
      margin-right: 10px;
      margin-top:7px;
    }
    .forget-title span:nth-of-type(1){
      float:left;
      display:block;
      margin-top:5px;
      font-size:16px;
      font-weight:bold;
    }
    .forget-title button{
      float:right;
      margin-top:24px;
    }
    .steps-all{
      padding:0 30%;
      margin:60px 0 40px 0;
    }
    .authenticationForm{
      width: 380px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -200px;
      margin-top: -90px;
    }
    .authenticationForm-container{
        width:50%;
        margin-left:auto;
        margin-right:auto;
        margin-top:50px;
        background: #fff;
        border:solid 1px #dddee1;
        padding:60px 40px;
        position: relative;
        height:200px;
    }
    .passwordSetForm{
      width: 380px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -220px;
      margin-top: -90px;
    }
    .passwordSetForm-container{
      width:50%;
      margin-left:auto;
      margin-right:auto;
      margin-top:50px;
      background: #fff;
      border:solid 1px #dddee1;
      padding:60px 40px;
      position: relative;
      height:200px;
    }
    .password-success{
      text-align:center;
      width:100%;
      font-size:16px;
    }

</style>
