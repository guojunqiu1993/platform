<template>
    <div class="table" style="postion:relative;">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>系统设置</el-breadcrumb-item>
              <el-breadcrumb-item>考核配置</el-breadcrumb-item>
              <el-breadcrumb-item>考核规则查看</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-del mr10" @click="getBack()"><i class="iconfont icon-fanhui1"></i><span class="span">返回</span></el-button>
        </div>
        <div class="container">
          <div class="handle-box" style="font-size:15px;">
            <span>考核年度:</span>
            <span>2018年</span>
            <span>&nbsp;&nbsp;&nbsp;考核周期:</span>
            <span>年度考核</span>
            <span>&nbsp;&nbsp;&nbsp;制度名称:</span>
            <span>全年考核</span>
            <span>&nbsp;&nbsp;&nbsp;考核时间:</span>
            <span>2018-03-01 —— 2018-09-01</span>
          </div>
          <div class="table-content">
            <el-table
               class="performance_table"
               :data="tableData"
               :span-method="objectSpanMethod"
               border>
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
          </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'inspectionPreview',
        data() {
            return {
              tableData: [
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
        created() {
          // this.getTableData()
        },
        methods: {
          //表格数据
          getTableData(){

          },
          //返回
          getBack(){
            this.$router.push({ path: 'inspectionConfig',query:{

              }
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

</style>
