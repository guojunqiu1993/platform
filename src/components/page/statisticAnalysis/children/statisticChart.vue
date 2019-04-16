<template>
    <div class="table">
      <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 统计分析</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-export mr10" @click="departmentExport" v-show='ruleTabBoolean1' style="right:140px"><i class="iconfont icon-xiafa"></i><span class="span">导出</span></el-button>
          <el-button type="primary" class="handle-export mr10" @click="publicExport" v-show='ruleTabBoolean2' style="right:140px"><i class="iconfont icon-xiafa"></i><span class="span">导出</span></el-button>
          <el-button type="primary" class="handle-export mr10" @click="eventExport" v-show='ruleTabBoolean3' style="right:140px"><i class="iconfont icon-xiafa"></i><span class="span">导出</span></el-button>
          <el-button type="primary" class="handle-export mr10" @click="viewMap()"><i class="iconfont icon-fanhui1"></i><span class="span">返回统计图</span></el-button>
      </div>
      <div class="container">
        <div class="tab-change">
            <span @click="departmentShow()" :class="ruleTabBoolean1 ? 'active' : '' " style="cursor:pointer;">按部门统计</span>
            <span @click="typeShow()" :class="ruleTabBoolean2 ? 'active' : '' " style="cursor:pointer;">按舆情类型</span>
            <span @click="eventShow()" :class="ruleTabBoolean3 ? 'active' : '' " style="cursor:pointer;">按事件统计</span>
        </div>

        <div class="handle-box" v-show='ruleTabBoolean1' style="padding-left:0px;padding-right:0px;">
            <div style="padding:0 20px 10px 20px;margin-bottom:10px;display:flex;border-bottom:solid 1px #dedde2;">
              <span style="width:100px;margin-top:10px;font-size:14px;">统计信息:</span>
              <el-checkbox-group v-model="checkedInformation" style="width:80%;margin:8px 0;">
                <el-checkbox v-for="obj in statisInformationArr" :disabled="obj.label === '回复事件' || obj.label === '下发数'" :label="obj.label" :key="obj.index" style="width:15%;margin:4px 0;">{{obj.value}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <el-date-picker v-model="startTimeDepartment" placeholder="开始日期" :picker-options="startDepartmentOption" type="date" value-format="yyyy-MM-dd" style="margin-left:20px;"></el-date-picker>
            <span>至</span>
            <el-date-picker v-model="endTimeDepartment" placeholder="结束日期" :picker-options="endDepartmentOption" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            <el-input v-model="department_word" placeholder="请输入部门名称" class="handle-input mr10"></el-input>
            <el-select v-model="departmentValue" placeholder="请选择">
                <el-option
                  v-for="item in departmentArrOptions"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" class="handle-search" icon="search" @click="departmentSearch"><i class="iconfont icon-chazhao"></i></el-button>
            <el-button type="primary" v-bind:title="'重置'" class="handle-search" icon="search" @click="departmentReset"><i class="iconfont icon-chongzhi"></i></el-button>
        </div>

        <div class="handle-box" v-show='ruleTabBoolean2'>
            <el-select v-model="classValue" placeholder="请选择" >
                <el-option
                  v-for="item in classArrOptions"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker v-model="startTimePublic" placeholder="开始日期" :picker-options="startPublicOption" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            <span>至</span>
            <el-date-picker v-model="endTimePublic" placeholder="结束日期" :picker-options="endPublicOption" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            <el-button type="primary" class="handle-search" icon="search" @click="publicTypeSearch"><i class="iconfont icon-chazhao"></i></el-button>
            <el-select v-model="sortValue" placeholder="请选择">
                <el-option
                  v-for="item in sortFlexOptions"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-checkbox v-model="department_checked">仅看本部门</el-checkbox>
        </div>

        <div class="handle-box" v-show='ruleTabBoolean3'>
            <el-date-picker v-model="startTimeEvent" placeholder="开始日期" :picker-options="startEventOption" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            <span>至</span>
            <el-date-picker v-model="endTimeEvent" placeholder="结束日期" :picker-options="endEventOption" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            <el-select v-model="eventStateValue" placeholder="请选择" >
                <el-option
                  v-for="item in eventStateOptions"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="event_word" placeholder="请输入事件名称" class="handle-input mr10"></el-input>
            <el-button type="primary" class="handle-search" icon="search" @click="eventSearch"><i class="iconfont icon-chazhao"></i></el-button>
            <el-checkbox v-model="event_checked">仅看本部门</el-checkbox>
        </div>


        <div class="table-content">

          <el-table :data="departmentData" style="width: 100%" v-show='ruleTabBoolean1' border>
            <el-table-column type="index" align="center" width="70" label="序号">
            </el-table-column>
            <template v-for="(col ,index) in cols">
                <el-table-column v-if="col.label==='部门'&&col.type==='sort'" :prop="col.prop" sortable :label="col.label" align="center" :width="250" show-overflow-tooltip></el-table-column>
                <el-table-column v-if="col.label!='部门'&&col.type==='sort'" :prop="col.prop" sortable :label="col.label" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column v-if="col.type==='normal'" :prop="col.prop" :label="col.label" align="center"  show-overflow-tooltip></el-table-column>
            </template>
          </el-table>
          <div class="Pagination" style="text-align: left;margin-top: 10px;" v-show='ruleTabBoolean1'>
              <el-pagination
                @size-change="departmentHandleSizeChange"
                @current-change="departmentHandleCurrentChange"
                :current-page="departmentCurrentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next,jumper"
                :total="departmentCount">
              </el-pagination>
          </div>

          <el-table ref="publicTypeData" border v-show='ruleTabBoolean2'  :data="publicTypeData" style="width: 100%">
            <el-table-column property="public_type" align="center" label="舆情类型" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="sent_total" align="center" label="下发总数" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="generl_public" align="center" label="一般舆情" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="major_public" align="center" label="较大舆情" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="great_public" align="center" label="重大舆情" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="transfer" align="center" label="已办结" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="complete" align="center" label="完成率" show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <div class="Pagination" style="text-align: left;margin-top: 10px;" v-show='ruleTabBoolean2'>
              <el-pagination
                @size-change="publicHandleSizeChange"
                @current-change="publicHandleCurrentChange"
                :current-page="publicCurrentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next,jumper"
                :total="publicCount">
              </el-pagination>
          </div>


          <lb-table align="center" v-show='ruleTabBoolean3' :column="eventData.column" :data="eventData.data" :merge="['event_name', 'complete_percent']" border>
          </lb-table>
          <div class="Pagination" style="text-align: left;margin-top: 10px;" v-show='ruleTabBoolean3'>
              <el-pagination
                @size-change="eventHandleSizeChange"
                @current-change="eventHandleCurrentChange"
                :current-page="eventCurrentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next,jumper"
                :total="eventCount">
              </el-pagination>
          </div>

        </div>
      </div>


    </div>
</template>

<script>
    import axios from 'axios'
    import LbTable from '../../../libs/lb-table/lb-table.vue'
    export default {
        name: 'statisticChart',
        components: {
          LbTable
        },
        data() {
            return {
              ruleTabBoolean1:true,
              ruleTabBoolean2:false,
              ruleTabBoolean3:false,

              publicCount: 0,
              publicCurrentPage: 1,
              departmentCount: 0,
              departmentCurrentPage: 1,
              eventCount: 0,
              eventCurrentPage: 1,
              pageSize:10,


              //按部门统计
              statisInformationArr:[
                {'label':'回复事件','value':'回复事件'},
                {'label':'下发数','value':'下发数'},
                {'label':'待受理','value':'待受理'},
                {'label':'处理中','value':'处理中'},
                {'label':'待审核','value':'待审核'},
                {'label':'已办结','value':'已办结'},
                {'label':'完成率','value':'完成率'},
                {'label':'重大舆情','value':'重大舆情'},
                {'label':'较大舆情','value':'较大舆情'},
                {'label':'一般舆情','value':'一般舆情'},
                {'label':'上报舆情数','value':'上报舆情数'},
                {'label':'转为舆情数','value':'转为舆情数'}
              ],
              checkedInformation:['回复事件','下发数','待受理','处理中','待审核','已办结','完成率'],
              startDepartmentOption: {
                disabledDate: time => {
                  let endDateVal = this.endTimeDepartment
                  if (endDateVal) {
                    return time.getTime() > new Date(endDateVal).getTime();
                  }
                }
              },
              endDepartmentOption: {
                disabledDate: time => {
                  let beginDateVal = this.startTimeDepartment
                  if (beginDateVal) {
                    return (
                      time.getTime() <
                      new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
                    );
                  }
                }
              },
              startTimeDepartment:'',
              endTimeDepartment:'',
              departmentArrOptions:[
                {'label':'全部部门','value':''},
                {'label':'A部门','value':'A部门'},
                {'label':'B部门','value':'B部门'},
                {'label':'C部门','value':'C部门'}
              ],
              departmentValue:'',
              department_word:'',
              cols: [
                  { label: "部门", prop: "department_name", type: "sort" },
                  { label: "回复事件", prop: "response_event", type: "sort" },
                  { label: "下发数", prop: "sent_total", type: "sort" },
                  { label: "待受理", prop: "to_accept", type: "normal" },
                  { label: "处理中", prop: "being_processed", type: "normal" },
                  { label: "待审核", prop: "to_audit", type: "normal" },
                  { label: "已办结", prop: "have_transferred", type: "normal" },
                  { label: "完成率", prop: "complete", type: "sort" },
              ],
              departmentData: [{
                  department_name:'爱仕达介爱仕达介爱仕达介爱仕达介爱仕达介',
                  response_event:'30',
                  sent_total:'26',
                  to_accept:'22',
                  being_processed:'56',
                  to_audit:'17',
                  have_transferred:'30',
                  complete:'24%'
              },
              {
                  department_name:'圣诞节福克斯',
                  response_event:'25',
                  sent_total:'45',
                  to_accept:'17',
                  being_processed:'45',
                  to_audit:'76',
                  have_transferred:'50',
                  complete:'54%'
              },{
                department_name:'开放港口的风格',
                response_event:'60',
                sent_total:'76',
                to_accept:'23',
                being_processed:'26',
                to_audit:'15',
                have_transferred:'50',
                complete:'24%',
              },{
                department_name:'束带结发数',
                response_event:'40',
                sent_total:'28',
                to_accept:'5',
                being_processed:'46',
                to_audit:'14',
                have_transferred:'30',
                complete:'25%',
              },{
                department_name:'查看看电视开',
                response_event:'56',
                sent_total:'15',
                to_accept:'26',
                being_processed:'26',
                to_audit:'16',
                have_transferred:'20',
                complete:'44%',
              }],



              //按舆情性质
              classArrOptions:[
                {'label':'二级分类','value':'二级分类'},
                {'label':'一级分类','value':'一级分类'}
              ],
              classValue:'二级分类',
              sortFlexOptions:[
                {'label':'按类型名称排序','value':'按类型名称排序'},
                {'label':'按下发总数排序','value':'按下发总数排序'},
                {'label':'按完成率排序','value':'按完成率排序'}
              ],
              sortValue:'按类型名称排序',
              department_checked:false,
              startPublicOption: {
                disabledDate: time => {
                  let endDateVal = this.endTimePublic
                  if (endDateVal) {
                    return time.getTime() > new Date(endDateVal).getTime();
                  }
                }
              },
              endPublicOption: {
                disabledDate: time => {
                  let beginDateVal = this.startTimePublic
                  if (beginDateVal) {
                    return (
                      time.getTime() <
                      new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
                    );
                  }
                }
              },
              startTimePublic:'',
              endTimePublic:'',
              publicTypeData:[{
                public_type:'城管',
                sent_total:'20',
                generl_public:'12',
                major_public:'14',
                great_public:'23',
                transfer:'12',
                complete:'50%'
              },{
                public_type:'交通',
                sent_total:'20',
                generl_public:'12',
                major_public:'14',
                great_public:'23',
                transfer:'12',
                complete:'50%'
              },{
                public_type:'医疗',
                sent_total:'20',
                generl_public:'12',
                major_public:'14',
                great_public:'23',
                transfer:'12',
                complete:'50%'
              },{
                public_type:'服务',
                sent_total:'20',
                generl_public:'12',
                major_public:'14',
                great_public:'23',
                transfer:'12',
                complete:'50%'
              }],

              //事件统计
              startEventOption: {
                disabledDate: time => {
                  let endDateVal = this.endTimeEvent
                  if (endDateVal) {
                    return time.getTime() > new Date(endDateVal).getTime();
                  }
                }
              },
              endEventOption: {
                disabledDate: time => {
                  let beginDateVal = this.startTimeEvent
                  if (beginDateVal) {
                    return (
                      time.getTime() <
                      new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
                    );
                  }
                }
              },
              startTimeEvent:'',
              endTimeEvent:'',
              eventStateOptions:[
                {'label':'全部状态','value':''},
                {'label':'待受理','value':'1'},
                {'label':'处理中','value':'2'},
                {'label':'待审核','value':'3'},
                {'label':'已办结','value':'4'}
              ],
              eventStateValue:'',
              event_word:'',
              event_checked:false,
              eventData: {
                column: [
                  {
                    prop: 'event_name',
                    label: '事件名称',
                    width:200,
                    showOverflowTooltip:true
                  },
                  {
                    prop: 'complete_percent',
                    label: '完成部门/处理部门'
                  },
                  {
                    prop: 'processing_department',
                    label: '处理部门'
                  },
                  {
                    prop: 'sent_time',
                    label: '下发时间'
                  },
                  {
                    prop: 'first_time',
                    label: '初次响应时间'
                  },
                  {
                    prop: 'response_speed',
                    label: '响应速度'
                  },
                  {
                    prop: 'current_state',
                    label: '当前状态'
                  },
                ],
                data: [
                  {
                    event_name: '阿萨达发说说的阿萨德啊请问企鹅请问请问',
                    complete_percent: '1/3',
                    processing_department: '宝安办事处',
                    sent_time: '2016-08-21 08:20:00',
                    first_time: '2017-05-21 08:20:00',
                    response_speed: '00:22',
                    current_state:'已办结'
                  },
                  {
                    event_name: '阿萨达发说说的阿萨德啊请问企鹅请问请问',
                    complete_percent: '1/3',
                    processing_department: '福田办事处',
                    sent_time: '2016-04-23 08:20:00',
                    first_time: '2016-08-11 08:20:00',
                    response_speed: '00:15',
                    current_state:'待审核'
                  },
                  {
                    event_name: '的郭德纲的风格',
                    complete_percent: '1/2',
                    processing_department: '罗湖办事处',
                    sent_time: '2016-08-21 08:20:00',
                    first_time: '2017-05-21 08:20:00',
                    response_speed: '00:22',
                    current_state:'已办结'
                  },
                  {
                    event_name: '的郭德纲的风格',
                    complete_percent: '1/2',
                    processing_department: '南山办事处',
                    sent_time: '2016-08-21 08:20:00',
                    first_time: '2017-05-21 08:20:00',
                    response_speed: '00:22',
                    current_state:'已办结'
                  },
                  {
                    event_name: '企鹅企鹅企鹅企鹅请问',
                    complete_percent: '1/3',
                    processing_department: '宝安办事处',
                    sent_time: '2016-08-21 08:20:00',
                    first_time: '2017-05-21 08:20:00',
                    response_speed: '00:22',
                    current_state:'已办结'
                  },
                  {
                    event_name: '企鹅企鹅企鹅企鹅请问',
                    complete_percent: '1/3',
                    processing_department: '福田办事处',
                    sent_time: '2016-04-23 08:20:00',
                    first_time: '2016-08-11 08:20:00',
                    response_speed: '00:15',
                    current_state:'待审核'
                  },
                ]
              }


            }
        },
        created() {
          this.departmentList()
          this.publicList()
          this.eventList()
        },
        methods: {
          publicHandleSizeChange(val) {

          },
          publicHandleCurrentChange(val) {
              this.publicCurrentPage = val
              this.publicList()
          },
          departmentHandleSizeChange(val) {

          },
          departmentHandleCurrentChange(val) {
              this.departmentCurrentPage = val
              this.departmentList()
          },
          eventHandleSizeChange(val) {

          },
          eventHandleCurrentChange(val) {
              this.eventCurrentPage = val
              this.eventList()
          },

          //按部门统计 点击按钮
          departmentShow(){
            this.ruleTabBoolean1=true
            this.ruleTabBoolean2=false
            this.ruleTabBoolean3=false
            this.checkedInformation=['回复事件','下发数','待受理','处理中','待审核','已办结','完成率']
            this.startTimeDepartment=''
            this.endTimeDepartment=''
            this.departmentValue=''
            this.department_word=''
            this.departmentCurrentPage=1
            this.departmentList()
          },
          //按舆情类型 点击按钮
          typeShow(){
            this.ruleTabBoolean1=false
            this.ruleTabBoolean2=true
            this.ruleTabBoolean3=false
            this.classValue='二级分类'
            this.sortValue='按类型名称排序'
            this.department_checked=false
            this.startTimePublic=''
            this.endTimePublic=''
            this.publicCurrentPage=1
            this.publicList()
          },
          //按事件统计 点击按钮
          eventShow(){
            this.ruleTabBoolean1=false
            this.ruleTabBoolean2=false
            this.ruleTabBoolean3=true
            this.startTimeEvent=''
            this.endTimeEvent=''
            this.eventStateValue=''
            this.event_word=''
            this.event_checked=false
            this.eventCurrentPage=1
            this.eventList()
          },


          //部门统计
          //部门统计列表
          departmentList(){

          },
          //导出
          departmentExport(){

          },
          //搜索
          departmentSearch(){
            this.departmentCurrentPage=1
            this.departmentList()
          },
          //重置
          departmentReset(){
            this.checkedInformation=['回复事件','下发数','待受理','处理中','待审核','已办结','完成率']
            this.startTimeDepartment=''
            this.endTimeDepartment=''
            this.departmentValue=''
            this.department_word=''
          },


          //舆情类型
          //舆情类型列表
          publicList(){

          },
          //舆情类型搜索
          publicTypeSearch(){
            this.publicCurrentPage=1
            this.publicList()
          },
          //导出
          publicExport(){

          },


          //事件统计
          //事件统计列表
          eventList(){

          },
          //导出
          eventExport(){

          },
          //搜索
          eventSearch(){
            this.eventCurrentPage=1
            this.eventList()
          },


          //点击跳转到统计图
          viewMap(){
            this.$router.push({ path: 'statisticAnalysis',query:{

              }
            })
          }


        }

    }

</script>

<style scoped>
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
  border-radius:5px 5px 0 0;
}
</style>
