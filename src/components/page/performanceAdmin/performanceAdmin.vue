<template>
    <div class="table">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 绩效考核</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-new mr10" style="right:130px;" @click="standing()"><i class="iconfont icon-kaohe-mian"></i><span class="span">考核台账</span></el-button>
          <el-button type="primary" class="handle-del mr10" @click="informationHit()"><i class="iconfont icon-shenhe1"></i><span class="span">资料审核</span></el-button>
        </div>
        <div class="container">
              <div class="handle-box" style="margin-bottom:0px;">
                <el-select v-model="yearValue" placeholder="" class="handle-select" style="margin-bottom:10px;">
                    <el-option
                      v-for="item in yearOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="halfYearValue" placeholder="" class="handle-select">
                    <el-option
                      v-for="item in halfYearOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="quarterValue" placeholder="" class="handle-select">
                    <el-option
                      v-for="item in quarterOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="monthValue" placeholder="" class="handle-select">
                    <el-option
                      v-for="item in monthOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="departmentRankValue" placeholder="" class="handle-select">
                    <el-option
                      v-for="item in departmentRankOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="departmentOpinionValue" placeholder="" class="handle-select">
                    <el-option
                      v-for="item in departmentOpinionOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <br/>
                <el-select v-model="scoreValue" placeholder="" class="handle-select" style="width:170px;">
                    <el-option
                      v-for="item in scoreOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-show='echartVisible' v-model="company_word" placeholder="请输入单位名称" class="handle-input mr10"></el-input>
                <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
              </div>
              <div class="handle-box" style="text-align:right;">
                  <i class="iconfont icon-tongji icon-checks" v-show='tableVisible' title="切换到柱状图" @click="tableCheck()"></i>
                  <i class="iconfont icon-biaoge icon-checks" v-show='echartVisible' title="切换到考核表" @click="echartCheck()"></i>
                  <i class="iconfont icon-xiafa icon-checks" title="导出"></i>
              </div>
              <div class="table-content">
                <el-table :data="tabledata" v-show='tableVisible'>
                   <el-table-column align="center" label="部门\考核项" width='120' prop='departmentName'>
                   </el-table-column>
                   <el-table-column align="center" v-for='item in tableHeadData' :label="item.label" :prop='item.prop' :width='item.width' :key="item.key">
                     <el-table-column align="center" v-if='item.children||item.children.length>0' v-for="item1 in item.children"
                     :label="item1.label" :prop='item1.prop' :width='item1.width' :key="item1.key">
                     <el-table-column align="center" v-if='item1.children||item1.children.length>0' v-for="item2 in item1.children"
                     :label="item2.label" :prop='item2.prop' :width='item2.width' :key="item2.key">
                     </el-table-column>
                     </el-table-column>
                   </el-table-column>
                   <el-table-column align="center" label="评估分" prop="assessment">
                   </el-table-column>
                   <el-table-column label="操作" align="center" >
                     <template slot-scope="scope">
                       <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                     </template>
                   </el-table-column>
                 </el-table>

                 <div id="columnChart" v-show='echartVisible' style="width:90%;height:380px;margin:20px 5%;"></div>

              </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
    export default {
        name: 'performanceAdmin',
        data() {
            return {
              tableVisible:true,
              echartVisible:false,
              company_word:'',
              yearValue:'2019',
              yearOptions:[{
                value:'2019',
                label:'2019'
              },{
                value:'2018',
                label:'2018'
              }],
              halfYearValue:'上半年',
              halfYearOptions:[{
                value:'全年',
                label:'全年'
              },{
                value:'上半年',
                label:'上半年'
              },{
                value:'下半年',
                label:'下半年'
              }],
              quarterValue:'全年',
              quarterOptions:[{
                value:'全年',
                label:'全年'
              },{
                value:'第一季度',
                label:'第一季度'
              },{
                value:'第二季度',
                label:'第二季度'
              },{
                value:'第三季度',
                label:'第三季度'
              },{
                value:'第四季度',
                label:'第四季度'
              }],
              monthValue:'全年',
              monthOptions:[{
                value:'全年',
                label:'全年'
              },{
                value:'一月',
                label:'一月'
              },{
                value:'二月',
                label:'二月'
              },{
                value:'三月',
                label:'三月'
              },{
                value:'三月',
                label:'三月'
              },{
                value:'四月',
                label:'四月'
              },{
                value:'五月',
                label:'五月'
              },{
                value:'六月',
                label:'六月'
              },{
                value:'七月',
                label:'七月'
              },{
                value:'八月',
                label:'八月'
              },{
                value:'九月',
                label:'九月'
              },{
                value:'十月',
                label:'十月'
              },{
                value:'十一月',
                label:'十一月'
              },{
                value:'十二月',
                label:'十二月'
              }],
              departmentRankValue:'全部部门',
              departmentRankOptions:[{
                value:'全部部门',
                label:'全部部门'
              },{
                value:'a部门',
                label:'a部门'
              },{
                value:'b部门',
                label:'b部门'
              },{
                value:'c部门',
                label:'c部门'
              }],
              departmentOpinionValue:'全部部门',
              departmentOpinionOptions:[{
                value:'全部部门',
                label:'全部部门'
              },{
                value:'仅有舆情部门',
                label:'仅有舆情部门'
              }],
              scoreValue:'按考核分值由高到低',
              scoreOptions:[{
                value:'按考核分值由高到低',
                label:'按考核分值由高到低'
              },{
                value:'按考核分值由低到高',
                label:'按考核分值由低到高'
              }],
              tabledata:[{
                departmentName:'部门1',
                a:'1',
                b:'3',
                c:'4',
                d:'6',
                e:'7',
                f:'4',
                g:'4',
                h:'4',
                i:'4',
                assessment:'20',
                id:1
              },{
                departmentName:'部门2',
                a:'4',
                b:'2',
                c:'5',
                d:'3',
                e:'8',
                f:'2',
                g:'4',
                h:'4',
                i:'4',
                assessment:'20',
                id:2
              },{
                departmentName:'部门3',
                a:'4',
                b:'2',
                c:'5',
                d:'2',
                e:'4',
                f:'2',
                g:'4',
                h:'3',
                i:'4',
                assessment:'18',
                id:3
              },{
                departmentName:'部门4',
                a:'4',
                b:'2',
                c:'5',
                d:'1',
                e:'2',
                f:'1',
                g:'4',
                h:'4',
                i:'4',
                assessment:'16',
                id:4
              },{
                departmentName:'部门5',
                a:'1',
                b:'2',
                c:'3',
                d:'3',
                e:'5',
                f:'2',
                g:'4',
                h:'2',
                i:'4',
                assessment:'19',
                id:5
              },{
                departmentName:'部门6',
                a:'2',
                b:'1',
                c:'4',
                d:'3',
                e:'5',
                f:'2',
                g:'3',
                h:'3',
                i:'4',
                assessment:'20',
                id:6
              },{
                departmentName:'部门7',
                a:'2',
                b:'2',
                c:'3',
                d:'3',
                e:'2',
                f:'2',
                g:'2',
                h:'4',
                i:'4',
                assessment:'16',
                id:7
              },{
                departmentName:'部门8',
                a:'4',
                b:'2',
                c:'1',
                d:'3',
                e:'3',
                f:'2',
                g:'4',
                h:'2',
                i:'2',
                assessment:'17',
                id:8
              },{
                departmentName:'部门9',
                a:'4',
                b:'2',
                c:'5',
                d:'3',
                e:'4',
                f:'2',
                g:'2',
                h:'3',
                i:'2',
                assessment:'16',
                id:9
              },{
                departmentName:'部门10',
                a:'4',
                b:'2',
                c:'5',
                d:'3',
                e:'8',
                f:'2',
                g:'4',
                h:'4',
                i:'4',
                assessment:'20',
                id:2
              }],
              tableHeadData:[
                {
                  key:1,
                  label:'应急措施',
                  prop:'',
                  children:[
                    {key:2,label:'接收(8)',prop:'a'},
                    {key:3,label:'措施(6)',prop:'b'}
                  ]
                },{
                  key:4,
                  label:'行动措施',
                  prop:'',
                  width:'',
                  children:[
                    {key:5,label:'措施(3)',prop:'c'},
                    {key:6,label:'反馈(4)',prop:'d'}
                  ]
                },{
                  key:7,
                  label:'应对成效',
                  prop:'',
                  width:'',
                  children:[
                    {key:8,label:'信息发布(3)',prop:'e'},
                    {key:9,label:'媒体(3)',prop:'f'}
                  ]
                },{
                  key:10,
                  label:'其他',
                  prop:'',
                  width:'',
                  children:[
                    {key:11,label:'签到(3)',prop:'g'},
                    {key:12,label:'舆情数量(3)',prop:'h'},
                    {key:13,label:'上报舆情(3)',prop:'i'}
                  ]
                }
              ]

            }
        },
        created() {

        },
        mounted(){
            $(".table-content").width(document.documentElement.clientWidth - 271)
            $("#columnChart").width($(".table-content").width()*0.9)
            this.drawColumn()
        },
        computed: {

        },
        methods: {
          search(){

          },
          tableCheck(){
            this.tableVisible=false
            this.echartVisible=true
          },
          echartCheck(){
            this.tableVisible=true
            this.echartVisible=false
          },
          //点击跳考核台账页面
          standing(){
            this.$router.push({ path: 'standingAdmin', query: {

              }
            })
          },
          //考核表修改
          handleEdit(index, row){
            this.$router.push({ path: 'assessEdit', query: {

              }
            })
          },
          //点击资料审核按钮
          informationHit(){
            this.$router.push({ path: 'informationAudition', query: {

              }
            })
          },
          drawColumn(){
            let myChart = this.$echarts.init(document.getElementById('columnChart'))
            myChart.setOption({
                title : {
                    // text: '绩效考核得分排行榜',
                    x:'center',
                    y:'top',
                    textAlign:'left'
                },
               color: ['#3398DB'],
               tooltip : {
                   trigger: 'axis',
                   axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                       type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                   }
               },
               grid: {
                   left: '3%',
                   right: '4%',
                   bottom: '6%',
                   containLabel: true
               },
               xAxis : [
                   {
                       type : 'category',
                       data : ['单位1', '单位2', '单位3', '单位4', '单位5', '单位6', '单位7','单位8', '单位9', '单位10', '单位11', '单位12', '单位13', '单位14', '单位15', '单位16', '单位17', '单位18', '单位19', '单位20', '单位21', '单位22', '单位23', '单位24', '单位25', '单位26', '单位27', '单位28', '单位29', '单位30'],
                       axisTick: {
                           show:true
                       },
                       axisLine:{
                            show:true,
                            lineStyle: {
                              color: '#d3d7e0'
                            }
                       },
                       //设置字体倾斜
                       axisLabel: {
                           interval: 0,
                           rotate: 45,
                           margin: 10,
                           textStyle: {
                               color: "#5d5d5d"
                           }
                       }
                   }
               ],
               yAxis : [
                   {
                       type : 'value',
                       axisTick: {
                           show:false
                       },
                       axisLine:{show:false},
                       axisLabel: {
                           textStyle: {
                               color: "#898e92"
                           }
                       }
                   }
               ],
               series : [
                   {
                       name:'分数',
                       type:'bar',
                       barWidth: '60%',
                       itemStyle: {
        		              normal: {
                            barBorderRadius: [15,15,0,0],
        		                //颜色渐变
        		                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        		                  offset: 0,
        		                  color: '#9993f7'
        		                }, {
        		                  offset: 1,
        		                  color: '#3679ec'
        		                }])
        		              }
        		            },
                       data:[10, 52, 200, 334, 390, 330, 220,10, 52, 200, 334, 390, 330,34,135,10, 52, 200, 334, 390, 330, 220,10, 52, 200, 334, 390, 330,34,135]
                   }
               ],
               dataZoom: [{
                   type: 'slider',
                   show: true, //flase直接隐藏图形
                   xAxisIndex: [0],
                   left: '9%', //滚动条靠左侧的百分比
                   bottom: -5,
                   start: 0,//滚动条的起始位置
                   end: 72 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
               }]
            })
          }


        }
    }

</script>

<style scoped>
.icon-checks{
  color:#4489ff;
  font-size:20px;
  cursor:pointer;
}

</style>
