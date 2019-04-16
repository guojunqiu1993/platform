<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 舆情处置</el-breadcrumb-item>
                <el-breadcrumb-item>编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-form class="commonForm"   label-width="120px" :model="formData" ref="formData" :rules="formrules">
            <el-form-item label="标题" prop="title">
              <el-input v-model="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="来源" prop="source">
              <el-input v-model="formData.source"></el-input>
            </el-form-item>
            <el-form-item label="链接" prop="url">
              <el-input v-model="formData.url"></el-input>
            </el-form-item>
            <el-form-item label="舆情性质" prop="opinion">
              <el-select v-model="formData.opinion" placeholder="舆情性质选择">
                  <el-option
                    v-for="item in opinionOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="舆情分类一级" prop="levelOne_classify">
              <el-select v-model="formData.levelOne_classify" placeholder="舆情分类一级选择" @change="levelOneSel()">
                  <el-option
                    v-for="item in levelOneOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-select v-model="formData.levelTwo_classify" placeholder="舆情分类二级选择">
                  <el-option
                    v-for="item in levelTwoOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
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
    export default {
        name: 'publicOpinionEdit',
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
            // var validateUrl = (rule, value, callback) => {
            //     if (value !== '') {
            //       let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
            //       let mat = value.match(cnReg);
            //       let lengths
            //       if(mat){
            //          lengths=(mat.length + (value.length - mat.length) * 0.5)*2
            //       }else{
            //         lengths=value.length
            //       }
            //       if(lengths>0&&lengths<101 ){
            //         callback()
            //       }else{
            //         callback(new Error('请输入100个字符以内的链接'))
            //       }
            //     }else{
            //       callback()
            //     }
            // }

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
              opinionOptions:[{
                value:'6',
                label:'一般舆情'
              },{
                value:'7',
                label:'较大舆情'
              },{
                value:'8',
                label:'重大舆情'
              }],
              levelOneOptions:[],
              levelTwoOptions:[],
              formData: {
                title: '',
                source: '',
                url: '',
                opinion:'',
                levelOne_classify:'',
                levelTwo_classify:'',
                article_id:''
              },
              formrules: {
        		      title: [
        						{ required: true, validator: validateTitle, trigger: 'blur' }
        					],
                  source: [
        						{ required: true, validator: validateSource, trigger: 'blur' }
        					],
                  url: [
        						{ required: false, validator: validateUrl, trigger: 'blur' }
        					],
                  opinion: [
        						{ required: true, message: '请输入舆情性质', trigger: 'change' }
        					],
                  levelOne_classify: [
        						{ required: true, message: '请输入舆情分类一级', trigger: 'change' }
        					]
        		  }
            }
        },
        created() {
          this.editData()
          this.eventFlexData()

        },
        methods: {
          editData(){
            this.formData.title=this.$route.query.title
            this.formData.source=this.$route.query.source
            this.formData.url=this.$route.query.url
            this.formData.opinion=this.$route.query.grade
            this.formData.article_id=this.$route.query.article_id
          },
          saveCancel(formName){
            let _this=this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  let _this=this
                  let opinion=''
                  if(_this.formData.opinion=='一般舆情'||_this.formData.opinion=='6'){
                    opinion=6
                  }else if(_this.formData.opinion=='较大舆情'||_this.formData.opinion=='7'){
                    opinion=7
                  }else if(_this.formData.opinion=='重大舆情'||_this.formData.opinion=='8'){
                    opinion=8
                  }
                  axios.get('/api/v1/mng/article/deal/upd',{
                      params:{
                        'one_level':this.formData.levelOne_classify,
                        'two_level':this.formData.levelTwo_classify,
                        'article_id':this.formData.article_id,
                        'title':this.formData.title,
                        'source':this.formData.source,
                        'url':this.formData.url,
                        'grade_id':opinion
                      }
                    }).then(function (response) {
                      _this.$message({
                        type: 'success',
                        message: '修改成功'
                      });
                      _this.$router.push({ path: 'publicOpinion'})
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
            this.$router.push({ path: 'publicOpinion'})
          },



          //事件分类 一级
          eventFlexData(){
            let _this=this
            axios.get('/api/v1/sys/event/classify/one/level',{
                params:{

                }
              }).then(function (response) {
                let arr=response.data.data
                let newArr=[]

                if(arr.length>0){
                  for(var i=0;i<arr.length;i++){
                    let obj={}
                    obj.value=arr[i].one_level
                    obj.label=arr[i].one_level
                    newArr.push(obj)
                  }
                }
                _this.levelOneOptions=newArr
                _this.formData.levelOne_classify=_this.$route.query.one_level
                _this.levelOneSel()
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

          //一级 下拉事件
          levelOneSel(){
            let _this=this
            axios.get('/api/v1/sys/event/classify/two/level',{
                params:{
                  one_level:_this.formData.levelOne_classify
                }
              }).then(function (response) {
                let arr=response.data.data
                let newArrNull=[]
                let newArr=[]
                if(arr.length>0){
                  for(var i=0;i<arr.length;i++){
                    let obj={}
                    obj.value=arr[i].id
                    obj.label=arr[i].two_level
                    newArrNull.push(obj)
                  }
                  _this.formData.levelTwo_classify=arr[0].two_level
                  _this.levelTwoOptions=newArrNull
                }else{
                  _this.formData.levelTwo_classify=''
                  _this.levelTwoOptions=newArr
                }

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

</style>
