<template>
    <div>
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 组织管理</el-breadcrumb-item>
              <el-breadcrumb-item>产品授权</el-breadcrumb-item>
          </el-breadcrumb>
            <el-button type="primary" class="handle-new mr10" @click="returnBtn()"><i class="iconfont icon-fanhui1"></i><span class="span">返回</span></el-button>
          <el-button type="primary" class="handle-del mr10" @click="addAll()"><i class="iconfont icon-tianjia"></i><span class="span">授权</span></el-button>
        </div>
        <div class="container">
              <div class="handle-box">
                  <span>当前客户:</span><span>{{clientName}}</span> &nbsp;&nbsp;
                  <span style="display:none;">{{clientId}}</span>
                  <el-select v-model="typeValue" placeholder="请选择产品" @change="changeProduct()">
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :code="item.code">
                      </el-option>
                  </el-select>
              </div>
              <div class="table-content">
                  <el-table ref="singleTable" border  :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentChange" style="width: 100%">
                    <el-table-column type="index" align="center" width="70" fixed label="序号">
                    </el-table-column>
                    <el-table-column property="product_name" align="center" label="产品名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="code" align="center" label="产品编码" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="auth_type" align="center" label="授权类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="user_time" align="center" label="使用期限" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="auth_status" align="center" label="授权状态" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="create_time" align="center" label="授权时间" width="100px" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="220px">
                      <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" @click="handleState(scope.$index, scope.row)">{{scope.row.auth_unstatus}}</el-button>
                        <el-button size="small" @click="handleMenu(scope.$index, scope.row)">字典管理</el-button>
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
// import instance1 from '../../../common/axiosv1'
    export default {
        name: 'productImpower',
        data() {
            return {
              clientName:'',
              clientId:'',
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              tableData: [],
              currentRow:null,
              typeOptions:[],
              typeValue:'',

            }
        },
        created() {
            this.clientData()
            this.productData()
            this.getTableData()
        },
        computed: {

        },
        methods: {
            getTableData(){
                let _this=this
                axios.get('/api/v1/org/product/auth/list',{
                    params:{
                      pageNumber:this.currentPage,
                      pageSize:this.pageSize,
                      org_id:this.clientId
                    }
                  }).then(function (response) {
                     let arr=response.data.data.productList
                     //console.log(arr)
                     _this.tableData=[]
                     if(arr.length>0){
                       arr.forEach(item => {
                         let tableObj={}
                         if(item.auth_status=='1'){
                           tableObj.auth_status='启用'
                           tableObj.auth_unstatus='禁用'
                         }else{
                           tableObj.auth_status='禁用'
                           tableObj.auth_unstatus='启用'
                         }
                         if(item.auth_type=='1'){
                           tableObj.auth_type='正式'
                         }else{
                           tableObj.auth_type='试用'
                         }
                         tableObj.code=item.code
                         tableObj.id=item.id
                         tableObj.org_id=item.org_id
                         tableObj.product_id=item.product_id
                         tableObj.product_name=item.product_name
                         tableObj.start_time=item.start_time
                         tableObj.end_time=item.end_time
                         tableObj.user_time=item.start_time+"——"+item.end_time
                         tableObj.create_time=item.create_time
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
            returnBtn(){
              this.$router.push({ path: 'organizationManagement'})
            },
            //当前客户
            clientData(){
              this.clientName=this.$route.query.clientName
              this.clientId=this.$route.query.clientId
            },
            //产品名称
            productData(){
              let _this=this;
              axios.get('/api/v1/org/product/list',{
                  params:{

                  }
                }).then(function (response) {
                   let arr=response.data.data
                  // console.log(arr)
                   let newArr=[]
                   if(arr.length>0){
                     for(var i=0;i<arr.length;i++){
                       let obj={}
                       obj.value=arr[i].product_id+','+arr[i].code+','+arr[i].product_name
                       //console.log(obj.value)
                       obj.label=arr[i].product_name
                       newArr.push(obj)
                     }
                   }
                   _this.typeOptions=newArr
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
            //产品名称-下拉选中事件
            changeProduct(){
                console.log((this.typeValue).split(","))

            },
            peoplehandleSizeChange(val) {

            },
            peoplehandleCurrentChange(val) {
                this.currentPage = val
                this.getTableData()
            },
            handleSelectionChange(val) {
              this.multipleSelection = val
            },
            handleCurrentChange(val) {

            },
            //添加
            addAll(){
                if(this.typeValue==''){
                  this.$message({
                    showClose: true,
                    message: '请选择产品',
                    type: 'error'
                  });
                }else{
                  let arr=this.typeValue.split(",")
                  this.$router.push({ path: 'impowerAdd', query: {
                      'product_id': arr[0],
                      'code':arr[1],
                      'org_id':this.clientId,
                      'product_name':arr[2],
                      'clientName':this.clientName
                    }
                  })
                }

            },
            //编辑单个
            handleEdit(index, row){
              this.$router.push({ path: 'impowerEdit', query: {
                  'product_id':row.product_id,
                  'code':row.code,
                  'org_id':row.org_id,
                  'product_name':row.product_name,
                  'clientName':this.clientName,
                  'id':row.id,
                  'auth_type':row.auth_type,
                  'start_time':row.start_time,
                  'end_time':row.end_time,
                  'auth_status':row.auth_status
                }})
            },
            //点击字典管理
            handleMenu(index, row){
              this.$router.push({ path: 'dictionaryList', query: {
                  'clientName':this.clientName,
                  'clientId':this.clientId,
                  'id':row.org_id,
                  'product_id':row.product_id
                }})
            },
            //点击切换启用和禁用状态
            handleState(index, row){
              let _this=this
              let status=''
              if(row.auth_status=='启用'){
                status=0
              }else{
                status=1
              }
              axios.post('/api/v1/org/product/auth/status/upd', {
                id:row.id,
                auth_status:status
              })
              .then(function (response) {
                _this.getTableData()
                _this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
              })
              .catch(function (error) {
                if(error.response.data.errorCode=='7' || error.response.data.errorCode=='8' ){
                  window.sessionStorage.removeItem('access_token', '')
                  _this.$router.push({ path: 'login'})
                }else{
                  _this.$message({
                    type: 'error',
                    message: error.response.data.errorMessage
                  });
                }
              });
            }
        }
    }

</script>

<style scoped>
  .handle-export{
    position:absolute;
    right:190px;
    top:6px;
    padding: 4px 6px;
  }
  .handle-box span{
    font-size:14px;
  }
</style>
