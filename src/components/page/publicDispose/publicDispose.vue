<template>
    <div class="table" style="postion:relative;">
        <div class="crumbs">
          <el-breadcrumb separator="">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>舆情处理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="container">
          <div class="tab-change">
              <span @click="noAcceptEvent()" :class="tabBoolean1 ? 'active' : '' ">未受理舆情</span>
              <span @click="checkEvent()" :class="tabBoolean2 ? 'active' : '' ">办理中舆情</span>
              <span @click="concludeEvent()" :class="tabBoolean3 ? 'active' : '' ">已办结舆情</span>
          </div>
          <div class="handle-box">
              <el-input v-model="title_word" placeholder="请输入标题" class="handle-input mr10"></el-input>
              <el-select v-model="timeValue" placeholder="时间选择" class="handle-select" style="margin-bottom:10px;">
                  <el-option
                    v-for="item in timeOptions"
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
              <el-select v-model="natureValue" placeholder="舆情性质选择" class="handle-select" v-show="tabBoolean1">
                  <el-option
                    v-for="item in natureOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </br>
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
                <el-table ref="singleTable" border  :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentChange" style="width: 100%">
                  <el-table-column type="index" align="center" width="70px"  label="序号">
                  </el-table-column>
                  <el-table-column align="left" label="标题"  width="360px">
                    <template slot-scope="scope">
                        <img v-bind:title="'一般舆情'" v-show="scope.row.grade==6" src="/static/img/main/general.png" class="common-icon" />
                        <img v-bind:title="'较大舆情'" v-show="scope.row.grade==7" src="/static/img/main/larger.png" class="common-icon" />
                        <img v-bind:title="'重大舆情'"  v-show="scope.row.grade==8" src="/static/img/main/great.png" class="common-icon" />
                        <img v-bind:title="'系统发现'" v-show="scope.row.channel==1" src="/static/img/main/find.png" class="common-icon" />
                        <img v-bind:title="'手动添加'" v-show="scope.row.channel==0" src="/static/img/main/hand.png" class="common-icon" />
                        <img v-bind:title="'单位报送'" v-show="scope.row.channel==2" src="/static/img/main/company.png" class="common-icon" />
                        <img v-bind:title="'上级调度'" v-show="scope.row.channel==3" src="/static/img/main/superior.png" class="common-icon" />
                        <span v-bind:title="scope.row.article_title" style="cursor:pointer;vertical-align: middle;" @click="detailsTick(scope.row.article_id,scope.row.msg_id)">{{scope.row.article_title  | readMore(20,'...')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column property="created_at" align="center" label="下发时间" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="dept_ame" align="center" label="下发部门" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="loginName" align="center" label="下发人" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column align="center" label="处理状态" show-overflow-tooltip >
                    <template slot-scope="scope">
                      <span v-show="scope.row.msg_status==0">未受理</span>
                      <span v-show="scope.row.msg_status==1">办理中</span>
                      <span v-show="scope.row.msg_status==2">待审核</span>
                      <span v-show="scope.row.msg_status==3">已办结</span>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column align="center" label="超时情况" show-overflow-tooltip >
                    <template slot-scope="scope">
                      <img v-show="scope.row.overtime==1" src="/static/img/main/green.png" class="common-icon" />
                      <img v-show="scope.row.overtime==2" src="/static/img/main/red.png" class="common-icon" />
                      <img v-show="scope.row.overtime==3" src="/static/img/main/yellow.png" class="common-icon" />
                    </template>
                  </el-table-column> -->
                  <el-table-column property="two_level" align="center" label="舆情分类" show-overflow-tooltip>
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
              tabBoolean1:true,
              tabBoolean2:false,
              tabBoolean3:false,
              status:0,  //0:未受理舆情  1：办理中舆情  3已办结舆情
              title_word:'',
              department_word:'',
              // user_time:'',
              startTime:'',
              endTime:'',
              levelOne_classify:'',
              levelOneOptions:[],
              levelTwo_classify:'',
              levelTwoOptions:[],
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
            axios.get('/api/v1/article/deal/list',{
                params:{
                  pageNumber:this.currentPage,
                  pageSize:this.pageSize,
                  starTime:this.startTime,
                  endTime:this.endTime,
                  one_level:levelOne_classify,
                  two_level:this.levelTwo_classify,
                  type:1,
                  status:this.status,
                  title:this.title_word,
                  grade:this.natureValue,
                  orderType:this.timeValue
                }
              }).then(function (response) {
                 let arr=response.data.data.dealList
                 if(arr.length>0){
                   _this.tableData=[]
                   arr.forEach(item => {
                     let tableObj={}
                     tableObj.article_title=item.article_title
                     tableObj.created_at=item.created_at
                     tableObj.dept_ame=item.dept_ame
                     tableObj.loginName=item.loginName
                     tableObj.msg_id=item.msg_id
                     tableObj.msg_status=item.msg_status
                     tableObj.one_level=item.one_level
                     tableObj.two_level=item.two_level
                     tableObj.user_id=item.user_id
                     tableObj.username=item.username
                     tableObj.grade=item.grade
                     tableObj.channel=item.channel
                     tableObj.article_id=item.article_id
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
          detailsTick(article_id,msg_id){
              this.$router.push({ path: 'publicDisposeDetails',query: {
                    'article_id':article_id,
                    'msg_id':msg_id
                }})
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
          //未受理舆情
          noAcceptEvent(){
            this.tabBoolean1=true
            this.tabBoolean2=false
            this.tabBoolean3=false
            this.status=0
            this.currentPage=1
            this.startTime=''
            this.endTime=''
            this.levelOne_classify=''
            this.levelTwo_classify=''
            this.title_word=''
            this.natureValue=''
            this.timeValue='1'
            this.getTableData()
          },
          //办理中舆情
          checkEvent(){
            this.tabBoolean1=false
            this.tabBoolean2=true
            this.tabBoolean3=false
            this.status=1
            this.currentPage=1
            this.startTime=''
            this.endTime=''
            this.levelOne_classify=''
            this.levelTwo_classify=''
            this.title_word=''
            this.natureValue=''
            this.timeValue='1'
            this.getTableData()
          },
          //已办结舆情
          concludeEvent(){
            this.tabBoolean1=false
            this.tabBoolean2=false
            this.tabBoolean3=true
            this.status=3
            this.currentPage=1
            this.startTime=''
            this.endTime=''
            this.levelOne_classify=''
            this.levelTwo_classify=''
            this.title_word=''
            this.natureValue=''
            this.timeValue='1'
            this.getTableData()
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
                  })
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
.tab-change{
  height:40px;
  border-bottom:solid 1px #dedde2;
  background:#f1f2f3;
  padding-left:20px;
}
.tab-change span{
  display: inline-block;
  height:30px;
  line-height:30px;
  margin-top:9px;
  padding:0 10px;
  font-size:14px;
  border-bottom:none;
  margin-right:10px;
  cursor:pointer;
  border-radius:5px 5px 0 0;
}
.common-icon{
  width:18px;
  height:auto;
  vertical-align: middle;
}
</style>
