<template>
    <div class="table">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 账号管理</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-exportDownload mr10" @click="exportDownload()"><i class="iconfont icon-xiafa"></i><span class="span">导入模板下载</span></el-button>
          <el-button type="primary" class="handle-export mr10" @click="exportAll()"><i class="iconfont icon-export"></i><span class="span">导入</span></el-button>
          <el-button type="primary" class="handle-new mr10" @click="newSingle()"><i class="iconfont icon-create-orders"></i><span class="span">新建</span></el-button>
          <el-button type="primary" class="handle-del mr10" @click="delAll()"><i class="iconfont icon-shanchu2"></i><span class="span">删除</span></el-button>
        </div>
        <div class="container">
              <div class="handle-box">
                  <el-select v-model="value" placeholder="请选择" class="handle-select">
                      <el-option
                        v-for="item in options"
                        :key="item.index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                  <el-select v-model="accountValue" placeholder="请选择" class="handle-select">
                      <el-option
                        v-for="item in accountOptions"
                        :key="item.index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                  <el-input v-model="user_name" placeholder="请输入用户名" class="handle-input mr10"></el-input>
                  <el-input v-model="account_name" placeholder="请输入账号" class="handle-input mr10"></el-input>
                  <el-date-picker
                    v-model="user_time"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                  <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
              </div>
              <div class="table-content">
                  <el-table ref="singleTable" border  :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentChange" style="width: 100%">
                    <el-table-column type="selection" align="center"  width="50" fixed>
                    </el-table-column>
                    <el-table-column type="index" align="center" width="70" label="序号">
                    </el-table-column>
                    <el-table-column property="customer_name" align="center" label="所属组织" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="username" align="center" label="用户名" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="loginName" align="center" label="账号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="rolename" align="center" label="角色类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="status" align="center" label="账号状态" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="use_time" align="center" label="使用期限" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column property="create_time" align="center" label="创建时间" width="100px" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200px">
                      <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" @click="handleUser(scope.$index, scope.row)" v-if="scope.row.status=='启用'">锁定</el-button>
                        <el-button size="small" @click="handleUser(scope.$index, scope.row)" v-else-if="scope.row.status=='锁定'">启用</el-button>
                        <el-button size="small" @click="handleUser(scope.$index, scope.row)" v-else-if="scope.row.status=='冻结'">解冻</el-button>
                        <el-button size="small" @click="handleReset(scope.$index, scope.row)">重置密码</el-button>
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



        <!-- 导入模态框 -->
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
import $ from 'jquery'
import axios from 'axios'
// import instance1 from '../../common/axiosv1'
    export default {
        name: 'role',
        data() {
            return {
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              user_name:'',
              account_name:'',
              tableData: [],
              multipleSelection:[],
              currentRow:null,
              options: [],
              value: '',
              accountOptions:[{
                value:'',
                label:'账号状态选择'
              },{
                value:'1',
                label:'启用'
              },{
                value:'0',
                label:'禁用'
              }],
              accountValue:'',
              user_time:'',
              status:'',
              file:'',
              exportVisible:false
            }
        },
        created() {
          this.orlData()
          this.getTableData()
        },
        computed: {

        },
        methods: {
            getTableData(){
                let _this=this;
                let startTime=''
                let endTime=''
                if(this.user_time!=''){
                  startTime=(this.user_time)[0]
                  endTime=(this.user_time)[1]
                }else{
                  startTime=''
                  endTime=''
                }

                axios.get('/api/v1/account/list',{
                    params:{
                      pageNumber:this.currentPage,
                      pageSize:this.pageSize,
                      orgid:this.value,
                      status:this.accountValue,
                      loginName:this.account_name,
                      username:this.user_name,
                      start_time:startTime,
                      end_time:endTime
                    }
                  }).then(function (response) {
                     let arr=response.data.data.userList
                     if(arr.length>0){
                       _this.tableData=[]
                       arr.forEach(item => {
                         let tableObj={}
                         tableObj.create_time=item.create_time
                         tableObj.username=item.username
                         tableObj.customer_name=item.customer_name
                         tableObj.orgid=item.orgid
                         tableObj.end_time=item.end_time
                         tableObj.id=item.id
                         tableObj.loginName=item.loginName
                         tableObj.rolename=item.rolename
                         tableObj.start_time=item.start_time
                         if(item.status=='0'){
                           tableObj.status='锁定'
                         }else if(item.status=='1'){
                           tableObj.status='启用'
                         }else if(item.status=='2'){
                           tableObj.status='过期'
                         }else if(item.status=='3'){
                           tableObj.status='冻结'
                         }
                         tableObj.use_time=item.use_time
                         tableObj.email=item.email
                         tableObj.openid=item.openid
                         tableObj.phone=item.phone
                         tableObj.qq_number=item.qq_number
                         tableObj.sex=item.sex
                         tableObj.weixin_number=item.weixin_number
                         tableObj.type=item.type
                         tableObj.name=item.name
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
            //获取下拉框数据  组织列表
            orlData(){
              let _this=this
              axios.get('/api/v1/account/org/list',{
                  params:{

                  }
                }).then(function (response) {
                   let arr=response.data.data
                   let newArr=[{'value':'','label':'所属组织选择'}]
                   if(arr.length>0){
                     for(var i=0;i<arr.length;i++){
                       let obj={}
                       obj.value=arr[i].orgid
                       obj.label=arr[i].customer_name
                       newArr.push(obj)
                     }
                   }
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
              if(this.user_time=='null'|| !(this.user_time)){
                this.user_time=''
              }
              this.currentPage=1
              this.getTableData()
            },
            //新建单个
            newSingle(formName){
              this.$router.push({ path: 'accountAdd'})
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

              axios.post('/api/v1/account/import', formData, config).then(function (res) {
                //console.log(res.data.errorCode)
                if(res.data.errorCode=='0'){
                  _this.currentPage=1
                  _this.value=''
                  _this.accountValue=''
                  _this.user_time=''
                  _this.user_name=''
                  _this.account_name=''
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
              this.$confirm('此操作将会下载账号管理模板, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                axios({
                    method: 'post',
                    url: '/api/v1/account/excel/download',
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
                link.setAttribute('download', '账号管理模板.xlsx')

                document.body.appendChild(link)
                link.click()
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
                    axios.get('/api/v1/account/del',{
                        params:{
                          ids:ids.substr(0,ids.length-1)
                        }
                      }).then(function (response) {
                            _this.currentPage=1
                            _this.value=''
                            _this.accountValue=''
                            _this.user_time=''
                            _this.user_name=''
                            _this.account_name=''
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
              this.$router.push({ path: 'accountEdit', query: {
                    'start_time':row.start_time,
                    'end_time':row.end_time,
                     //  'clientSign':row.clientSign,
                    // 'dept_name':row.dept_name,
                    // 'dept_type':row.dept_type,
                    'email':row.email,
                    'loginName':row.loginName,
                    'openid':row.openid,
                    'customer_name':row.customer_name+','+row.orgid,
                    'phone':row.phone,
                    'qq_number':row.qq_number,
                    'rolename':row.rolename,
                    'sex':row.sex,
                    'status':row.status,
                    'username':row.username,
                    'weixin_number':row.weixin_number,
                    'id':row.id,
                    'type':row.type,
                    'name':row.name
                }
              })
            },
            //点击停用
            handleUser(index, row){
              let state=''
              let _this=this
              if(row.status=='启用'){
                this.$confirm('此操作账号将无法登录, 是否锁定?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  _this.accountStatusHttp(row.id,'0')

                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  });
                });
              }else if(row.status=='锁定'){
                _this.accountStatusHttp(row.id,'1')
              }else if(row.status=='冻结'){
                _this.accountStatusHttp(row.id,'1')
              }
            },
            //按钮触发服务
            accountStatusHttp(ids,state){
              let _this=this
              axios.get('/api/v1/account/status/upd',{
                  params:{
                    id:ids,
                    status:state
                  }
                }).then(function (response) {
                  _this.currentPage=1
                  _this.value=''
                  _this.accountValue=''
                  _this.user_time=''
                  _this.user_name=''
                  _this.account_name=''
                  _this.getTableData()
                  _this.$message({
                    type: 'success',
                    message: '修改成功!'
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
            },

            //重置密码
            handleReset(index, row){
              let _this=this
              axios.get('/api/v1/account/pwd/reset',{
                  params:{
                    id:row.id
                  }
                }).then(function (response) {
                  _this.$alert('重置密码为'+response.data.data.password+'', '密码重置', {
                    confirmButtonText: '确定',
                    callback: action => {
                      // this.$message({
                      //   type: 'info',
                      //   message: ''
                      // })
                    }
                  })
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
            }
        }
    }

</script>

<style scoped>
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
