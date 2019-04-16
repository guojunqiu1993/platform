<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i>绩效考核</el-breadcrumb-item>
                <el-breadcrumb-item>资料审核</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button  type="primary" class="handle-export mr10" style="right:245px;" @click="batchAudit()"><i class="iconfont icon-kaohe-mian"></i><span class="span">批量审核</span></el-button>
            <el-button  type="primary" class="handle-new mr10" style="right:160px"><i class="iconfont icon-guidang2"></i><span class="span">批量下载</span></el-button>
            <el-button  type="primary" class="handle-del mr10" style="right:100px"><i class="iconfont icon-xiafa"></i><span class="span">导出</span></el-button>
            <el-button type="primary" class="handle-del mr10" @click="goBack()"><i class="iconfont icon-fanhui1"></i><span class="span">返回</span></el-button>
        </div>
        <div class="container">
          <div class="handle-box">
            <el-date-picker  v-model="startTime" placeholder="开始日期" :picker-options="startTimeEvent" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
            <el-input v-model="company_word" placeholder="请输入上传单位名称" class="handle-input mr10"></el-input>
            <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
          </div>
          <div class="table-content">
              <el-table ref="singleTable" border  :data="informationData" highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentChange"  style="width: 100%">
                 <el-table-column type="selection" align="center"  width="50" fixed>
                 </el-table-column>
                 <el-table-column type="index" align="center" width="70px"  label="序号">
                 </el-table-column>
                 <el-table-column property="upload_unit" align="center" label="上传单位" width="120px" show-overflow-tooltip>
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
                 <el-table-column property="time" align="center" label="操作时间" width="120px" show-overflow-tooltip>
                 </el-table-column>
                 <el-table-column property="state" align="center" label="审核结果"  show-overflow-tooltip >
                 </el-table-column>
                 <el-table-column label="操作" align="center">
                   <template slot-scope="scope">
                     <el-button size="small" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
                   </template>
                 </el-table-column>
             </el-table>

           </div>
        </div>

        <!-- 批量审核  模态框 -->
        <el-dialog title="批量审核" :visible.sync="exportVisible">
          <el-form :model="batchAuditFormData">
            <el-form-item label="审核结果">
              <el-select v-model="batchAuditFormData.auditState" placeholder="请选择">
                  <el-option
                    v-for="item in auditStataOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="exportCancel()">取 消</el-button>
            <el-button type="primary" @click="exportConfirm($event)">确 定</el-button>
          </div>
        </el-dialog>

    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'informationAudition',
        data: function(){
            return {
              multipleSelection:[],
              currentRow:null,
              company_word:'',
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
                'upload_unit':'深圳网信办',
                'inspection_item':'制度文件',
                'data_item':'平台建设',
                'score':'0.5',
                'cycle':'第四季度',
                'data_name':'龙华培训.doc',
                'time':'2018-12-20 08:00:00',
                'state':'待审核',
                'id':1
              },{
                'upload_unit':'深圳安全',
                'inspection_item':'制度文件',
                'data_item':'平台建设',
                'score':'0.5',
                'cycle':'第四季度',
                'data_name':'龙华培训.doc',
                'time':'2018-12-20 08:00:00',
                'state':'待审核',
                'id':2
              },{
                'upload_unit':'深圳维护',
                'inspection_item':'制度文件',
                'data_item':'平台建设',
                'score':'0.5',
                'cycle':'第四季度',
                'data_name':'龙华培训.doc',
                'time':'2018-12-20 08:00:00',
                'state':'待审核',
                'id':3
              },{
                'upload_unit':'深圳保险',
                'inspection_item':'制度文件',
                'data_item':'平台建设',
                'score':'0.5',
                'cycle':'第四季度',
                'data_name':'龙华培训.doc',
                'time':'2018-12-20 08:00:00',
                'state':'待审核',
                'id':4
              }],
              exportVisible:false,
              batchAuditFormData:{
                'auditState':'未审核'
              },
              auditStataOptions: [{
                label:'未审核',
                value:'未审核'
              },{
                label:'通过',
                value:'通过'
              },{
                label:'不通过',
                value:'不通过'
              }]

            }
        },
        methods: {
          search(){

          },
          handleSelectionChange(val) {
            this.multipleSelection = val
          },
          handleCurrentChange(val) {

          },
          //点击批量审核
          batchAudit(){
            let ids=''
            for(var obj of this.multipleSelection){
              ids+=obj.id+','
            }
            if(ids.length>0){
              this.exportVisible=true

            }else{
              this.$message({
                showClose: true,
                message: '请选择一项再进行操作',
                type: 'error'
              });
            }
          },
          //点击审核
          handleEdit(index, row){
            this.$router.push({ path: 'informationAuditionEdit', query: {

              }
            })
          },
          //点击返回按钮
          goBack(){
            this.$router.push({ path: 'performanceAdmin', query: {

              }
            })
          },
          //批量审核-模态框  取消
          exportCancel(){
            this.exportVisible=false
          },
          //批量审核-模态框 确定
          exportConfirm(){
            this.exportVisible=false
          }

        }

    }
</script>
<style scoped>

</style>
