<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i>绩效考核</el-breadcrumb-item>
                <el-breadcrumb-item>资料审核</el-breadcrumb-item>
                <el-breadcrumb-item>审核</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form class="commonForm"   label-width="80px" :model="formData" ref="formData" :rules="formrules">
              <el-form-item label="上传单位" prop="unit" >
                <el-input v-model="formData.unit"></el-input>
              </el-form-item>
              <el-form-item label="考核项" prop="inspection_item">
                <el-input v-model="formData.inspection_item"></el-input>
              </el-form-item>
              <el-form-item label="资料项" prop="information_item">
                <el-input v-model="formData.information_item"></el-input>
              </el-form-item>
              <el-form-item label="分值" prop="score">
                <el-input v-model="formData.score"></el-input>
              </el-form-item>
              <el-form-item label="考核周期" prop="cycle">
                <el-input v-model="formData.cycle"></el-input>
              </el-form-item>
              <el-form-item label="审核结果">
                <el-select v-model="formData.state" placeholder="请选择">
                    <el-option
                      v-for="item in stataOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="formData.remark" type="textarea"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="common-btns">
            <el-button type="primary" @click="saveCancel('formData')">保存</el-button>
            <el-button @click="editCancel()">取消</el-button>
          </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'informationAudition',
        data: function(){
            var validateremark = (rule, value, callback) => {
                if (value !== '') {
                  let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                  let mat = value.match(cnReg);
                  let lengths
                  if(mat){
                     lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                  }else{
                    lengths=value.length
                  }
                  if(lengths>0&&lengths<51 ){
                    callback()
                  }else{
                    callback(new Error('请输入50个字符以内的备注'))
                  }
                }else{
                  callback()
                }
            }
            return {
              formData: {
                unit: '办事处',
                inspection_item: '制度文件',
                information_item:'培训记录',
                score: '1/2',
                cycle:'第四季度',
                state:'未审核',
                remark:''
              },
              stataOptions: [{
                label:'未审核',
                value:'未审核'
              },{
                label:'通过',
                value:'通过'
              },{
                label:'不通过',
                value:'不通过'
              }],
              formrules: {
                  unit:{ required: true, message: '请输入上传单位', trigger: 'blur' },
                  inspection_item: { required: true, message: '请输入考核项', trigger: 'blur' },
                  information_item: { required: true, message: '请输入资料项', trigger: 'blur' },
                  score:{ required: true, message: '请输入分值', trigger: 'blur' },
                  cycle:{ required: true, message: '请输入考核周期', trigger: 'blur' },
                  remark:{ required: false, validator: validateremark, trigger: 'blur' }
              }
            }
        },
        methods: {
          editCancel(){
            this.$router.push({ path: 'informationAudition', query: {

              }})
          },
          saveCancel(formData){
            let _this=this
            this.$refs[formData].validate((valid) => {
                if (valid) {
                  // axios.post('/api/v1/org/product/auth/add', {
                  //   id:'',
                  //   product_id:this.formData.product_id,
                  //   product_name:this.formData.productName,
                  //   auth_status:this.formData.auth_status,
                  //   auth_type:this.formData.auth_type,
                  //   code:this.formData.code,
                  //   end_time:(this.formData.user_time)[1],
                  //   org_id:this.formData.org_id,
                  //   start_time:(this.formData.user_time)[0]
                  // })
                  // .then(function (response) {
                  //   _this.$router.push({ path: 'informationAudition', query: {
                  //     }})
                  //   _this.$message({
                  //     type: 'success',
                  //     message: '修改成功!'
                  //   });
                  // })
                  // .catch(function (error) {
                  //   if(error.response.data.errorCode=='7' || error.response.data.errorCode=='8' ){
                  //     window.sessionStorage.removeItem('access_token', '')
                  //     _this.$router.push({ path: 'login'})
                  //   }else{
                  //     _this.$message({
                  //       type: 'error',
                  //       message: error.response.data.errorMessage
                  //     });
                  //   }
                  // });



               }
            })
          },
          //数据渲染
          formSet(){

          }

        },
        created() {
          this.formSet()
        }

    }
</script>
<style scoped>

</style>
