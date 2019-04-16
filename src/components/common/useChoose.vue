 <template>
  <div class="module-container">

      <div class="logo">
          <div class="top">
            <span>{{loginName}},</span>
            <span>欢迎您登录舆情服务平台,祝您工作愉快!</span>
            <span>{{time}}</span>
            <div class="tuichu-btn" @click="quit" title="退出"><i class="iconfont icon-tuichu"></i></div>
          </div>
          <img src="/static/img/logo/logo_gly.png"/>
          <span>统一平台</span>
      </div>
      <ul class="use-item">
        <template v-for="obj in userArr" v-if="userArr.length!=2">
          <li @click="nextModule(obj.url,obj.product_name,obj.product_sign,obj.id)" class="moreItem">
            <img src="/static/img/main/select_logo_ams.png">
            <div class="use-word">
              <span>{{obj.product_name}}</span>
            </div>
            <div class="use-next"> <i class="iconfont icon-arrow-right"></i> </div>
          </li>
        </template>
        <template v-for="obj in userArr" v-if="userArr.length==2">
          <li @click="nextModule(obj.url,obj.product_name,obj.product_sign,obj.id)" class="litterItem">
            <img src="/static/img/main/select_logo_ams.png">
            <div class="use-word">
              <span>{{obj.product_name}}</span>
            </div>
            <div class="use-next"> <i class="iconfont icon-arrow-right"></i> </div>
          </li>
        </template>
      </ul>
    </div>

</template>
<script>
    import bus from '../common/bus'
    import axios from 'axios'
    import { getModuleList,signName } from '@/api/login'
    let name=window.localStorage.getItem('ms_username')
    export default {
        data() {
            return {
              userArr:[],
              loginName:name,
              time:''
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
              this.$router.push('/login')
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
          },
          //获取系统时间
          timeGet(){
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            let week=''
            if(date.getDay() == 1){
              week= '星期一'
            } else if(date.getDay() == 2){
              week= '星期二'
            } else if(date.getDay() == 3){
              week= '星期三'
            } else if(date.getDay() == 4){
              week= '星期四'
            } else if(date.getDay() == 5){
              week= '星期五'
            } else if(date.getDay() == 6){
              week= '星期六'
            } else {
              week= '星期日'
            }
            let nowDate = year + "-" + month + "-" + day+"  "+week
            this.time=nowDate
          },
          //模块加载
          moduleList(){
            let _this=this
            let submitUrl_=getModuleList()
            let barer_token = 'Bearer ' + window.sessionStorage.getItem('access_token')
            let config = {
              headers: {
                'Authorization': barer_token
              }
            }
            axios.get(submitUrl_,'',config).then(function (response) {
                _this.userArr=response.data.data
                let arr=_this.userArr
                for(var i=0;i<arr.length;i++){
                  if(arr[i].product_sign=='ums'){
                    window.sessionStorage.setItem('umsUrl', arr[i].url)
                  }else if(arr[i].product_sign=='dms'){
                    window.sessionStorage.setItem('dmsUrl', arr[i].url)
                  }
                }
            }).catch(function (error) {
              if(error.response.data.errorCode=='7' || error.response.data.errorCode=='8' ){
                window.sessionStorage.removeItem('access_token', '')
                _this.$router.push({ path: 'login'})
              }
            })

          },
          //点击模块
          nextModule(url,name,product_signs,id){
            window.sessionStorage.setItem('product_id', id)
            let _this=this
            let submitUrl_=signName()
            let barer_token = 'Bearer ' + window.sessionStorage.getItem('access_token')
            let config = {
              headers: {
                'Authorization': barer_token
              }
            }
            axios.post(submitUrl_, {
              product_sign:product_signs
            },config)
            .then(function (response) {
                 window.sessionStorage.setItem('product_sign', product_signs)
                 if(product_signs=='ums'){
                   window.sessionStorage.setItem('url', url)
                   _this.$router.push({ path: 'menuManagement'})
                 }else if(product_signs=='dms'){
                   window.sessionStorage.setItem('url', url)
                   let arrs=response.data.data
                   if(arrs[0].type=='1'){
                     _this.$router.push({ path: 'newPublic'}) //管理员
                   }else if(arrs[0].type=='2'){
                     _this.$router.push({ path: 'publicDispose'})  //发言人
                   }
                 }
            }).catch(function (error) {
              if(error.response.data.errorCode=='7' || error.response.data.errorCode=='8' ){
                window.sessionStorage.removeItem('access_token', '')
                _this.$router.push({ path: 'login'})
              }
            })

          }

        },
        mounted(){
            this.moduleList()
            this.timeGet()
        }
    }
