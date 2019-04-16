<template>

    <div class="sidebar">
      <div class="collapse-btn" @click="collapseChage">
          <div class="collapse-div">
            <i class="iconfont icon-zhankai" v-show="collapse"></i>
            <i class="iconfont icon-shousuo" v-show="!collapse"></i>
          </div>
      </div>
      <!-- :default-active="onRoutes" :collapse="collapse" -->
        <el-menu class="sidebar-el-menu"   :default-active="onRoutes" :collapse="collapse"
              unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus'
    import axios from 'axios'
    export default {
        data() {
            return {
                collapse: true,
                items: [

                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        methods:{
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            slideData(){
              let umsUrl=window.sessionStorage.getItem('umsUrl')
              let dmsUrl=window.sessionStorage.getItem('dmsUrl')
              let product_sign=window.sessionStorage.getItem('product_sign')
              if(product_sign=='ums'){
                this.menuTest(umsUrl)
              }else if(product_sign=='dms'){
                this.menuTest(dmsUrl)
              }
            },
            menuTest(url){
              let _this=this
              axios.get('http://192.168.2.165:8081'+'/api/v1/left/menu',{
                  params:{
                    product_id:window.sessionStorage.getItem('product_id')
                  }
                }).then(function (response) {
                  let arr=response.data.data
                  arr.forEach(item => {
                    if(item.title=='用户管理'){
                      item.index='userManagement'
                      item.icon='iconfont icon-kehuqunzu'
                    }else if(item.title=='系统监控'){
                      item.index='logManagement'
                      item.icon='iconfont icon-rizhi'
                    }else if(item.title=='字典管理'){
                      item.icon='iconfont icon-dict'
                    }else if(item.title=='产品管理'){
                      item.icon='iconfont icon-chanpin'
                    }else if(item.title=='菜单管理'){
                      item.icon='iconfont icon-menu'
                    }else if(item.title=='最新舆情'){
                      item.icon='iconfont icon-zuixin'
                    }else if(item.title=='舆情处置'){
                      item.icon='iconfont icon-wenjian'
                    }else if(item.title=='舆情交流'){
                      item.index='publicExchange'
                      item.icon='iconfont icon-tufashijianshangbao'
                    }else if(item.title=='舆情处理'){
                      item.icon='iconfont icon-chuli'
                    }else if(item.title=='绩效考核'){
                      item.icon='iconfont icon-jixiaokaohexuanzhong'
                      item.index='jixiaokaohe'
                    }else if(item.title=='系统设置'){
                      item.icon='iconfont icon-shezhi'
                      item.index='systemSet'
                    }else if(item.title=='统计分析'){
                      item.icon='iconfont icon-tongji'
                    }
                  })
                  _this.items=arr
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
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
            this.slideData()
        },
        mounted(){
          let objSerialize_ = (obj) => {
             let type_ = Object.prototype.toString.call(obj);
             let str = '?'
             if(type_ == '[object Object]'){
               let keys = Object.keys(obj)
               let key
               for (var i = 0,len = keys.length; i < len; i++) {
                 key = keys[i]
                 if(i == 0){
                   str += keys[i]+'='+obj[key]
                 }else{
                   str += '&'+keys[i]+'='+obj[key]
                 }
              }
              return str
             }else{
               return console.log('非对象类型')
             }
          }
          if(document.body.clientWidth < 1500){
              this.collapseChage();
          }
        }
    }
</script>

<style scoped>
    .collapse-btn{
        cursor: pointer;
        height: 38px;
    }
    .collapse-div{
      width:24px;
      height:24px;
      line-height: 24px;
      text-align: center;
      border-radius:3px;
      float:right;
      margin-right: 20px;
      margin-top:6px;
    }
    .collapse-div i{
      color:#fff;
    }
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 60px;
        bottom:0;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 210px;
    }
    .sidebar > ul {
        height:100%;
    }
    .content .sidebar-el-menu .el-menu-item:hover{
       background-color: rgb(231, 235, 240) !important;
    }
    .el-menu-item i,.el-submenu__title i{
      margin-right:10px;
    }

</style>
