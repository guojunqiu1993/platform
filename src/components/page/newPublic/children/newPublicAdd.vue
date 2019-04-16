<template>
    <div>
      <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 最新舆情</el-breadcrumb-item>
              <el-breadcrumb-item>添加舆情</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="container">
        <el-form class="commonForm"  label-width="80px" :model="formData" ref="formData" :rules="formrules">
          <el-form-item label="标题" prop="title">
            <el-input v-model="formData.title"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="formData.author"></el-input>
          </el-form-item>
          <el-form-item label="来源" prop="source">
            <el-input v-model="formData.source"></el-input>
          </el-form-item>

          <el-form-item label="任务类型" prop="task_type" style="display:none;">
            <el-select v-model="formData.task_type" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
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
          <el-form-item label="信息渠道" prop="channel" style="display:none;">
            <el-select v-model="formData.channel" placeholder="请选择">
                <el-option
                  v-for="item in channelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="舆情性质" prop="grade_id">
            <el-select v-model="formData.grade_id" placeholder="请选择">
                <el-option
                  v-for="item in gradeIdOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="链接" prop="link">
            <el-input v-model="formData.link" ></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <!-- <el-input type="textarea" v-model="formData.content" :rows="6"></el-input> -->
            <quill-editor ref="myTextEditor" v-model="formData.content" :options="word_editorOption" @change="onEditorChangeWord($event)"></quill-editor>
          </el-form-item>
          <!-- <el-form-item label="附件">
            <el-upload
              v-model="formData.accessory"
              class="upload-demo"
              ref="upload"
              multiple
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-remove="handleRemoveAccessory"
              :on-change="changeAccessory"
              :file-list="fileListAccessory"
              :show-file-list="true"
              :limit="5"
              accept=".bmp,.gif,.jpg,.tiff,.psd,.png,.swf,.svg,.jpeg,.mp4,.flv,.rar,.zip,.avi,.mov,.mkv,.doc,.docx,.pdf,.xls,.xlsx,.txt,.ppt,.pptx,.wmv"
              :auto-upload="false">
              <el-button type="primary">选取文件</el-button>
              <span slot="tip" class="el-upload__tip">单次提交最多5个文件，且每个文件大小不超过50M</span>
            </el-upload>
            <span style="color:#f56c6c;font-size:12px;">{{accessory_word}}</span>
          </el-form-item> -->
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
import $ from 'jquery'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
let umsUrl=window.sessionStorage.getItem('umsUrl')
export default {
    name: 'newPublicAdd',
    data() {
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
              if(lengths>0&&lengths<10001 ){
                callback()
              }else{
                callback(new Error('请输入10000个字符以内的内容'))
              }
            }else{
              callback(new Error('请输入内容'))
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

        return {
          word_editorOption: {
              placeholder:'',
              modules:{ toolbar:[ [{'font':[]}, {'size':[]}, {'color':[]}, 'bold','italic','underline',{'align':[]} ] ]}
          },
          typeOptions:[],
          classifyOptions:[],
          channelOptions:[],
          formData:{
            'title':'',
            'author':'',
            'source':'',
            'task_type':'',
            'msg_category':'',
            'link':'',
            'content':'',
            'channel':'',
            'accessory':''
          },
          fileListAccessory:[],
          accessory_word:'',
          formrules: {
              content: [
                { required: true,validator:validateContent, trigger: 'blur' }
              ],
              author: [
                { required: false,validator:validateAuthor, trigger: 'blur' }
              ],
              title: [
                { required: true, validator:validateTitle, trigger: 'blur' }
              ],
              source: [
                { required: true, validator:validateSource, trigger: 'blur' }
              ],
              link: [
                { required: false, validator:validateUrl, trigger: 'blur' }
              ],
              // task_type: [
              //   { required: true, message: '请输入任务类型', trigger: 'change'}
              // ],
              msg_category: [
                { required: true, message: '请输入信息分类', trigger: 'change'}
              ],
              // channel: [
              //   { required: true, message: '请输入信息渠道', trigger: 'change'}
              // ],
              // grade_id: [
              //   { required: true, message: '请输入舆情性质', trigger: 'change'}
              // ]
          }


        }
    },
    components: {
        quillEditor
    },
    created() {
      // this.taskTypeData()
      this.messageTypeData()
      // this.channelData()
    },
    computed: {

    },
    mounted(){
      $(".quill-editor .ql-editor").height($(".quill-editor .ql-container").height())
    },
    methods: {
      onEditorChangeWord({ editor, html, text }) {
          // console.log(this.word_content)
      },
      saveCancel(formName){
        let _this=this
        this.$refs[formName].validate((valid) => {
            if (valid) {
              axios.post('/api/v1/newest/article/add', {
                title:this.formData.title,
                author:this.formData.author,
                from:this.formData.source,  //文章来源
                linkurl:this.formData.link,  //链接地址
                arttype:this.formData.msg_category,  //信息分类
                content:this.formData.content,
                channel:'0',
                iframeUpload:'', //上传文件
                mid:parseInt(Math.random()*999999999),
                type:1,
                // grade_id:this.formData.grade_id
              })
              .then(function (response) {
                _this.$router.push({ path: 'newPublic'})
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
      // handleRemoveAccessory(file, fileList) {
      //   let name=''
      //   let accessoryArr=[]
      //   let arr=[]
      //   name=file.name
      //   accessoryArr=this.formData.accessory
      //   for(var i=0;i<accessoryArr.length;i++){
      //     if(accessoryArr[i].name!=name){
      //       arr.push(accessoryArr[i])
      //     }
      //   }
      //   this.formData.accessory=arr
      // },
      // changeAccessory(file, fileList){
      //     let arrs=[]
      //     let showArrs=[]  //文件显示数组
      //     for(var i=0;i<fileList.length;i++){
      //       if(fileList[i].raw.size / 1024 / 1024 < 50){
      //         let obj={}
      //         obj.name=fileList[i].raw.name
      //         obj.url=fileList[i].url
      //         arrs.push(fileList[i].raw)
      //         showArrs.push(obj)
      //       }
      //     }
      //     this.formData.accessory=arrs
      //     this.fileListAccessory=showArrs
      // },
      editCancel(){
        this.$router.push({ path: 'newPublic'})
      },
      taskTypeData(){
        let _this=this;
        axios.get(umsUrl+'/api/v1/org/dept/type/list',{
            params:{
              dict_type:'任务类型'
            }
          }).then(function (response) {
            let arr=response.data.data
            let newArr=[{'value':'','label':'任务类型选择'}]
            if(arr.length>0){
              for(var i=0;i<arr.length;i++){
                let obj={}
                obj.value=arr[i]
                obj.label=arr[i]
                newArr.push(obj)
              }
            }
            _this.typeOptions=newArr
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
      //信息渠道
      channelData(){
        let _this=this;
        axios.get(umsUrl+'/api/v1/dictionary/maintain/list',{
            params:{
              dict_type:'信息渠道'
            }
          }).then(function (response) {
            let arr=response.data.data
            let newArr=[{'value':'','label':'信息渠道选择'}]
            if(arr.length>0){
              for(var i=0;i<arr.length;i++){
                let obj={}
                obj.value=arr[i].value
                obj.label=arr[i].name
                newArr.push(obj)
              }
            }
            _this.channelOptions=newArr
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
      }

    }
}

</script>

<style scoped>
.container .el-button--small, .el-button--small.is-round {
    padding: 9px 15px;
}
</style>