</script>
<style scoped>
    .module-container{
      width:100%;
      height:100%;
      overflow:hidden;
      background: #edf3fc;
    }
    .logo .top{
      height:44px;
      line-height:44px;
      text-align: right;
      color:#fdffff;
      padding-right:30px;
      background: rgba(0,0,0,0.2);
    }
    .logo .top span{
      font-size:14px;
      font-weight:normal;
    }
    .logo{
      width:100%;
      height:120px;
      background-image: url(/static/img/main/select-header.jpg);
      background-size: 100% 100%;
    }
    .logo img{
      width:130px;
      height: auto;
      margin-left:10%;
      margin-right:10px;
      margin-top:14px;
      vertical-align: bottom;
    }
    .logo span{
        font-size: 22px;
        font-weight:bold;
        color:#fff;
    }

    .logo .top .tuichu-btn{
      margin-left:20px;
      margin-top:10px;
      float:right;
      width:24px;
      height:24px;
      line-height: 24px;
      text-align: center;
      background: rgba(255,255,255,0.5);
      border-radius:3px;
      cursor:pointer;
      box-shadow: 0px 0px 1px rgba(0,0,0,0.3);
    }
    .logo .top .tuichu-btn i{
      font-size:14px;
    }
    .tuichu-btn:hover{
      background: rgba(255,255,255,0.1);
    }


    .use-item{
      width:100%;
      height:70%;
      padding:50px 5%;
      list-style:none;
      overflow: auto;
    }
    .use-item>li.moreItem{
      width:20%;
      height:180px;
      float:left;
      background:#fff;
      margin:50px 3%;
      cursor:pointer;
      border-radius:10px;
      -webkit-box-shadow: rgba(86,143,253,0.2) 0px 0px 20px;
      -moz-box-shadow: rgba(86,143,253,0.2) 0px 0px 20px;
      box-shadow: rgba(86,143,253,0.2) 0px 0px 20px;
      padding:0 2%;
      position:relative;
    }
    .use-item>li.litterItem{
      width:20%;
      height:180px;
      float:left;
      background:#fff;
      margin:50px 10%;
      cursor:pointer;
      border-radius:10px;
      -webkit-box-shadow: rgba(86,143,253,0.2) 0px 0px 20px;
      -moz-box-shadow: rgba(86,143,253,0.2) 0px 0px 20px;
      box-shadow: rgba(86,143,253,0.2) 0px 0px 20px;
      padding:0 2%;
      position:relative;
    }
    .use-item>li>img{
      width:auto;
      height:96px;
      margin-top:30px;
    }
    .use-item .use-word{
      float:right;
      height:100%;
      margin-top:35px;
    }
    .use-item .use-word span{
      color:#555;
      font-size:20px;
    }
    .use-item .use-word img{
      display:block;
      height:5px;
      width:auto;
    }
    .use-next{
      position:absolute;
      right:10%;
      bottom:40px;
      width:34px;
      height:34px;
      line-height: 34px;
      text-align:center;
      font-size:18px;
      border-radius:50%;
      background: #fff;
      -webkit-box-shadow: rgba(86,143,253,0.6) 0px 6px 14px;
      -moz-box-shadow: rgba(86,143,253,0.6) 0px 6px 14px;
      box-shadow: rgba(86,143,253,0.6) 0px 6px 14px;
    }
    .use-next i{
      color:#4284f0;
    }
</style>
