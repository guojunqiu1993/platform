<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 字典管理</el-breadcrumb-item>
                <el-breadcrumb-item>字典维护编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-form class="commonForm"  label-width="80px" :model="maintainFormData" ref="maintainFormData" :rules="maintainFormrules">
            <el-form-item label="字典值" prop="value">
              <el-input v-model="maintainFormData.value" disabled></el-input>
            </el-form-item>
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="maintainFormData.name"></el-input>
            </el-form-item>
            <el-form-item label="排序号">
              <el-input-number style="width:220px;" :min="1" v-model="maintainFormData.sort" @change="handleNumChange"></el-input-number>
            </el-form-item>
            <el-form-item label="字典描述" prop="description">
              <el-input v-model="maintainFormData.description"></el-input>
            </el-form-item>
            <el-form-item label="字典状态" prop="status">
              <el-radio v-model="maintainFormData.status" label="1">启用</el-radio>
              <el-radio v-model="maintainFormData.status" label="0">禁用</el-radio>
            </el-form-item>
            <el-input type="hidden" v-model="maintainFormData.id"></el-input>
            <el-input type="hidden" v-model="maintainFormData.dict_type_id"></el-input>

          </el-form>
        </div>
        <div class="common-btns">
            <el-button type="primary" @click="mainSaveCancel('maintainFormData')">保存</el-button>
            <el-button @click="mainEditCancel()">取消</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    // import instance1 from '../../../common/axiosv1'
    export default {
        name: 'maintainEdit',
        data: function(){
            return {
              maintainFormData:{
                value:'',
                name:'',
                sort:'',
                description:'',
                status:'',
                dict_type_id:'',
                id:''
              },
              maintainFormrules: {
                  value: [
                    { required: true, message: '请输入字典值', trigger: 'blur' }
                  ],
                  name: [
                    { required: true, message: '请输入字典名称', trigger: 'blur' }
                  ],
                  status: [
                    { required: true, message: '请选择字典状态', trigger: 'change' }
                  ],
                  description: [
        						{ required: false, trigger: 'blur' },{min: 0,max: 400,message: '长度不能超过400'}
        					]
              }
            }

        },
        created(){
          this.maintainSet()
        },
        methods: {
          maintainSet(){
            this.maintainFormData.description=this.$route.query.description
            this.maintainFormData.dict_type_id=this.$route.query.dict_type_id
            this.maintainFormData.id=this.$route.query.id
            this.maintainFormData.name=this.$route.query.name
            this.maintainFormData.sort=this.$route.query.sort
            this.maintainFormData.value=this.$route.query.value
            this.maintainFormData.status=this.$route.query.status
          },
          handleNumChange(value){
            console.log(value)
          },
          //取消
          mainEditCancel(){
            this.$router.push({ path: 'maintainList',query:{
                  dict_type_id:this.$route.query.dict_type_id
              }
            })
          },
          //字典维护-保存
          mainSaveCancel(maintainFormData){
            let _this=this
            this.$refs[maintainFormData].validate((valid) => {
                if (valid) {
                  axios.post('/api/v1/dictionary/maintain/upd', {
                    id:_this.maintainFormData.id,
                    dict_type_id:_this.maintainFormData.dict_type_id,
                    value:_this.maintainFormData.value,
                    name:_this.maintainFormData.name,
                    sort:_this.maintainFormData.sort,
                    description:_this.maintainFormData.description,
                    status:_this.maintainFormData.status
                  })
                  .then(function (response) {
                    _this.$router.push({ path: 'maintainList',query:{
                          dict_type_id:_this.$route.query.dict_type_id
                      }
                    })
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
        }
    }
</script>
<style scoped>

</style>
