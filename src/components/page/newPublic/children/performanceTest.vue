<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 绩效考核</el-breadcrumb-item>
                <el-breadcrumb-item>demo</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-table :data="tabledata" style="width:90%;margin:20px 5%;">
             <el-table-column label="部门\考核项" width='120' prop='departmentName'>
             </el-table-column>
             <el-table-column align="center" v-for='item in tableHeadData' :label="item.label" :prop='item.prop' :width='item.width' :key="item.key">
               <el-table-column v-if='item.children||item.children.length>0' v-for="item1 in item.children"
               :label="item1.label" :prop='item1.prop' :width='item1.width' :key="item1.key">
               <el-table-column v-if='item1.children||item1.children.length>0' v-for="item2 in item1.children"
               :label="item2.label" :prop='item2.prop' :width='item2.width' :key="item2.key">
               </el-table-column>
               </el-table-column>
             </el-table-column>
             <el-table-column label="评估分" width='120' prop="assessment">
             </el-table-column>
             <el-table-column label="操作" align="center" width='120'>
               <template slot-scope="scope">
                 <el-button size="small">修改</el-button>
               </template>
             </el-table-column>
           </el-table>


           <el-table
              class="performance_table"
              :data="tableData1"
              :span-method="objectSpanMethod"
              border
              style="width:90%;margin:20px 5%;">
              <el-table-column
                prop="cycle"
                label="考核周期">
              </el-table-column>
              <el-table-column
                prop="items_parent"
                label="考核项" >
              </el-table-column>
              <el-table-column
                prop="items"
                label="考核子项">
              </el-table-column>
              <el-table-column
                prop="type"
                label="部门类型">
              </el-table-column>
              <el-table-column
                prop="default_score"
                label="默认分值">
              </el-table-column>
              <el-table-column
                prop="max_score"
                label="最高分值">
              </el-table-column>
              <el-table-column
                prop="min_score"
                label="最低分值">
              </el-table-column>
              <el-table-column
                prop="association_rules"
                label="关联规则">
              </el-table-column>
              <el-table-column
                prop="public_opinion"
                label="舆情性质">
              </el-table-column>
              <el-table-column
                prop="time_type"
                label="时间类型">
              </el-table-column>
              <el-table-column
                prop="time_require"
                label="时间要求">
              </el-table-column>
              <el-table-column
                prop="single_score"
                label="单次分值">
              </el-table-column>
            </el-table>

            <div id="myChart1" :style="{width: '500px', height: '500px','margin':'20px auto','border':'solid 1px red'}"></div>
            <div id="myChart2" :style="{width: '400px', height: '400px','margin':'20px auto','border':'solid 1px red'}"></div>
            <div id="myChart3" :style="{width: '600px', height: '600px','margin':'20px auto','border':'solid 1px red'}"></div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'performanceTest',
        data: function(){
            return {
               tabledata:[{
                 departmentName:'部门1',
                 a:'1',
                 b:'3',
                 c:'4',
                 d:'6',
                 e:'7',
                 f:'4',
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
                 }
               ],

               tableData1: [
                 {
                   cycle: '半年考核',
                   items_parent:'应急响应',
                   items: '速度(4)',
                   type: '所有类型',
                   default_score: '3',
                   max_score: 10,
                   min_score:1,
                   association_rules:'考核流程',
                   public_opinion:'一般舆情',
                   time_type:'下发时间',
                   time_require:'80分钟',
                   single_score:'6'
                 },{
                   cycle: '半年考核',
                   items_parent:'应急响应',
                   items: '速度(4)',
                   type: '所有类型',
                   default_score: '3',
                   max_score: 10,
                   min_score:1,
                   association_rules:'考核流程',
                   public_opinion:'重大舆情',
                   time_type:'下发时间',
                   time_require:'80分钟',
                   single_score:'6'
                 },{
                   cycle: '半年考核',
                   items_parent:'应急响应',
                   items: '措施(8)',
                   type: '所有类型',
                   default_score: '4',
                   max_score: 12,
                   min_score:1,
                   association_rules:'考核流程',
                   public_opinion:'一般舆情',
                   time_type:'下发时间',
                   time_require:'40分钟',
                   single_score:'2'
                 },{
                   cycle: '半年考核',
                   items_parent:'应急响应',
                   items: '预案(8)',
                   type: '所有类型',
                   default_score: '4',
                   max_score: 12,
                   min_score:1,
                   association_rules:'考核流程',
                   public_opinion:'一般舆情',
                   time_type:'下发时间',
                   time_require:'40分钟',
                   single_score:'2'
                 },{
                   cycle: '半年考核',
                   items_parent:'应急响应',
                   items: '组织调查(10)',
                   type: '所有类型',
                   default_score: '1',
                   max_score: 9,
                   min_score:1,
                   association_rules:'考核流程',
                   public_opinion:'一般舆情',
                   time_type:'考核项时间',
                   time_require:'50分钟',
                   single_score:'5'
                 },{
                   cycle: '半年考核',
                   items_parent:'应急响应',
                   items: '时效性(9)',
                   type: '所有类型',
                   default_score: '2',
                   max_score: 17,
                   min_score:1,
                   association_rules:'可选处置项',
                   public_opinion:'重大舆情',
                   time_type:'下发时间',
                   time_require:'70分钟',
                   single_score:'2'
                 },{
                   cycle: '半年考核',
                   items_parent:'信息发布',
                   items: '持续性(11)',
                   type: '所有类型',
                   default_score: '4',
                   max_score: 15,
                   min_score:1,
                   association_rules:'考核流程',
                   public_opinion:'一般舆情',
                   time_type:'考核项时间',
                   time_require:'40分钟',
                   single_score:'3'
                 },{
                   cycle: '半年考核',
                   items_parent:'信息发布',
                   items: '增长性(11)',
                   type: '所有类型',
                   default_score: '4',
                   max_score: 15,
                   min_score:1,
                   association_rules:'考核流程',
                   public_opinion:'一般舆情',
                   time_type:'下发时间',
                   time_require:'40分钟',
                   single_score:'3'
                 },{
                   cycle: '年度考核',
                   items_parent:'制度措施',
                   items: '媒体应用(6)',
                   type: '所有类型',
                   default_score: '4',
                   max_score: 15,
                   min_score:1,
                   association_rules:'考核流程',
                   public_opinion:'一般舆情',
                   time_type:'考核项时间',
                   time_require:'20分钟',
                   single_score:'2'
                 },{
                   cycle: '年度考核',
                   items_parent:'加分项目',
                   items: '公众反馈(5)',
                   type: '所有类型',
                   default_score: '4',
                   max_score: 15,
                   min_score:1,
                   association_rules:'考核流程',
                   public_opinion:'一般舆情',
                   time_type:'考核项时间',
                   time_require:'10分钟',
                   single_score:'2'
                 },{
                   cycle: '年度考核',
                   items_parent:'加分项目',
                   items: '群众举报(5)',
                   type: '所有类型',
                   default_score: '4',
                   max_score: 15,
                   min_score:1,
                   association_rules:'考核流程',
                   public_opinion:'一般舆情',
                   time_type:'下发时间',
                   time_require:'10分钟',
                   single_score:'2'
                 },{
                   cycle: '年度考核',
                   items_parent:'加分项目',
                   items: '数量质量(5)',
                   type: '所有类型',
                   default_score: '4',
                   max_score: 15,
                   min_score:1,
                   association_rules:'考核流程',
                   public_opinion:'一般舆情',
                   time_type:'下发时间',
                   time_require:'10分钟',
                   single_score:'2'
                 }
               ],
               column_row_offset: {
                 cycle: [8, 4],
                 items_parent:[6,2,1,3],
                 items: [2, 1, 1, 1, 1,1,1,1,1,1,1],
                 type: [2, 1, 1, 1, 1,1,1,1,1,1,1],
                 default_score: [1, 1, 1, 1, 1,1,1,1,1,1,1,1],
                 max_score:[1, 1, 1, 1, 1,1,1,1,1,1,1,1],
                 min_score:[1, 1, 1, 1, 1,1,1,1,1,1,1,1],
                 association_rules:[2, 1, 1, 1, 1,1,1,1,1,1,1],
                 public_opinion:[1, 1, 1, 1, 1,1,1,1,1,1,1,1],
                 time_type:[1, 1, 1, 1, 1,1,1,1,1,1,1,1],
                 time_require:[1, 1, 1, 1, 1,1,1,1,1,1,1,1],
                 single_score:[1, 1, 1, 1, 1,1,1,1,1,1,1,1],
               },
               now_col_row_num: {},
               now_col_offset: {

               }


             }

        },
        mounted(){
          this.drawLine()
          this.drawCircle()
          this.drawColumn()
        },
        methods: {
          drawLine(){
            let myChart = this.$echarts.init(document.getElementById('myChart1'))
            // 绘制图表
            myChart.setOption({
              title: {
                text: '绩效考核分值对比图',
                x:'center',
                y:'top',
                textAlign:'left'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                bottom:0,
                data:['标准分值','本期分值']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                },
                iconStyle:{
                  normal:{
                    textPosition:'left'
                  },
                  emphasis:{
                    textPosition:'top'
                  }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['接受舆情','制定方案','组织调查','采取措施','事情办结','文件上传','附加分值','网络宣传'],
                //设置字体倾斜
                axisLabel: {
                    interval: 0,
                    rotate: 45,
                    margin: 10,
                    textStyle: {
                        // fontWeight: "bolder",
                        // color: "#000000"
                    }
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'标准分值',
                    type:'line',
                    stack: '总量',
                    data:[120, 132, 101, 134, 90, 230, 210,135]
                },
                {
                    name:'本期分值',
                    type:'line',
                    stack: '总量',
                    data:[220, 182, 191, 234, 290, 330, 310,127]
                }
            ]
            })
          },
          drawCircle(){
            let myChart = this.$echarts.init(document.getElementById('myChart2'))
            myChart.setOption({
                title : {
                    text: '舆情处理统计',
                    x:'center',
                    y:'top',
                    textAlign:'left'
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    },
                    iconStyle:{
                      normal:{
                        textPosition:'left'
                      },
                      emphasis:{
                        textPosition:'top'
                      }
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    left: 'center',
                    top:40,
                    data: ['未受理','办理中','已办结']
                },
                series : [
                    {
                        name: '舆情处理统计',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '55%'],
                        data:[
                            {value:335, name:'未受理'},
                            {value:310, name:'办理中'},
                            {value:234, name:'已办结'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal:{
                              label:{
                                show:true,
                                position:'inner',
                                formatter:'{c}',
                                distance:0.7,
                                textStyle:{
                                  align:'center',
                                  baseline:'middle',
                                  fontSize:15
                                }
                              },
                              labelLine:{
                                show:false
                              }
                            }
                        }
                    }
                ]
            })
          },
          drawColumn(){
            let myChart = this.$echarts.init(document.getElementById('myChart3'))
            myChart.setOption({
                title : {
                    text: '绩效考核得分排行榜',
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
                           alignWithLabel: true
                       },
                       //设置字体倾斜
                       axisLabel: {
                           interval: 0,
                           rotate: 45,
                           margin: 10,
                           textStyle: {
                               // fontWeight: "bolder",
                               // color: "#000000"
                           }
                       }
                   }
               ],
               yAxis : [
                   {
                       type : 'value'
                   }
               ],
               series : [
                   {
                       name:'分数',
                       type:'bar',
                       barWidth: '60%',
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
                   end: 50 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
               }]
            })
          },
          objectSpanMethod({ row, column, rowIndex, columnIndex }) {
             if (!this.now_col_row_num[column.property]) {
               this.now_col_row_num[column.property] = Object.assign([], this.column_row_offset[column.property]);
               let a = this.now_col_row_num[column.property].shift();
               this.now_col_offset[column.property] = a;
               return {
                 rowspan: a,
                 colspan: 1
               };
             } else if (rowIndex >= this.now_col_offset[column.property]) {
               let a = this.now_col_row_num[column.property].shift();
               this.now_col_offset[column.property] += a;
               return {
                 rowspan: a,
                 colspan: 1
               };
             } else {
               return {
                 rowspan: 0,
                 colspan: 0
               };
             }

             if (rowIndex % 2 === 0) {
                if (columnIndex === 0) {
                  return [1, 2];
                } else if (columnIndex === 1) {
                  return [0, 0];
                }
              }

           }


        }
    }
</script>
<style scoped>
  .content-box .content .container .el-table .el-table__header-wrapper{
    background:red;
  }
</style>
