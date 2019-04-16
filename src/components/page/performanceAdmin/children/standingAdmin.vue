<template>
    <div class="table">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 绩效考核</el-breadcrumb-item>
              <el-breadcrumb-item>考核台账</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-new mr10" v-show="tabBoolean1"><i class="iconfont icon-xiafa"></i><span class="span">导出</span></el-button>
          <el-button type="primary" class="handle-del mr10" @click="goBack()"><i class="iconfont icon-fanhui1"></i><span class="span">返回</span></el-button>
        </div>
        <div class="container">
              <div class="tab-change">
                  <span @click="disposeStanding()" :class="tabBoolean1 ? 'active' : '' ">舆情处置台账</span>
                  <span @click="scoreStanding()" :class="tabBoolean2 ? 'active' : '' ">修改得分台账</span>
              </div>
              <div class="handle-box">
                <el-date-picker  v-model="startTime" placeholder="开始日期" :picker-options="startTimeEvent" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                <span>至</span>
                <el-date-picker v-model="endTime" placeholder="结束日期" :picker-options="endTimeEvent" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                <el-select v-model="disposeDeductValue" placeholder="" class="handle-select" v-show="tabBoolean1">
                    <el-option
                      v-for="item in disposeDeductOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="scoreDeductValue" placeholder="" class="handle-select" v-show="tabBoolean2">
                    <el-option
                      v-for="item in scoreDeductOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-input placeholder="请输入标题" class="handle-input mr10" v-show="tabBoolean1"></el-input>
                <el-input placeholder="请输入处置部门" class="handle-input mr10" v-show="tabBoolean1"></el-input>
                <el-input placeholder="请输入考核部门" class="handle-input mr10" v-show="tabBoolean2"></el-input>
                <el-input placeholder="请输入备注" class="handle-input mr10" v-show="tabBoolean2"></el-input>
                <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
              </div>
              <div class="table-content">

                <el-table :data="tabledata" v-show='tabBoolean1'>
                  <el-table-column type="index" align="center" width="70px"  label="序号">
                  </el-table-column>
                  <el-table-column align="center" label="舆情标题" prop="title" width="170px" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column align="center" label="处置部门" prop="dispose_department" width="120px" show-overflow-tooltip>
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

                 <el-table ref="singleTable" border v-show="tabBoolean2"  :data="alterScoreData" highlight-current-row  style="width: 100%">
                   <el-table-column type="index" align="center" width="70px"  label="序号">
                   </el-table-column>
                  <el-table-column property="department" align="center" label="考核部门" width="120px" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="cycle" align="center" label="考核周期" width="140px" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="inspectionItem" align="center" label="考核项" width="140px" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="originalScore" align="center" label="原始评估分" width="100px">
                  </el-table-column>
                  <el-table-column property="modifyScore" align="center" label="修改分值" width="100px">
                  </el-table-column>
                  <el-table-column property="modifyTime" align="center" label="修改时间" width="160px" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="account" align="center" label="操作账号" width="120px" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="remark" align="center" label="修改备注"  show-overflow-tooltip >
                  </el-table-column>
                </el-table>


              </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'standingAdmin',
        data() {
            return {
              tabBoolean1:true,
              tabBoolean2:false,
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
              scoreDeductValue:'全部',
              scoreDeductOptions:[{
                value:'全部',
                label:'全部'
              },{
                value:'加分',
                label:'加分'
              },{
                value:'扣分',
                label:'扣分'
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
                title:'人民网评：点燃实干强国的坚强斗志',
                dispose_department:'a部门',
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
                title:'人民网评：点燃实干强国的坚强斗志',
                dispose_department:'b部门',
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
                title:'人民网评：点燃实干强国的坚强斗志',
                dispose_department:'c部门',
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
                title:'人民网评：点燃实干强国的坚强斗志',
                dispose_department:'d部门',
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
                title:'人民网评：点燃实干强国的坚强斗志',
                dispose_department:'e部门',
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
                    {key:4,label:'时效性(6)',prop:'b'},
                    {key:5,label:'持续性(6)',prop:'b'},
                    {key:6,label:'组织调查(6)',prop:'b'},
                    {key:7,label:'事件处理(6)',prop:'b'},
                    {key:8,label:'整改落实(6)',prop:'b'}
                  ]
                }],
                alterScoreData:[{
                  'department':'a部门',
                  'cycle':'2018年上半年',
                  'inspectionItem':'速度',
                  'originalScore':'6',
                  'modifyScore':'+3',
                  'modifyTime':'2018-06-20 12:00:00',
                  'account':'admin',
                  'remark':'做了修改调整'
                },{
                  'department':'b部门',
                  'cycle':'2018年上半年',
                  'inspectionItem':'速度',
                  'originalScore':'8',
                  'modifyScore':'+6',
                  'modifyTime':'2018-06-20 12:00:00',
                  'account':'admin',
                  'remark':'做了修改调整做了修改调整做了修改调整做了修改调整做了修改调整做了修改调整'
                },{
                  'department':'c部门',
                  'cycle':'2018年上半年',
                  'inspectionItem':'速度',
                  'originalScore':'3',
                  'modifyScore':'+2',
                  'modifyTime':'2018-06-20 12:00:00',
                  'account':'admin',
                  'remark':'做了修改调整'
                },{
                  'department':'d部门',
                  'cycle':'2018年上半年',
                  'inspectionItem':'速度',
                  'originalScore':'6',
                  'modifyScore':'+3',
                  'modifyTime':'2018-06-20 12:00:00',
                  'account':'admin',
                  'remark':'做了修改调整'
                },{
                  'department':'e部门',
                  'cycle':'2018年上半年',
                  'inspectionItem':'速度',
                  'originalScore':'7',
                  'modifyScore':'+2',
                  'modifyTime':'2018-06-20 12:00:00',
                  'account':'admin',
                  'remark':'做了修改调整'
                },{
                  'department':'f部门',
                  'cycle':'2018年上半年',
                  'inspectionItem':'速度',
                  'originalScore':'5',
                  'modifyScore':'+1',
                  'modifyTime':'2018-06-20 12:00:00',
                  'account':'admin',
                  'remark':'做了修改调整'
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
          //舆情处置台账
          disposeStanding(){
            this.tabBoolean1=true
            this.tabBoolean2=false
          },
          //修改得分台账
          scoreStanding(){
            this.tabBoolean1=false
            this.tabBoolean2=true
          },
          //点击返回按钮
          goBack(){
            this.$router.push({ path: 'performanceAdmin', query: {

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
  cursor:pointer;
  border-radius:5px 5px 0 0;
}
</style>
