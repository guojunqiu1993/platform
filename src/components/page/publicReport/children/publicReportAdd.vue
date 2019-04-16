<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 舆情交流</el-breadcrumb-item>
                <el-breadcrumb-item>新增上报</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-form class="commonForm"   label-width="80px" :model="formData" ref="formData" :rules="formrules">
            <el-form-item label="标题" prop="title">
              <el-input v-model="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input v-model="formData.author"></el-input>
            </el-form-item>
            <el-form-item label="来源" prop="source">
              <el-input v-model="formData.source"></el-input>
            </el-form-item>
            <el-form-item label="链接" prop="url">
              <el-input v-model="formData.url"></el-input>
            </el-form-item>
            <el-form-item label="信息分类" prop="msg_category">
              <el-select v-model="formData.msg_category" placeholder="请选择">
                  <el-option
                    v-for="item in classifyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="content" >
              <!-- <el-input type="textarea" v-model="formData.content" :rows="6"></el-input> -->
              <quill-editor ref="myTextEditor" v-model="formData.content" :options="word_editorOption" @change="onEditorChangeWord($event)"></quill-editor>
            </el-form-item>
            <el-form-item label="报送部门" prop="department">
              <el-input v-model="formData.department" type="hidden"></el-input>
              <div class="department-tree">
                  <el-tree
                  :data="dataTree"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  ref="tree"
                  highlight-current
                  :check-strictly="true"
                  :default-checked-keys="arr_check"
                  @check-change="checkChange()"
                  :props="defaultProps">
                  </el-tree>
              </div>
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
    import $ from 'jquery'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import { quillEditor } from 'vue-quill-editor'
    export default {
        name: 'publicReportAdd',
        data: function(){
            var validateTitle = (rule, value, callback) => {
                if (value !== '') {
                  let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                  let mat = value.match(cnReg);
                  let lengths
                  if(mat){
                     lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                  }else{
                    lengths=value.length
                  }
                  if(lengths>0&&lengths<81 ){
                    callback()
                  }else{
                    callback(new Error('请输入80个字符以内的标题'))
                  }
                }else{
                  callback(new Error('请输入标题'))
                }
            }
            var validateAuthor = (rule, value, callback) => {
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
                    callback(new Error('请输入20个字符以内的作者'))
                  }
                }else{
                  callback()
                }
            }
            var validateSource = (rule, value, callback) => {
                if (value !== '') {
                  let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                  let mat = value.match(cnReg);
                  let lengths
                  if(mat){
                     lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                  }else{
                    lengths=value.length
                  }
                  if(lengths>0&&lengths<31 ){
                    callback()
                  }else{
                    callback(new Error('请输入30个字符以内的来源'))
                  }
                }else{
                  callback(new Error('请输入来源'))
                }
            }
            var validateUrl = (rule, value, callback) => {
                if (value !== '') {

                  let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                  let mat = value.match(cnReg);
                  let lengths
                  if(mat){
                     lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                  }else{
                    lengths=value.length
                  }
                 if(!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(value)){
                   callback(new Error('请填写正确链接地址,须以http://、https://、ftp://作为开头'))
                 }else{
                   callback()
                 }

                }else{
                  callback()
                }
            }
            var validateContent = (rule, value, callback) => {
                if (value !== '') {
                  let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                  let mat = value.match(cnReg);
                  let lengths
                  if(mat){
                     lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                  }else{
                    lengths=value.length
                  }
                  if(lengths>0&&lengths<10001){
                    callback()
                  }else{
                    callback(new Error('请输入10000个字符以内的内容'))
                  }
                }else{
                  callback(new Error('请输入内容'))
                }
            }
            return {
              word_editorOption: {
                  placeholder:'',
                  modules:{ toolbar:[ [{'font':[]}, {'size':[]}, {'color':[]}, 'bold','italic','underline',{'align':[]} ] ]}
              },
              formData: {
                title: '',
                author: '',
                source: '',
                url:'',
                msg_category:'',
                content:'',
                department:'',
                departmentName:''
              },
              formrules: {
        		      title: [
        						{ required: true, validator: validateTitle, trigger: 'blur' }
        					],
                  author: [
        						{ required: false, validator: validateAuthor, trigger: 'blur' }
        					],
                  source: [
        						{ required: true, validator: validateSource, trigger: 'blur' }
        					],
                  url: [
        						{ required: false, validator: validateUrl, trigger: 'blur' }
        					],
                  message_flex: [
        						{ required: true, message: '请输入信息分类', trigger: 'blur' }
        					],
                  department: [
        						{ required: true, message: '请输入报送部门', trigger: 'change' }
        					],
                  content: [
        						{ required: true,validator: validateContent, trigger: 'blur' }
        					],
                  msg_category: [
                    { required: true, message: '请输入信息分类', trigger: 'change'}
                  ]
        		  },
              dataTree: [
              ],
              defaultProps: {
                children: 'children',
                label: 'name'
              },
              arr_check:[],
              classifyOptions:[]

            }
        },
        created() {
          this.messageTypeData()
          this.reportdelData()
        },
        components: {
            quillEditor
        },
        mounted(){
          $(".quill-editor .ql-container").height('160px')
          $(".quill-editor .ql-editor").height($(".quill-editor .ql-container").height())
        },
        methods: {
          onEditorChangeWord({ editor, html, text }) {
              // console.log(this.word_content)
          },
          checkChange(){
            let arr=[]
            let parentArr=[]
            arr=this.$refs.tree.getCheckedNodes()
            parentArr=this.$refs.tree.getHalfCheckedNodes()
            let concatArr=arr.concat(parentArr)
            let newStr=''
            let newStr1=''
            if(concatArr.length>0){
              for(var i=0;i<concatArr.length;i++){
                newStr+=concatArr[i].id+','
                newStr1+=concatArr[i].name+','
              }
              this.formData.department=newStr.substr(0,newStr.length-1)
              this.formData.departmentName=newStr1.substr(0,newStr1.length-1)
            }else{
              this.formData.department=''
              this.formData.departmentName=''
            }

          },
          //信息分类
          messageTypeData(){
            let _this=this;
            axios.get('http://192.168.2.165:8081'+'/api/v1/dictionary/maintain/list',{
                params:{
                  dict_type:'信息分类'
                }
              }).then(function (response) {
                let arr=response.data.data
                let newArr=[{'value':'','label':'信息分类选择'}]
                if(arr.length>0){
                  for(var i=0;i<arr.length;i++){
                    let obj={}
                    obj.value=arr[i].value
                    obj.label=arr[i].name
                    newArr.push(obj)
                  }
                }
                _this.classifyOptions=newArr
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
          //报送部门
          reportdelData(){
            let _this=this
            axios.get('/api/v1/article/exchange/export/dept/list',{
                params:{

                }
              }).then(function (response) {
                let arr=response.data.data
                _this.dataTree=arr
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
                  axios.post('/api/v1/article/exchange/export/add',{
                        'title':this.formData.title,
                        'author':this.formData.author,
                        'type':this.formData.msg_category,  //信息分类
                        'url':this.formData.url,
                        'bbstopic_from':this.formData.source,  //来源
                        'content':this.formData.content,
                        'to_depts':this.formData.department,
                        'to_depts_name':this.formData.departmentName
                    }).then(function (response) {
                      _this.$message({
                        type: 'success',
                        message: '添加成功'
                      });
                      _this.$router.push({ path: 'publicReport'})
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
            })
          },

          addCancel(){
            this.$router.push({ path: 'publicReport'})
          }
        }

    }
</script>
<style scoped>
.department-tree{
  padding:20px;
  max-height:180px;
  overflow:auto;
  border:1px solid #dcdfe6;
  margin-top:-28px;
  border-radius: 4px;
}
</style>
