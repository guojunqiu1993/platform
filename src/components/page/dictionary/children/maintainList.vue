<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 字典管理</el-breadcrumb-item>
                <el-breadcrumb-item>字典维护列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="primary" class="handle-new mr10" @click="maintainAddBtn()"><i class="iconfont icon-create-orders"></i><span class="span">新建</span></el-button>
            <el-button type="primary" class="handle-del mr10" @click="returnBtn()"><i class="iconfont icon-fanhui1"></i><span class="span">返回</span></el-button>
        </div>
        <div class="container">
           <div class="table-content" style="margin-top:20px;">
             <el-table max-height="434" ref="singleTable" border  :data="maintainData" highlight-current-row  style="width: 100%">
              <el-table-column property="value" align="center" label="字典值" width="180" fixed>
              </el-table-column>
              <el-table-column property="name" align="center" label="字典名称" width="180">
              </el-table-column>
              <el-table-column property="sort" align="center" label="排序号" width="180">
              </el-table-column>
              <el-table-column property="description" align="center" label="字典描述" width="180">
              </el-table-column>
              <el-table-column property="status" align="center" label="字典状态" width="180">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="small" @click="maintainEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="small" @click="maintainDel(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    // import instance1 from '../../../common/axiosv1'
    export default {
        name: 'maintainList',
        data: function(){
            return {
              dict_type_id:'',
              maintainData:[]
            }
        },
        methods: {
          maintainDataList(){
            this.dict_type_id=this.$route.query.dict_type_id
            let _this=this
              axios.get('/api/v1/dictionary/maintain/list',{
                  params:{
                    dict_type_id:_this.dict_type_id
                  }
                }).then(function (response) {
                   let arr=response.data.data
                   //console.log(arr)
                   _this.maintainData=[]
                   arr.forEach(item => {
                     let tableObj={}
                     tableObj.description=item.description
                     tableObj.dict_type_id=item.dict_type_id
                     tableObj.id=item.id
                     tableObj.name=item.name
                     tableObj.sort=item.sort
                     if(item.status==1){
                       tableObj.status='启用'
                     }else{
                       tableObj.status='禁用'
                     }
                     tableObj.value=item.value

                     _this.maintainData.push(tableObj)
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
          //返回
          returnBtn(){
              this.$router.push({ path: 'dictionaryManagement'})
          },
          //新增
          maintainAddBtn(){
            this.$router.push({ path: 'maintainAdd',query:{
                  dict_type_id:this.dict_type_id
              }
            })
          },
          //编辑
          maintainEdit(index,row){
            let state=''
            if(row.status=='启用'){
              state='1'
            }else{
              state='0'
            }
            this.$router.push({ path: 'maintainEdit',query:{
                'description':row.description,
                'dict_type_id':row.dict_type_id,
                'id':row.id,
                'name':row.name,
                'sort':row.sort,
                'value':row.value,
                'status':state
              }
            })
          },
          //字典维护 -单个删除
          maintainDel(index, row){
            let _this=this
            let state=''
            if(row.status=='启动'){
              state=1
            }else{
              state=0
            }
            this.$confirm('此操作将会删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              axios.get('/api/v1/dictionary/maintain/del',{
                  params:{
                    ids:row.id,
                    dict_type_id:row.dict_type_id,
                    value:row.value,
                    name:row.name,
                    sort:row.sort,
                    description:row.description,
                    status:state
                  }
                }).then(function (response) {
                      _this.maintainDataList()
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
          }
        },
        created(){
          this.maintainDataList()
        }
    }
</script>
<style scoped>

</style>
