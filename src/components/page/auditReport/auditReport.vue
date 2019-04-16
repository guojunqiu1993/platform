<template>
    <div class="table" style="postion:relative;">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>舆情交流</el-breadcrumb-item>
              <el-breadcrumb-item>审核上报</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-del mr10" @click="checkExport()"><i class="iconfont icon-xiafa"></i><span class="span">导出</span></el-button>
        </div>
        <div class="container">
          <div class="handle-box">
              <el-input v-model="title_word" placeholder="请输入标题" class="handle-input mr10"></el-input>
              <el-input v-model="appear_people" placeholder="请输入上报人" class="handle-input mr10"></el-input>
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
              <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
          </div>
          <div class="table-content">
                <el-table  ref="singleTable" border  :data="tableData" highlight-current-row @selection-change="checkHandleSelectionChange" @current-change="checkHandleCurrentChange" style="width: 100%">
                  <el-table-column type="selection" align="center"  width="50" fixed>
                  </el-table-column>
                  <el-table-column property="title" align="left" label="标题" show-overflow-tooltip width="400px">
                    <template slot-scope="scope">
                        <span style="cursor:pointer;vertical-align: middle;" @click="detailsTick(scope.row.bbstopic_id)">{{scope.row.bbstopic_title}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column property="created_at" align="center" label="上报时间" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="update_at" align="center" label="更新时间" show-overflow-tooltip >
                  </el-table-column>
                  <el-table-column property="watch" align="center" label="浏览/回复" show-overflow-tooltip >
                  </el-table-column>
                  <el-table-column property="dept_name" align="center" label="上报部门" show-overflow-tooltip >
                  </el-table-column>
                  <el-table-column property="username" align="center" label="上报人" show-overflow-tooltip >
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button size="small" v-show="scope.row.to_article==0" @click="turnOpinion(scope.row.bbstopic_id)">转为舆情</el-button>
                      <span v-show='scope.row.to_article==1'>已转舆情</span>
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
        name: 'auditReport',
        data() {
            return {
              title_word:'',
              appear_people:'',
              // user_time:'',
              startTime:'',
              endTime:'',
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              tableData: [],
              multipleSelection:[],
              currentRow:null,
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
          this.checkTableList()
        },
        methods: {
          checkTableList(){
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
            axios.get('/api/v1/article/exchange/audit/list',{
                params:{
                  pageNumber:this.currentPage,
                  pageSize:this.pageSize,
                  startTime:this.startTime,
                  endTime:this.endTime,
                  title:this.title_word,
                  username:this.appear_people
                }
              }).then(function (response) {
                 let arr=response.data.data.exchangeList
                 if(arr.length>0){
                   _this.tableData=[]
                   arr.forEach(item => {
                     let tableObj={}
                     tableObj.bbstopic_id=item.bbstopic_id
                     tableObj.bbstopic_sub=item.bbstopic_sub
                     tableObj.bbstopic_title=item.bbstopic_title
                     tableObj.bbstopic_view=item.bbstopic_view
                     tableObj.created_at=item.created_at
                     tableObj.dept_name=item.dept_name
                     tableObj.to_article=item.to_article  //操作 未转舆情0  已转舆情1
                     tableObj.update_at=item.update_at
                     tableObj.username=item.username
                     tableObj.watch=item.bbstopic_view+'/'+item.bbstopic_sub

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

          //搜索
          search(){
            // if(this.user_time=='null'|| !(this.user_time)){
            //   this.user_time=''
            // }
            this.currentPage=1
            this.checkTableList()
          },
          peoplehandleSizeChange(val) {

          },
          peoplehandleCurrentChange(val) {
              this.currentPage = val
              this.checkTableList()
          },
          checkHandleSelectionChange(val) {
            this.multipleSelection = val
          },
          checkHandleCurrentChange(val) {

          },
          //点击文章标题
          detailsTick(bbstopic_ids){
            this.$router.push({ path: 'auditReportDetails', query: {
              'bbstopic_id':bbstopic_ids
            }})
          },
          //导出
          checkExport(){
            let _this=this
            let ids=''
            for(var obj of this.multipleSelection){
              ids+=obj.bbstopic_id+','
            }
            ids=ids.substr(0,ids.length-1)
            if(ids.length>0){
                _this.$confirm('此操作将会按勾选导出数据, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  axios({
                      method: 'get',
                      url: '/api/v1/article/exchange/audit/exp?ids='+ids,
                      responseType: 'blob'
                  }).then(response => {
                      _this.download(response.data)
                      _this.currentPage=1
                      _this.startTime=''
                      _this.endTime=''
                      _this.title_word=''
                      _this.appear_people=''
                      _this.checkTableList()
                  }).catch((error) => {
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
            }else{
              _this.$confirm('此操作将会按条件导出数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // let startTime=''
                // let endTime=''
                // if(this.user_time!=''){
                //   startTime=(this.user_time)[0]
                //   endTime=(this.user_time)[1]
                // }else{
                //   startTime=''
                //   endTime=''
                // }
                axios({
                    method: 'get',
                    url:'/api/v1/article/exchange/audit/exp?title='+_this.title_word+'&username='+_this.appear_people+'&startTime='+_this.startTime+'&endTime='+_this.endTime,
                    responseType: 'blob'
                }).then(response => {
                  _this.download(response.data)
                  _this.currentPage=1
                  _this.startTime=''
                  _this.endTime=''
                  _this.title_word=''
                  _this.appear_people=''
                  _this.checkTableList()
                }).catch((error) => {
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

            }
          },
          // 下载文件
          download (data) {
              if (!data) {
                  return
              }
              let url = window.URL.createObjectURL(new Blob([data]))
              let link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              link.setAttribute('download', '审核上报.xlsx')
              document.body.appendChild(link)
              link.click()
          },
          //转为舆情
          turnOpinion(bbstopic_ids){
            let _this=this
            axios.get('/api/v1/article/exchange/audit/toArticle',{
                params:{
                  bbstopic_id:bbstopic_ids
                }
              }).then(function (response) {
                _this.currentPage=1
                _this.startTime=''
                _this.endTime=''
                _this.title_word=''
                _this.appear_people=''
                _this.checkTableList()
                _this.$message({
                  type: 'success',
                  message: '转为舆情成功!'
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
</style>
