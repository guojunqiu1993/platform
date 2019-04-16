  <template>
    <div>
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>舆情处置</el-breadcrumb-item>
              <el-breadcrumb-item>处置详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="container">
          <div class="flow-container">
            <div class="steps-items">
              <span v-show="progressArr.length>0">未受理</span>
              <span v-show="progressArr.length>0">办理中</span>
              <span v-show="progressArr.length>0">待审核</span>
              <span v-show="progressArr.length>0">已办结</span>
            </div>
            <div class="steps-container" v-for = "(item,index) in progressArr" v-show="progressArr.length>0">
              <div style="margin:20px 0;" v-show='item.msg_status>=0'>
                <span style="float:left;" class="flow-title" v-bind:title="item.dept_name">{{item.dept_name}}</span>
                <el-steps :active="item.msg_status+1" align-center>
                  <el-step title=""></el-step>
                  <el-step title=""></el-step>
                  <el-step title=""></el-step>
                  <el-step title=""></el-step>
                </el-steps>
              </div>
            </div>
          </div>
          <div class="admin-container">
            <div class="flow-shift" @click="shiftUp()" v-show="shiftState">
                <i class="iconfont icon-arrow-up"></i>
            </div>
            <div class="flow-shift" @click="shiftDown()" v-show="!shiftState">
                <i class="iconfont icon-arrow-down"></i>
            </div>
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
                <span>{{adminObj.issueTime  | formatDate}}</span>
                <el-button type="primary" @click="removeSetClick()">移除下发</el-button>
                <el-button type="primary" @click="addSetClick()">追加下发</el-button>
                <el-button type="primary" @click="opinionAddtion()">追加舆情</el-button>
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

              </div>
              <div class="article-content"  v-show='(adminObj.contentHover).length<=1000' style="max-height:2000px;">

              </div>
              <div class="fold-div" v-show='(adminObj.contentHover).length>1000'>
                <div class="gradient-div" v-show='shadowVisible'></div>
                <span @click="toggleContent()">{{fold_word}}</span>
              </div>


              <p class="article-url">
                <span>链接地址:</span>
                <!-- <span>{{adminObj.url}}</span> -->
                <a v-bind:title="adminObj.url" v-bind:href="adminObj.url" target="_blank" style="color:#22457b;text-decoration: underline;">  {{adminObj.url | readMore(50,'...')}}</a>
              </p>

              <!-- 追加信息 -->
              <div class="add-message" v-for = "(item,index) in adminObj.addMessage" v-show="(adminObj.addMessage).length>0">
                <div class="addMessage-item">
                    <div class="addMessage-del">
                      <span>{{adminObj.admins}}:</span>
                      <span>{{item.article_time}}</span>
                    </div>
                    <div class="addMessage-title">
                      <span>【追加舆情】</span>
                      <span v-bind:title="item.article_title">{{item.article_title}}</span>
                    </div>
                    <div class="addMessage-url">
                      <span>链接地址:</span>
                      <a v-bind:title="item.article_url" v-bind:href="item.article_url" target="_blank">{{item.article_url | readMore(50,'...')}}</a>
                    </div>
                </div>
              </div>

              <div class="article-dispose">
                <p><span>处理部门:&nbsp;</span><span>{{adminObj.disposeDepartment}}</span></p>
                <p><span>舆情分类:&nbsp;</span><span>{{adminObj.publicFlex}}</span></p>
                <p>
                  <span>舆情性质:&nbsp;</span>
                  <span v-show="adminObj.publicNature==6">一般</span>
                  <span v-show="adminObj.publicNature==7">较大</span>
                  <span v-show="adminObj.publicNature==8">重大</span>
                </p>
              </div>

            </div>
          </div>

          <div class="correlation-parent" v-for = "(item,index) in replyArr">
            <div class="correlation-container" style="position:relative;">
              <div class="correlation-left">
                <div style="position:absolute;width:100px;height:100%;border-right:solid 1px #dedde2;background:#f2f2f2;">
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
                  <i class="iconfont icon-shanchu" @click="delReply(item.trace_id)" v-show="item.trace_content!='该回复已删除'"></i>
                </div>


                <div class="correlation-content">
                  <div class="content-filter" v-html='item.trace_content'></div>
                </div>
              </div>
              <div style="clear:both"></div>
            </div>
          </div>

          <div class="word_editor">
            <quill-editor ref="myTextEditor" v-model="word_content" :options="word_editorOption" @change="onEditorChangeWord($event)"></quill-editor>
          </div>
          <div class="department-reply">
            <span>回复部门：</span>
            <el-radio-group v-model="reply">
               <el-radio :label="item.dept_id" :key="item.dept_id" v-for="item in replyRadioArr">{{item.dept_name}}</el-radio>
            </el-radio-group>

          </div>


          <div class="department-check" v-show='adminObj.status==2||adminObj.status==3'>
            <span>审核结果：</span>
            <el-radio v-model="check" label="1">退回</el-radio>
            <el-radio v-model="check" label="3">确认办结</el-radio>
          </div>

          <div class="notification-way">
            <span>通知方式：</span>
            <el-checkbox-group v-model="notificationList" style="display:inline-block;">
              <el-checkbox label="短信" @change="noteChange()"></el-checkbox>
            </el-checkbox-group>
          </div>

          <div class="short-note" v-show='noteVisible'>
            <p>短信通知</p>
            <el-input type="textarea" v-model="messageContent"></el-input>
          </div>

        </div>
        <div class="common-btns">
          <el-button type="primary" @click="saveCancel('formData')">保存</el-button>
          <el-button @click="addCancel()">取消</el-button>
        </div>


        <!--追加下发  模态框-->
        <el-dialog title="追加下发" :visible.sync="addSetVisible">
          <div style="max-height:200px;overflow:auto;">
            <el-tree
              :data="addSetData"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :check-strictly="true"
              :props="defaultProps">
            </el-tree>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetAddSet()">重置</el-button>
            <el-button type="primary" @click="confirmAddSet()">确 定</el-button>
          </div>
        </el-dialog>

        <!--移除下发  模态框-->
        <el-dialog title="移除下发" :visible.sync="removeSetVisible">
          <div style="max-height:200px;overflow:auto;">
            <el-checkbox-group v-model="removeSelectArr">
              <el-checkbox v-for="item in removeSetArr" :label="item.dept_id" :key="item.dept_id" style="display:block;margin-left:0px;margin-bottom:7px;">{{item.dept_name}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetRemoveSet()">重置</el-button>
            <el-button type="primary" @click="confirmRemoveSet()">确 定</el-button>
          </div>
        </el-dialog>

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
              placeholder:'',
              modules:{ toolbar:[ [{'font':[]}, {'size':[]}, {'color':[]}, 'bold','italic','underline',{'align':[]} ] ]}
          },
          reply:'',
          replyRadioArr:[],
          check:'1',
          notificationList:['短信'],
          chknoticeSms:1,
          shiftState:true,
          noteVisible:true,
          shadowVisible:true,
          fold_word:'展开全文',
          messageContent:'',
          //进度条
          progressArr:[],
          //回复部门
          replyArr:[],
          //管理员
          adminObj:{
            'accountName':'admin',
            'people':'',
            'issueDepartment':'',
            'issueTime':'',
            'title':'',
            'messageSource':'',
            'author':'',
            'foundTime':'',
            'content':'',
            'contentHover':'',
            'url':'',
            'disposeDepartment':'',
            'publicFlex':'',
            'publicFlexOne':'',
            'publicNature':'',
            // 追加下发-数组
            'addMessage':[],
            'admins':'',  //管理员部门+admin
            'status':'' //舆情状态
          },

          addSetVisible:false,   //追加下发-模态框
          //追加下发-树图
          addSetData: [],
          defaultProps: {
            children: 'children',
            label: 'name'
          },
          mid:'',
          removeSetVisible:false,  //移除下发
          removeSetArr:[],  //移除部门
          removeSelectArr:[] //点击确定按钮  查看勾选的部门
        }
    },
    filters: {
      formatDate(time) {
          let date = new Date(time)
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
      this.detailData()
    },
    mounted(){
      $(".quill-editor .ql-editor").height($(".quill-editor .ql-container").height())
    },
    components: {
        quillEditor
    },
    methods: {
      //详情数据加载
      detailData(){
        let _this=this
        axios.get('/api/v1/mng/article/deal/detail',{
            params:{
              article_id:_this.$route.query.article_id,
              deptid:_this.$route.query.dept_id,
              msg_id:_this.$route.query.msg_id,
              type:'cz'
            }
          }).then(function (response) {
             let data=response.data.data
             let depts=data.result.depts
             _this.progressArr=depts//进度条
             //处理部门
             let disposeStr=''
             let deptId=''
             let disposeAllObj={}
             let deptIds=''
             for(var i=0;i<depts.length;i++){
                 disposeStr+=depts[i].dept_name+'、'
                 deptId+=depts[i].dept_id+','
             }
             _this.adminObj.disposeDepartment=disposeStr.substr(0,disposeStr.length-1)
             _this.replyRadioArr=depts
             deptIds=deptId.substr(0,deptId.length-1)
             disposeAllObj={'dept_id':deptIds,'dept_name':'全部'}
             if(depts.length>1){
               _this.replyRadioArr.unshift(disposeAllObj)
               _this.reply=deptIds
             }else{
               _this.reply=depts[0].dept_id
             }

            _this.adminObj.author= data.result.article_author   //作者

            _this.adminObj.content= data.result.article_content  //内容

            _this.adminObj.title=data.result.article_title //文章标题

            _this.adminObj.foundTime=data.result.article_time //文章发现时间
            $(".article-content").html(data.result.article_content)
            _this.adminObj.contentHover=$(".article-content").text()


            _this.adminObj.messageSource=data.result.article_form   //来源

            _this.adminObj.url=data.result.article_url
            _this.adminObj.accountName= data.result.loginName//下发账号
            _this.adminObj.issueTime=data.result.created_at//下发时间
            _this.adminObj.issueDepartment=data.result.dept_name//下发部门
            _this.adminObj.publicNature=data.result.grade//舆情性质 6一般 7较大 8重大
            _this.adminObj.publicFlex=data.result.two_level//舆情分类 （二级分类）
            _this.adminObj.publicFlexOne=data.result.one_level//舆情分类 （一级分类）
            _this.adminObj.status=data.result.msg_status //舆情状态
            _this.replyArr=data.huifu //回复

            _this.adminObj.addMessage=data.result.appendList  //追加下发
            _this.adminObj.admins=data.result.dept_name+"+"+data.result.loginName

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
        if(this.word_content==''){
          this.$message({
            type: 'error',
            message: '回复内容不能为空'
          });
        }else{
          let _this=this
          let checks=''
          if(_this.adminObj.status=='0'||_this.adminObj.status=='1'){
            checks=_this.adminObj.status
          }else{
            checks=_this.check
          }
          axios.get('/api/v1/mng/article/deal/detail/submit',{
              params:{
                article_id:this.$route.query.article_id, //文章id
                content:this.word_content,  //回复内容
                is_save:checks,        //审核结果
                is_sync:'',
                msg_id:this.$route.query.msg_id,
                artWeight:checks,
                file_mid:'',     //mid
                ids:this.reply,                 //回复部门
                chknoticeSms:this.chknoticeSms,  //短信
                smsNotice:this.messageContent, //短信内容
                deptid:this.$route.query.dept_id
              }
            }).then(function (response) {
               _this.$message({
                 type: 'success',
                 message: '保存成功'
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

      },
      //取消
      addCancel(){
        this.$router.push({ path: 'publicOpinion'})
      },
      onEditorChangeWord({ editor, html, text }) {
          // console.log(this.word_content)
      },
      //点击进度条-小按钮  收起
      shiftUp(){
          $(".flow-container").css('height', '0px');
          this.shiftState=false
      },
      //点击进度条-小按钮 展开
      shiftDown(){
          $(".flow-container").css('height', 'auto');
          this.shiftState=true
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
      //追加舆情
      opinionAddtion(){
        this.$router.push({ path: 'publicOpinionAddtion', query: {
            'article_id': this.$route.query.article_id,
            'dept_id':this.$route.query.dept_id,
            'msg_id':this.$route.query.msg_id
          }
        })
      },
      //回复部门-点击删除
      delReply(id){
        let _this=this
        this.$confirm('此操作将会清空回复内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/v1/mng/article/deal/reply/del',{
              params:{
                trace_id:id
              }
            }).then(function (response) {
               _this.detailData()
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

      //追加下发数据
      addSetList(){
        let _this=this
        axios.get('/api/v1/mng/article/deal/append',{
            params:{
              articleId:this.$route.query.article_id //文章id
            }
          }).then(function (response) {
            let arr=response.data.data.deptTree
            _this.addSetData=arr
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
      //追加下发
      addSetClick(){
        let _this=this
        this.addSetVisible=true
        this.addSetList()
        //如果追加下发有部门,先清空树的勾选状态
        setTimeout(function(){
          _this.$refs.tree.setCheckedKeys([]);
        },1000)
      },
      //重置追加下发
      resetAddSet(){
        this.$refs.tree.setCheckedKeys([]);
      },
      //追加下发 -确定
      confirmAddSet(){
        let _this=this
        let treeArr=this.$refs.tree.getCheckedNodes()
        if(treeArr.length==0){
          this.$message({
            type: 'error',
            message: '请勾选需要下发的部门'
          });
        }else{
          let str=''
          let nameStr=''
          for(var i=0;i<treeArr.length;i++){
            str+=treeArr[i].id+','
            nameStr+=treeArr[i].name+','
          }
          axios.get('/api/v1/newest/article/down',{
              params:{
                grade:_this.adminObj.publicNature,
                delaytime:'',
                chknoticeEmail:1,
                chknoticeSms:1,
                chkid:1,
                send_email:1,
                send_sms:1,
                content:'',
                iframeUpload:'',
                questionid:'',
                mid:'',
                addmid:'',
                smsNotice:'',
                emailNotice:'',
                ids:str.substr(0,str.length-1),
                one_level:_this.adminObj.publicFlexOne,
                two_level:_this.adminObj.publicFlex,
                names:nameStr.substr(0,nameStr.length-1),
                artId:_this.$route.query.article_id,
                menuStatus:''
              }
            }).then(function (response) {
              _this.addSetVisible=false
              _this.$message({
                type: 'success',
                message: '追加下发成功'
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
      },

      //移除下发数据
      removeData(){
        let _this=this
        axios.get('/api/v1/mng/article/deal/del',{
            params:{
              article_id:this.$route.query.article_id //文章id
            }
          }).then(function (response) {
            let arr=response.data.data.deptList
            _this.removeSetArr=arr
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
      //移除下发点击
      removeSetClick(){
        this.removeSetVisible=true
        //如果移除下发部门有的话，清空多选框
        this.removeSelectArr=[]
        this.removeData()
      },
      //移除下发重置
      resetRemoveSet(){
        this.removeSelectArr=[]
      },
      //移除下发确定
      confirmRemoveSet(){
        let _this=this
        let ids=''
        let arr=this.removeSelectArr
        for(var i=0;i<arr.length;i++){
          ids+=arr[i]+','
        }
        if(arr.length>0){
          axios.get('/api/v1/mng/article/deal/del/submit',{
              params:{
                'article_id':this.$route.query.article_id, //文章id
                'ids':ids.substr(0,ids.length-1)
              }
            }).then(function (response) {
              _this.removeSetVisible=false
              _this.$message({
                type: 'success',
                message: '移除下发成功'
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
        }else{
          _this.$message({
            type: 'error',
            message: '请选择要移除的部门!'
          });
        }

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
  .flow-container{
    padding:0 20%;
    border-bottom:solid 1px #dedde2;
    background:#f1f2f4;
    position:relative;
    overflow:hidden;
  }
  .steps-items{
    margin:20px 0 15px 80px;
    display: flex;
  }
  .steps-items span{
    flex-basis: 25%;
    text-align: center;
    font-size:14px;
  }

  .flow-title{
    float:left;
    display:inline-block;
    width:80px;
    border:solid 1px #dedde2;
    font-size:14px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    text-align:center;
  }
  .flow-shift{
    width:24px;
    height:24px;
    line-height:24px;
    border-radius:24px;
    background:#fff;
    position:absolute;
    left:50%;
    top:-34px;
    text-align:center;
    -webkit-box-shadow: rgba(86,143,253,0.6) 0px 0px 20px;
    -moz-box-shadow: rgba(86,143,253,0.6) 0px 0px 20px;
    box-shadow: rgba(86,143,253,0.6) 0px 0px 20px;
    cursor:pointer;
    z-index:1;
  }
  .flow-container .flow-shift i{
    color:#4183f3;
  }
  .admin-container{
    width:70%;
    margin:20px 15%;
    border:solid 1px #dedde2;
    border-radius:3px;
    /* height:320px; */
    position:relative;
  }
  .admin-left{
    width:100px;
    /* height:320px; */
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
    /* height:320px; */
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
  .article-department .el-button{
    float:right;
    margin-top:5px;
    margin-right:5px;
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
    max-height:2000px;
    overflow: hidden;
  }
  .article-url{
    padding:10px 8px 10px 6px;
    font-size:12px;
    color:#989898;
    text-indent:2em;
  }
  .article-dispose{
    background:#fffbe5;
    border-top:solid 1px #dedee0;
    padding:5px 8px;
  }
  .article-dispose p{
    text-indent:2em;
    color:#e0433c;
    font-size:12px;
    margin:6px 0;
  }


  .correlation-parent{
    margin-bottom:20px;
  }
  .correlation-container{
    width:70%;
    margin:0 15% 0 15%;
    border:solid 1px #dedde2;
    /* height:150px; */
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
    /* height:150px; */
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
    margin-left:10px;
    margin-right:10px;
    margin-bottom:5px;
    /* max-height:108px;
    overflow:hidden; */
  }


  .word_editor{
    margin:15px 15%;
  }
  .department-reply{
    margin:15px 15%;
    font-size:14px;
  }
  .department-reply .el-radio{
    margin-right:2px;
  }
  .department-check{
    margin:15px 15%;
    font-size:14px;
  }
  .department-check .el-radio{
    width:50px;
  }
  .notification-way{
    margin:15px 15%;
    font-size:14px;
  }
  .notification-way .el-checkbox{
    width:56px;
  }
  .short-note{
    margin:15px 15%;
    text-indent:15px;
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

  /* 追加舆情 */
  .add-message .addMessage-item{
    border-top:solid 1px #dedde2;
    margin:0 20px;
  }
  .add-message .addMessage-del,.add-message .addMessage-url{
    font-size:12px;
    margin:5px 10px;
  }
  .add-message .addMessage-title{
    font-size:12px;
    margin:5px 6px;
  }
  .add-message .addMessage-del span{
    color:#7d7d7d;
  }
  .add-message .addMessage-title span:nth-of-type(1){
    color:#448afc;
  }
  .add-message .addMessage-title span:nth-of-type(2){
    color:#333;
    display: inline-block;
    width:240px;
    height:18px;
    vertical-align: middle;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
  }
  .add-message .addMessage-url span:nth-of-type(1){
    color:#989898;
    margin-left:72px;
  }
  .add-message .addMessage-url a{
    color:#22457b;
    text-decoration: underline;
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
