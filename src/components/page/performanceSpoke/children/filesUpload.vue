<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i>绩效考核</el-breadcrumb-item>
                <el-breadcrumb-item>文件上传</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button  type="primary" class="handle-del mr10" style="right:100px" @click="fieldNew()"><i class="iconfont icon-shangchuan"></i><span class="span">上传</span></el-button>
            <el-button type="primary" class="handle-del mr10" @click="goBack()"><i class="iconfont icon-fanhui1"></i><span class="span">返回</span></el-button>
        </div>
        <div class="container">
          <div class="handle-box">
            <el-date-picker v-model="startTime" placeholder="开始日期" :picker-options="startTimeEvent" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <span>至</span>
            <el-date-picker v-model="endTime" placeholder="结束日期" :picker-options="endTimeEvent" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <el-select v-model="cycleValue" placeholder="请选择" class="handle-select">
                <el-option
                  v-for="item in cycleOptions"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="stateValue" placeholder="请选择" class="handle-select">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
          </div>
          <div class="table-content">
              <el-table ref="singleTable" border  :data="informationData" highlight-current-row style="width: 100%">
                 <el-table-column type="index" align="center" width="70px"  label="序号">
                 </el-table-column>
                 <el-table-column property="inspection_item" align="center" label="考核项" width="140px" show-overflow-tooltip>
                 </el-table-column>
                 <el-table-column property="data_item" align="center" label="资料项" width="140px" show-overflow-tooltip>
                 </el-table-column>
                 <el-table-column property="score" align="center" label="分值" width="100px">
                 </el-table-column>
                 <el-table-column property="cycle" align="center" label="考核周期" width="100px">
                 </el-table-column>
                 <el-table-column property="data_name" align="center" label="资料名" width="160px" show-overflow-tooltip>
                 </el-table-column>
                 <el-table-column property="file_user" align="center" label="上传用户" width="120px" show-overflow-tooltip>
                 </el-table-column>
                 <el-table-column property="time" align="center" label="操作时间" width="120px" show-overflow-tooltip>
                 </el-table-column>
                 <el-table-column property="state" align="center" label="审核结果"  show-overflow-tooltip >
                 </el-table-column>
                 <el-table-column label="操作" align="center">
                   <template slot-scope="scope">
                     <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                     <el-button size="small">删除</el-button>
                   </template>
                 </el-table-column>
             </el-table>

           </div>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'informationAudition',
        data: function(){
            return {
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
              cycleValue:'',
              cycleOptions:[{
                'label':'请选择考核周期',
                'value':''
              },{
                'label':'第一季度',
                'value':'第一季度'
              },{
                'label':'第二季度',
                'value':'第二季度'
              },{
                'label':'第三季度',
                'value':'第三季度'
              },{
                'label':'第四季度',
                'value':'第四季度'
              }],
              stateValue:'',
              stateOptions:[{
                'label':'请选择审核结果',
                'value':''
              },{
                'label':'待审核',
                'value':'待审核'
              },{
                'label':'通过',
                'value':'通过'
              },{
                'label':'未通过',
                'value':'未通过'
              }],
              informationData:[{
                'file_user':'深圳网信办',
                'inspection_item':'制度文件',
                'data_item':'平台建设',
                'score':'0.5',
                'cycle':'第四季度',
                'data_name':'龙华培训.doc',
                'time':'2018-12-20 08:00:00',
                'state':'待审核',
                'id':1
              },{
                'file_user':'深圳安全',
                'inspection_item':'制度文件',
                'data_item':'平台建设',
                'score':'0.5',
                'cycle':'第四季度',
                'data_name':'龙华培训.doc',
                'time':'2018-12-20 08:00:00',
                'state':'待审核',
                'id':2
              },{
                'file_user':'深圳维护',
                'inspection_item':'制度文件',
                'data_item':'平台建设',
                'score':'0.5',
                'cycle':'第四季度',
                'data_name':'龙华培训.doc',
                'time':'2018-12-20 08:00:00',
                'state':'待审核',
                'id':3
              },{
                'file_user':'深圳保险',
                'inspection_item':'制度文件',
                'data_item':'平台建设',
                'score':'0.5',
                'cycle':'第四季度',
                'data_name':'龙华培训.doc',
                'time':'2018-12-20 08:00:00',
                'state':'待审核',
                'id':4
              }]

            }
        },
        methods: {
          search(){

          },
          //点击修改或者查看
          handleEdit(index, row){
            this.$router.push({ path: 'uploadOpinion', query: {

              }
            })
          },
          //点击返回按钮
          goBack(){
            this.$router.push({ path: 'performanceSpoke', query: {

              }
            })
          },
          //点击上传
          fieldNew(){
            this.$router.push({ path: 'uploadAdd', query: {

              }
            })
          }

        }

    }
</script>
<style scoped>

</style>
