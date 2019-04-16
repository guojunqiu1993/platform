  <template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>修改密码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-form class="commonForm"   label-width="80px" :model="formData" ref="formData" :rules="formrules">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input type="password" v-model="formData.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input type="password" v-model="formData.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input type="password" v-model="formData.confirmPassword"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <div class="common-btns">
          <el-button type="primary" @click="saveCancel('formData')">保存</el-button>
          <el-button @click="editReset('formData')">重置</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    // import instance1 from '../../common/axiosv1'
    export default {
        name: 'passwordSet',
        data: function(){
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
              } else if (value !== this.formData.newPassword) {
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
              formData: {
                oldPassword: '',
                newPassword:'',
                confirmPassword: ''
              },
              formrules: {
                  oldPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' }
                  ],
                  newPassword: [
                    { required: true, trigger: 'blur',validator: validatePass }
                  ],
                  confirmPassword: [
                    { required: true, trigger: 'blur',validator: validatePass2 }
                  ]
              }
            }
        },
        methods: {
          //取消
          editReset(formName){
               this.$refs[formName].resetFields()
          },
          //保存
          saveCancel(formName){
            let _this=this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  axios.post('/api/v1/pwd/upd', {
                    oldPwd:_this.formData.oldPassword,
                    newPwd:_this.formData.newPassword
                  })
                  .then(function (response) {
                    let code=response.data.errorCode
                    if(code!=0){
                      _this.$message.error(response.data.errorMessage);
                    }else{
                      localStorage.removeItem('ms_password', '')
                      _this.$message({
                        type: 'success',
                        message: '修改密码成功!'
                      });
                      _this.$router.push({ path: 'login'})
                    }

                  })
                  .catch(function (error) {
                    if(error.response.data.errorCode=='7' || error.response.data.errorCode=='8' ){
                      window.sessionStorage.removeItem('access_token', '')
                      _this.$router.push({ path: 'login'})
                    }else{
                      _this.$message({
                        type: 'error',
                        message: error.response.data.errorMessage
                      });
                    }
                  });
                }
            })
          }
        },
        created() {

        }

    }
</script>
<style scoped>

</style>
