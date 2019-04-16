<template>
    <div>
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>系统设置</el-breadcrumb-item>
              <el-breadcrumb-item>考核配置</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-export mr10" @click="addInspection"><i class="iconfont icon-create-orders"></i><span class="span">新建考核制度</span></el-button>
        </div>
        <div class="container">
          <div class="handle-box">
              <el-select v-model="year_word" placeholder="请选择" class="handle-select">
                  <el-option
                    v-for="item in yearSearchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-select v-model="stateValue" placeholder="状态选择" class="handle-select">
                  <el-option
                    v-for="item in stateOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-input v-model="system_word" placeholder="请输入制度名称" class="handle-input mr10"></el-input>
              <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
          </div>
          <div class="table-content">
                <el-table ref="singleTable" border  :data="tableData" style="width: 100%">
                  <el-table-column type="index" align="center" width="70px"  label="序号">
                  </el-table-column>
                  <el-table-column align="center" property="year" label="考核年度"  show-overflow-tooltip width="110">
                  </el-table-column>
                  <el-table-column align="center" label="考核周期"  show-overflow-tooltip width="140">
                    <template slot-scope="scope">
                      <span v-show="scope.row.period_name==1">年度考核</span>
                      <span v-show="scope.row.period_name==2">半年考核</span>
                      <span v-show="scope.row.period_name==3">季度考核</span>
                      <span v-show="scope.row.period_name==4">月度考核</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" property="system_name" label="制度名称"  show-overflow-tooltip width="140">
                  </el-table-column>
                  <el-table-column property="begin_date" align="center" label="开始日期" show-overflow-tooltip width="110">
                  </el-table-column>
                  <el-table-column property="end_date" align="center" label="结束日期" show-overflow-tooltip width="110">
                  </el-table-column>
                  <el-table-column align="center" label="状态" show-overflow-tooltip width='90px'>
                    <template slot-scope="scope">
                      <span v-show="scope.row.state==0">未生效</span>
                      <span v-show="scope.row.state==1">生效</span>
                      <span v-show="scope.row.state==2">过期</span>
                    </template>
                  </el-table-column>
                  <el-table-column  align="center" label="操作" >
                    <template slot-scope="scope">
                      <el-button size="small" @click="handleSee(scope.$index, scope.row)">预览</el-button>
                      <el-button size="small" @click="handleRule(scope.$index, scope.row)">考核规则</el-button>
                      <el-button size="small" @click="handleItem(scope.$index, scope.row)">考核项</el-button>
                      <el-button size="small" @click="handleExamine(scope.$index, scope.row)">编辑</el-button>
                      <el-button size="small" @click="handleCopy(scope.$index, scope.row)">复制</el-button>
                      <el-button v-show="scope.row.state==0" size="small" @click="handleDelete(scope.$index, scope.row)">删除·</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="Pagination" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                      @size-change="peoplehandleSizeChange"
                      @current-change="peoplehandleCurrentChange"
                      :current-page="currentPage"
                      :page-size="pageSize"
                      layout="total, prev, pager, next,jumper"
                      :total="peopleCount">
                    </el-pagination>
                </div>
          </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'inspectionConfig',
        data() {
            return {
              year_word:'',
              yearSearchOptions:[],
              system_word:'',
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              stateOptions:[{
                'label':'全部',
                'value':''
              },{
                'label':'生效',
                'value':'1'
              },{
                'label':'未生效',
                'value':'0'
              },{
                'label':'已过期',
                'value':'2'
              }],
              stateValue:'',
              tableData: []
            }
        },
        created() {
          this.yearData()
          this.getTableData()
        },
        methods: {
          //表格数据
          getTableData(){
            let _this=this
            axios.get('/api/v1/assessment/period/list',{
                params:{
                  pageNumber:this.currentPage,
                  pageSize:this.pageSize,
                  year:this.year_word,
                  state:this.stateValue,
                  system_name:this.system_word
                }
              }).then(function (response) {
                 let arr=response.data.data.articleList
                 if(arr.length>0){
                   _this.tableData=[]
                   arr.forEach(item => {
                     let tableObj={}
                     tableObj.period_name=item.period_name
                     tableObj.system_name=item.system_name
                     tableObj.year=item.year
                     tableObj.begin_date=item.begin_date
                     tableObj.end_date=item.end_date
                     tableObj.period_id=item.period_id
                     tableObj.state=item.state
                     _this.tableData.push(tableObj)
                   })
                   _this.peopleCount=response.data.data.total
                 }else{
                   _this.tableData=[]
                   _this.peopleCount=0
                 }
              }).catch(function (error) {
                if(error.response.data.errorCode=='7' || error.response.data.errorCode=='8' ){
                  window.sessionStorage.removeItem('access_token', '')
                  _this.$router.push({ path: 'login'})
                }else{
                  _this.$message({
                    type: 'error',
                    message: error.response.data.errorMessage
                  });
                }
              })
          },
          //搜索
          search(){
            this.currentPage=1
            this.getTableData()
          },
          //删除
          handleDelete(index,row){
            let _this=this
            this.$confirm('请确认是否删除该考核制度?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              axios.get('/api/v1/assessment/period/del',{
                  params:{
                    period_id:row.period_id
                  }
                }).then(function (response) {
                      _this.currentPage=1
                      _this.year_word=''
                      _this.stateValue=''
                      _this.system_word=''
                      _this.getTableData()
                      _this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });

                }).catch(function (error) {
                  if(error.response.data.errorCode=='7' || error.response.data.errorCode=='8' ){
                    window.sessionStorage.removeItem('access_token', '')
                    _this.$router.push({ path: 'login'})
                  }else{
                    _this.$message({
                      type: 'error',
                      message: error.response.data.errorMessage
                    });
                  }
                })

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
          },
          peoplehandleSizeChange(val) {

          },
          peoplehandleCurrentChange(val) {
              this.currentPage = val
              this.getTableData()
          },
          //年份下拉框
          yearData(){
            let date = new Date()
            let year = date.getFullYear()
            this.yearSearchOptions=[{
              'label':'全部',
              'value':''
            },{
              'label':year,
              'value':year
            },{
              'label':Number(year)-1,
              'value':Number(year)-1
            }]
            this.year_word=''
          },
          //复制
          handleCopy(index,row){
            this.$router.push({ path: 'inspectionConfigAdd',query:{
                'period_name':row.period_name,
                'period_id':row.period_id,
                'option':'复制'
              }
            })
          },
          //编辑
          handleExamine(index,row){
            this.$router.push({ path: 'inspectionConfigEdit',query:{
                'period_name':row.period_name,
                'system_name':row.system_name,
                'begin_date':row.begin_date,
                'end_date':row.end_date,
                'period_id':row.period_id,
                'year':row.year,
                'state':row.state
              }
            })
          },
          //新增考核年
          addInspection(){
            this.$router.push({ path: 'inspectionConfigAdd',query:{

              }
            })
          },
          //预览
          handleSee(index,row){
            this.$router.push({ path: 'inspectionPreview',query:{
                'period_id':row.period_id
              }
            })
          },
          //考核规则
          handleRule(index,row){
            this.$router.push({ path: 'inspectionRules',query:{
                'period_id':row.period_id,
                'state':row.state
              }
            })
          },
          //考核项
          handleItem(index,row){
            this.$router.push({ path: 'inspectionItem',query:{
                'period_id':row.period_id,
                'state':row.state
              }
            })
          }





        }
    }

</script>
<style scoped>

</style>
