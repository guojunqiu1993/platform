<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 绩效考核</el-breadcrumb-item>
                <el-breadcrumb-item>手动修改得分</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <div class="handle-box" style="margin-bottom:0px;">
             <span style="font-size:15px;">考核部门:</span>
             <span style="font-size:15px;">街道办</span>
          </div>
          <div class="handle-box">
             <span style="font-size:14px;color:#e05b56;">修改提示:修改分值处填写正数则为加分,负数为扣分,修改分数操作不可逆转,请谨慎操作!</span>
          </div>
          <div class="table-content" style="padding-bottom:20px;">
            <el-table ref="singleTable" border  :data="tableData" highlight-current-row style="width: 100%">
              <el-table-column property="assessment_name" align="center" width="310px" label="考核项名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="max_score" align="center" label="最高评估分" show-overflow-tooltip >
              </el-table-column>
              <el-table-column property="actual_score" align="center" label="实际分值" show-overflow-tooltip >
              </el-table-column>
              <el-table-column align="center" label="修改分值" show-overflow-tooltip width="160px">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.change_score" :precision="1" :step="0.1" :max="10000" :min="-1000" @change="changeScore(scope.row.change_score,scope.row.actual_score,scope.row.assessment_score,scope.$index)"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column property="assessment_score" align="center" label="评估分" show-overflow-tooltip >
              </el-table-column>
              <el-table-column align="center" label="修改备注" show-overflow-tooltip width="320px">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" type="text" size="6"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="common-btns">
            <el-button type="primary" @click="save()">保存</el-button>
            <el-button @click="editCancel()">返回</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import $ from 'jquery'
    export default {
        name: 'assessEdit',
        data: function(){
            return {
              tableData:[{
                'assessment_name':'接受舆情请问请问锁定接受舆情请问请问锁定',
                'max_score':'10',
                'actual_score':'-12',
                'assessment_score':'-12',
                'change_score':undefined,
                'remark':''
              },{
                'assessment_name':'分公司开发商开发上课上课地方看看快速开发上课',
                'max_score':'10',
                'actual_score':'-12',
                'assessment_score':'-12',
                'change_score':undefined,
                'remark':''
              },{
                'assessment_name':'快递费看过的',
                'max_score':'10',
                'actual_score':'-12',
                'assessment_score':'-12',
                'change_score':undefined,
                'remark':''
              }]
            }
        },
        methods: {
          editCancel(){
            this.$router.push({ path: 'performanceAdmin', query: {

              }})
          },
          changeScore(a,b,c,d){
            let arr=[]
            arr=this.tableData
            if(a==undefined){
              a=0
            }else if(a==0){
              arr[d].change_score=undefined
              a=0
            }
            c=(Number(a)+Number(b)).toFixed(1)
            arr[d].assessment_score=c
          },
          save(){
            let arr=[]
            let newArr=[]
            var a=0
            arr=this.tableData
            for(var i=0;i<arr.length;i++){
              if(arr[i].change_score==undefined && arr[i].remark==''){
                a++
              }
              if( (arr[i].change_score==undefined && arr[i].remark!='')||(arr[i].change_score!=undefined && arr[i].remark=='')){
                newArr.push(arr[i].assessment_name)
              }
            }
            if(newArr.length>0){
              let nameStr=''
              for(var i=0;i<newArr.length;i++){
                nameStr+=newArr[i]+'、'
              }
              this.$message({
                type: 'error',
                message: '考核项【'+nameStr.substr(0,nameStr.length-1)+'】修改分值/修改备注为空，无法保存'
              });
            }else if(a==arr.length){
              this.$message({
                type: 'error',
                message: '请至少修改一项后保存'
              });
            }else {
              console.log(this.tableData)
            }


          }

        }

    }
</script>
<style scoped>

</style>
