<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 字典管理</el-breadcrumb-item>
                <el-breadcrumb-item>字典管理编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-form class="commonForm"   label-width="80px" :model="formData" ref="formData" :rules="formrules">
            <el-form-item label="产品名称" prop="product_name">
              <el-select v-model="formData.product_name" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="字典类型" prop="dict_type">
              <el-input v-model="formData.dict_type" disabled></el-input>
            </el-form-item>
            <el-form-item label="类型ID" prop="dict_type_id">
              <el-input v-model="formData.dict_type_id" disabled></el-input>
              <span class="form_hint" style="position:absolute;right:-140px;top:0px;">编写规则:产品名称+序号</span>
            </el-form-item>
            <el-form-item label="类型描述" prop="description">
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
        name: 'dictionaryEdit',
        data: function(){
          var validateType = (rule, value, callback) => {
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
                  callback(new Error('请输入20个字符以内的字典类型'))
                }
              }else{
                callback(new Error('请输入字典类型'))
              }
          }
          var validateTypeId = (rule, value, callback) => {
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
                  callback(new Error('请输入10个字符以内的字典类型ID'))
                }
              }else{
                callback(new Error('请输入字典类型ID'))
              }
          }
          var validateTypeDrl = (rule, value, callback) => {
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
                  callback(new Error('请输入100个字符以内的字典类型描述'))
                }
              }else{
                callback()
              }
          }
            return {
              formData: {
                product_name: '',
                dict_type: '',
                dict_type_id:'',
                description: '',
                id:''
              },
              formrules: {
                product_name: [
                  { required: true, message: '请输入产品名称', trigger: 'change' }
                ],
                dict_type: [
                  { required: true, validator: validateType, trigger: 'blur' }
                ],
                dict_type_id: [
                  { required: true, validator:validateTypeId, trigger: 'blur' }
                ],
                description: [
                  { required: false, trigger: 'blur' , validator:validateTypeDrl}
                ]
              },
              options: [],
              value: ''
            }
        },
        methods: {
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
                 //console.log(newArr)
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
          formSet(){
            this.formData.product_name=this.$route.query.product_name
            this.formData.dict_type=this.$route.query.dict_type
            this.formData.dict_type_id=this.$route.query.dict_type_id
            this.formData.description=this.$route.query.description
            this.formData.id=this.$route.query.id
          },
          //取消
          editCancel(){
            this.$router.push({ path: 'dictionaryManagement'})
          },
          //保存
          saveCancel(formName){
            let _this=this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  axios.post('/api/v1/dictionary/upd', {
                    product_name:_this.formData.product_name,
                    description:_this.formData.description,
                    dict_type:_this.formData.dict_type,
                    dict_type_id:_this.formData.dict_type_id,
                    id:_this.formData.id
                  })
                  .then(function (response) {
                    _this.$router.push({ path: 'dictionaryManagement'})
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
          this.productData()
          this.formSet()
        },

    }
</script>
<style scoped>

</style>
