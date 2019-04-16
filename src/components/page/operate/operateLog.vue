<template>
    <div class="table">
      <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 日志管理</el-breadcrumb-item>
              <el-breadcrumb-item>操作行为日志</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-export mr10" @click="exportAll"><i class="iconfont icon-xiafa"></i><span class="span">导出</span></el-button>
      </div>
      <div class="container">
        <div class="handle-box">
            <el-select  @change="productSel()" class="handle-select product_select" v-model="productNameValue" placeholder="请选择产品名称" style="margin-bottom:10px;">
                <el-option
                  v-for="item in productNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-select @change="clientSel()" class="handle-select" v-model="clientNameValue" placeholder="请选择客户">
                <el-option
                  v-for="item in clientNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-select class="handle-select" v-model="roleNameValue" placeholder="请选择角色">
                <el-option
                  v-for="item in roleNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-select class="handle-select" v-model="departNameValue" placeholder="请选择部门">
                <el-option
                  v-for="item in departNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-select class="handle-select" v-model="optionPlaceValue" placeholder="请选择操作位置">
                <el-option
                  v-for="item in optionPlaceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-select class="handle-select" v-model="optionTypeValue" placeholder="请选择操作类型">
                <el-option
                  v-for="item in optionTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>

            <el-date-picker
              v-model="time"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>

            <el-input v-model="type_word" placeholder="请输入账号" class="handle-input mr10"></el-input>
            <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
        </div>
        <div class="table-content">
            <el-table ref="singleTable" border  :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentChange" style="width: 100%">
              <el-table-column type="selection" align="center"  width="50" fixed>
              </el-table-column>
              <el-table-column type="index" align="center" width="70" label="序号">
              </el-table-column>
              <el-table-column property="tenantName" align="center" label="客户名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="departmentName" align="center" label="部门" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="roleName" align="center" label="角色类型" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="loginName" align="center" label="账号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="operationMenuName" align="center" label="操作位置" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="operationTypeName" align="center" label="操作类型" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="operationDetail" align="center" label="操作详情" width="200" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="operationTime" align="center" label="操作时间" width="180" show-overflow-tooltip>
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
        name: 'operateLog',
        data() {
            return {
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              type_word:'',
              tableData: [],
              multipleSelection:[],
              currentRow:null,
              productNameOptions: [],
              productNameValue: '',
              clientNameOptions:[],
              clientNameValue:'',
              roleNameOptions:[],
              roleNameValue:'',
              departNameOptions:[],
              departNameValue:'',
              optionPlaceOptions:[],
              optionPlaceValue:'',
              optionTypeOptions:[],
              optionTypeValue:'',
              time:'',
              productIdCli:''
            }
        },
        created() {
          this.productData()
          // this.getData()
        },
        computed: {

        },
        methods: {
          getData(){

            let _this=this
            let proArr=(this.productNameValue).split(",")
            let productId=''
            if(proArr.length==2){
              productId=proArr[0]
            }else {
              if(this.productNameValue==''){
                productId=''
              }else{
                productId=this.productIdCli
              }

            }
            let startTime=''
            let endTime=''
            if(this.time!=''){
              startTime=(this.time)[0]
              endTime=(this.time)[1]
            }else{
              startTime=''
              endTime=''
            }
            axios.get('/api/v1/operationlog/list',{
                params:{
                  pageIndex:this.currentPage,
                  pageSize:this.pageSize,
                  productionId:productId,
                  loginName:this.type_word,
                  tenantId:this.clientNameValue,
                  departmentId:this.departNameValue,
                  roleId:this.roleNameValue,
                  operationTimeBegin:startTime,
                  operationTimeEnd:endTime,
                  operationType:this.optionTypeValue,
                  operationMenu:this.optionPlaceValue,
                }
              }).then(function (response) {
                 let arr=response.data.data.dataList
                // console.log(arr)
                 _this.tableData=[]
                 if(arr.length>0){
                   arr.forEach(item => {
                     let tableObj={}
                     tableObj.departmentName=item.departmentName
                     tableObj.id=item.id
                     tableObj.loginName=item.loginName
                     tableObj.operationDetail=item.operationDetail
                     tableObj.operationMenuName=item.operationMenuName
                     tableObj.operationTime=item.operationTime
                     tableObj.operationTypeName=item.operationTypeName
                     tableObj.roleName=item.roleName
                     tableObj.tenantName=item.tenantName
                     _this.tableData.push(tableObj)
                   })
                   _this.peopleCount=response.data.data.totalCount
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
          //导出
          exportAll(){
            let _this=this
            let proArr=(this.productNameValue).split(",")
            let productId=''
            if(proArr.length==2){
              productId=proArr[0]
            }else {
              if(this.productNameValue==''){
                productId=''
              }else{
                productId=this.productIdCli
              }

            }
            let startTime=''
            let endTime=''
            if(this.time!=''){
              startTime=(this.time)[0]
              endTime=(this.time)[1]
            }else{
              startTime=''
              endTime=''
            }

            let ids=''
            for(var obj of this.multipleSelection){
              ids+=obj.id+','
            }
            ids=ids.substr(0,ids.length-1)
            if(ids.length>0){
                this.$confirm('此操作将会按勾选项导出数据, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {

                  axios({
                      method: 'get',
                      url: 'api/v1/operationlog/exporting/selected?ids='+ids+'&productionId='+productId+'&tenantId='+_this.clientNameValue,
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
            }else{
              this.$confirm('此操作将会按条件导出数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {

                axios({
                    method: 'get',
                    url: 'api/v1/operationlog/exporting/queried?pageIndex='+_this.currentPage+'&pageSize='+_this.pageSize+'&productionId='+productId+'&loginName='+_this.type_word+'&tenantId='+_this.clientNameValue+'&departmentId='+_this.departNameValue+'&roleId='+_this.roleNameValue+'&operationTimeBegin='+startTime+'&operationTimeEnd='+endTime+'&operationType='+_this.optionTypeValue+'&operationMenu='+_this.optionPlaceValue,
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
            }
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
              link.setAttribute('download', '操作行为日志.xlsx')

              document.body.appendChild(link)
              link.click()
          },
          peoplehandleSizeChange(val) {

          },
          peoplehandleCurrentChange(val) {
              this.currentPage = val
              this.getData()
          },
          search() {
            if(this.time=='null'|| !(this.time)){
              this.time=''
            }
            this.currentPage=1
            this.getData()
          },
          handleSelectionChange(val) {
            this.multipleSelection = val
          },
          handleCurrentChange(val) {

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
                 let newArr=[]
                 if(arr.length>0){
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].id+','+arr[i].product_name
                     obj.label=arr[i].product_name
                     newArr.push(obj)
                   }
                 }
                 _this.productNameOptions=newArr
                 _this.productNameValue=((newArr[0].value).split(","))[1]
                 _this.productIdCli=((newArr[0].value).split(","))[0]
                 _this.getData()
                 //初始化
                 let productId=((newArr[0].value).split(","))[0]
                 let productName=((newArr[0].value).split(","))[1]
                 //客户选择
                 axios.get('/api/v1/product/org/list',{
                     params:{
                       product_id:productId
                     }
                   }).then(function (response) {
                      let arr=response.data.data
                      //console.log(arr)
                      let newArr=[{'value':'','label':'客户选择'}]
                      if(arr.length>0){
                        for(var i=0;i<arr.length;i++){
                          let obj={}
                          obj.value=arr[i].org_id
                          obj.label=arr[i].customer_name
                          newArr.push(obj)
                        }
                      }
                      _this.clientNameOptions=newArr
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

                 //角色
                 axios.get('/api/v1/role/list',{
                     params:{
                       pageNumber:'',
                       pageSize:'',
                       product_name:productName,
                       status:'',
                       rolename:''
                     }
                   }).then(function (response) {
                      let arr=response.data.data.roleList
                     // console.log(arr)
                      let newArr=[{'value':'','label':'角色选择'}]
                      if(arr.length>0){
                        for(var i=0;i<arr.length;i++){
                          let obj={}
                          obj.value=arr[i].id
                          obj.label=arr[i].rolename
                          newArr.push(obj)
                        }
                      }
                      _this.roleNameOptions=newArr
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

                   //操作类型
                   axios.get('/api/v1/dictionary/maintain/list',{
                       params:{
                         product_id:productId,
                         dict_type:'操作类'
                       }
                     }).then(function (response) {
                        let arr=response.data.data
                       // console.log(arr)
                        let newArr=[{'value':'','label':'操作类型选择'}]
                        if(arr.length>0){
                          for(var i=0;i<arr.length;i++){
                            let obj={}
                            obj.value=arr[i].value
                            obj.label=arr[i].name
                            newArr.push(obj)
                          }
                        }
                        _this.optionTypeOptions=newArr
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

                     //操作位置
                     axios.get('/api/v1/product/menu/list',{
                         params:{
                           product_id:productId
                         }
                       }).then(function (response) {
                          let arr=response.data.data
                          console.log(arr)
                          let newArr=[{'value':'','label':'操作位置选择'}]
                          if(arr.length>0){
                            for(var i=0;i<arr.length;i++){
                              let obj={}
                              obj.value=arr[i].id
                              obj.label=arr[i].name
                              newArr.push(obj)
                            }
                          }
                          _this.optionPlaceOptions=newArr
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
          //产品选择-下拉事件
          productSel(){
            this.clientNameValue=''
            this.roleNameValue=''
            this.optionTypeValue=''
            this.optionPlaceValue=''
            this.departNameValue=''
            let proArr=(this.productNameValue).split(",")
            let productId=proArr[0]
            let productName=proArr[1]
            let _this=this
            //客户选择
            axios.get('/api/v1/product/org/list',{
                params:{
                  product_id:productId
                }
              }).then(function (response) {
                 let arr=response.data.data
                 //console.log(arr)
                 let newArr=[{'value':'','label':'客户选择'}]
                 if(arr.length>0){
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].org_id
                     obj.label=arr[i].customer_name
                     newArr.push(obj)
                   }
                 }
                 _this.clientNameOptions=newArr
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

            //角色
            axios.get('/api/v1/role/list',{
                params:{
                  pageNumber:'',
                  pageSize:'',
                  product_name:productName,
                  status:'',
                  rolename:''
                }
              }).then(function (response) {
                 let arr=response.data.data.roleList
                // console.log(arr)
                 let newArr=[{'value':'','label':'角色选择'}]
                 if(arr.length>0){
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].id
                     obj.label=arr[i].rolename
                     newArr.push(obj)
                   }
                 }
                 _this.roleNameOptions=newArr
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

              //操作类型
              axios.get('/api/v1/dictionary/maintain/list',{
                  params:{
                    product_id:productId,
                    dict_type:'操作类'
                  }
                }).then(function (response) {
                   let arr=response.data.data
                  // console.log(arr)
                   let newArr=[{'value':'','label':'操作类型选择'}]
                   if(arr.length>0){
                     for(var i=0;i<arr.length;i++){
                       let obj={}
                       obj.value=arr[i].value
                       obj.label=arr[i].name
                       newArr.push(obj)
                     }
                   }
                   _this.optionTypeOptions=newArr
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

                //操作位置
                axios.get('/api/v1/product/menu/list',{
                    params:{
                      product_id:productId
                    }
                  }).then(function (response) {
                     let arr=response.data.data
                     console.log(arr)
                     let newArr=[{'value':'','label':'操作位置选择'}]
                     if(arr.length>0){
                       for(var i=0;i<arr.length;i++){
                         let obj={}
                         obj.value=arr[i].id
                         obj.label=arr[i].name
                         newArr.push(obj)
                       }
                     }
                     _this.optionPlaceOptions=newArr
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
          //客户选择下拉事件
          clientSel(){
            let orgId=this.clientNameValue
            let _this=this
            //部门选择
            axios.get('/api/v1/org/dept/list',{
                params:{
                  org_id:orgId
                }
              }).then(function (response) {
                 let arr=response.data.data.deptList
                 let newArr=[{'value':'','label':'部门选择'}]
                 if(arr.length>0){
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].id
                     obj.label=arr[i].name
                     newArr.push(obj)
                   }
                 }
                 _this.departNameOptions=newArr
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

</style>
