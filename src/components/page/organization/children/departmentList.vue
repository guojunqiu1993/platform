<template>
    <div class="table" style="postion:relative;">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>组织管理</el-breadcrumb-item>
              <el-breadcrumb-item>部门管理</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-exportDownload mr10" @click="exportDownload()"><i class="iconfont icon-xiafa"></i><span class="span">导入模板下载</span></el-button>
          <el-button type="primary" class="handle-export mr10" @click="exportAll()"><i class="iconfont icon-create-orders"></i><span class="span">导入</span></el-button>
          <el-button type="primary" class="handle-new mr10" @click="newSingle()"><i class="iconfont icon-create-orders"></i><span class="span">新建</span></el-button>
          <el-button type="primary" class="handle-del mr10" @click="returnOrl()"><i class="iconfont icon-fanhui1"></i><span class="span">返回</span></el-button>
        </div>
        <div class="container">
              <div class="handle-box">
                  <el-select v-model="departValue" placeholder="请选择" class="handle-select">
                      <el-option
                        v-for="item in departOptions"
                        :key="item.index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                  <el-input v-model="select_word" placeholder="请输入部门名称" class="handle-input mr10"></el-input>
                  <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
              </div>

              <div class="table-content">
                <div class="department-tree">
                  <el-tree :data="treeData" node-key="id" default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                </div>
                <div class="table-div">
                  <el-table ref="singleTable" border  :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentChange" style="width: 100%">
                    <el-table-column type="index" align="center" width="70" label="序号">
                    </el-table-column>
                    <el-table-column align="center" label="部门类型" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-show="scope.row.type==1">管理员部门</span>
                        <span v-show="scope.row.type==2">发言人部门</span>
                      </template>
                    </el-table-column>
                    <el-table-column property="name" align="center" label="部门名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="create_time" align="center" label="创建时间" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="level" align="center" label="层级" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="sort" align="center" label="显示顺序" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" align="center" >
                      <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

        <!-- 导出模态框 -->
        <el-dialog title="导入" :visible.sync="exportVisible">
            <input type="file" @change="getFile($event)" ref="pathClear">
            <div slot="footer" class="dialog-footer">
              <el-button @click="exportCancel()">取 消</el-button>
              <el-button type="primary" @click="exportConfirm($event)">确 定</el-button>
            </div>
          </el-dialog>

    </div>
</template>

