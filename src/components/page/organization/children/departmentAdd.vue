<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 组织管理</el-breadcrumb-item>
                <el-breadcrumb-item>部门管理新建</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-form class="commonForm"   label-width="120px" :model="formData" ref="formData" :rules="formrules">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="部门类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择">
                  <el-option
                    v-for="item in departOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否真实部门" prop="isRealDept">
              <el-select v-model="formData.isRealDept" placeholder="请选择">
                  <el-option
                    v-for="item in realOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门上级" prop="parentDept">
              <el-input v-model="formData.parentDept" readonly @focus="parentFocus()"></el-input>
              <div class="parent-div" v-show='parentVisible'>
                <i class="iconfont icon-weibiaoti31" @click="parentHide()"></i>
                <el-tree :data="treeData" node-key="id" :expand-on-click-node='false' default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree>
              </div>
            </el-form-item>
            <el-form-item label="层级" prop="level">
              <el-input-number v-model="formData.level" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="formData.sort" :min="1" :max="9999"></el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div class="common-btns">
          <el-button type="primary" @click="saveCancel('formData')">保存</el-button>
          <el-button @click="addCancel()">取消</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    // import instance1 from '../../../common/axiosv1'
    export default {
        name: 'productAdd',
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
                if(lengths>0&&lengths<41 ){
                  callback()
                }else{
                  callback(new Error('请输入40个字符以内的部门名称'))
                }
              }else{
                callback(new Error('请输入部门名称'))
              }
          }

            return {
              formData: {
                name: '',
                type: '',
                level:'',
                sort:'',
                parentDept:'根目录',
                isRealDept:''
              },
              org_id:this.$route.query.id,
              formrules: {
        		      name: [
        						{ required: true, validator: validateName, trigger: 'blur' }
        					],
                  type: [
        						{ required: true, message: '请输入部门类型', trigger: 'change' }
        					],
                  level: [
        						{ required: true, message: '请输入层级', trigger: 'change' }
        					],
                  isRealDept:[
        						{ required: true, message: '请输入真实部门', trigger: 'change' }
        					],
                  parentDept:[
        						{ required: true, message: '请输入部门上级', trigger: 'blur' }
        					]
        		  },
              treeData: [],
              defaultProps: {
                children: 'children',
                label: 'name'
              },
              parentVisible:false,
              departOptions:[{
                'label':'部门类型选择',
                'value':''
              },{
                'label':'管理员部门',
                'value':'1'
              },{
                'label':'发言人部门',
                'value':'2'
              }],
              realOptions:[{'value':'','label':'真实部门选择'},{'value':1,'label':'是'},{'value':0,'label':'否'}]
            }
        },
        created() {
            // this.departmentTypeData()
            this.departTreeData()
        },
        methods: {
          parentHide(){
            this.parentVisible=false
          },
          //上级标签-获得焦点
          parentFocus(){
            this.parentVisible=true
          },
          //左侧-tree
          handleNodeClick(data) {
            console.log(data)
            this.formData.parentDept=data.name
            this.parentVisible=false
          },
          //左侧树
          departTreeData(){
            let _this=this
            axios.get('/api/v1/org/dept/list/tree',{
                params:{
                  org_id:_this.$route.query.id
                }
              }).then(function (response) {
                //console.log(response.data.data)
                _this.treeData=response.data.data
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
          saveCancel(formName){
            let _this=this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  axios.post('/api/v1/org/dept/add', {
                    org_id:_this.org_id,
                    type:_this.formData.type,
                    name:_this.formData.name,
                    level:_this.formData.level,
                    sort:_this.formData.sort,
                    isRealDept:_this.formData.isRealDept,
                    parentDept:_this.formData.parentDept
                  })
                  .then(function (response) {
                      _this.$refs[formName].resetFields();
                      _this.$router.push({ path: 'departmentList', query: {
                        'id': _this.$route.query.id
                        }})
                      _this.$message({
                        type: 'success',
                        message: '添加成功!'
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

          addCancel(){
            this.$router.push({ path: 'departmentList', query: {
              'id': this.$route.query.id
              }})
          },
          //部门类型选择
          departmentTypeData(){
            let _this=this;
            axios.get('/api/v1/org/dept/type/list',{
                params:{
                  // org_id:_this.$route.query.id
                  dict_type:'部门类型'
                }
              }).then(function (response) {
                let arr=response.data.data
                //console.log(arr)
                let newArr=[{'value':'','label':'部门类型选择'}]
                if(arr.length>0){
                  for(var i=0;i<arr.length;i++){
                    let obj={}
                    obj.value=arr[i]
                    obj.label=arr[i]
                    newArr.push(obj)
                  }
                }
                _this.departOptions=newArr
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
          }
        }

    }
</script>
<style scoped>
  .parent-div{
    position:absolute;
    left:0px;
    top:34px;
    width:480px;
    max-height:200px;
    overflow:auto;
    background:#fff;
    z-index:20;
    -webkit-box-shadow: rgba(0,0,0,0.4) 0px 0px 10px;
    -moz-box-shadow: rgba(0,0,0,0.4) 0px 0px 10px;
    box-shadow: rgba(0,0,0,0.4) 0px 0px 10px;
    padding:20px 10px 10px 10px;
  }
  .parent-div i{
    position:absolute;
    right:20px;
    top:5px;
    z-index:30;
    cursor:pointer;
  }
</style>
