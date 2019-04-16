 <template>
     <div>
         <div class="crumbs">
             <el-breadcrumb separator="/">
                 <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 组织管理</el-breadcrumb-item>
                 <el-breadcrumb-item>页面设置</el-breadcrumb-item>
             </el-breadcrumb>
         </div>
         <div class="container">
           <el-form class="commonForm" enctype=”multipart/form-data”   label-width="100px" :model="formData" ref="formData" :rules="formrules">
             <el-form-item label="系统名称" prop="sys_name" >
               <el-input v-model="formData.sys_name"></el-input>
             </el-form-item>
             <el-form-item label="系统logo" prop="logo" >
               <el-upload
                 v-model="formData.logo"
                 class="upload-demo"
                 ref="upload"
                 action="https://jsonplaceholder.typicode.com/posts/"
                 :on-remove="handleRemoveLogo"
                 :on-change="changeLogo"
                 :file-list="fileListLogo"
                 :show-file-list="true"
                 :limit="1"
                 :auto-upload="false">
                 <el-button type="primary">选取图片</el-button>
                 <span slot="tip" class="el-upload__tip">只能上传jpg/png/gif且长宽200*60的图片，且不超过500kb</span>
               </el-upload>
               <span style="color:#f56c6c;font-size:12px;">{{logo_word}}</span>
               <img src="" class="logo-img" style="display:none;"/>
             </el-form-item>
             <el-form-item label="登录背景图" prop="background" >
               <el-upload
                 v-model="formData.background"
                 class="upload-demo"
                 ref="upload"
                 action="https://jsonplaceholder.typicode.com/posts/"
                 :on-remove="handleRemoveBg"
                 :on-change="changeBg"
                 :file-list="fileListBg"
                 :show-file-list="true"
                 :limit="1"
                 :auto-upload="false">
                 <el-button type="primary">选取图片</el-button>
                 <span slot="tip" class="el-upload__tip">只能上传jpg/png/gif且长宽1600*900的图片，且不超过2M</span>
               </el-upload>
               <span style="color:#f56c6c;font-size:12px;">{{background_word}}</span>
               <img src="" class="background-img" style="display:none;"/>
             </el-form-item>
             <el-form-item label="页尾声明" prop="state" >
               <el-upload
                 v-model="formData.state"
                 class="upload-demo"
                 ref="upload"
                 action="https://jsonplaceholder.typicode.com/posts/"
                 :on-remove="handleRemoveFooter"
                 :on-change="changeFooter"
                 :file-list="fileListFooter"
                 :show-file-list="true"
                 :limit="1"
                 :auto-upload="false">
                 <el-button type="primary">选取excel文件</el-button>
                 <span slot="tip" class="el-upload__tip">只能上传excel，且不超过200kb</span>
               </el-upload>
               <span style="color:#f56c6c;font-size:12px;">{{state_word}}</span>
             </el-form-item>
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
     export default {
         name: 'pageSet',
         data: function(){
           var validaterLogo = (rule, value, callback) => {
               if (value !== '') {
                 const types=value[0].raw.type
                 const isLt2M = value[0].raw.size / 1024 / 1024 < 0.5;
                 if (!(types=='image/png'||types=='image/jpeg'||types=='image/gif')) {
                   callback(new Error('上传系统logo图片只能是 jpg、png、gif格式!'))
                 }
                 if (!isLt2M) {
                   callback(new Error('上传系统logo图片大小不能超过 500kb!'))
                 }
                 if((types=='image/png'||types=='image/jpeg'||types=='image/gif')&&isLt2M){
                   callback()
                 }
               }else{
                 callback(new Error('请上传系统logo图'))
               }
           }
           var validaterBg = (rule, value, callback) => {
               if (value !== '') {
                 const types=value[0].raw.type
                 const isLt2M = value[0].raw.size / 1024 / 1024 < 2;
                 if (!(types=='image/png'||types=='image/jpeg'||types=='image/gif')) {
                   callback(new Error('上传背景图片只能是 jpg、png、gif格式!'))
                 }
                 if (!isLt2M) {
                   callback(new Error('上传背景图片大小不能超过 2M!'))
                 }
                 if((types=='image/png'||types=='image/jpeg'||types=='image/gif')&&isLt2M){
                   callback()
                 }
               }else{
                 callback(new Error('请上传背景图片'))
               }
           }
           var validaterFooter = (rule, value, callback) => {
               if (value !== '') {
                 const types=value[0].raw.type
                 const isLt2M = value[0].raw.size / 1024 / 1024 < 0.2;
                 if (!(types=='application/vnd.ms-excel'||types=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                   callback(new Error('页尾声明只能是 excel文件!'))
                 }
                 if (!isLt2M) {
                   callback(new Error('页尾声明文件大小不能超过 200kb!'))
                 }
                 if((types=='application/vnd.ms-excel'||types=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')&&isLt2M){
                   callback()
                 }
               }else{
                 callback(new Error('请上传页尾声明文件'))
               }
           }
             return {
               formData: {
                 sys_name: '',
                 logo:'',
                 background:'',
                 state:'',
                 state_word:''
               },
               formrules: {
                   sys_name: [
                     { required: true, message: '请输入系统名称', trigger: 'change' }
                   ],
                   logo: [
                     { required: true, message: '', trigger: 'blur' }
                   ],
                   background: [
                     { required: true, message: '', trigger: 'blur' }
                   ],
                   state: [
                     { required: true, message: '', trigger: 'blur' }
                   ]

                   // logo: [
                   //   { required: true, validator: validaterLogo, trigger: 'change' }
                   // ],
                   // background: [
                   //   { required: true, validator: validaterBg, trigger: 'change' }
                   // ],
                   // state: [
                   //   { required: true, validator: validaterFooter, trigger: 'change' }
                   // ]
               },
               fileListLogo:[],
               fileListBg:[],
               fileListFooter:[],
               logo_word:'',
               background_word:'',
               state_word:''
             }
         },
         methods: {
           //logo图
           handleRemoveLogo(file, fileList) {
             this.formData.logo=''
           },
           changeLogo(file, fileList){
             let _this=this
             const types=file.raw.type
             const isLt2M = file.raw.size / 1024 / 1024 < 0.5;
             if (!(types=='image/png'||types=='image/jpeg'||types=='image/gif')) {
               this.logo_word='上传系统logo图片只能是 jpg、png、gif格式'
               this.fileListLogo=[]
               this.formData.logo=''
             }
             if (!isLt2M) {
               this.logo_word='上传系统logo图片大小不能超过 500kb'
               this.fileListLogo=[]
               this.formData.logo=''
             }
            var reader = new FileReader();
            reader.readAsDataURL(fileList[0].raw);
            //监听文件读取结束后事件
            reader.onloadend = function (e) {
                 $(".logo-img").attr("src",e.target.result);    //e.target.result就是最后的路径地址
                 var image = new Image();
                 image.onload = function () {
                      var width = this.width;
                      var height = this.height;
                      if(Number(width)==Number(200) && Number(height)==Number(60)){
                          if((types=='image/png'||types=='image/jpeg'||types=='image/gif')&&isLt2M){
                            _this.logo_word=''
                            _this.formData.logo=fileList[0].raw
                            console.log(fileList)
                            console.log(fileList[0].raw)
                          }
                      }else{
                        _this.logo_word='上传系统logo图片宽度为200,高度为60'
                        _this.fileListLogo=[]
                        _this.formData.logo=''
                      }
                  };
                image.src=e.target.result;   //需要注意的是：src 属性一定要写到 onload 的后面，否则程序在 IE 中会出错。
             }
           },

           //背景图
           handleRemoveBg(file, fileList) {
             this.formData.background=''
           },
           changeBg(file, fileList){
             let _this=this
             const types=file.raw.type
             const isLt2M = file.raw.size / 1024 / 1024 < 2;
             if (!(types=='image/png'||types=='image/jpeg'||types=='image/gif')) {
               this.background_word='上传系统logo图片只能是 jpg、png、gif格式!'
               this.formData.background=''
               this.fileListBg=[]
             }
             if (!isLt2M) {
               this.background_word='上传系统logo图片大小不能超过 2M'
               this.formData.background=''
               this.fileListBg=[]
             }

             var reader = new FileReader();
             reader.readAsDataURL(fileList[0].raw);
             //监听文件读取结束后事件
             reader.onloadend = function (e) {
                  $(".background-img").attr("src",e.target.result);    //e.target.result就是最后的路径地址
                  var image = new Image();
                  image.onload = function () {
                       var width = this.width;
                       var height = this.height;
                       if(Number(width)==Number(1600) && Number(height)==Number(900)){
                           if((types=='image/png'||types=='image/jpeg'||types=='image/gif')&&isLt2M){
                             _this.background_word=''
                             _this.formData.background=fileList[0].raw
                           }
                       }else{
                         _this.background_word='上传系统背景图片宽度为1600,高度为900'
                         _this.fileListBg=[]
                         _this.formData.background=''
                       }
                   };
                 image.src=e.target.result;   //需要注意的是：src 属性一定要写到 onload 的后面，否则程序在 IE 中会出错。
              }
           },

           //底部声明
           handleRemoveFooter(file, fileList) {
             this.formData.state=''
           },
           changeFooter(file, fileList){
             const types=file.raw.type
             const isLt2M = file.raw.size / 1024 / 1024 < 0.2;
             if (!(types=='application/vnd.ms-excel'||types=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
               this.state_word='页尾声明只能是 excel文件'
               this.formData.state=''
               this.fileListFooter=[]
             }
             if (!isLt2M) {
               this.state_word='页尾声明文件大小不能超过 200kb'
               this.formData.state=''
               this.fileListFooter=[]
             }
             if((types=='application/vnd.ms-excel'||types=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')&&isLt2M){
               this.state_word=''
               this.formData.state=fileList[0].raw
             }
           },

           editCancel(){
             this.$router.push({ path: 'organizationManagement'})
           },
           saveCancel(formData){
               let _this=this
               if(this.formData.logo==''){
                 this.logo_word='请上传logo图片'
               }
               if(this.formData.background==''){
                 this.background_word='请上传登录背景图片'
               }
               if(this.formData.state==''){
                 this.state_word='请上传页尾声明文件'
               }
               if(this.formData.logo!=''&&this.formData.background!=''&&this.formData.state!=''){
                 this.$refs[formData].validate((valid) => {
                     if (valid) {
                       let formData = new FormData()
                       formData.append('org_id', this.$route.query.id)
                       formData.append('sys_name', this.formData.sys_name)
                       formData.append('file1', this.formData.logo)
                       formData.append('file2', this.formData.background)
                       formData.append('file3', this.formData.state)
                       axios.post('/api/v1/org/page/set',formData)
                       .then(function (response) {
                         _this.$router.push({ path: 'organizationManagement'})
                         _this.$message({
                           type: 'success',
                           message: '添加成功!'
                         })
                       })
                       .catch(function (error) {
                         if(error.response.data.errorCode=='7' || error.response.data.errorCode=='8' ){
                           window.sessionStorage.removeItem('access_token', '')
                           _this.$router.push({ path: 'login'})
                         }else{
                           _this.$message({
                             type: 'error',
                             message: error.response.data.errorMessage
                           })
                         }
                       });
                    }
                 })
               }

             }

         }

     }
 </script>
 <style scoped>
 .container .el-button--small, .el-button--small.is-round {
     padding: 9px 15px;
 }
 </style>