<script>
import axios from 'axios'
// import instance1 from '../../../common/axiosv1'
    export default {
        name: 'product',
        data() {
            return {
              departValue:'',
              departOptions:[{
                'label':'部门类型选择',
                'value':''
              },{
                'label':'管理员部门',
                'value':'1'
              },{
                'label':'发言人部门',
                'value':'2'
              }],
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              select_word:'',
              tableData: [],
              multipleSelection:[],
              currentRow:null,
              treeData: [],
              defaultProps: {
                children: 'children',
                label: 'name'
              },
              file:'',
              exportVisible:false
            }
        },
        created() {
            // this.departmentTypeData()
            this.getTableData()
            this.departTreeData()
        },
        computed: {

        },
        methods: {
            //左侧-tree
            handleNodeClick(data) {
              console.log(data)
            },
            //左侧树
            departTreeData(){
              let _this=this
              axios.get('/api/v1/org/dept/list/tree',{
                  params:{
                    org_id:_this.$route.query.id
                  }
                }).then(function (response) {
                  //console.log(response.data.data)
                  _this.treeData=response.data.data
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
            //点击导入
            exportAll(index, row){
              this.exportVisible=true
            },
            //导入模态框-取消
            exportCancel(){
              this.exportVisible=false
              this.file=''
            },

            getFile(event) {
              this.file = event.target.files[0];
              //console.log(this.file);
            },
            //导出模态框-确定
            exportConfirm(event) {
              let _this=this
              event.preventDefault();
              let formData = new FormData();
              formData.append('file', this.file);

              let config = {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }

              axios.post('/api/v1/org/dept/import', formData, config).then(function (res) {
                console.log(res.data.errorCode)
                if(res.data.errorCode=='0'){
                  _this.currentPage = 1
                  _this.select_word=''
                  _this.departValue=''
                  _this.getTableData()
                  _this.$refs.pathClear.value =''
                  _this.exportVisible=false
                  _this.$message({
                    type: 'success',
                    message: '导入成功!'
                  })

                }else{
                  _this.$refs.pathClear.value =''
                  _this.exportVisible=false
                  _this.$message.error(res.data.errorMessage)
                }

              })
            },
            //导入模板下载
            exportDownload(){
              let _this=this
              this.$confirm('此操作将会下载部门管理模板, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                axios({
                    method: 'post',
                    url: '/api/v1/org/dept/excel/download',
                    responseType: 'blob'
                }).then(response => {
                    this.download(response.data)
                }).catch((error) => {
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

            // 下载文件
            download (data) {
                if (!data) {
                    return
                }
                let url = window.URL.createObjectURL(new Blob([data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', '部门管理模板.xlsx')

                document.body.appendChild(link)
                link.click()
            },
            //部门类型选择
            departmentTypeData(){
              let _this=this;
              axios.get('/api/v1/org/dept/type/list',{
                  params:{
                    dict_type:'部门类型'
                  }
                }).then(function (response) {
                  let arr=response.data.data
                  //console.log(arr)
                  let newArr=[{'value':'','label':'部门类型选择'}]
                  if(arr.length>0){
                    for(var i=0;i<arr.length;i++){
                      let obj={}
                      obj.value=arr[i]
                      obj.label=arr[i]
                      newArr.push(obj)
                    }
                  }
                  _this.departOptions=newArr
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
            getTableData(){
                let _this=this;
                axios.get('/api/v1/org/dept/list',{
                    params:{
                      pageNumber:_this.currentPage,
                      pageSize:_this.pageSize,
                      org_id:_this.$route.query.id,
                      type:_this.departValue,
                      name:_this.select_word
                    }
                  }).then(function (response) {
                     let arr=response.data.data.deptList
                     //console.log(arr)
                     _this.tableData=[]
                     if(arr.length>0){
                       arr.forEach(item => {
                         let tableObj={}
                         tableObj.children=item.children
                         tableObj.create_time=item.create_time
                         tableObj.id=item.id
                         tableObj.level=item.level
                         tableObj.name=item.name
                         tableObj.org_id=item.org_id
                         tableObj.parentId=item.parentId
                         tableObj.sort=item.sort
                         tableObj.level=item.level
                         tableObj.type=item.type
                         tableObj.isRealDept=item.isRealDept
                         tableObj.parentDept=item.parentDept
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
              this.$router.push({ path: 'departmentAdd', query: {
                'id': this.$route.query.id
                }})
            },
            handleSelectionChange(val) {
              this.multipleSelection = val
            },
            handleCurrentChange(val) {

            },
            //编辑单个
            handleEdit(index, row){
              this.$router.push({ path: 'departmentEdit', query: {
                'id':row.id,
                'level':row.level,
                'name':row.name,
                'sort':row.sort,
                'type':row.type,
                'orl_id': this.$route.query.id,
                'isRealDept':row.isRealDept,
                'parentDept':row.parentDept
                }})

            },
            //导入-部门
            exportDepart(){

            },
            //返回
            returnOrl(){
              this.$router.push({ path: 'organizationManagement'})
            }
        }
    }

</script>

<style scoped>
  .department-tree{
    width:23%;
    margin-right:1.5%;
    height:auto;
    float:left;

  }
  .table-div{
    width:75%;
    float:right;
  }
  .handle-export{
    position:absolute;
    right:160px;
    top:6px;
    padding: 4px 6px;
  }
  .handle-exportDownload{
    position:absolute;
    right:220px;
    top:6px;
    padding: 4px 6px;
  }
</style>
