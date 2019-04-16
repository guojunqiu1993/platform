<template>
    <div class="table">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>组织管理</el-breadcrumb-item>
              <el-breadcrumb-item>产品授权</el-breadcrumb-item>
              <el-breadcrumb-item>字典管理</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- <el-button  type="primary" class="handle-new mr10" @click="returnBtn"><i class="iconfont icon-fanhui1"></i>返回</el-button> -->
          <!-- <el-button  type="primary" class="handle-del mr10" @click="newSingle"><i class="iconfont icon-create-orders"></i>新建</el-button> -->
          <el-button type="primary" class="handle-new mr10" @click="returnBtn"><i class="iconfont icon-fanhui1"></i><span class="span">返回</span></el-button>
        <el-button type="primary" class="handle-del mr10" @click="newSingle"><i class="iconfont icon-create-orders"></i><span class="span">新建</span></el-button>
        </div>
        <div class="container">
              <div class="handle-box">
                <el-select v-model="typeValue" placeholder="请选择字典类型" @change="changeProduct()">
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
                <el-table  ref="singleTable" border  :data="tableData" highlight-current-row>
                  <el-table-column property="value" align="center" label="字典值" width="280" fixed show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="name" align="center" label="字典名称" width="280" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="sort" align="center" label="排序号" width="280" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="status" align="center" label="字典状态" show-overflow-tooltip>
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
        name: 'dictionaryList',
        data() {
            return {
              clientName:'',
              clientId:'',
              id:'',
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              tableData: [],
              currentRow:null,
              typeValue:'',
              typeOptions:[]
            }

        },
        created() {
          this.clientData()
          this.dictionaryTypeList()

        },
        computed: {

        },
        methods: {
            //渲染clientName clientId
            clientData(){
              this.clientName=this.$route.query.clientName
              this.clientId=this.$route.query.clientId
              this.id=this.$route.query.id
              if(this.$route.query.dict_type){
                  this.typeValue=this.$route.query.dict_type
              }
            },
            //字典类型列表
            dictionaryTypeList(){
              let _this=this
              axios.get('/api/v1/org/dictionary/type/list',{
                  params:{
                    org_id:_this.id,
                    product_id:_this.$route.query.product_id
                  }
                }).then(function (response) {
                   let arr=response.data.data
                   //console.log(arr);
                   let newArr=[]
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i]
                     obj.label=arr[i]
                     newArr.push(obj)

                   }
                   //console.log(newArr)
                   if(!(_this.$route.query.dict_type)){
                     _this.typeValue=arr[0]
                   }
                   _this.typeOptions=newArr
                   if(newArr.length>0){
                     _this.typeValue=newArr[0].value
                   }else{
                     _this.typeValue=''
                   }
                   _this.currentPage=1
                   _this.getTableData()
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
            changeProduct(){
              this.currentPage=1
              this.getTableData()
            },
            //表格list
            getTableData(){
              let _this=this
              axios.get('/api/v1/org/dictionary/list',{
                  params:{
                    pageNumber:this.currentPage,
                    pageSize:this.pageSize,
                    dict_type:this.typeValue,
                    org_id:this.clientId
                  }
                }).then(function (response) {
                   let arr=response.data.data.dictList
                   //console.log(arr)
                   _this.tableData=[]
                   arr.forEach(item => {
                     let tableObj={}
                     tableObj.description=item.description
                     tableObj.dict_type=item.dict_type
                     tableObj.id=item.id
                     tableObj.name=item.name
                     tableObj.org_id=item.org_id
                     tableObj.product_id=item.product_id
                     tableObj.sort=item.sort
                     if(item.status==1){
                       tableObj.status='启用'
                     }else{
                       tableObj.status='禁用'
                     }
                     tableObj.value=item.value
                     _this.tableData.push(tableObj)
                   })
                   _this.peopleCount=response.data.data.total

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
            peoplehandleSizeChange(val) {

            },
            peoplehandleCurrentChange(val) {
              this.currentPage = val
              this.getTableData()
            },
            //新建单个
            newSingle(){
              this.$router.push({ path: 'dictionaryOrlAdd', query: {
                'clientName':this.clientName,
                'clientId':this.clientId,
                'id':this.id,
                'dict_type':this.typeValue,
                'product_id':this.$route.query.product_id
                }})
            },
            //返回
            returnBtn(){
              this.$router.push({ path: 'productImpower', query: {
                  'clientName':this.clientName,
                  'clientId':this.clientId
                }})
            }


        }
    }

</script>

<style scoped>


</style>
