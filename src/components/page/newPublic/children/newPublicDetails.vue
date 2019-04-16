<template>
    <div>
      <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 最新舆情</el-breadcrumb-item>
              <el-breadcrumb-item>舆情下发</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="container">
        <div class="area-left">
          <div class="left-content">
            <p>事件分类</p>
            <div class="left-option">
              <div class="option-div">
                <span>一级分类</span>
                <el-select v-model="levelOne_classify" placeholder="请选择" style="width:65%;" @change="levelOneSel()">
                    <el-option
                      v-for="item in levelOneOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </div>
              <div class="option-div">
                <span>二级分类</span>
                <el-select v-model="levelTwo_classify" placeholder="请选择" style="width:65%;">
                    <el-option
                      v-for="item in levelTwoOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </div>
            </div>
          </div>

          <div class="left-content">
            <p>舆情性质</p>
            <div class="left-option">
              <div class="radio-div">
                <el-radio-group v-model="nature">
                   <el-radio :label="item.grade_id" :key="item.grade_id" v-for="item in natureRadioArr">{{item.grade_name}}</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>

          <div class="left-content">
            <p>处置部门</p>
            <div class="left-option">
              <div class="dispose-tree">
                <el-tree
                  :data="disposeData"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  ref="tree"
                  highlight-current
                  :check-strictly="true"
                  :default-checked-keys="disposeArr_check"
                  :props="defaultProps">
                </el-tree>
              </div>
            </div>
          </div>

          <div class="left-content">
            <p>抄送部门</p>
            <div class="left-option">
            </div>
          </div>

          <div class="left-content">
            <p>领导批示</p>
            <div class="left-option">
            </div>
          </div>

        </div>
        <div class="area-right">
          <p class="article-title" v-bind:title="articleObj.title">{{articleObj.title}}</p>
          <div class="article-annotation">
            <p>
              <span>信息来源:</span>
              <span>{{articleObj.source}}</span>
              <span>&nbsp;作者:</span>
              <span>{{articleObj.author}}</span>
              <span>&nbsp;发表时间:</span>
              <span>{{articleObj.publish_time | formatDate }}</span>
            </p>
            <p>
              <span>原文地址:</span>
              <a v-bind:title="articleObj.url" v-bind:href="articleObj.url" target="_blank" style="font-size:12px;color:#22457b;text-decoration: underline;">{{articleObj.url | readMore(50,'...')}}</a>
            </p>
          </div>

          <div class="article-content"  v-show='(articleObj.content).length>1000' style="max-height:170px;">

          </div>
          <div class="article-content"  v-show='(articleObj.content).length<=1000' style="max-height:2000px;">

          </div>

          <div class="fold-div" v-show='(articleObj.content).length>1000'>
            <div class="gradient-div" v-show='shadowVisible'></div>
            <span @click="toggleContent()">{{fold_word}}</span>
          </div>
          <div class="word_editor">
            <quill-editor ref="myTextEditor" v-model="word_content" :options="word_editorOption" @change="onEditorChangeWord($event)"></quill-editor>
          </div>

          <div class="department-watch">
            <span>部门互看：</span>
            <el-radio v-model="watch" label="1">是</el-radio>
            <el-radio v-model="watch" label="0">否</el-radio>
          </div>
          <div class="public-wipe">
            <span>舆情擦除：</span>
            <el-input v-model="wipe_num" :maxlength="100"  @keyup.native="proving"/>
            <span>&nbsp;天</span>
          </div>
          <div class="notification-way">
            <span>通知方式：</span>
            <el-checkbox-group v-model="notificationList" style="display:inline-block;">
              <el-checkbox label="短信" @change="noteChange()"></el-checkbox>
              <el-checkbox label="邮件" @change="emailChange()"></el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="short-note" v-show='noteVisible'>
            <p>短信通知</p>
            <el-input type="textarea" v-model="smsNotice"></el-input>
          </div>
          <div class="email_editor" v-show="emailVisible">
            <p>邮件通知</p>
            <el-input type="textarea" v-model="emailNotice"></el-input>
          </div>
        </div>
      </div>
      <div class="common-btns">
          <el-button type="primary" @click="saveCancel()">下发</el-button>
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
import { formatDate } from '@/util/date'
import { quillEditor } from 'vue-quill-editor'
export default {
    name: 'newPublicDetails',
    data() {
        return {
          levelOne_classify:'',
          levelOneOptions:[],
          levelTwo_classify:'',
          levelTwoOptions:[],
          nature:'',
          natureRadioArr:[],
          disposeArr_check:[],
          disposeData: [],
          defaultProps: {
            children: 'children',
            label: 'name'
          },
          watch:'0',
          wipe_num:'',
          notificationList:['短信','邮件'],
          word_content: '',   //富文本框内容
          word_editorOption: {
              placeholder:'',
              modules:{ toolbar:[ [{'font':[]}, {'size':[]}, {'color':[]}, 'bold','italic','underline',{'align':[]} ] ]}
          },
          noteVisible:true,
          emailVisible:true,
          articleObj:{
            'title':'',  //标题
            'source':'',  //信息来源
            'author':'',  //作者
            'publish_time':'',  //发表时间
            'url':'',  //原文地址
            'content':'' //正文
          },
          fold_word:'展开全文',
          shadowVisible:true,
          chknoticeEmail:1, //邮件打勾
          chknoticeSms:1, //短信打勾
          smsNotice:'',
          emailNotice:''
        }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      readMore: function (value,length,suffix) {
        if(value.length>length){
          return value.substr(0,length) + suffix
        }else{
          return value
        }
      }
    },
    components: {
        quillEditor
    },
    created() {
      this.newPublicDetailData()
      this.eventFlexData()
    },
    computed: {

    },
    mounted(){
      $(".quill-editor .ql-editor").height($(".quill-editor .ql-container").height())
    },
    methods: {
      //下发
      saveCancel(){
        let _this=this
        let treeArr=this.$refs.tree.getCheckedNodes()
        if(this.disposeData.length>0&&treeArr.length==0){
          this.$message({
            type: 'error',
            message: '请选择处置部门'
          })
        }else{
          let str=''
          let nameStr=''
          for(var i=0;i<treeArr.length;i++){
            str+=treeArr[i].id+','
            nameStr+=treeArr[i].name+','
          }

          axios.get('/api/v1/newest/article/down',{
              params:{
                grade:_this.nature,
                delaytime:'',
                // chknoticeEmail:_this.chknoticeEmail,
                // chknoticeSms:_this.chknoticeSms,
                chkid:1,
                send_email:_this.chknoticeEmail,
                send_sms:_this.chknoticeSms,
                content:_this.word_content,
                iframeUpload:'',
                questionid:'',
                mid:'',
                addmid:'',
                smsNotice:_this.smsNotice,
                emailNotice:_this.emailNotice,
                ids:str.substr(0,str.length-1),
                one_level:_this.levelOne_classify,
                two_level:_this.levelTwo_classify,
                names:nameStr.substr(0,nameStr.length-1),
                artId:_this.$route.query.articleId,
                menuStatus:'',
                traceLook:_this.watch
              }
            }).then(function (response) {
              _this.$message({
                type: 'success',
                message: '下发成功'
              });
              _this.$router.push({ path: 'publicOpinion'})
          }).catch(function (error) {
            if(error.response.data.errorCode=='7' || error.response.data.errorCode=='8' ){
              window.sessionStorage.removeItem('access_token', '')
              _this.$router.push({ path: 'login'})
            }else{
              _this.$message({
                type: 'error',
                message: error.response.data.errorMessage || error.response.data.message
              });
            }
          })
        }

      },
      //取消
      editCancel(){
        this.$router.push({ path: 'newPublic'})
      },
      //最新舆情详情
      newPublicDetailData(){
        let _this=this
        axios.get('/api/v1/newest/article/detail',{
            params:{
              articleId:this.$route.query.articleId
            }
          }).then(function (response) {

            let obj=response.data.data
            let radioArr=obj.grade
            _this.articleObj.title=obj.art.articleTitle
            _this.articleObj.source=obj.art.articleForm
            _this.articleObj.author=obj.art.articleAuthor
            _this.articleObj.publish_time=obj.art.createdAt
            _this.articleObj.url=obj.art.articleUrl
            _this.articleObj.content=obj.art.articleContent
            $(".article-content").html(obj.art.articleContent)
            _this.natureRadioArr=obj.grade
            _this.nature=radioArr[0].grade_id
            _this.disposeData=obj.dept //处置部门

        }).catch(function (error) {
          if(error.response.data.errorCode=='7' || error.response.data.errorCode=='8' ){
            window.sessionStorage.removeItem('access_token', '')
            _this.$router.push({ path: 'login'})
          }else{
            _this.$message({
              type: 'error',
              message: error.response.data.errorMessage || error.response.data.message
            });
          }
        })
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
                obj.value=arr[i].id+','+arr[i].one_level
                obj.label=arr[i].one_level
                newArr.push(obj)
              }
            }
            _this.levelOne_classify=arr[0].one_level
            _this.levelOneOptions=newArr
            _this.levelOneSel(arr[0].id)
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
      levelOneSel(id){
        let _this=this
        let strs=this.levelOne_classify
        let arrs=strs.split(",")
        let leveloneId=''
        if(arrs.length==1){
          leveloneId=id
        }else{
          leveloneId=arrs[0]
          this.levelOne_classify=arrs[1]
        }
        axios.get('/api/v1/sys/event/classify/two/level',{
            params:{
              one_level_id:leveloneId
            }
          }).then(function (response) {
            let arr=response.data.data
            let newArr=[]
            if(arr.length>0){
              for(var i=0;i<arr.length;i++){
                let obj={}
                obj.value=arr[i].two_level
                obj.label=arr[i].two_level
                newArr.push(obj)
              }
            }
            _this.levelTwo_classify=arr[0].two_level
            _this.levelTwoOptions=newArr


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
      onEditorChangeWord({ editor, html, text }) {
          // console.log(this.word_content)
      },
      //短信
      noteChange(){
        if(this.noteVisible=='0'){
          this.noteVisible=true
          this.chknoticeSms=1
        }else{
          this.noteVisible=false
          this.chknoticeSms=0
        }
      },
      //邮箱
      emailChange(){
        if(this.emailVisible=='0'){
          this.emailVisible=true
          this.chknoticeEmail=1
        }else{
          this.emailVisible=false
          this.chknoticeEmail=0
        }
      },
      toggleContent(){
        if(this.fold_word=='展开全文'){
          this.fold_word='收起全文'
          this.shadowVisible=false
          $(".article-content").css('max-height','100000px')
        }else if(this.fold_word=='收起全文'){
          this.fold_word='展开全文'
          this.shadowVisible=true
          $(".article-content").css('max-height','170px')
        }
      },
      proving() {
        this.wipe_num = this.wipe_num.replace(/[^\.\d]/g,'');
        this.wipe_num = this.wipe_num.replace('.','');
        this.wipe_num = this.wipe_num.substring(0,3);
        if(this.wipe_num=='0'||this.wipe_num=='00'||this.wipe_num=='000'){
          this.wipe_num=''
        }
      }


    }
}

</script>

<style scoped>
.area-left{
  width:27%;
  position:fixed;
  right:18px;
  top:100px;
  width:20%;
}
.area-right{
  width:69%;
  margin:0 2% 60px 2%;
  float:left;
}
.left-content{
  width:100%;
  border-left:solid 1px #dddddf;
  border-bottom:solid 1px #dddddf;
  border-right:solid 1px #dddddf;
}
.left-content>p{
  width:100%;
  height:30px;
  line-height:30px;
  text-indent:20px;
  border-bottom:solid 1px #dddddf;
  color:#464d67;
  font-size:14px;
  font-weight:bold;
  background:#f1f2f4;
}
.left-content .option-div{
  margin:6px 0 6px 20px;
}
.left-content .option-div span{
  font-size:14px;
}
.radio-div{
  width:100%;
  padding:6px 0;
  text-align:center;
}
.dispose-tree{
  padding-left:10px;
  max-height:170px;
  min-height:40px;
  overflow:auto;
}

.dispose-tree .el-tree-node__label{
  font-size:12px;
}
.article-title{
  color: #343434;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
  padding: 0 30%;
  font-size: 20px;
  height: 25px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.article-annotation{
  width:100%;
  border:solid 1px #dedde2;
  background:#f1f2f4;
  margin:0 5px;
}
.article-annotation span{
  font-size:12px;
  color:#a7a7a9;
}
.article-annotation p{
  margin:5px 0px 5px 20px;
}
.article-content{
  font-size:14px;
  color:#333333;
  margin:10px;
  max-height:2000px;
  overflow:hidden;
  text-indent:2em;
}
.department-watch,.notification-way,.public-wipe{
  width:100%;
  margin:10px;
  padding-left:20px;
}
.public-wipe{
  /* display:flex; */
  display:none;
}
.public-wipe .el-input{
  width:108px;
  vertical-align: middle;
  margin-left:3px;
}
.public-wipe span{
  font-size:14px;
  color:#464d67;
  vertical-align: middle;
  display: inline-block;
  line-height: 30px;
}
.department-watch span,.notification-way span{
  font-size:14px;
  color:#464d67;
}
.department-watch .el-radio{
  width:50px;
}
.notification-way .el-checkbox{
  width:56px;
}
.short-note{
  margin:10px;
  text-indent:20px;
}
.short-note>p{
  width:100%;
  height:36px;
  line-height:36px;
  color:#333;
  font-weight:bold;
  border:solid 1px #edf0f5;
  background: #f1f2f4;
  font-size:14px;
  border-radius:4px 4px 0 0;
}
.short-note .el-textarea__inner{
  border-radius:0px;
}
.word_editor{
  margin:10px;
}
.email_editor{
  margin:20px 10px 10px 10px;
  text-indent:20px;
}
.email_editor>p{
  width:100%;
  height:36px;
  line-height:36px;
  color:#333;
  font-weight:bold;
  border:solid 1px #edf0f5;
  background: #f1f2f4;
  font-size:14px;
  border-radius:4px 4px 0 0;
}
.fold-div{
  width:100%;
  margin:10px 0;
  text-align:center;
  height:30px;
  position:relative;
}
.gradient-div{
  position:absolute;
  left:0px;
  top:-94px;
  background:url('/static/img/main/jianbian.png') repeat-x;
  margin:0px 10px 0 10px;
  height:90px;
  z-index:2;
  width:100%;
}
.fold-div span{
  width:60px;
  height:26px;
  line-height:26px;
  text-align:center;
  display:inline-block;
  border:solid 1px #dddee1;
  background:#fff;
  font-size:12px;
  color:#606266;
  border-radius:3px;
  cursor:pointer;
}

</style>
