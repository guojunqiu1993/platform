<template>
    <div class="table" style="postion:relative;">
        <div class="crumbs">
          <el-breadcrumb separator="">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>产品管理</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button  type="primary" class="handle-new mr10" @click="newSingle"><i class="iconfont icon-create-orders"></i><span class="span">新建</span></el-button>
          <el-button  type="primary" class="handle-del mr10" @click="delAll"><i class="iconfont icon-shanchu2"></i><span class="span">删除</span></el-button>
        </div>
        <div class="container">
              <div class="handle-box">
                  <el-input v-model="select_word" placeholder="请输入产品名称" class="handle-input mr10"></el-input>
                  <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
              </div>
              <div class="table-content">
                <el-table  ref="singleTable" border  :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentChange" style="width: 100%">
                  <el-table-column type="selection" align="center" width="50px"  fixed>
                  </el-table-column>
                  <el-table-column type="index" align="center" width="70px"  label="序号">
                  </el-table-column>
                  <el-table-column property="product_sign" align="center" label="产品标识" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="product_name" align="center" label="产品名称" show-overflow-tooltip width='180'>
                  </el-table-column>
                  <el-table-column property="code" align="center" label="产品编码" show-overflow-tooltip width="120">
                  </el-table-column>
                  <el-table-column property="description" align="center" label="产品描述" show-overflow-tooltip width='320'>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                      <el-button size="small" @click="handleMenu(scope.$index, scope.row)">菜单设置</el-button>
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
// import instance1 from '../../common/axiosv1'
    export default {
        name: 'product',
        data() {
            return {
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              select_word:'',
              tableData: [],
              multipleSelection:[],
              currentRow:null
            }
        },
        created() {
          this.getTableData()
        },
        computed: {

        },
        methods: {
            getTableData(){
                let _this=this;
                axios.get('/api/v1/mng/product/list',{
                    params:{
                      pageNumber:this.currentPage,
                      pageSize:this.pageSize,
                      product_name:this.select_word
                    }
                  }).then(function (response) {
                     let arr=response.data.data.productList
                    // console.log(arr)
                     _this.tableData=[]
                     if(arr.length>0){
                       arr.forEach(item => {
                         let tableObj={}
                         tableObj.product_name=item.product_name
                         tableObj.description=item.description
                         tableObj.code=item.code
                         tableObj.id=item.id
                         tableObj.product_sign=item.product_sign
                         tableObj.url=item.url
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
            peoplehandleSizeChange(val) {

            },
            peoplehandleCurrentChange(val) {
                this.currentPage = val
                this.getTableData()
            },
            search() {
              this.currentPage=1
              this.getTableData()
            },
            //新建单个
            newSingle(){
              this.$router.push({ path: 'productAdd'})
            },
            //批量删除
            delAll(){
              let _this=this
              let ids=''
              for(var obj of this.multipleSelection){
                ids+=obj.id+','
              }
              if(ids.length>0){
                  this.$confirm('请确认是否删除产品?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    axios.get('/api/v1/product/del',{
                        params:{
                          ids:ids.substr(0,ids.length-1)
                        }
                      }).then(function (response) {

                            _this.currentPage=1
                            _this.select_word=''
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
              }else{
                this.$message({
                  showClose: true,
                  message: '请选择一个产品进行操作',
                  type: 'error'
                });
              }
            },
            handleSelectionChange(val) {
              this.multipleSelection = val
            },
            handleCurrentChange(val) {

            },
            //编辑单个
            handleEdit(index, row){
              this.$router.push({ path: 'productEdit', query: {
                'product_name': row.product_name,
                'description':row.description,
                'code':row.code,
                'id':row.id,
                'product_sign':row.product_sign,
                'url':row.url
              }})
            },
            //菜单设置 -单个
            handleMenu(index, row){
              this.$router.push({ path: 'menuSet', query: {product_id:row.id}})
            }
        }
    }

</script>

<style scoped>

</style>
