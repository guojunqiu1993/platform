<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 角色管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-form class="commonForm"   label-width="80px" :model="formData" ref="formData" :rules="formrules">
            <el-form-item label="所属产品" prop="product_name">
              <el-select v-model="formData.product_name" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色名称" prop="rolename">
              <el-input v-model="formData.rolename"></el-input>
            </el-form-item>
            <el-form-item label="角色编码" prop="code">
              <el-input v-model="formData.code"></el-input>
            </el-form-item>
            <el-form-item label="角色状态" prop="status">
              <el-radio v-model="formData.status" label="启用">启用</el-radio>
              <el-radio v-model="formData.status" label="禁用">禁用</el-radio>
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
              <el-input type="textarea" v-model="formData.description"></el-input>
            </el-form-item>
            <el-input type="hidden" v-model="formData.id"></el-input>
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
        name: 'roleEdit',
        data: function(){
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
                  callback(new Error('请输入20个字符以内的角色名称'))
                }
              }else{
                callback(new Error('请输入角色名称'))
              }
          }
          var validateCode = (rule, value, callback) => {
              if (value !== '') {
                let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                let mat = value.match(cnReg);
                let lengths
                if(mat){
                   lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                }else{
                  lengths=value.length
                }
                if(lengths>0&&lengths<11 ){
                  callback()
                }else{
                  callback(new Error('请输入10个字符以内的角色编码'))
                }
              }else{
                callback(new Error('请输入角色编码'))
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
                if(lengths>0&&lengths<101 ){
                  callback()
                }else{
                  callback(new Error('请输入100个字符以内的角色描述'))
                }
              }else{
                callback()
              }
          }
            return {
              formData: {
                product_name: '',
                rolename:'',
                code: '',
                status:'',
                description: '',
                id:'',
                product_id:''
              },
              formrules: {
                product_name: [
                  { required: true, message: '请输入产品名称', trigger: 'change' }
                ],
                rolename: [
                  { required: true, validator: validateName, trigger: 'blur' }
                ],
                code: [
                  { required: true, validator: validateCode, trigger: 'blur' }
                ],
                status: [
                  { required: true, message: '请输入角色状态', trigger: 'blur' }
                ],
                description: [
                  { required: false, validator: validateDel, trigger: 'blur' }
                ]
              },
              options: [],
              value: ''
            }
        },
        methods: {
          formSet(){
             this.formData.product_name=this.$route.query.product_name
             this.formData.rolename=this.$route.query.rolename
             this.formData.code=this.$route.query.code
             this.formData.description=this.$route.query.description
             this.formData.id=this.$route.query.id
             this.formData.status=this.$route.query.status

          },
          //获取下拉框数据  产品选择
          productData(){
            let _this=this
            axios.get('/api/v1/mng/product/list',{
                params:{
                  pageNumber:'',
                  pageSize:'',
                  product_name:''
                }
              }).then(function (response) {
                 let arr=response.data.data.productList
                 //console.log(arr);
                 let newArr=[]
                 if(arr.length>0){
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].product_name
                     obj.label=arr[i].product_name
                     newArr.push(obj)
                   }
                 }
                // console.log(newArr)
                 _this.options=newArr
              }).catch(function (error) {
                if(error.response.data.errorCode=='7' || error.response.data.errorCode=='8' ){
                  window.sessionStorage.removeItem('access_token', '')
                  _this.$router.push({ path: 'login'})
                }else{
                  _this.$message({
                    type: 'error',
                    message: error.response.data.errorMessage
                  });
                }
              })
          },
          //取消
          editCancel(){
             this.$router.push({ path: 'roleManagement'})
          },
          //保存
          saveCancel(formData){
            let _this=this
            this.$refs[formData].validate((valid) => {
                if (valid) {
                  let state=''
                  if(_this.formData.status=='启用'){
                    state=1
                  }else{
                    state=0
                  }
                  axios.post('/api/v1/role/upd', {
                    id:_this.formData.id,
                    product_name:_this.formData.product_name,
                    rolename:_this.formData.rolename,
                    code:_this.formData.code,
                    status:state,
                    description:_this.formData.description
                  })
                  .then(function (response) {
                    _this.$router.push({ path: 'roleManagement'})
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
          }

        },
        created() {
            this.formSet()
            this.productData()
        }

    }
</script>
<style scoped>

</style>
