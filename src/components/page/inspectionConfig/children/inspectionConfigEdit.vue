<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>考核配置</el-breadcrumb-item>
                <el-breadcrumb-item>{{head_title}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-form class="commonForm"  label-width="80px" :model="formData" ref="formData" :rules="formrules">
            <el-form-item label="考核年" prop="year">
              <el-select v-model="formData.year" placeholder="请选择" disabled>
                  <el-option
                    v-for="item in yearOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="考核周期" prop="cycle">
              <el-select v-model="formData.cycle" placeholder="请选择" class="handle-select" :disabled="cycleVisible">
                  <el-option
                    v-for="item in cycleOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="制度名称" prop="systemName">
              <el-input v-model="formData.systemName" :disabled="systemVislble"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker :disabled="startVislble" v-model="formData.startTime" placeholder="开始日期" :picker-options="startTimeEvent" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker :disabled="endVislble" v-model="formData.endTime" placeholder="结束日期" :picker-options="endTimeEvent" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="common-btns">
            <el-button v-show="confirmButtonVisible" type="primary" @click="saveCancel('formData')">保存</el-button>
            <el-button @click="editCancel()">取消</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'inspectionConfigAdd',
        data: function(){
            var validateSystemName = (rule, value, callback) => {
                if (value !== '') {
                  let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                  let mat = value.match(cnReg);
                  let lengths
                  if(mat){
                     lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                  }else{
                    lengths=value.length
                  }
                  if(lengths>5&&lengths<21 ){
                    callback()
                  }else{
                    callback(new Error('请输入6-20个字符以内的制度名称'))
                  }
                }else{
                  callback(new Error('请输入制度名称'))
                }
            }
            return {
              startTimeEvent: {
                disabledDate: time => {
                  let endDateVal = this.formData.endTime;
                  if (endDateVal) {
                    return time.getTime() > new Date(endDateVal).getTime();
                  }
                }
              },
              endTimeEvent: {
                disabledDate: time => {
                  let beginDateVal = this.formData.startTime;
                  if (beginDateVal) {
                    return (
                      time.getTime() <
                      new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
                    );
                  }
                }
              },
              head_title:'',
              confirmButtonVisible:true,
              cycleVisible:false,
              startVislble:false,
              endVislble:false,
              systemVislble:false,
              formData: {
                startTime:'',
                endTime:'',
                year:'',
                systemName:'',
                cycle:'',
                period_id:''
              },
              yearOptions:[],
              cycleOptions:[{
                'value':'1',
                'label':'年度考核'
              },{
                'value':'2',
                'label':'半年考核'
              },{
                'value':'3',
                'label':'季度考核'
              },{
                'value':'4',
                'label':'月度考核'
              }],
              formrules: {
                startTime: [
                  { required: true, message: '请输入开始时间', trigger: 'blur' }
                ],
                endTime: [
                  { required: true, message: '请输入结束时间', trigger: 'blur' }
                ],
                systemName: [
                  { required: true,validator:validateSystemName, trigger: 'blur' }
                ]
              }
            }
        },
        methods: {
          //年份下拉框
          yearData(){
            let date = new Date()
            let year = date.getFullYear()
            this.yearOptions=[{
              'label':Number(year)-1,
              'value':Number(year)-1
            },{
              'label':year,
              'value':year
            },{
              'label':Number(year)+1,
              'value':Number(year)+1
            }]
            this.formData.year=(this.yearOptions)[1].value
          },
          // 数据加载
          inspectionData(){
            this.formData.systemName=this.$route.query.system_name
            this.formData.cycle=this.$route.query.period_name+''
            this.formData.startTime=this.$route.query.begin_date
            this.formData.endTime=this.$route.query.end_date
            this.formData.period_id=this.$route.query.period_id
            this.formData.year=this.$route.query.year
            if(this.$route.query.state=='2'){
              this.confirmButtonVisible=false
              this.cycleVisible=true
              this.startVislble=true
              this.endVislble=true
              this.systemVislble=true
              this.head_title='考核制度查看'
            }if(this.$route.query.state=='1'){
              this.cycleVisible=true
              this.startVislble=true
              this.confirmButtonVisible=true
              this.head_title='考核制度编辑'
            }

          },
          //取消
          editCancel(){
            this.$router.push({ path: 'inspectionConfig'})
          },
          //保存
          saveCancel(formName){
            let _this=this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  axios.post('/api/v1/assessment/period/upd', {
                    begin_date:_this.formData.startTime,
                    end_date:_this.formData.endTime,
                    year:_this.formData.year,
                    period_name:_this.formData.cycle,
                    system_name:_this.formData.systemName,
                    period_id:_this.formData.period_id
                  })
                  .then(function (response) {
                    _this.$router.push({ path: 'inspectionConfig'})
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
          }
        },
        created() {
          this.inspectionData()
          this.yearData()
        },

    }
</script>
<style scoped>

</style>
