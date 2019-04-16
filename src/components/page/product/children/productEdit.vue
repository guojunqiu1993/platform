<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 产品管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-form class="commonForm"   label-width="80px" :model="formData" ref="formData" :rules="formrules">
            <el-form-item label="产品标识" prop="product_sign">
              <el-input v-model="formData.product_sign"></el-input>
            </el-form-item>
            <el-form-item label="产品名称" prop="product_name">
              <el-input v-model="formData.product_name"></el-input>
            </el-form-item>
            <el-form-item label="产品编码" prop="code">
              <el-input v-model="formData.code"></el-input>
              <span class="form_hint" style="position:absolute;right:-110px;top:0px;">编写规则:CP+序号</span>
            </el-form-item>
            <el-form-item label="链接" prop="url">
              <el-input v-model="formData.url"></el-input>
            </el-form-item>
            <el-form-item label="产品描述" prop="description">
              <el-input type="textarea" v-model="formData.description"></el-input>
            </el-form-item>
            <el-input type="hidden" v-model="formData.id"></el-input>

          </el-form>
        </div>
        <div class="common-btns">
          <el-button type="primary" @click="saveCancel('formData')">保存</el-button>
          <el-button @click="EditCancel()">取消</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    // import instance1 from '../../../common/axiosv1'
    export default {
        name: 'productEdit',
        data: function(){
          var validateCode = (rule, value, callback) => {
              if (value !== '') {
                var isCode = /^[A-Za-z0-9]{1,10}$/;
                if(isCode.test(value) ){
                  callback()
                }else{
                  callback(new Error('请输入大小字母+数字且字符为10个以内的编码'))
                }
              }else{
                callback(new Error('请输入产品编码'))
              }
          }
          var validateName = (rule, value, callback) => {
              if (value !== '') {
                let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                let mat = value.match(cnReg);
                let lengths
                if(mat){
                   lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                }else{
                  lengths=value.length
                }
                if(lengths>0&&lengths<21 ){
                  callback()
                }else{
                  callback(new Error('请输入20个字符以内的产品名称'))
                }
              }else{
                callback(new Error('请输入产品名称'))
              }
          }
          var validateDel = (rule, value, callback) => {
              if (value !== '') {
                let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                let mat = value.match(cnReg);
                let lengths
                if(mat){
                   lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                }else{
                  lengths=value.length
                }
                if(lengths>0&&lengths<400 ){
                  callback()
                }else{
                  callback(new Error('请输入400个字符以内的产品描述'))
                }
              }else{
                callback()
              }
          }
            return {
              formData: {
                product_name: '',
                code: '',
                description: '',
                id:'',
                product_sign:'',
                url:''
              },
              formrules: {
                product_name: [
                  { required: true, validator: validateName, trigger: 'blur' }
                ],
                code: [
                  { required: true, validator: validateCode, trigger: 'blur' }
                ],
                description: [
                  { required: false, validator: validateDel, trigger: 'blur' }
                ],
                product_sign: [
                  { required: true, message: '请输入产品标识', trigger: 'blur' }
                ],
                url: [
                  { required: true, message: '请输入链接', trigger: 'blur' }
                ]
        		  }
            }
        },
        methods: {
          formSet(){
            this.formData.id=this.$route.query.id
            this.formData.product_name=this.$route.query.product_name
            this.formData.description=this.$route.query.description
            this.formData.code=this.$route.query.code
            this.formData.product_sign=this.$route.query.product_sign
            this.formData.url=this.$route.query.url
          },
          saveCancel(formName){
            let _this=this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  axios.post('/api/v1/product/upd', {
                    product_name:_this.formData.product_name,
                    description:_this.formData.description,
                    code:_this.formData.code,
                    id:_this.formData.id,
                    product_sign:_this.formData.product_sign,
                    url:_this.formData.url
                  })
                  .then(function (response) {
                    _this.$router.push({ path: 'productManagement'})
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
          EditCancel(){
            this.$router.push({ path: 'productManagement'})
          }
        },
        created(){
           this.formSet()
        }

    }
</script>
<style scoped>

</style>
