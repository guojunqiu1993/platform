<template>
    <div class="table" style="postion:relative;">
        <div class="crumbs">
          <el-breadcrumb separator="">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>舆情处置</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-export mr10" @click="exportAll" ><i class="iconfont icon-xiafa"></i><span class="span">导出</span></el-button>
        </div>
        <div class="container">
          <div class="handle-box">
              <el-input v-model="title_word" placeholder="请输入标题" class="handle-input mr10"></el-input>
              <el-input v-model="depart_word" placeholder="请输入部门" class="handle-input mr10" style="margin-bottom:10px;"></el-input>
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
              <el-select v-model="stateValue" placeholder="状态选择" class="handle-select">
                  <el-option
                    v-for="item in stateOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-select v-model="levelOne_classify" placeholder="舆情分类一级选择" @change="levelOneSel()">
                  <el-option
                    v-for="item in levelOneOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-select v-model="levelTwo_classify" placeholder="舆情分类二级选择">
                  <el-option
                    v-for="item in levelTwoOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-select v-model="natureValue" placeholder="舆情性质选择" class="handle-select">
                  <el-option
                    v-for="item in natureOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-select v-model="timeValue" placeholder="时间选择" class="handle-select">
                  <el-option
                    v-for="item in timeOptions"
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
                  <el-table-column  align="left" label="处理部门" width="160px">
                    <template slot-scope="scope">
                        <img v-bind:title="'未受理'" v-show="scope.row.msg_status==0" src="/static/img/main/no_accept.png" class="common-icon" />
                        <img v-bind:title="'办理中'" v-show="scope.row.msg_status==1" src="/static/img/main/accepting.png" class="common-icon" />
                        <img v-bind:title="'待审核'" v-show="scope.row.msg_status==2" src="/static/img/main/await_check.png" class="common-icon" />
                        <img v-bind:title="'已办结'" v-show="scope.row.msg_status==3" src="/static/img/main/conclude.png" class="common-icon" />
                        <span style="vertical-align: middle;" v-bind:title="scope.row.dept_name">{{scope.row.dept_name | readMore(6,'...')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="标题" width="360px">
                    <template slot-scope="scope">
                        <img v-bind:title="'一般舆情'" v-show="scope.row.grade==6" src="/static/img/main/general.png" class="common-icon" />
                        <img v-bind:title="'较大舆情'" v-show="scope.row.grade==7" src="/static/img/main/larger.png" class="common-icon" />
                        <img v-bind:title="'重大舆情'" v-show="scope.row.grade==8" src="/static/img/main/great.png" class="common-icon" />
                        <img v-bind:title="'系统发现'" v-show="scope.row.channel==1" src="/static/img/main/find.png" class="common-icon" />
                        <img v-bind:title="'手动添加'" v-show="scope.row.channel==0" src="/static/img/main/hand.png" class="common-icon" />
                        <img v-bind:title="'单位报送'" v-show="scope.row.channel==2" src="/static/img/main/company.png" class="common-icon" />
                        <img v-bind:title="'上级调度'" v-show="scope.row.channel==3" src="/static/img/main/superior.png" class="common-icon" />
                        <span v-bind:title="scope.row.article_title" style="cursor:pointer;vertical-align: middle;" @click="detailsTick(scope.row.article_id,scope.row.dept_id,scope.row.msg_id)">{{scope.row.article_title | readMore(20,'...')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column property="created_at" align="center" label="下发时间" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="updated_at" align="center" label="更新时间" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="watch" align="center" label="浏览/回复" show-overflow-tooltip >
                  </el-table-column>
                  <el-table-column align="center" label="处理状态" show-overflow-tooltip >
                    <template slot-scope="scope">
                      <span v-show="scope.row.msg_status==0">未受理</span>
                      <span v-show="scope.row.msg_status==1">办理中</span>
                      <span v-show="scope.row.msg_status==2">待审核</span>
                      <span v-show="scope.row.msg_status==3">已办结</span>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column property="" align="center" label="超时情况" show-overflow-tooltip >
                    <template slot-scope="scope">
                      <img v-show="scope.row.overtime==1" src="/static/img/main/green.png" class="common-icon" />
                      <img v-show="scope.row.overtime==2" src="/static/img/main/red.png" class="common-icon" />
                      <img v-show="scope.row.overtime==3" src="/static/img/main/yellow.png" class="common-icon" />
                    </template>
                  </el-table-column> -->
                  <el-table-column property="two_level" align="center" label="舆情分类" show-overflow-tooltip >
                  </el-table-column>
                  <el-table-column  align="center" label="操作" show-overflow-tooltip >
                    <template slot-scope="scope">
                      <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
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
        name: 'newPublic',
        data() {
            return {
              title_word:'',
              depart_word:'',
              // user_time:'',
              startTime:'',
              endTime:'',
              levelOne_classify:'',
              levelOneOptions:[],
              levelTwo_classify:'',
              levelTwoOptions:[],
              stateOptions:[{
                'label':'全部状态',
                'value':''
              },{
                'label':'未受理',
                'value':'0'
              },{
                'label':'办理中',
                'value':'1'
              },{
                'label':'待审核',
                'value':'2'
              },{
                'label':'已办结',
                'value':'3'
              },],
              stateValue:'',
              natureOptions:[{
                value:'',
                label:'舆情性质选择'
              },{
                value:'6',
                label:'一般舆情'
              },{
                value:'7',
                label:'较大舆情'
              },{
                value:'8',
                label:'重大舆情'
              }],
              natureValue:'',
              timeOptions:[{
                value:'1',
                label:'按下发时间排序'
              },{
                value:'0',
                label:'按更新时间排序'
              }],
              timeValue:'1',
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
          this.eventFlexData()
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
            let levelOne_classify=''
            if(!(levelOne_classify)){
              levelOne_classify=''
            }else{
              levelOne_classify=(this.levelOne_classify).split(",")[1]
            }
            axios.get('/api/v1/mng/article/deal/list',{
                params:{
                  pageNumber:this.currentPage,
                  pageSize:this.pageSize,
                  type:1,
                  stat:this.stateValue,
                  deptName:this.depart_word,
                  starTime:this.startTime,
                  endTime:this.endTime,
                  title:this.title_word,
                  orderType:this.timeValue,
                  reply:1,
                  grade:this.natureValue,
                  one_level:levelOne_classify,
                  two_level:this.levelTwo_classify,
                  article_id:'',
                  dept_id:''
                }
              }).then(function (response) {
                 let arr=response.data.data.ArticleDealList
                 if(arr.length>0){
                   _this.tableData=[]
                   arr.forEach(item => {
                     let tableObj={}
                     tableObj.article_id=item.article_id
                     tableObj.article_title=item.article_title
                     tableObj.channel=item.channel
                     tableObj.created_at=item.created_at
                     tableObj.dept_id=item.dept_id
                     tableObj.dept_name=item.dept_name
                     tableObj.grade=item.grade
                     tableObj.grade_id=item.grade_id
                     tableObj.msg_id=item.msg_id
                     tableObj.msg_status=item.msg_status
                     tableObj.msg_sub=item.msg_sub
                     tableObj.msg_view=item.msg_view
                     tableObj.one_level=item.one_level
                     tableObj.two_level=item.two_level
                     tableObj.updated_at=item.updated_at
                     tableObj.article_form=item.article_form
                     tableObj.article_url=item.article_url
                     tableObj.watch=item.msg_view+'/'+item.msg_sub
                     //tableObj.overtime='1' //超时
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
          //点击标题 跳转详情
          detailsTick(articleId,dept_id,msg_id){
            this.$router.push({ path: 'publicOpinionDetails', query: {
                'article_id': articleId,
                'dept_id':dept_id,
                'msg_id':msg_id
              }
            })
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

          },
          //事件分类 一级
          eventFlexData(){
            let _this=this
            axios.get('/api/v1/sys/event/classify/one/level',{
                params:{

                }
              }).then(function (response) {
                let arr=response.data.data
                let newArr=[{'value':'','label':'舆情分类一级选择'}]
                if(arr.length>0){
                  for(var i=0;i<arr.length;i++){
                    let obj={}
                    obj.value=arr[i].id+','+arr[i].one_level
                    obj.label=arr[i].one_level
                    newArr.push(obj)
                  }
                }
                _this.levelOneOptions=newArr
                _this.levelOne_classify=''
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
            let strs=this.levelOne_classify
            let arrs=strs.split(",")
            let one_event_ids=arrs[0]
            axios.get('/api/v1/sys/event/classify/two/level',{
                params:{
                  one_level_id:one_event_ids
                }
              }).then(function (response) {
                let arr=response.data.data
                let newArrNull=[]
                let newArr=[{'value':'','label':'舆情分类二级选择'}]
                if(arr.length>0){
                  for(var i=0;i<arr.length;i++){
                    let obj={}
                    obj.value=arr[i].two_level
                    obj.label=arr[i].two_level
                    newArrNull.push(obj)
                  }
                  _this.levelTwo_classify=arr[0].two_level
                  _this.levelTwoOptions=newArrNull
                }else{
                  _this.levelTwo_classify=''
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
          },
          //导出
          exportAll(){
            let _this=this
            let ids=''
            for(var obj of this.multipleSelection){
              ids+=obj.msg_id+','
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
                      url: '/api/v1/mng/article/deal/exp?ids='+ids+'&type=1',
                      responseType: 'blob'
                  }).then(response => {
                      _this.download(response.data)
                      _this.currentPage=1
                      _this.title_word=''
                      _this.depart_word=''
                      _this.startTime=''
                      _this.endTime=''
                      _this.timeValue='1'
                      _this.stateValue=''
                      _this.levelOne_classify=''
                      _this.levelTwo_classify=''
                      _this.natureValue=''
                      _this.getTableData()
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
                let levelOne_classify=''
                if(!(levelOne_classify)){
                  levelOne_classify=''
                }else{
                  levelOne_classify=(this.levelOne_classify).split(",")[1]
                }
                axios({
                    method: 'get',
                    url:'/api/v1/mng/article/deal/exp?type=1&stat='+_this.stateValue+'&title='+_this.title_word+'&deptName='+_this.depart_word+'&starTime='+_this.startTime+'&endTime='+_this.endTime+'&orderType='+_this.timeValue+'&reply=1&one_level='+levelOne_classify+'&two_level='+_this.levelTwo_classify+'&article_id=""&dept_id=""',
                    responseType: 'blob'
                }).then(response => {
                  _this.download(response.data)
                  _this.currentPage=1
                  _this.title_word=''
                  _this.depart_word=''
                  _this.startTime=''
                  _this.endTime=''
                  _this.timeValue='1'
                  _this.stateValue=''
                  _this.levelOne_classify=''
                  _this.levelTwo_classify=''
                  _this.natureValue=''
                  _this.getTableData()
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
              link.setAttribute('download', '舆情处置.xlsx')

              document.body.appendChild(link)
              link.click()
          },
          //修改
          handleEdit(index,row){
            let grade=''
            if(row.grade=='6'){
              grade='一般舆情'
            }else if(row.grade=='7'){
              grade='较大舆情'
            }else if(row.grade=='8'){
              grade='重大舆情'
            }
            this.$router.push({ path: 'publicOpinionEdit', query: {
                'title':row.article_title,
                'source':row.article_form,
                'url':row.article_url,
                'grade':grade,
                'article_id':row.article_id,
                'one_level':row.one_level
              }
            })
          }



        }
    }

</script>
<style scoped>
.handle-export{
  position:absolute;
  right:40px;
  top:6px;
  padding: 4px 6px;
}
.common-icon{
  width:18px;
  height:auto;
  vertical-align: middle;
}
</style>
