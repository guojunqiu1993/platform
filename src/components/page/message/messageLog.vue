<template>
    <div class="table">
      <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 日志管理</el-breadcrumb-item>
              <el-breadcrumb-item>消息发送日志</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-export mr10" @click="exportAll"><i class="iconfont icon-xiafa"></i><span class="span">导出</span></el-button>
          <el-button type="primary" class="handle-new mr10" @click="sendAgainAll"><i class="iconfont icon-send"></i><span class="span">再次发送</span></el-button>
      </div>
      <div class="container">
        <div class="handle-box">
            <el-select @change="productSel()" class="handle-select" v-model="productNameValue" placeholder="请选择产品名称" style="margin-bottom:10px;">
                <el-option
                  v-for="item in productNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-select @change="clientSel()" class="handle-select" v-model="sendUnitValue" placeholder="请选择发送单位">
                <el-option
                  v-for="item in sendUnitOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-select class="handle-select" v-model="sendDepartValue" placeholder="请选择发送部门">
                <el-option
                  v-for="item in sendDepartOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-select class="handle-select" v-model="sendObjectValue" placeholder="请选择发送对象">
                <el-option
                  v-for="item in sendObjectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-select class="handle-select" v-model="sendWayValue" placeholder="请选择发送方式">
                <el-option
                  v-for="item in sendWayOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <el-select class="handle-select" v-model="sendStateValue" placeholder="请选择发送状态">
                <el-option
                  v-for="item in sendStateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>

            <el-date-picker
              v-model="time"
              value-format="yyyy-MM-dd hh:mm:ss"
              type="datetimerange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>

            <el-input v-model="type_word" placeholder="请输入详情关键字" class="handle-input mr10"></el-input>
            <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
        </div>

        <div class="table-content">
            <el-table ref="singleTable" border  :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentChange" style="width: 100%">
              <el-table-column type="selection" align="center"  width="50" fixed>
              </el-table-column>
              <el-table-column type="index" align="center" width="70" label="序号">
              </el-table-column>
              <el-table-column property="senderTenantName" align="center" label="客户组织" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="senderLoginNameAll" align="center" label="发送人" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="receiverLoginNameAll" align="center" label="发送对象" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="receiverContact" align="center" label="接收地址" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="notificationTypeName" align="center" label="发送方式" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="notificationDetail" align="center" label="详情" width="220px;" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="notificationTime" align="center" label="发送时间" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="notificationResultName" align="center" label="发送状态" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="center" label="操作" >
                <template slot-scope="scope">
                  <el-button size="small" @click="sendAgain(scope.$index, scope.row)">再次发送</el-button>
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
              sendUnitOptions:[],
              sendUnitValue:'',
              sendDepartOptions:[],
              sendDepartValue:'',
              sendObjectOptions:[],
              sendObjectValue:'',
              sendWayOptions:[],
              sendWayValue:'',
              sendStateOptions:[],
              sendStateValue:'',
              time:'',
              productIdCli:''
            }
        },
        created() {
            this.productData()
          //  this.getData()
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
            axios.get('/api/v1/notificationlog/list',{
                params:{
                  pageIndex:this.currentPage,
                  pageSize:this.pageSize,
                  productionId:productId,
                  senderTenantId:this.sendUnitValue,
                  senderDepartmentId:this.sendDepartValue,
                  receiverTenantId:this.sendObjectValue,
                  notificationTimeBegin:startTime,
                  notificationTimeEnd:endTime,
                  notificationType:this.sendWayValue,
                  notificationResult:this.sendStateValue,
                  notificationDetail:this.type_word
                }
              }).then(function (response) {
                 let arr=response.data.data.dataList
                // console.log(arr)
                 _this.tableData=[]
                 if(arr.length>0){
                   arr.forEach(item => {
                     let tableObj={}
                     tableObj.id=item.id
                     tableObj.notificationDetail=item.notificationDetail
                     tableObj.notificationResultName=item.notificationResultName
                     tableObj.notificationTime=item.notificationTime
                     tableObj.notificationTypeName=item.notificationTypeName
                     tableObj.receiverContact=item.receiverContact
                     tableObj.receiverLoginName=item.receiverLoginName
                     tableObj.receiverTenantName=item.receiverTenantName
                     tableObj.senderContact=item.senderContact
                     tableObj.senderDepartmentName=item.senderDepartmentName
                     tableObj.senderLoginName=item.senderLoginName
                     tableObj.senderTenantName=item.senderTenantName
                     tableObj.senderLoginNameAll=item.senderDepartmentName+'_'+item.senderLoginName
                     tableObj.receiverLoginNameAll=item.receiverTenantName+'_'+item.receiverLoginName

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
            let ids=''
            for(var obj of this.multipleSelection){
              ids+=obj.id+','
            }
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

            ids=ids.substr(0,ids.length-1)
            if(ids.length>0){
                this.$confirm('此操作将会按勾选项导出数据, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  axios({
                      method: 'get',
                      url: '/api/v1/notificationlog/exporting/selected?ids='+ids+'&productionId='+productId+'&senderTenantId='+_this.sendUnitValue,
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
                    url: '/api/v1/notificationlog/exporting/queried?pageIndex='+_this.currentPage+'&pageSize='+_this.pageSize+'&productionId='+productId+'&senderTenantId='+_this.sendUnitValue+'&senderDepartmentId='+_this.sendDepartValue+'&receiverTenantId='+_this.sendObjectValue+'&notificationTimeBegin='+startTime+'&notificationTimeEnd='+endTime+'&notificationType='+_this.sendWayValue+'&notificationResult='+_this.sendStateValue+'&notificationDetail='+_this.type_word,
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
              link.setAttribute('download', '消息发送日志.xlsx')

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
          sendAgain(index, row){
            let _this=this
            let culId=row.id
            axios.post('/api/v1/notificationlog/sendingagain?ids='+culId+'')
            .then(function (response) {
              _this.productData()
              _this.$message({
                type: 'success',
                message: '再次发送成功'
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
          },
          //批量发送
          sendAgainAll(){
            let _this=this
            let ids=''
            for(var obj of this.multipleSelection){
              ids+=obj.id+','
            }
            ids=ids.substr(0,ids.length-1)
            if(ids.length>0){
                this.$confirm('此操作将会批量发送, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  axios.post('/api/v1/notificationlog/sendingagain?ids='+ids+'')
                  .then(function (response) {
                    _this.productData()
                    _this.$message({
                      type: 'success',
                      message: '再次发送成功'
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
                // console.log(arr);
                 let newArr=[]
                 if(arr.length>0){
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].id+','+arr[i].product_name
                     obj.label=arr[i].product_name
                     newArr.push(obj)
                   }
                   _this.productNameOptions=newArr
                   _this.productNameValue=((newArr[0].value).split(","))[1]
                   _this.productIdCli=((newArr[0].value).split(","))[0]
                   _this.getData()



                   //初始化操作
                   let productId=((newArr[0].value).split(","))[0]

                   //单位选择
                   axios.get('/api/v1/product/org/list',{
                       params:{
                         product_id:productId
                       }
                     }).then(function (response) {
                        let arr=response.data.data
                        //console.log(arr)
                        let newArr=[{'value':'','label':'组织选择'}]
                        if(arr.length>0){
                          for(var i=0;i<arr.length;i++){
                            let obj={}
                            obj.value=arr[i].org_id
                            obj.label=arr[i].customer_name
                            newArr.push(obj)
                          }
                        }
                        _this.sendUnitOptions=newArr
                        _this.sendObjectOptions=newArr
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


                   //发送方式
                   axios.get('/api/v1/dictionary/maintain/list',{
                       params:{
                         product_id:productId,
                         dict_type:'通知类型'
                       }
                     }).then(function (response) {
                        let arr=response.data.data
                       // console.log(arr)
                        let newArr=[{'value':'','label':'发送方式选择'}]
                        if(arr.length>0){
                          for(var i=0;i<arr.length;i++){
                            let obj={}
                            obj.value=arr[i].value
                            obj.label=arr[i].name
                            newArr.push(obj)
                          }
                        }
                        _this.sendWayOptions=newArr

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

                     //发送状态
                     axios.get('/api/v1/dictionary/maintain/list',{
                         params:{
                           product_id:productId,
                           dict_type:'通知结果'
                         }
                       }).then(function (response) {
                          let arr=response.data.data
                         // console.log(arr)
                          let newArr=[{'value':'','label':'发送状态选择'}]
                          if(arr.length>0){
                            for(var i=0;i<arr.length;i++){
                              let obj={}
                              obj.value=arr[i].value
                              obj.label=arr[i].name
                              newArr.push(obj)
                            }
                          }
                          _this.sendStateOptions=newArr
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
            this.sendUnitValue=''
            this.sendObjectValue=''
            this.sendDepartValue=''
            this.sendWayValue=''
            this.sendStateValue=''
            let proArr=(this.productNameValue).split(",")
            let productId=proArr[0]
            let _this=this
            //单位选择
            axios.get('/api/v1/product/org/list',{
                params:{
                  product_id:productId
                }
              }).then(function (response) {
                 let arr=response.data.data
                 //console.log(arr)
                 let newArr=[{'value':'','label':'组织选择'}]
                 if(arr.length>0){
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].org_id
                     obj.label=arr[i].customer_name
                     newArr.push(obj)
                   }
                 }
                 _this.sendUnitOptions=newArr
                 _this.sendObjectOptions=newArr
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


              //发送方式
              axios.get('/api/v1/dictionary/maintain/list',{
                  params:{
                    product_id:productId,
                    dict_type:'通知类型'
                  }
                }).then(function (response) {
                   let arr=response.data.data
                  // console.log(arr)
                   let newArr=[{'value':'','label':'发送方式选择'}]
                   if(arr.length>0){
                     for(var i=0;i<arr.length;i++){
                       let obj={}
                       obj.value=arr[i].value
                       obj.label=arr[i].name
                       newArr.push(obj)
                     }
                   }
                   _this.sendWayOptions=newArr
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

                //发送状态
                axios.get('/api/v1/dictionary/maintain/list',{
                    params:{
                      product_id:productId,
                      dict_type:'通知结果'
                    }
                  }).then(function (response) {
                     let arr=response.data.data
                    // console.log(arr)
                     let newArr=[{'value':'','label':'发送状态选择'}]
                     if(arr.length>0){
                       for(var i=0;i<arr.length;i++){
                         let obj={}
                         obj.value=arr[i].value
                         obj.label=arr[i].name
                         newArr.push(obj)
                       }
                     }
                     _this.sendStateOptions=newArr
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
          //单位选择-下拉事件
          clientSel(){
              this.sendDepartValue=''
              let orgId=this.sendUnitValue
              let _this=this
              //部门选择
              axios.get('/api/v1/org/dept/list',{
                  params:{
                    org_id:orgId
                  }
                }).then(function (response) {
                   let arr=response.data.data.deptList
                   //console.log(arr)
                   let newArr=[{'value':'','label':'部门选择'}]
                   if(arr.length>0){
                     for(var i=0;i<arr.length;i++){
                       let obj={}
                       obj.value=arr[i].id
                       obj.label=arr[i].name
                       newArr.push(obj)
                     }
                   }
                   _this.sendDepartOptions=newArr
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
