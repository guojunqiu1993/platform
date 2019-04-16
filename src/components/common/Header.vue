<template>
    <div class="header">
        <div class="logo">
            <img v-bind:src="imgUrl"/>
            <span>统一平台</span>
        </div>
        <div class="header-right">
            <div class="header-user-con">
              <div class="header-message">
                  <span>欢迎您,</span>
                  <span>{{loginName}}</span>
                  <span>服务组织:</span>
                  <span>{{organizationName}}</span>
              </div>
              <!-- <div class="notice-btn"><i class="iconfont icon-notice"></i></div> -->
              <div class="help-btn" title="回到模块列表" @click="moduleReturn()"><i class="iconfont icon-liucheng"></i></div>
              <div class="shezhi-btn" title="密码设置"><i class="iconfont icon-quanxian2" @click="topSet()" ></i></div>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  <div class="notice-btn"><i class="iconfont icon-pifu"></i></div>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item class="clearfix" command="sutraBlue">
                    经典蓝
                  </el-dropdown-item>
                  <el-dropdown-item class="clearfix" command='scienceBlue'>
                    科技蓝
                  </el-dropdown-item>
                  <el-dropdown-item class="clearfix" command='deepBlue'>
                    深沉蓝
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div class="tuichu-btn" @click="quit" title="退出"><i class="iconfont icon-tuichu"></i></div>
            </div>
        </div>
    </div>



</template>
<script>
    import $ from 'jquery'
    import bus from '../common/bus';
    export default {
        data() {
            return {
              loginName:'admin',
              organizationName:'-',
              imgUrl:'',
              colorState:'sutraBlue'
            }
        },
        computed:{

        },
        methods:{
          quit() {
            this.$confirm('此操作将会退出登录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              window.sessionStorage.removeItem('access_token', '')
            //  window.localStorage.removeItem('imgUrl', '')
              this.$router.push('/login')
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
          },
          messageSet(){
            this.loginName=localStorage.getItem('ms_username')
            //this.imgUrl=localStorage.getItem('imgUrl')
            this.imgUrl='/static/img/logo/logo_gly.png'
          },
          handleCommand(command){
            let newUrl='./static/css/common_'+command+'.css'
            $("link.changeSkin").each(function(index,item){
            	$(item).attr( "href", newUrl + "?vhong=" + ( new Date() ).valueOf() )
        		});
          },
          topSet(){
            this.$router.push({ path: 'passwordSet'})
          },
          moduleReturn(){
            this.$router.push({ path: 'useChoose'})
          }
        },
        mounted(){
            this.messageSet()
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        font-size: 22px;
        color: #fff;
        padding:0 10px 0 20px;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 58px;
    }
    .header .logo{
      float:left;
      padding-top: 7px;
    }
    .header .logo img{
      width:130px;
      height: auto;
      vertical-align: bottom;
    }
    .header .logo span{
        font-size: 22px;
        font-weight:bold;
    }
    .header-right{
        float: right;
    }
    .header-user-con{
        display: flex;
        height: 60px;
        align-items: center;
    }
    .notice-btn,.help-btn,.shezhi-btn,.tuichu-btn{
      width:30px;
      height:30px;
      line-height: 30px;
      text-align: center;
      background: rgba(255,255,255,0.2);
      border-radius:3px;
      margin-right:10px;
      cursor:pointer;
      box-shadow: 0px 0px 1px rgba(0,0,0,0.3);
    }
    .notice-btn:hover,.help-btn:hover,.shezhi-btn:hover,.tuichu-btn:hover{
      background: rgba(255,255,255,0.1);
    }
    .header-message{
      font-size:14px;
    }
    .header-message span:nth-of-type(2),.header-message span:nth-of-type(4){
      margin-right:10px;
    }
    .header .el-dropdown{
      color:#fff;
    }
</style>
