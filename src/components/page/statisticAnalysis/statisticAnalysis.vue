<template>
    <div class="table">
      <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 统计分析</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-export mr10" @click="viewChart()"><i class="iconfont icon-create-orders"></i><span class="span">查看统计表</span></el-button>
      </div>
      <div class="container">
        <div class="handle-box" style="margin-bottom:0px;">
          <el-select v-model="type_word" placeholder="请选择" class="handle-select" style="width:180px;" @change="typeSelect()">
              <el-option
                v-for="item in statisticTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          <el-select v-model="range_word" placeholder="请选择" class="handle-select" :disabled="type_word==4?true:false">
              <el-option
                v-for="item in statisticRangeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          <el-select v-model="flex_word" placeholder="请选择" class="handle-select" v-show="type_word==1||type_word==5">
              <el-option
                v-for="item in statisticFlexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          <el-date-picker v-model="startTimeHandle" placeholder="开始日期" :picker-options="startTimeEvent" type="date" value-format="yyyy-MM-dd"></el-date-picker>
          <span>至</span>
          <el-date-picker v-model="endTimeHandle" placeholder="结束日期" :picker-options="endTimeEvent" type="date" value-format="yyyy-MM-dd"></el-date-picker>
          <el-button  type="primary" class="handle-search mr10" @click="produce()" style="padding:8px;"><span class="span">生成统计图</span></el-button>
        </div>
        <div class="handle-box">
          <span style="font-size:14px;">{{statistic_word}}</span>
          <div class="days-change" v-show="opinion_show">
            <el-button :disabled="opinionChange_show==1?true:false" @click="opinionMonths()" :class="opinionMonth ? 'active' : '' " style="padding:0px;margin:0px;border-radius:3px 0 0 3px;">月</el-button>
            <el-button :disabled="opinionChange_show==1?true:false" @click="opinionWeeks()" :class="opinionWeek ? 'active' : '' " style="padding:0px;margin:0px;border-radius:0 3px 3px 0;">周</el-button>
          </div>
          <div class="days-change" v-show="dispose_show">
            <el-button :disabled="disposeChange_show==1?true:false" @click="disposeMonths()" :class="disposeMonth ? 'active' : '' " style="padding:0px;margin:0px;border-radius:3px 0 0 3px;">月</el-button>
            <el-button :disabled="disposeChange_show==1?true:false" @click="disposeWeeks()" :class="disposeWeek ? 'active' : '' " style="padding:0px;margin:0px;border-radius:0 3px 3px 0;">周</el-button>
          </div>
          <div class="days-change" v-show="sent_show">
            <el-button :disabled="sentChange_show==1?true:false" @click="sentMonths()" :class="sentMonth ? 'active' : '' " style="padding:0px;margin:0px;border-radius:3px 0 0 3px;">月</el-button>
            <el-button :disabled="sentChange_show==1?true:false" @click="sentWeeks()" :class="sentWeek ? 'active' : '' " style="padding:0px;margin:0px;border-radius:0 3px 3px 0;">周</el-button>
          </div>
        </div>
        <div class="table-content" style="padding:0px;">
          <div id="columnChart" style="height:380px;margin:20px 5%;" v-show="column_visible"></div>
          <div id="mixtureChart" style="height:380px;margin:70px 5% 0px 5%;" v-show="mixture_visible"></div>
        </div>
      </div>


    </div>
</template>

