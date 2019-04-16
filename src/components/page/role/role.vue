<template>
    <div class="table">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 角色管理</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-new mr10" @click="newSingle()"><i class="iconfont icon-create-orders"></i><span class="span">新建</span></el-button>
          <el-button type="primary" class="handle-del mr10" @click="delAll()">
            <i class="iconfont icon-shanchu2"></i><span class="span">删除</span>
          </el-button>
        </div>
        <div class="container">
              <div class="handle-box">
                  <el-select v-model="value" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                  <el-select v-model="roleValue" placeholder="请选择" class="handle-select">
                      <el-option
                        v-for="item in roleStateOptions"
                        :key="item.index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                  <el-input v-model="type_word" placeholder="请输入角色名称" class="handle-input mr10"></el-input>
                  <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
              </div>
              <div class="table-content">
                <el-table ref="singleTable" border  :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentChange" style="width: 100%">
                  <el-table-column type="selection" align="center"  width="50" fixed>
                  </el-table-column>
                  <el-table-column type="index" align="center" width="70" label="序号">
                  </el-table-column>
                  <el-table-column property="rolename" align="center" label="角色名称" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="code" align="center" label="角色编码" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="product_name" align="center" label="所属产品" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="status" align="center" label="角色状态" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="create_time" align="center" label="创建时间" width="180" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                      <el-button size="small" @click="handleMenu(scope.$index, scope.row)">菜单授权</el-button>
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
        name: 'role',
        data() {
            return {
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              type_word:'',
              tableData: [],
              multipleSelection:[],
              currentRow:null,
              options: [],
              value: '',
              roleStateOptions:[{
                value:'',
                label:'角色状态选择'
              },{
                value:'1',
                label:'启用'
              },{
                value:'0',
                label:'禁用'
              }],
              roleValue:''
            }
        },
        created() {
          this.productData()
          this.getTableData()
        },
        computed: {

        },
        methods: {
            getTableData(){
                let _this=this;
                axios.get('/api/v1/role/list',{
                    params:{
                      pageNumber:this.currentPage,
                      pageSize:this.pageSize,
                      product_name:this.value,
                      rolename:this.type_word,
                      status:this.roleValue
                    }
                  }).then(function (response) {
                     let arr=response.data.data.roleList
                     //console.log(arr)
                     _this.tableData=[]
                     if(arr.length>0){
                       arr.forEach(item => {
                         let tableObj={}
                         tableObj.code=item.code
                         tableObj.product_id=item.product_id
                         tableObj.description=item.description
                         tableObj.id=item.id
                         tableObj.product_name=item.product_name
                         tableObj.rolename=item.rolename
                         if(item.status==1){
                           tableObj.status='启用'
                         }else{
                           tableObj.status='禁用'
                         }
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
            //获取下拉框数据  产品选择
            productData(){
              let _this=this
              axios.get('/api/v1/mng/product/list',{
                  params:{
                    pageNumber:'',
                    pageSize:'',
                    product_name:''
                  }
                }).then(function (response) {
                   let arr=response.data.data.productList
                   //console.log(arr);
                   let newArr=[{'value':'','label':'产品选择'}]
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].product_name
                     obj.label=arr[i].product_name
                     newArr.push(obj)
                   }
                   //console.log(newArr)
                   _this.options=newArr
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
            newSingle(formName){
              this.$router.push({ path: 'roleAdd'})
            },
            //批量删除
            delAll(){
              let _this=this
              let ids=''
              for(var obj of this.multipleSelection){
                ids+=obj.id+','
              }
              if(ids.length>0){
                  this.$confirm('此操作将会删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    axios.get('/api/v1/role/del',{
                        params:{
                          ids:ids.substr(0,ids.length-1)
                        }
                      }).then(function (response) {
                            _this.currentPage=1
                            _this.type_word=''
                            _this.value=''
                            _this.roleValue=''
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
                  message: '请勾选项',
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

              this.$router.push({ path: 'roleEdit', query: {
                    code:row.code,
                    create_time:row.create_time,
                    description:row.description,
                    id:row.id,
                    rolename:row.rolename,
                    product_name:row.product_name,
                    status:row.status
                }
              })
            },
            //点击菜单授权
            handleMenu(index, row){
              this.$router.push({ path: 'roleMenu',query:{
                  id:row.id,
                  product_id:row.product_id
                }
              })
            }

        }
    }

</script>

<style scoped>

</style>
