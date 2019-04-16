<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 组织管理</el-breadcrumb-item>
                <el-breadcrumb-item>产品授权编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-form class="commonForm"   label-width="80px" :model="formData" ref="formData" :rules="formrules">
            <el-form-item label="产品名称" prop="product_name" >
              <el-input v-model="formData.product_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="产品编码" prop="code">
              <el-input v-model="formData.code" disabled></el-input>
            </el-form-item>
            <el-form-item label="授权类型" prop="auth_type">
              <el-radio v-model="formData.auth_type" label="正式">正式</el-radio>
              <el-radio v-model="formData.auth_type" label="试用">试用</el-radio>
            </el-form-item>
            <el-form-item label="使用期限" prop="user_time">
              <el-date-picker
                v-model="formData.user_time"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="授权状态" prop="auth_status">
              <el-radio v-model="formData.auth_status" label="启用">启用</el-radio>
              <el-radio v-model="formData.auth_status" label="禁用">禁用</el-radio>
            </el-form-item>
            <el-input v-model="formData.product_id" type="hidden"></el-input>
            <el-input v-model="formData.org_id" type="hidden"></el-input>
            <el-input v-model="formData.id" type="hidden"></el-input>
          </el-form>
        </div>
        <div class="common-btns">
          <el-button type="primary" @click="saveCancel('formData')">保存</el-button>
          <el-button @click="editCancel()">取消</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    // import instance1 from '../../../common/axiosv1'
    export default {
        name: 'impowerEdit',
        data: function(){
            return {
              formData: {
                product_name: '',
                auth_type: '',
                user_time:'',
                auth_status: '',
                product_id:'',
                code:'',
                org_id:'',
                id:''
              },
              formrules: {
                  product_name: [
                    { required: true, message: '请输入产品名称', trigger: 'blur' }
                  ],
                  code: [
                    { required: true, message: '请输入产品编码', trigger: 'blur' }
                  ],
                  auth_type: [
                    { required: true, message: '请输入授权类型', trigger: 'blur' }
                  ],
                  user_time: [
                    { required: true, message: '请输入使用期限', trigger: 'blur' }
                  ],
                  auth_status: [
                    { required: true, message: '请输入授权状态', trigger: 'blur' }
                  ]
              }
            }
        },
        methods: {
          editCancel(){
            this.$router.push({ path: 'productImpower', query: {
              'clientName': this.$route.query.clientName,
              'clientId':this.formData.org_id
              }})
          },
          saveCancel(formData){
            let _this=this
            let status=''
            let type=''
            if(this.formData.auth_status=='启用'){
              status=1
            }else{
              status=0
            }
            if(this.formData.auth_type=='正式'){
              type=1
            }else{
              type=0
            }
            this.$refs[formData].validate((valid) => {
                if (valid) {
                  axios.post('/api/v1/org/product/auth/upd', {
                    id:this.formData.id,
                    product_id:this.formData.product_id,
                    product_name:this.formData.product_name,
                    auth_status:status,
                    auth_type:type,
                    code:this.formData.code,
                    end_time:(this.formData.user_time)[1],
                    org_id:this.formData.org_id,
                    start_time:(this.formData.user_time)[0]
                  })
                  .then(function (response) {
                    _this.$router.push({ path: 'productImpower', query: {
                      'clientName': _this.$route.query.clientName,
                      'clientId':_this.formData.org_id
                      }})
                    _this.$message({
                      type: 'success',
                      message: '编辑成功!'
                    });
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
          },
          formSet(){
            this.formData.id=this.$route.query.id
            this.formData.product_id=this.$route.query.product_id
            this.formData.code=this.$route.query.code
            this.formData.product_name=this.$route.query.product_name
            this.formData.org_id=this.$route.query.org_id
            this.formData.auth_type=this.$route.query.auth_type
            this.formData.auth_status=this.$route.query.auth_status
            // this.formData.start_time=this.$route.query.start_time
            // this.formData.end_time=this.$route.query.end_time
            this.formData.user_time=[this.$route.query.start_time,this.$route.query.end_time]
          }

        },
        created() {
          this.formSet()
        }

    }
</script>
<style scoped>

</style>
