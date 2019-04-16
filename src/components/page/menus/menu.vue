<template>
    <div class="table">
      <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 菜单管理</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
        <div class="container">
          <div class="handle-box">
              <el-input v-model="select_word" placeholder="请输入模块名称" class="handle-input mr10"></el-input>
              <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
          </div>
          <div class="table-content">
            <tree-table ref="recTree" :list.sync="treeDataSource" @actionFunc="actionFunc" @deleteFunc="deleteFunc" @handlerExpand="handlerExpand" @orderByFunc="orderByFunc"></tree-table>
          </div>
        </div>


    </div>
</template>

<script>
import axios from 'axios'
// import instance1 from '../../common/axiosv1'
import treeTable from '../../libs/pc/tree-table.vue'
export default {
    name: 'basetable',
    data() {
        return {
          treeDataSource: [],
          select_word:''
        }
    },
    components: {
      treeTable
    },
    created() {
       this.tableData()

    },
    computed: {

    },
    methods: {
      tableData(){
        let _this=this
        axios.get('/api/v1/menu',{
            params:{
              name:this.select_word
            }
          }).then(function (response) {
             let arr=response.data.data
             _this.treeDataSource=arr
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
      orderByFunc(val) {

      },
      actionFunc(m) {

      },
      deleteFunc(m) {

      },
      handlerExpand(m) {
        m.isExpand = !m.isExpand
      },
      //搜索
      search(){
         this.tableData()
      }
    }
}

</script>

<style scoped>


</style>
