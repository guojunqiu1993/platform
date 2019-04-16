<template>
    <div>
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>舆情交流</el-breadcrumb-item>
              <el-breadcrumb-item>上报详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="container">
          <div class="admin-container">
            <div class="admin-left">
              <div class="admin-icon"><i class="iconfont icon-yonghu2"></i></div>
              <p v-bind:title="adminObj.accountName">{{adminObj.accountName}}</p>
              <!-- <p>{{adminObj.people}}</p> -->
            </div>
            <div class="admin-right">
              <div class="article-department">
                <span>下发部门:</span>
                <span>{{adminObj.issueDepartment}}</span>
                <span>&nbsp;&nbsp;下发时间:</span>
                <span>{{adminObj.issueTime}}</span>
              </div>
              <p class="article-title" v-bind:title="adminObj.title">{{adminObj.title}}</p>
              <div class="article-source">
                <span>信息来源:</span>
                <span>{{adminObj.messageSource}}</span>
                <span>&nbsp;&nbsp;作者:</span>
                <span>{{adminObj.author}}</span>
                <span>&nbsp;&nbsp;发现时间:</span>
                <span>{{adminObj.foundTime}}</span>
              </div>

              <div class="article-content"  v-show='(adminObj.contentHover).length>1000' style="max-height:170px;">
                {{adminObj.content}}
              </div>
              <div class="article-content"  v-show='(adminObj.contentHover).length<=1000' style="max-height:2000px;">
                {{adminObj.content}}
              </div>
              <div class="fold-div" v-show='(adminObj.contentHover).length>1000'>
                <div class="gradient-div" v-show='shadowVisible'></div>
                <span @click="toggleContent()">{{fold_word}}</span>
              </div>
              <p class="article-url">
                <span>链接地址:</span>
                <a v-bind:title="adminObj.url" v-bind:href="adminObj.url" target="_blank" style="color:#22457b;text-decoration: underline;">{{adminObj.url | readMore(50,'...')}}</a>
              </p>
            </div>
          </div>

          <div class="correlation-parent" v-for = "(item,index) in replyArr">
            <div class="correlation-container" style="position:relative;">
              <div style="position:absolute;width:100px;height:100%;border-right:solid 1px #dedde2;background:#f2f2f2;">
                  <div class="correlation-left">
                    <div class="admin-icon"><i class="iconfont icon-yonghu2"></i></div>
                    <p v-bind:title="item.loginName">{{item.loginName}}</p>
                  </div>
              </div>
              <div class="correlation-right">
                <div class="correlation-department">
                  <span>回复部门:</span>
                  <span>{{item.deptName}}</span>
                  <span>&nbsp;&nbsp;回复时间:</span>
                  <span>{{item.created_at}}</span>
                  <i class="iconfont icon-shanchu" @click="delReply(item.bbspost_id)"></i>
                </div>
                <div class="correlation-content">
                  <div v-html='item.bbspost_content' class="content-filter"></div>
                </div>
              </div>
              <div style="clear:both"></div>
            </div>
          </div>

          <div class="word_editor">
            <quill-editor ref="myTextEditor" v-model="word_content" :options="word_editorOption" @change="onEditorChangeWord($event)"></quill-editor>
          </div>


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
import { formatDate } from '@/util/date'
import { quillEditor } from 'vue-quill-editor'
export default {
    name: 'publicOpinionDetails',
    data() {
        return {
          word_content: '',   //提示语富文本框内容
          word_editorOption: {
              placeholder: '',
              modules:{ toolbar:[ [{'font':[]}, {'size':[]}, {'color':[]}, 'bold','italic','underline',{'align':[]} ] ]}
          },

          shadowVisible:true,
          fold_word:'展开全文',
          //回复部门
          replyArr:[],

          //管理员
          adminObj:{
            'accountName':'',
            'issueDepartment':'',
            'issueTime':'',
            'title':'',
            'messageSource':'',
            'author':'',
            'foundTime':'',
            'content':'',
            'url':'',
            'contentHover':''
          }

        }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      read(val){//val就是以获取的msg的值
        return val.replace(/<[^>]*>/g).replace(/undefined/g, "");//去除文字的<...></...>标签
      },
      readMore: function (value,length,suffix) {
        if(value.length>length){
          return value.substr(0,length) + suffix
        }else{
          return value
        }
      }
    },
    created() {
      this.detailsData()
    },
    components: {
        quillEditor
    },
    mounted(){
      $(".quill-editor .ql-editor").height($(".quill-editor .ql-container").height())
    },
    methods: {
      //详情数据
      detailsData(){
        let _this=this
        axios.get('/api/v1/article/exchange/audit/detail',{
            params:{
              bbstopic_id:this.$route.query.bbstopic_id
            }
          }).then(function (response) {
            let data=response.data.data
            _this.adminObj.accountName=data.result.loginName
            _this.adminObj.issueDepartment=data.result.dept_name//下发部门
            _this.adminObj.issueTime=data.result.created_at//下发时间
            _this.adminObj.title=data.result.bbstopic_title //文章标题
            _this.adminObj.foundTime=data.result.created_at //文章发现时间
            let contontStr=data.result.bbstopic_content //内容 在悬浮title只显示汉字
            // _this.adminObj.contentHover=contontStr.match(/[\u4e00-\u9fa5]/g).join("") //内容
            $(".article-content").html(data.result.bbstopic_content)
            _this.adminObj.contentHover=$(".article-content").text()
            _this.adminObj.messageSource=data.result.bbstopic_from   //来源
            _this.adminObj.url=data.result.bbstopic_url //链接
            _this.adminObj.author= data.result.bbstopic_author   //作者
            _this.replyArr=data.huifu //回复

            _this.$nextTick(() => {
              let height=$(".wrapper .admin-container .admin-right").height()
              $(".wrapper .admin-container .admin-left").height(height)
              $(".wrapper .admin-container").height(height)
            })

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
      //保存
      saveCancel(){
        let _this=this
        if(this.word_content==''){
          this.$message({
            type: 'error',
            message: '回复内容不能为空'
          });
        }else{
          axios.get('/api/v1/article/exchange/audit/submit',{
              params:{
                bbstopic_id:this.$route.query.bbstopic_id,
                content:this.word_content
              }
            }).then(function (response) {
              _this.$message({
                type: 'success',
                message: '保存成功'
              });
              _this.$router.push({ path: 'auditReport'})

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

      },
      //取消
      addCancel(){
        this.$router.push({ path: 'auditReport'})
      },
      onEditorChangeWord({ editor, html, text }) {
          // console.log(this.word_content)
      },
      //回复部门-点击删除
      delReply(id){
        // let el = event.currentTarget;
        // $(el).parent().next().children().text('该回复已删除')
        let _this=this
        this.$confirm('此操作将会删除回复内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/v1/article/exchange/audit/reply/del',{
              params:{
                bbspost_id:id
              }
            }).then(function (response) {
               _this.detailsData()
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
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消'
          });
        });


      },
      toggleContent(){
        if(this.fold_word=='展开全文'){
          this.fold_word='收起全文'
          this.shadowVisible=false
          $(".article-content").css('max-height','1000000000px')
          let height=$(".wrapper .admin-container .admin-right").height()
          $(".wrapper .admin-container .admin-left").height(height)
          $(".wrapper .admin-container").height(height)
        }else if(this.fold_word=='收起全文'){
          this.fold_word='展开全文'
          this.shadowVisible=true
          $(".article-content").css('max-height','170px')
          let height=$(".wrapper .admin-container .admin-right").height()
          $(".wrapper .admin-container .admin-left").height(height)
          $(".wrapper .admin-container").height(height)
        }
      }

    }
}
</script>
<style scoped>
  .admin-container{
    width:70%;
    margin:20px 15%;
    border:solid 1px #dedde2;
    border-radius:3px;
  }
  .admin-left{
    width:100px;
    border-right:solid 1px #dedde2;
    background:#f2f2f2;
    float:left;
  }
  .admin-icon{
    width:30px;
    height:30px;
    line-height:30px;
    text-align:center;
    border-radius:30px;
    background:#d8dbe2;
    margin:0px auto;
    margin-top:10px;
  }
  .admin-icon i{
    color:#fff;
  }
  .admin-left p{
    width: 90%;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #393939;
    font-size: 14px;
    margin-left: 5%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .admin-left p:nth-of-type(1){
    margin-top:10px;
  }
  .admin-right{
    width:calc(100% - 101px);
    float:right;
  }
  .article-department{
    width:100%;
    height:30px;
    line-height:30px;
    border-bottom:solid 1px #dedde2;
  }
  .article-department span{
    font-size:12px;
    color:#8d98b4;
  }
  .article-department span:nth-of-type(1){
    margin-left:8px;
  }

  .article-title{
    width:80%;
    height:20px;
    line-height:20px;
    text-indent:8px;
    color:#333333;
    font-size:16px;
    font-weight:bold;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    margin:7px 0 7px 5px;
  }
  .article-source{
    padding:0 8px 0 8px;
    height:24px;
    line-height:24px;
    border:solid 1px #dedee0;
    background:#f1f3f2;
    color:#888888;
    font-size:12px;
    margin:0 10px;
  }
  .article-source span:nth-of-type(1){
    margin-left:5px;
  }
  .article-content{
    color:#404040;
    /* height:50px; */
    font-size:14px;
    text-indent:2em;
    padding:8px;
    /* display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3; */
    overflow: hidden;
    max-height:2000px;
  }
  .article-url{
    padding:10px 8px 10px 6px;
    font-size:12px;
    color:#989898;
    text-indent:2em;
    height:20px;
  }



  .correlation-parent{
    margin-bottom:20px;
  }
  .correlation-container{
    width:70%;
    margin:0 15% 0 15%;
    border:solid 1px #dedde2;
    border-bottom:none;
  }
  .correlation-container:first-of-type{
    border-radius:3px 3px 0px 0px;
  }
  .correlation-container:last-of-type{
    border-bottom:solid 1px #dedde2;
    border-radius:0px 0px 3px 3px;
  }
  .correlation-left{
    width:100px;
    border-right:solid 1px #dedde2;
    background:#f2f2f2;
    float:left;
  }
  .correlation-icon{
    width:30px;
    height:30px;
    line-height:30px;
    text-align:center;
    border-radius:30px;
    background:#d8dbe2;
    margin:0px auto;
    margin-top:10px;
  }
  .correlation-icon i{
    color:#fff;
  }
  .correlation-left p{
    width:90%;
    margin-left:5%;
    height:20px;
    line-height:20px;
    text-align:center;
    color:#393939;
    font-size:14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .correlation-left p:nth-of-type(1){
    margin-top:10px;
  }
  .correlation-right{
    width:calc(100% - 101px);
    float:right;
    min-height:150px;
  }
  .correlation-department{
    width:100%;
    height:30px;
    line-height:30px;
    border-bottom:solid 1px #dedde2;
  }
  .correlation-department span{
    font-size:12px;
    color:#8d98b4;
  }
  .correlation-department span:nth-of-type(1){
    margin-left:8px;
  }
  .content-filter{
    margin-top:5px;
    margin-bottom:5px;
    margin-left:10px;
    margin-right:10px;
    /* max-height:108px;
    overflow:hidden; */
  }


  .word_editor{
    margin:15px 15%;
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
