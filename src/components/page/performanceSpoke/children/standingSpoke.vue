<template>
    <div class="table">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>绩效考核</el-breadcrumb-item>
              <el-breadcrumb-item>考核台账</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-new mr10"><i class="iconfont icon-xiafa"></i><span class="span">导出</span></el-button>
          <el-button type="primary" class="handle-del mr10" @click="goBack()"><i class="iconfont icon-fanhui1"></i><span class="span">返回</span></el-button>
        </div>
        <div class="container">
              <div class="handle-box">
                <el-date-picker v-model="startTime" placeholder="开始日期" :picker-options="startTimeEvent" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                <span>至</span>
                <el-date-picker v-model="endTime" placeholder="结束日期" :picker-options="endTimeEvent" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                <el-select v-model="disposeDeductValue" placeholder="" class="handle-select">
                    <el-option
                      v-for="item in disposeDeductOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-input placeholder="请输入事件名称" v-model="event_name" class="handle-input mr10" ></el-input>
                <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
              </div>
              <div class="table-content">
                <el-table :data="tabledata">
                  <el-table-column align="center" label="事件名称" prop="event_name" width="180px" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column align="center" label="下发时间" prop="sent_time" width="120px" show-overflow-tooltip>
                  </el-table-column>
                   <el-table-column align="center" v-for='item in tableHeadData' :label="item.label" :prop='item.prop' :width='item.width' :key="item.key">
                     <el-table-column align="center" v-if='item.children||item.children.length>0' v-for="item1 in item.children"
                     :label="item1.label" :prop='item1.prop' :width='item1.width' :key="item1.key">
                     <el-table-column align="center" v-if='item1.children||item1.children.length>0' v-for="item2 in item1.children"
                     :label="item2.label" :prop='item2.prop' :width='item2.width' :key="item2.key">
                     </el-table-column>
                     </el-table-column>
                   </el-table-column>
                 </el-table>
              </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'standingSpoke',
        data() {
            return {
              event_name:'',
              startTime:'',
              endTime:'',
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
              },
              disposeDeductValue:'全部',
              disposeDeductOptions:[{
                value:'全部',
                label:'全部'
              },{
                value:'有加分或扣分',
                label:'有加分或扣分'
              }],
              tabledata:[{
                a:'1',
                b:'3',
                c:'4',
                d:'6',
                e:'7',
                f:'4',
                g:'4',
                h:'4',
                i:'4',
                event_name:'人民网评：点燃实干强国的坚强斗志',
                sent_time:'2018-10-12 08:00:00'
              },{
                a:'1',
                b:'3',
                c:'4',
                d:'6',
                e:'7',
                f:'4',
                g:'4',
                h:'4',
                i:'4',
                event_name:'人民网评：点燃实干强国的坚强斗志',
                sent_time:'2018-10-12 08:00:00'
              },{
                a:'1',
                b:'3',
                c:'4',
                d:'6',
                e:'7',
                f:'4',
                g:'4',
                h:'4',
                i:'4',
                event_name:'人民网评：点燃实干强国的坚强斗志',
                sent_time:'2018-10-12 08:00:00'
              },{
                a:'1',
                b:'3',
                c:'4',
                d:'6',
                e:'7',
                f:'4',
                g:'4',
                h:'4',
                i:'4',
                event_name:'人民网评：点燃实干强国的坚强斗志',
                sent_time:'2018-10-12 08:00:00'
              },{
                a:'1',
                b:'3',
                c:'4',
                d:'6',
                e:'7',
                f:'4',
                g:'4',
                h:'4',
                i:'4',
                event_name:'人民网评：点燃实干强国的坚强斗志',
                sent_time:'2018-10-12 08:00:00'
              }],
              tableHeadData:[
                {
                  key:1,
                  label:'考核项',
                  prop:'',
                  children:[
                    {key:2,label:'速度(8)',prop:'a'},
                    {key:3,label:'措施(6)',prop:'b'},
                    {key:3,label:'时效性(6)',prop:'b'},
                    {key:3,label:'持续性(6)',prop:'b'},
                    {key:3,label:'组织调查(6)',prop:'b'},
                    {key:3,label:'事件处理(6)',prop:'b'},
                    {key:3,label:'整改落实(6)',prop:'b'}
                  ]
                }]

            }
        },
        created() {

        },
        mounted(){

        },
        computed: {

        },
        methods: {
          search(){

          },
          //点击返回按钮
          goBack(){
            this.$router.push({ path: 'performanceSpoke', query: {

              }
            })
          }


        }
    }

</script>

<style scoped>

</style>
