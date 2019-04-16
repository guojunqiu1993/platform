<template>
    <div class="table">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 绩效考核</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-new mr10" style="right:185px;" @click="standing()"><i class="iconfont icon-kaohe-mian"></i><span class="span">考核台账</span></el-button>
          <el-button type="primary" class="handle-del mr10" style="right:100px;" @click="filesUpload()"><i class="iconfont icon-shangchuan"></i><span class="span">文件上传</span></el-button>
          <el-button type="primary" class="handle-del mr10"><i class="iconfont icon-xiafa"></i><span class="span">导出</span></el-button>
        </div>
        <div class="container">
              <div class="handle-box">
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
                <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
              </div>
              <div class="table-content">
                <div id="columnChart" style="height:380px;margin:20px 5%;"></div>
              </div>
              <el-table :data="tabledata" style="width:94%;margin-left:3%;">
                 <el-table-column align="center" label="单位\考核项" width='120' prop='departmentName'>
                 </el-table-column>
                 <el-table-column align="center" v-for='item in tableHeadData' :label="item.label" :prop='item.prop' :width='item.width' :key="item.key">
                   <el-table-column align="center" v-if='item.children||item.children.length>0' v-for="item1 in item.children"
                   :label="item1.label" :prop='item1.prop' :width='item1.width' :key="item1.key">
                   <el-table-column align="center" v-if='item1.children||item1.children.length>0' v-for="item2 in item1.children"
                   :label="item2.label" :prop='item2.prop' :width='item2.width' :key="item2.key">
                   </el-table-column>
                   </el-table-column>
                 </el-table-column>
                 <el-table-column align="center" label="总得分" prop="assessment">
                 </el-table-column>
               </el-table>


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
                value:'上半年',
                label:'上半年'
              },{
                value:'下半年',
                label:'下半年'
              }],
              tabledata:[{
                departmentName:'柳州舆情中心',
                a:'1',
                b:'3',
                c:'4',
                d:'6',
                e:'7',
                f:'4',
                g:'4',
                h:'4',
                i:'4',
                j:'3',
                k:'6',
                l:'8',
                assessment:'40',
                id:1
              }],
              tableHeadData:[
                {
                  key:1,
                  label:'舆情处置流程',
                  prop:'',
                  children:[
                    {key:2,label:'接收舆情(8)',prop:'a'},
                    {key:3,label:'制定方案(6)',prop:'b'},
                    {key:4,label:'组织调查(8)',prop:'c'},
                    {key:5,label:'采取措施(6)',prop:'d'},
                    {key:6,label:'事情办结(6)',prop:'e'}
                  ]
                },{
                  key:7,
                  label:'网络宣传引导',
                  prop:'',
                  width:'',
                  children:[
                    {key:8,label:'信息发布(3)',prop:'f'},
                    {key:9,label:'善用媒体(4)',prop:'g'},
                    {key:10,label:'媒体应对(4)',prop:'h'}
                  ]
                },{
                  key:11,
                  label:'文件上传',
                  prop:'',
                  width:'',
                  children:[
                    {key:12,label:'制度文件(3)',prop:'i'},
                    {key:13,label:'领导批示(3)',prop:'j'}
                  ]
                },{
                  key:14,
                  label:'附加分值',
                  prop:'',
                  width:'',
                  children:[
                    {key:15,label:'签到(3)',prop:'k'},
                    {key:16,label:'舆情数量(3)',prop:'l'}
                  ]
                }
              ]

            }
        },
        created() {

        },
        mounted(){
            $(".table-content").width(document.documentElement.clientWidth - 291)
            $("#columnChart").width($(".table-content").width()*0.9)
            this.drawColumn()
        },
        computed: {

        },
        methods: {
          search(){

          },
          //点击跳考核台账页面
          standing(){
            this.$router.push({ path: 'standingSpoke', query: {

              }
            })
          },
          //点击文件上传
          filesUpload(){
            this.$router.push({ path: 'filesUpload', query: {

              }
            })
          },
          drawColumn(){
            let myChart = this.$echarts.init(document.getElementById('columnChart'))
            myChart.setOption({
               title : {
                   text: '分值对比图',
                   x:'center',
                   y:'top',
                   textAlign:'left'
               },
              tooltip : {
                  trigger: 'axis',
                  axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                      type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  }
              },
              legend: {
                  data: ['总分','得分'],
                  padding: 30
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              xAxis:  {
                 axisTick: {
                      show:true
                  },
                  axisLine:{
                       show:true,
                       lineStyle: {
                         color: '#898e92'
                       }
                  },
                  type: 'category',
                  data: ['周一','周二','周三','周四','周五','周六','周日','周一','周二','周三','周四','周五','周六','周日']
              },
              yAxis: {
                   type: 'value',
                   axisTick: {
                       show:false
                   },
                   axisLine:{show:false},
                   axisLabel: {
                       textStyle: {
                           color: "#898e92"
                       }
                   }
              },
              series: [
                  {
                      name: '得分',
                      type: 'bar',
                      stack: '总量',
                      color:'#c566ff',
                      // label: {
                      //     normal: {
                      //         show: true,
                      //         position: 'insideRight'
                      //     }
                      // },
                      data: [120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210]
                  },
                  {
                      name: '总分',
                      type: 'bar',
                      stack: '总量',
                      color:'#3679ec',
                      // label: {
                      //     normal: {
                      //         show: true,
                      //         position: 'insideRight'
                      //     }
                      // },
                      data: [320, 302, 301, 334, 390, 330, 320,320, 302, 301, 334, 390, 330, 320]
                  }
              ]
            })
          }


        }
    }

</script>

<style scoped>

</style>
