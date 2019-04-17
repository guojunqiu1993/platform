 <template>
    <div class="table" style="postion:relative;">
        <div class="crumbs">
          <el-breadcrumb separator="">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 最新舆情</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button  type="primary" class="handle-export mr10" @click="newGet"><i class="iconfont icon-shuaxin"></i><span class="span">获取</span></el-button>
          <el-button  type="primary" class="handle-new mr10" @click="newSingle"><i class="iconfont icon-create-orders"></i><span class="span">添加</span></el-button>
          <el-button  type="primary" class="handle-del mr10" @click="delAll"><i class="iconfont icon-shanchu2"></i><span class="span">删除</span></el-button>
        </div>
        <div class="container">
          <div class="handle-box">
              <el-input v-model="title_word" placeholder="请输入标题" class="handle-input mr10" ></el-input>
              <el-input v-model="source_word" placeholder="请输入来源" class="handle-input mr10"></el-input>
              <!-- <el-date-picker
                v-model="user_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker> -->
              <el-date-picker v-model="startTime" placeholder="开始日期" :picker-options="startTimeEvent" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              <span>至</span>
              <el-date-picker v-model="endTime" placeholder="结束日期" :picker-options="endTimeEvent" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
                  <el-table-column align="left" label="标题" width="420px">
                    <template slot-scope="scope">
                        <img v-bind:title="'系统发现'" v-show="scope.row.channel=='1'" src="/static/img/main/find.png" class="common-icon" />
                        <img v-bind:title="'手动添加'" v-show="scope.row.channel=='0'" src="/static/img/main/hand.png" class="common-icon"/>
                        <img v-bind:title="'单位报送'" v-show="scope.row.channel=='2'" src="/static/img/main/company.png" class="common-icon"/>
                        <img v-bind:title="'上级调度'" v-show="scope.row.channel=='3'" src="/static/img/main/superior.png" class="common-icon"/>
                        <span v-bind:title="scope.row.title" style="cursor:pointer;vertical-align: middle;" @click="detailsTick(scope.row.article_id)">{{scope.row.title  | readMore(25,'...')}}</span>
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
let umsUrl=window.sessionStorage.getItem('umsUrl')
    export default {
        name: 'newPublic',
        data() {
            return {
              title_word:'',
              source_word:'',
              // user_time:'',
              startTime:'',
              endTime:'',
              channelValue:'',
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              tableData: [],
              multipleSelection:[],
              currentRow:null,
              channelOptions:[],
              startTimeEvent: {
                disabledDate: time => {
                  if (this.endTime) {
                    return (
                      time.getTime() > new Date(this.endTime).getTime()
                    );
                  } else {
                    return time.getTime() > Date.now();
                  }
                }
              },
              endTimeEvent: {
                disabledDate: time => {
                  if (this.startTime) {
                    return (
                      time.getTime() > Date.now() ||
                      time.getTime() < new Date(this.startTime).getTime()
                    );
                  } else {
                    return time.getTime() > Date.now();
                  }
                }
              }

            }
        },
        created() {
          this.channelData()
          this.getTableData()
        },
        filters: {
          readMore: function (value,length,suffix) {
            if(value.length>length){
              return value.substr(0,length) + suffix
            }else{
              return value
            }
          }
        },
        methods: {
          //表格数据
          getTableData(){
            let _this=this;
            // let startTime=''
            // let endTime=''
            // if(this.user_time!=''){
            //   startTime=(this.user_time)[0]
            //   endTime=(this.user_time)[1]
            // }else{
            //   startTime=''
            //   endTime=''
            // }
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
                  starTime:this.startTime,
                  endTime:this.endTime,
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
          //获取
          newGet(){
            let _this=this;
            axios.post('/api/v1/article/jobstarting/manual',{
              }).then(function (response) {
                _this.currentPage=1
                _this.title_word=''
                _this.source_word=''
                _this.startTime=''
                _this.endTime=''
                _this.channelValue=''
                _this.getTableData()
                _this.$message({
                  type: 'success',
                  message: '获取数据成功!'
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
          },
          //点击标题 跳转详情
          detailsTick(articleId){
            this.$router.push({ path: 'newPublicDetails', query: {
                'articleId': articleId
              }
            })
          },
          //添加
          newSingle(){
            this.$router.push({ path: 'newPublicAdd'})
          },
          //删除
          delAll(){
            let _this=this
            let ids=''
            for(var obj of this.multipleSelection){
              ids+=obj.article_id+','
            }
            if(ids.length>0){
                this.$confirm('此操作将会删除最新舆情, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  axios.get('/api/v1/newest/article/del',{
                      params:{
                        ids:ids.substr(0,ids.length-1)
                      }
                    }).then(function (response) {
                          _this.currentPage=1
                          _this.title_word=''
                          _this.source_word=''
                          _this.startTime=''
                          _this.endTime=''
                          _this.channelValue=''
                          _this.getTableData()
                          _this.$message({
                            type: 'success',
                            message: '删除成功!'
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
            // if(this.user_time=='null'|| !(this.user_time)){
            //   this.user_time=''
            // }
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
