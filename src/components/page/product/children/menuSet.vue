<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 产品管理</el-breadcrumb-item>
                <el-breadcrumb-item>菜单设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="commonTree">
              <el-tree
              :data="data"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :default-checked-keys="arr_check"
              :props="defaultProps">
              </el-tree>
            </div>
        </div>
        <div class="common-btns">
          <el-button type="primary" @click="saveCancel()">保存</el-button>
          <el-button @click="editCancel()">取消</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    // import instance1 from '../../../common/axiosv1'
    export default {
        name: 'menuSet',
        data: function(){
            return {
              data:[],
              defaultProps: {
                children: 'children',
                label: 'name'
              },
              arr_check:[]
            }

        },
        methods: {
          saveCancel(){
            let product_ids=this.$route.query.product_id
            let _this=this
            let arr=[]
            let parentArr=[]
            let newArr=[]
            arr=this.$refs.tree.getCheckedNodes()
            parentArr=this.$refs.tree.getHalfCheckedNodes()
            let concatArr=arr.concat(parentArr)
            if(concatArr.length>0){
              for(var i=0;i<concatArr.length;i++){
                let obj={}
                obj.id=concatArr[i].id
                obj.level=concatArr[i].level
                obj.product_id=product_ids
                newArr.push(obj)
              }
            }else{
              newArr=[{'product_id':product_ids}]
            }


               axios.post('/api/v1/product/menu/set', {
                   ids:newArr
               })
               .then(function (response) {
                   _this.$router.push({ path: 'productManagement'})
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
          editCancel(){
            this.$router.push({ path: 'productManagement'})
          },
          checkData(){
            let product_ids=this.$route.query.product_id
            let _this=this
            axios.get('/api/v1/product/menu',{
                params:{
                  product_id:product_ids
                }
              }).then(function (response) {
                let arr=response.data.data.menu
                let ids=response.data.data.ids
                //console.log(arr)
                _this.data=arr
                _this.arr_check=ids
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

        },
        created(){
          this.checkData()
        }

    }
</script>
<style scoped>
  .commonTree{
    width:30%;
    overflow:auto;
    margin:20px auto;
  }
</style>
