<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 账号管理</el-breadcrumb-item>
                <el-breadcrumb-item>账号编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-form class="commonForm"  label-width="100px" :model="formData" ref="formData" :rules="formrules">
            <el-form-item label="所属组织" prop="org_name">
              <el-select v-model="formData.org_name" placeholder="请选择" @change="orlChange()">
                  <el-option
                    v-for="item in orlOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色类型" prop="role_name">
              <el-select v-model="formData.role_name" placeholder="请选择" multiple style="width:100%;" @change="roleChange()">
                  <el-option
                    v-for="item in roleTypeOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <span class="form_hint" style="margin:10px 0px 0px 0;">提示:请先选择所属组织再选择角色类型</span>
            </el-form-item>
            <el-form-item label="部门类型" prop="dept_type">
              <el-select v-model="formData.dept_type" placeholder="请选择" @change="deptTypeChange">
                  <el-option
                    v-for="item in depTypeOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <span class="form_hint" style="position:absolute;left:230px;top:0px;">提示:请先选择所属组织再选择部门类型</span>
            </el-form-item>
            <el-form-item label="部门名称" prop="dept_name">
              <el-select v-model="formData.dept_name" placeholder="请选择" >
                  <el-option
                    v-for="item in depNameOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <span class="form_hint" style="position:absolute;left:230px;top:0px;">提示:请先选择所属组织和部门类型再选择部门名称</span>
            </el-form-item>


            <el-form-item label="使用期限" prop="user_time">
              <el-date-picker
                value-format="yyyy-MM-dd hh-mm-ss"
                v-model="formData.user_time"
                type="datetimerange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="formData.username"></el-input>
            </el-form-item>
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="formData.sex" placeholder="请选择" class="handle-select">
                  <el-option
                    v-for="item in genderOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="登录账号" prop="loginName">
              <el-input v-model="formData.loginName"></el-input>
            </el-form-item>
            <el-form-item label="账号状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择" class="handle-select" >
                  <el-option
                    v-for="item in stateOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="formData.phone"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="formData.email"></el-input>
            </el-form-item>
            <el-form-item label="微信号" prop="weixin_number">
              <el-input v-model="formData.weixin_number"></el-input>
            </el-form-item>
            <el-form-item label="openid" prop="openid">
              <el-input v-model="formData.openid"></el-input>
            </el-form-item>
            <el-form-item label="qq号" prop="qq_number">
              <el-input v-model="formData.qq_number"></el-input>
            </el-form-item>
            <!-- <el-form-item label="服务组织" >
              <el-select placeholder="请选择" class="handle-select" >
                  <el-option
                    v-for="item in orlOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item> -->
            <el-input v-model="formData.id" type="hidden"></el-input>

          </el-form>
        </div>
        <div class="common-btns">
          <el-button type="primary" @click="saveCancel('formData')">保存</el-button>
          <el-button @click="editCancel()">取消</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    // import instance1 from '../../../common/axiosv1'
    export default {
        name: 'accountAdd',
        data: function(){
          var validateMobilePhone = (rule, value, callback) => {
            if (value !== '') {
              var reg=/^1[3456789]\d{9}$/;
              if(!reg.test(value)){
                callback(new Error('请输入有效的手机号码'));
              }
            }else{
              callback(new Error('请输入手机号码'));
            }
            callback();
          };
          var validateEmail = (rule, value, callback) => {
              if (value !== '') {
                var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if(!reg.test(value)){
                  callback(new Error('请输入有效的邮箱'));
                }
              }else{
                callback(new Error('请输入邮箱'));
              }
              callback();
          };
          var validateuserName = (rule, value, callback) => {
              if (value !== '') {
                let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                let mat = value.match(cnReg);
                let lengths
                if(mat){
                   lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                }else{
                  lengths=value.length
                }
                if(lengths>0&&lengths<21 ){
                  callback()
                }else{
                  callback(new Error('请输入20个字符以内的用户名称'))
                }
              }else{
                callback(new Error('请输入用户名称'))
              }
          }
          var validateLoginName = (rule, value, callback) => {
              if (value !== '') {
                let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                let mat = value.match(cnReg);
                let lengths
                if(mat){
                   lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                }else{
                  lengths=value.length
                }
                if(lengths>0&&lengths<21 ){
                  callback()
                }else{
                  callback(new Error('请输入20个字符以内的登录账号'))
                }
              }else{
                callback(new Error('请输入登录账号'))
              }
          }
          var validateWeixin = (rule, value, callback) => {
              if (value !== '') {
                let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                let mat = value.match(cnReg);
                let lengths
                if(mat){
                   lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                }else{
                  lengths=value.length
                }
                if(lengths>0&&lengths<31 ){
                  callback()
                }else{
                  callback(new Error('请输入30个字符以内的微信号'))
                }
              }else{
                callback()
              }
          }
          var validateOpenid = (rule, value, callback) => {
              if (value !== '') {
                let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                let mat = value.match(cnReg);
                let lengths
                if(mat){
                   lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                }else{
                  lengths=value.length
                }
                if(lengths>0&&lengths<31 ){
                  callback()
                }else{
                  callback(new Error('请输入30个字符以内的openid'))
                }
              }else{
                callback()
              }
          }
          var validateQQ = (rule, value, callback) => {
              if (value !== '') {
                let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                let mat = value.match(cnReg);
                let lengths
                if(mat){
                   lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                }else{
                  lengths=value.length
                }
                if(lengths>0&&lengths<21 ){
                  callback()
                }else{
                  callback(new Error('请输入20个字符以内的qq'))
                }
              }else{
                callback()
              }
          }
            return {
              formData: {
                org_name:'',
                role_name:'',
                dept_name:'',
                dept_type:'',
                username:'',
                sex:'',
                loginName:'',
                user_time:'',
                status:'',
                phone:'',
                email:'',
                weixin_number:'',
                openid:'',
                qq_number:'',
                id:''
              },
              orlseverOptions:[],
              orlOptions:[],
              depTypeOptions:[],
              depNameOptions:[],
              roleTypeOptions:[],
              genderOptions:[{
                'value':'m',
                'label':'男'
              },{
                'value':'f',
                'label':'女'
              }],
              stateOptions:[{
                'value':'锁定',
                'label':'锁定'
              },{
                'value':'启用',
                'label':'启用'
              }],

              formrules: {
                org_name: [
                  { required: true, message: '请输入所属组织', trigger: 'change' }
                ],
                role_name: [
                  { required: true, message: '请输入角色类型', trigger: 'change' }
                ],
                dept_type: [
                  { required: true, message: '请输入部门类型', trigger: 'change' }
                ],
                dept_name: [
                  { required: true, message: '请输入部门名称', trigger: 'change' }
                ],
                username: [
                  { required: true, validator: validateuserName, trigger: 'blur' }
                ],
                sex: [
                  { required: true, message: '请输入用户性别', trigger: 'change' }
                ],
                loginName: [
                  { required: true, validator: validateLoginName, trigger: 'blur' }
                ],
                user_time: [
                  { required: true, message: '请输入使用期限', trigger: 'blur' }
                ],
                status: [
                  { required: true, message: '请输入账号状态', trigger: 'change' }
                ],
                phone: [
                  {required: true, validator: validateMobilePhone, trigger: 'blur' }
                ],
                email: [
                  {required: true, validator: validateEmail, trigger: 'blur' }
                ],
                weixin_number: [
                  {required: false, validator: validateWeixin, trigger: 'blur' }
                ],
                openid: [
                  {required: false, validator: validateOpenid, trigger: 'blur' }
                ],
                qq_number: [
                  {required: false, validator: validateQQ, trigger: 'blur' }
                ]
              }
            }
        },
        methods: {
          editCancel(){
            this.$router.push({ path: 'accountManagement'})
          },
          //保存
          saveCancel(formName){
            let _this=this
            let state=''
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  if(_this.formData.status=='启用'){
                      state=1
                  }else if(_this.formData.status=='锁定'){
                      state=0
                  }

                  let time=_this.formData.user_time
                  let roleStrs=''
                  let roleArr=[]
                  roleArr=_this.formData.role_name
                  for(var i=0;i<roleArr.length;i++){
                    roleStrs+=roleArr[i]+','
                  }
                  axios.post('/api/v1/account/upd', {
                    'dept_name':_this.formData.dept_name,
                    'dept_type':_this.formData.dept_type,
                    'email':_this.formData.email,
                    'end_time':(_this.formData.user_time)[1],
                    'loginName':_this.formData.loginName,
                    'openid':_this.formData.openid,
                    'org_name':_this.formData.org_name,
                    'phone':_this.formData.phone,
                    'qq_number':_this.formData.qq_number,
                    'role_names':roleStrs.substr(0,roleStrs.length-1),
                    'sex':_this.formData.sex,
                    'start_time':(_this.formData.user_time)[0],
                    'status':state,
                    'username':_this.formData.username,
                    'weixin_number':_this.formData.weixin_number,
                    'id':_this.formData.id
                  })
                  .then(function (response) {
                    _this.$router.push({ path: 'accountManagement'})
                    _this.$message({
                      type: 'success',
                      message: '编辑成功!'
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
                }
            })
          },
          //所选组织
          orlData(){
            let _this=this
            axios.get('/api/v1/account/org/list',{
                params:{

                }
              }).then(function (response) {
                 let arr=response.data.data
                 let newArr=[]
                 if(arr.length>0){
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].customer_name+','+arr[i].orgid
                     obj.label=arr[i].customer_name
                     newArr.push(obj)
                   }
                 }
                 _this.orlOptions=newArr
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
          //组织下拉框选择-事件
          orlChange(){
            let _this=this
            _this.depTypeOptions=[]
            _this.depNameOptions=[]
            _this.roleTypeOptions=[]
            _this.formData.role_name=[]
            _this.formData.dept_name=''
            _this.formData.dept_type=''
            let orlNames=this.formData.org_name
            let name=''
            let orgid=''
            name=orlNames.split(",")[0]
            orgid=orlNames.split(",")[1]
            this.formData.org_name=name
            //部门类型
            axios.get('/api/v1/account/dept/type/list',{
                params:{
                  'customer_name':name
                }
              }).then(function (response) {
                 let arr=response.data.data
                 //console.log(arr)
                 let newArr=[]
                 if(arr.length>0){
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].type
                     obj.label=arr[i].type
                     newArr.push(obj)
                   }
                 }
                 _this.depTypeOptions=newArr
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

              //部门名称
              // axios.get('/api/v1/account/dept/name/list',{
              //     params:{
              //       'customer_name':name
              //     }
              //   }).then(function (response) {
              //      let arr=response.data.data
              //      //console.log(arr)
              //      let newArr=[]
              //      if(arr.length>0){
              //        for(var i=0;i<arr.length;i++){
              //          let obj={}
              //          obj.value=arr[i].name
              //          obj.label=arr[i].name
              //          newArr.push(obj)
              //        }
              //      }
              //      _this.depNameOptions=newArr
              //   }).catch(function (error) {
              //     if(error.response.data.errorCode=='7' || error.response.data.errorCode=='8' ){
              //       window.sessionStorage.removeItem('access_token', '')
              //       _this.$router.push({ path: 'login'})
              //     }else{
              //       _this.$message({
              //         type: 'error',
              //         message: error.response.data.errorMessage
              //       });
              //     }
              //   })


                axios.get('/api/v1/account/role/list',{
                    params:{
                      'orgid':orgid
                    }
                  }).then(function (response) {
                     let arr=response.data.data
                     //console.log(arr)
                     let newArr=[]
                     if(arr.length>0){
                       for(var i=0;i<arr.length;i++){
                         let obj={}
                         obj.value=arr[i].rolename
                         obj.label=arr[i].rolename
                         newArr.push(obj)
                       }
                     }
                     _this.roleTypeOptions=newArr
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
          deptTypeChange(){
            this.formData.dept_name=''
            let _this=this
            //部门名称
            axios.get('/api/v1/account/dept/name/list',{
                params:{
                  'customer_name':this.formData.org_name,
                  'type':this.formData.dept_type
                }
              }).then(function (response) {
                 let arr=response.data.data
                 console.log(arr)
                 let newArr=[]
                 if(arr.length>0){
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].name
                     obj.label=arr[i].name
                     newArr.push(obj)
                   }
                 }
                 _this.depNameOptions=newArr

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
          roleChange(){
            let roleArr=[]
            let curStr=''
            roleArr=this.formData.role_name
            if(roleArr.length>1){
              curStr=roleArr[roleArr.length-1]
              let roleOtherArr=[]

              for(var i=0;i<roleArr.length;i++){
                if(i!=roleArr.length-1){
                  roleOtherArr.push(roleArr[i])
                }
              }
              let otherStr=''
              for(var i=0;i<roleOtherArr.length;i++){
                otherStr+=roleOtherArr[i]+','
              }
              this.productSelect(otherStr.substr(0,otherStr.length-1),curStr)
            }
          },
          //判断 角色类型是否 是在同一个产品下面 如果是 不添加成功； 如不是 则添加
          productSelect(otherRole,curRole){
            let otherArr=[]
            otherArr=otherRole.split(",")
            let _this=this
            axios.get('/api/v1/account/role/submit',{
                params:{
                  'rolenames':otherRole,
                  'rolename':curRole
                }
              }).then(function (response) {
                 let state=response.data.data
                 console.log(state)
                 if(state==1){
                   // true:代表存在同一个产品多个角色
                   // flase:代表同一个产品不存在多个角色
                   _this.$message.error('该角色类型与已选中的角色类型来自于同一个产品,不能被选中');
                   _this.formData.role_name=otherArr
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


          //数据喧嚷
          accountData(){

            this.formData.dept_name=this.$route.query.name
            this.formData.dept_type=this.$route.query.type
            this.formData.email=this.$route.query.email
            this.formData.loginName=this.$route.query.loginName
            this.formData.openid=this.$route.query.openid
            this.formData.org_name=this.$route.query.customer_name
            this.formData.orgid= this.$route.query.orgid
            this.formData.phone=this.$route.query.phone
            this.formData.qq_number=this.$route.query.qq_number
            this.formData.role_name=(this.$route.query.rolename).split(",")
            this.formData.sex=this.$route.query.sex
            this.formData.status=this.$route.query.status
            this.formData.username=this.$route.query.username
            this.formData.weixin_number=this.$route.query.weixin_number
            this.formData.id=this.$route.query.id
            this.formData.user_time=[this.$route.query.start_time,this.$route.query.end_time]

            let _this=this
            let orlNames=this.formData.org_name
            let name=''
            let orgid=''
            name=orlNames.split(",")[0]
            orgid=orlNames.split(",")[1]
            this.formData.org_name=name
            //部门类型
            axios.get('/api/v1/account/dept/type/list',{
                params:{
                  'customer_name':name
                }
              }).then(function (response) {
                 let arr=response.data.data
                 //console.log(arr)
                 let newArr=[]
                 if(arr.length>0){
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].type
                     if(arr[i].type=='2'){
                       obj.label='发言人部门'
                     }else if(arr[i].type=='1'){
                       obj.label='管理员部门'
                     }
                     newArr.push(obj)
                   }
                 }
                 _this.depTypeOptions=newArr
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

              //部门名称
              axios.get('/api/v1/account/dept/name/list',{
                  params:{
                    'customer_name':name,
                    'type':this.formData.dept_type
                  }
                }).then(function (response) {
                   let arr=response.data.data
                   //console.log(arr)
                   let newArr=[]
                   if(arr.length>0){
                     for(var i=0;i<arr.length;i++){
                       let obj={}
                       obj.value=arr[i].name
                       obj.label=arr[i].name
                       newArr.push(obj)
                     }
                   }
                   _this.depNameOptions=newArr
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


                axios.get('/api/v1/account/role/list',{
                    params:{
                      'orgid':orgid
                    }
                  }).then(function (response) {
                     let arr=response.data.data
                     //console.log(arr)
                     let newArr=[]
                     if(arr.length>0){
                       for(var i=0;i<arr.length;i++){
                         let obj={}
                         obj.value=arr[i].rolename
                         obj.label=arr[i].rolename
                         newArr.push(obj)
                       }
                     }
                     _this.roleTypeOptions=newArr
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
        created() {
          this.accountData()
          this.orlData()
        }

    }
</script>
<style scoped>

</style>