<script>
    import axios from 'axios'
    import echarts from 'echarts'
    import $ from 'jquery'
    export default {
        name: 'statisticAnalysis',
        data() {
            return {
              statistic_word:'舆情分类统计TOP10',
              column_visible:true,
              mixture_visible:false,
              opinionMonth:true,
              opinionWeek:false,
              sentMonth:true,
              sentWeek:false,
              disposeMonth:true,
              disposeWeek:false,
              startTimeEvent: {
                disabledDate: time => {
                  let endDateVal = this.endTimeHandle
                  if (endDateVal) {
                    return time.getTime() > new Date(endDateVal).getTime();
                  }
                }
              },
              endTimeEvent: {
                disabledDate: time => {
                  let beginDateVal = this.startTimeHandle
                  if (beginDateVal) {
                    return (
                      time.getTime() <
                      new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
                    );
                  }
                }
              },
              startTimeHandle:'',
              endTimeHandle:'',
              statisticTypeOptions:[{
                'label':'舆情分类统计',
                'value':'1'
              },{
                'label':'舆情性质统计',
                'value':'2'
              },{
                'label':'舆情处理情况统计',
                'value':'3'
              },{
                'label':'舆情下发统计',
                'value':'4'
              },{
                'label':'舆情类型与性质统计',
                'value':'5'
              }],
              type_word:'1',
              statisticRangeOptions:[{
                'label':'全部',
                'value':''
              },{
                'label':'本单位',
                'value':'本单位'
              },{
                'label':'A类部门',
                'value':'A类部门'
              },{
                'label':'B类部门',
                'value':'B类部门'
              },{
                'label':'C类部门',
                'value':'C类部门'
              }],
              range_word:'',
              statisticFlexOptions:[{
                'label':'一级分类',
                'value':'一级分类'
              },{
                'label':'二级分类',
                'value':'二级分类'
              }],
              flex_word:'一级分类',
              opinionChange_show:1,
              opinion_show:false,
              sentChange_show:1,
              sent_show:false,
              disposeChange_show:1,
              dispose_show:false,
            }
        },
        created() {

        },
        mounted(){
          $(".table-content").width(document.documentElement.clientWidth - 211)
          $("#columnChart").width($(".table-content").width()*0.9)
          $("#mixtureChart").width($(".table-content").width()*0.9)
          this.produce()
        },
        methods: {
          //生成统计图 舆情性质
          produce(){
            let statisticType=''
            statisticType=this.type_word
            let obj1={},obj2={},obj3={},obj5={}
            obj1={
              arr1:['分类1','分类2','分类3','分类4','分类5','分类6','分类7','分类8','分类9','分类10'],
              arr2:[
                  {value:335, name:'分类1'},
                  {value:345, name:'分类2'},
                  {value:234, name:'分类3'},
                  {value:135, name:'分类4'},
                  {value:348, name:'分类5'},
                  {value:134, name:'分类6'},
                  {value:310, name:'分类7'},
                  {value:234, name:'分类8'},
                  {value:135, name:'分类9'},
                  {value:226, name:'分类10'}
              ]
            }
            obj2={
              fileName:'各单位舆情统计图',
              arr1:['一般舆情','较大舆情','重大舆情','舆情总数'],
              arr2:['单位1','单位2','单位3','单位4','单位5','单位6','单位7','单位8','单位9','单位10','单位11','单位12'],
              arr3:[
                    {
                        name:'一般舆情',
                        type:'bar',
                        data:[4, 6, 8, 4, 5, 7, 4, 8, 12, 20, 41, 31]
                    },
                    {
                        name:'较大舆情',
                        type:'bar',
                        data:[26, 19, 9, 26, 28, 34, 26, 10, 40, 18, 6, 39]
                    },
                    {
                        name:'重大舆情',
                        type:'bar',
                        data:[26, 19, 23, 26, 21, 16, 17, 18, 48, 18, 5, 50]
                    },
                    {
                        name:'舆情总数',
                        type:'line',
                        data:[56, 44, 40, 56, 54, 58, 46, 73, 46, 45, 32, 120]
                    }
                ]
            }





            obj3={
              fileName:'各单位处理情况',
              arr1:['未受理','办理中','待审核','已办结','舆情总数'],
              arr2:['单位1','单位2','单位3','单位4','单位5','单位6','单位7','单位8','单位9','单位10','单位11','单位12'],
              arr3:[
                    {
                        name:'未受理',
                        type:'bar',
                        data:[4, 6, 8, 4, 5, 7, 4, 8, 12, 20, 41, 31]
                    },
                    {
                        name:'办理中',
                        type:'bar',
                        data:[26, 19, 9, 26, 28, 34, 26, 10, 40, 18, 6, 39]
                    },
                    {
                        name:'待审核',
                        type:'bar',
                        data:[26, 19, 23, 26, 21, 16, 17, 18, 48, 18, 5, 50]
                    },
                    {
                        name:'已办结',
                        type:'bar',
                        data:[3, 5, 5, 3, 2, 7, 8, 7, 6, 4, 4, 2]
                    },
                    {
                        name:'舆情总数',
                        type:'line',
                        data:[56, 44, 40, 56, 54, 58, 46, 73, 46, 45, 32, 120]
                    }
                ]
            }



            obj5={
              fileName:'舆情分类与性质统计',
              arr1:['一般舆情','较大舆情','重大舆情','舆情总数'],
              arr2:['类型1','类型2','类型3','类型4','类型5','类型6','类型7','类型8','类型9','类型10','类型11','类型12'],
              arr3:[
                    {
                        name:'一般舆情',
                        type:'bar',
                        data:[5, 7, 7, 3, 5, 7, 4, 8, 12, 20, 41, 31]
                    },
                    {
                        name:'较大舆情',
                        type:'bar',
                        data:[26, 19, 9, 16, 28, 34, 26, 10, 30, 18, 6, 39]
                    },
                    {
                        name:'重大舆情',
                        type:'bar',
                        data:[26, 19, 23, 26, 21, 16, 17, 18, 48, 18, 5, 50]
                    },
                    {
                        name:'舆情总数',
                        type:'line',
                        data:[66, 34, 60, 46, 54, 38, 57, 53, 76, 55, 42, 150]
                    }
                ]
            }

            //计算天数
            let st=new Date(this.startTimeHandle)
            let et=new Date(this.endTimeHandle)
            let time = et.getTime()-st.getTime()
            let days = Number(parseFloat(time / (24 * 60 * 60 * 1000))+1)
            if(!days||days=='NaN'){
              days=0
            }
            if(statisticType=='1'){
              this.drawColumn(obj1.arr1,obj1.arr2)
              this.column_visible=true
              this.mixture_visible=false
              this.sent_show=false
              this.opinion_show=false
              this.dispose_show=false
            }else if(statisticType=='2'){
              this.column_visible=false
              this.mixture_visible=true
              this.dispose_show=false
              this.sent_show=false
              // "本单位" 才有周月的判断  如果是"全部" "部门",不显示周月切换,显示各级单位的数据
              if(this.range_word=='本单位'){
                this.statistic_word='本单位舆情性质统计'
                this.opinion_show=true
                if(days>60){
                  this.opinionChange_show=1
                }else{
                  this.opinionChange_show=0
                }
                this.opinionMonths()
              }else{
                this.statistic_word='各单位舆情性质统计'
                this.opinion_show=false
                this.drawMixture(obj2.arr1,obj2.arr2,obj2.arr3,obj2.fileName)
              }
            }else if(statisticType=='3'){
              this.column_visible=false
              this.mixture_visible=true
              this.opinion_show=false
              this.sent_show=false
              // "本单位" 才有周月的判断  如果是"全部" "部门",不显示周月切换,显示各级单位的数据
              if(this.range_word=='本单位'){
                this.statistic_word='本单位舆情处置情况'
                this.dispose_show=true
                if(days>60){
                  this.disposeChange_show=1
                }else{
                  this.disposeChange_show=0
                }
                this.disposeMonths()
              }else{
                this.statistic_word='各单位舆情处置情况'
                this.dispose_show=false
                this.drawMixture(obj3.arr1,obj3.arr2,obj3.arr3,obj3.fileName)
              }
            }else if(statisticType=='4'){
              this.column_visible=false
              this.mixture_visible=true
              this.opinion_show=false
              this.dispose_show=false
              this.sent_show=true
              if(days>60){
                this.sentChange_show=1
              }else{
                this.sentChange_show=0
              }
              this.sentMonths()

            }else if(statisticType=='5'){
              this.sent_show=false
              this.drawMixture(obj5.arr1,obj5.arr2,obj5.arr3,obj5.fileName)
              this.column_visible=false
              this.mixture_visible=true
              this.opinion_show=false
              this.dispose_show=false
            }




          },
          opinionMonths(){
            let obj2_month={}
            obj2_month={
              fileName:'本单位舆情统计图(月)',
              arr1:['一般舆情','较大舆情','重大舆情','舆情总数'],
              arr2:['2018-03','2018-04','2018-05','2018-06','2018-07','2018-08','2018-09','2018-10','2018-11','2018-12','2019-01','2019-02'],
              arr3:[
                    {
                        name:'一般舆情',
                        type:'bar',
                        data:[4, 6, 8, 4, 5, 7, 4, 8, 12, 20, 41, 31]
                    },
                    {
                        name:'较大舆情',
                        type:'bar',
                        data:[26, 19, 9, 26, 28, 34, 26, 10, 40, 18, 6, 39]
                    },
                    {
                        name:'重大舆情',
                        type:'bar',
                        data:[26, 19, 23, 26, 21, 16, 17, 18, 48, 18, 5, 50]
                    },
                    {
                        name:'舆情总数',
                        type:'line',
                        data:[56, 44, 40, 56, 54, 58, 46, 73, 46, 45, 32, 120]
                    }
                ]
            }


            this.opinionMonth=true
            this.opinionWeek=false
            this.drawMixture(obj2_month.arr1,obj2_month.arr2,obj2_month.arr3,obj2_month.fileName)
          },
          opinionWeeks(){
            let obj2_week={}
            obj2_week={
              fileName:'本单位舆情统计图(周)',
              arr1:['一般舆情','较大舆情','重大舆情','舆情总数'],
              arr2:['04-10','04-15','04-20','04-25'],
              arr3:[
                    {
                        name:'一般舆情',
                        type:'bar',
                        data:[4, 6, 8, 4]
                    },
                    {
                        name:'较大舆情',
                        type:'bar',
                        data:[26, 19, 9, 26]
                    },
                    {
                        name:'重大舆情',
                        type:'bar',
                        data:[26, 19, 23, 26]
                    },
                    {
                        name:'舆情总数',
                        type:'line',
                        data:[56, 44, 40, 56]
                    }
                ]
            }

            this.opinionMonth=false
            this.opinionWeek=true
            this.drawMixture(obj2_week.arr1,obj2_week.arr2,obj2_week.arr3,obj2_week.fileName)
          },


          sentMonths(){
            let obj4_month={}
            obj4_month={
              fileName:'舆情下发统计图(月)',
              arr1:['一般舆情','较大舆情','重大舆情','下发舆情'],
              arr2:['2018-03','2018-04','2018-05','2018-06','2018-07','2018-08','2018-09','2018-10','2018-11','2018-12','2019-01','2019-02'],
              arr3:[
                    {
                        name:'一般舆情',
                        type:'bar',
                        data:[4, 6, 8, 4, 5, 7, 4, 8, 12, 20, 41, 31]
                    },
                    {
                        name:'较大舆情',
                        type:'bar',
                        data:[26, 19, 9, 26, 28, 34, 26, 10, 40, 18, 6, 39]
                    },
                    {
                        name:'重大舆情',
                        type:'bar',
                        data:[26, 19, 23, 26, 21, 16, 17, 18, 48, 18, 5, 50]
                    },
                    {
                        name:'下发舆情',
                        type:'line',
                        data:[56, 44, 40, 56, 54, 58, 46, 73, 46, 45, 32, 120]
                    }
                ]
            }


            this.sentMonth=true
            this.sentWeek=false
            this.drawMixture(obj4_month.arr1,obj4_month.arr2,obj4_month.arr3,obj4_month.fileName)
          },
          sentWeeks(){
            let obj4_week={}
            obj4_week={
              fileName:'舆情下发统计图(周)',
              arr1:['一般舆情','较大舆情','重大舆情','下发舆情'],
              arr2:['04-10','04-15','04-20','04-25'],
              arr3:[
                    {
                        name:'一般舆情',
                        type:'bar',
                        data:[4, 6, 8, 4]
                    },
                    {
                        name:'较大舆情',
                        type:'bar',
                        data:[26, 19, 9, 26]
                    },
                    {
                        name:'重大舆情',
                        type:'bar',
                        data:[26, 19, 23, 26]
                    },
                    {
                        name:'下发舆情',
                        type:'line',
                        data:[56, 44, 40, 56]
                    }
                ]
            }

            this.sentMonth=false
            this.sentWeek=true
            this.drawMixture(obj4_week.arr1,obj4_week.arr2,obj4_week.arr3,obj4_week.fileName)
          },

          disposeMonths(){
            let obj3_month={}
            obj3_month={
              fileName:'本单位舆情处置情况统计图(月)',
              arr1:['未受理','办理中','待审核','已办结','舆情总数'],
              arr2:['2018-03','2018-04','2018-05','2018-06','2018-07','2018-08','2018-09','2018-10','2018-11','2018-12','2019-01','2019-02'],
              arr3:[
                    {
                        name:'未受理',
                        type:'bar',
                        data:[4, 6, 8, 4, 5, 7, 4, 8, 12, 20, 41, 31]
                    },
                    {
                        name:'办理中',
                        type:'bar',
                        data:[26, 19, 9, 26, 28, 34, 26, 10, 40, 18, 6, 39]
                    },
                    {
                        name:'待审核',
                        type:'bar',
                        data:[23, 12, 9, 26, 38, 24, 23, 20, 10, 14, 8, 39]
                    },
                    {
                        name:'已办结',
                        type:'bar',
                        data:[26, 19, 23, 26, 21, 16, 17, 18, 48, 18, 5, 50]
                    },
                    {
                        name:'舆情总数',
                        type:'line',
                        data:[56, 44, 40, 56, 54, 58, 46, 73, 46, 45, 32, 120]
                    }
                ]
            }


            this.disposeMonth=true
            this.disposeWeek=false
            this.drawMixture(obj3_month.arr1,obj3_month.arr2,obj3_month.arr3,obj3_month.fileName)
          },
          disposeWeeks(){
            let obj3_week={}
            obj3_week={
              fileName:'本单位舆情处置情况统计图(周)',
              arr1:['未受理','办理中','待审核','已办结','舆情总数'],
              arr2:['04-10','04-15','04-20','04-25'],
              arr3:[
                    {
                        name:'未受理',
                        type:'bar',
                        data:[4, 6, 8, 4]
                    },
                    {
                        name:'办理中',
                        type:'bar',
                        data:[26, 19, 9, 26]
                    },
                    {
                        name:'待审核',
                        type:'bar',
                        data:[12, 23, 12, 36]
                    },
                    {
                        name:'已办结',
                        type:'bar',
                        data:[26, 19, 23, 26]
                    },
                    {
                        name:'舆情总数',
                        type:'line',
                        data:[56, 44, 40, 56]
                    }
                ]
            }

            this.disposeMonth=false
            this.disposeWeek=true
            this.drawMixture(obj3_week.arr1,obj3_week.arr2,obj3_week.arr3,obj3_week.fileName)
          },

          //类型统计下拉框事件
          typeSelect(){
            if(this.type_word=='1'){
              this.statistic_word='舆情分类统计TOP10'
            }else if(this.type_word=='2'){
              this.statistic_word='各单位舆情性质统计'
            }else if(this.type_word=='3'){
              this.statistic_word='各单位处理情况统计'
            }else if(this.type_word=='4'){
              this.statistic_word='舆情下发统计'
              this.range_word=''
            }else if(this.type_word=='5'){
              this.statistic_word='舆情类型与性质统计'
            }
          },
          drawColumn(arr1,arr2){
            let myChart = this.$echarts.init(document.getElementById('columnChart'))
            myChart.setOption({
                title : {
                    text: '',
                    subtext: '',
                    x:'center'
                },
                toolbox: {
                    feature: {
                        saveAsImage: {show: true,title:'保存',name:'舆情分类统计'}
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    bottom: 10,
                    left: 'right',
                    data: arr1
                },
                series : [
                    {
                        name: '',
                        type: 'pie',
                        radius : '65%',
                        center: ['45%', '60%'],
                        data:arr2,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
          },
          drawMixture(arr1,arr2,arr3,fileName){
            let myChart1 = this.$echarts.init(document.getElementById('mixtureChart'))
            myChart1.setOption({
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'cross',
                      crossStyle: {
                          color: '#999'
                      }
                  }
              },
              toolbox: {
                  feature: {
                      saveAsImage: {show: true,title:'保存',name:fileName}
                  }
              },
              legend: {
                  data:arr1
              },
              xAxis: [
                  {
                      type: 'category',
                      data:arr2,
                      axisPointer: {
                          type: 'shadow'
                      }
                  }
              ],
              yAxis: [
                  {
                      type: 'value',
                      name: '舆情数',
                      // min: 0,
                      // max: 250,
                      // interval: 50,
                      axisLabel: {
                          formatter: '{value} '
                      }
                  }
              ],
              series:arr3,
              dataZoom: [{
                  type: 'slider',
                  show: true, //flase直接隐藏图形
                  xAxisIndex: [0],
                  left: '9%', //滚动条靠左侧的百分比
                  bottom: -5,
                  start: 0,//滚动条的起始位置
                  end: 80 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
              }]
            })
          },
          //点击跳转到查看统计表页面
          viewChart(){
            this.$router.push({ path: 'statisticChart',query:{

              }
            })
          }


        }

    }

</script>

<style scoped>
.days-change{
  height: 30px;
  float: right;
  width: 120px;
  display: flex;
  margin-top:-4px;
}
.days-change button{
  width: 60px;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  border-bottom: none;
  border:solid 1px #dcdfe6;
}
.days-change button.active {
  color: #fff;
  background: #4489fe;
  border: solid 1px #4489fe;
}
</style>
