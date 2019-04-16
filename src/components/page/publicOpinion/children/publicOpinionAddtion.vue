<template>
    <div class="table" style="postion:relative;">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>舆情处置</el-breadcrumb-item>
              <el-breadcrumb-item>追加舆情</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button  type="primary" class="handle-new mr10" @click="newSingle"><i class="iconfont icon-create-orders"></i><span class="span">追加</span></el-button>
          <el-button  type="primary" class="handle-del mr10" @click="returnBtn"><i class="iconfont icon-fanhui1"></i><span class="span">返回</span></el-button>
        </div>
        <div class="container">
          <div class="handle-box">
              <el-input v-model="title_word" placeholder="请输入标题" class="handle-input mr10"></el-input>
              <el-input v-model="source_word" placeholder="请输入来源" class="handle-input mr10"></el-input>
              <el-date-picker
                v-model="user_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-select v-model="channelValue" placeholder="渠道选择" class="handle-select">
                  <el-option
                    v-for="item in channelOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
          </div>
          <div class="table-content">
                <el-table ref="singleTable" border  :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentChange" style="width: 100%">
                  <el-table-column type="selection" align="center"  width="50" fixed>
                  </el-table-column>
                  <el-table-column align="left" label="标题" show-overflow-tooltip width="400px">
                    <template slot-scope="scope">
                        <img v-show="scope.row.channel=='1'" src="/static/img/main/find.png" class="common-icon" />
                        <img v-show="scope.row.channel=='0'" src="/static/img/main/hand.png" class="common-icon"/>
                        <img v-show="scope.row.channel=='2'" src="/static/img/main/company.png" class="common-icon"/>
                        <img v-show="scope.row.channel=='3'" src="/static/img/main/superior.png" class="common-icon"/>
                        <span style="cursor:pointer;vertical-align: middle;" @click="detailsTick(scope.row.article_id)">{{scope.row.title}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column property="created_at" align="center" label="发现时间" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="author" align="center" label="作者" show-overflow-tooltip >
                  </el-table-column>
                  <el-table-column  align="center" label="来源" show-overflow-tooltip >
                    <template slot-scope="scope">
                      <a target="_blank" style="cursor:pointer;color:#333;" v-bind:href="scope.row.article_url">{{scope.row.source}}</a>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="信息渠道" show-overflow-tooltip >
                    <template slot-scope="scope">
                      <span v-show="scope.row.channel=='1'">系统发现</span>
                      <span v-show="scope.row.channel=='0'">手动添加</span>
                      <span v-show="scope.row.channel=='2'">单位报送</span>
                      <span v-show="scope.row.channel=='3'">上级调度</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="Pagination" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                      @size-change="peoplehandleSizeChange"
                      @current-change="peoplehandleCurrentChange"
                      :current-page="currentPage"
                      :page-size="pageSize"
                      layout="total, prev, pager, next,jumper"
                      :total="peopleCount">
                    </el-pagination>
                </div>
          </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'publicOpinionAddtions',
        data() {
            return {
              title_word:'',
              source_word:'',
              user_time:'',
              channelOptions:[],
              channelValue:'',
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              tableData: [],
              multipleSelection:[],
              currentRow:null,
            }
        },
        created() {
          this.channelData()
          this.getTableData()
        },
        methods: {
          //返回
          returnBtn(){
            this.$router.push({ path: 'publicOpinionDetails', query: {
                'article_id': this.$route.query.article_id,
                'dept_id':this.$route.query.dept_id,
                'msg_id':this.$route.query.msg_id
              }})
          },
          //表格数据
          getTableData(){
            let _this=this;
            let startTime=''
            let endTime=''
            if(this.user_time!=''){
              startTime=(this.user_time)[0]
              endTime=(this.user_time)[1]
            }else{
              startTime=''
              endTime=''
            }
            // let channelNumber=''
            // if(this.channelValue=='手动添加'){
            //   channelNumber=0
            // }else if(this.channelValue=='系统发现'){
            //   channelNumber=1
            // }else if(this.channelValue=='单位报送'){
            //   channelNumber=2
            // }else if(this.channelValue=='上级调度'){
            //   channelNumber=3
            // }else if(this.channelValue==''){
            //   channelNumber=''
            // }
            axios.get('/api/v1/newest/article/list',{
                params:{
                  type:1,
                  selectfor:0,
                  pageNumber:this.currentPage,
                  pageSize:this.pageSize,
                  starTime:startTime,
                  endTime:endTime,
                  title:this.title_word,
                  article_form:this.source_word,
                  channel:this.channelValue
                }
              }).then(function (response) {
                 let arr=response.data.data.articleList
                 if(arr.length>0){
                   _this.tableData=[]
                   arr.forEach(item => {
                     let tableObj={}
                     tableObj.author=item.article_author
                     tableObj.channel=item.channel
                     tableObj.source=item.article_form
                     tableObj.title=item.article_title
                     tableObj.article_id=item.article_id
                     tableObj.article_url=item.article_url
                     tableObj.created_at=item.created_at
                     _this.tableData.push(tableObj)
                   })
                   _this.peopleCount=response.data.data.total
                 }else{
                   _this.tableData=[]
                   _this.peopleCount=0
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

          },
          //信息渠道
          channelData(){
            let _this=this;
            axios.get('http://192.168.2.165:8081'+'/api/v1/dictionary/maintain/list',{
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
          //点击标题 跳转详情
          detailsTick(articleId){
            this.$router.push({ path: 'newPublicDetails', query: {
                'articleId': articleId
              }
            })
          },
          //追加
          newSingle(){
            let _this=this
            let ids=''
            for(var obj of this.multipleSelection){
              ids+=obj.article_id+','
            }
            if(ids.length>0){
                this.$confirm('此操作将会追加舆情, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  axios.get('/api/v1/mng/article/deal/append/article',{
                      params:{
                        ids:ids.substr(0,ids.length-1),
                        tid:_this.$route.query.article_id
                      }
                    }).then(function (response) {
                          _this.currentPage=1
                          _this.title_word=''
                          _this.source_word=''
                          _this.user_time=''
                          _this.channelValue=''
                          _this.$router.push({ path: 'publicOpinionDetails', query: {
                              'article_id': _this.$route.query.article_id,
                              'dept_id':_this.$route.query.dept_id,
                              'msg_id':_this.$route.query.msg_id
                            }})
                          _this.$message({
                            type: 'success',
                            message: '追加成功!'
                          });

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
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  });
                });
            }else{
              this.$message({
                showClose: true,
                message: '请勾选最新舆情',
                type: 'error'
              });
            }
          },
          //搜索
          search(){
            if(this.user_time=='null'|| !(this.user_time)){
              this.user_time=''
            }
            this.currentPage=1
            this.getTableData()
          },
          peoplehandleSizeChange(val) {

          },
          peoplehandleCurrentChange(val) {
              this.currentPage = val
              this.getTableData()
          },
          handleSelectionChange(val) {
            this.multipleSelection = val
          },
          handleCurrentChange(val) {

          }
        }
    }

</script>

<style scoped>
.handle-export{
  position:absolute;
  right:160px;
  top:6px;
  padding: 4px 6px;
}
.common-icon{
  width:18px;
  height:auto;
  vertical-align: middle;
}
</style>
