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
              <el-select v-model="formData.year" placeholder="请选择">
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
              <el-input v-model="formData.systemName"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="formData.startTime" placeholder="开始日期" :picker-options="startTimeEvent" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="formData.endTime" placeholder="结束日期" :picker-options="endTimeEvent" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
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
              cycleVisible:false,
              formData: {
                startTime:'',
                endTime:'',
                year:'',
                systemName:'',
                cycle:'1'
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
          inspectionData(){
            if(this.$route.query.option){
              this.head_title='考核制度复制'
              this.cycleVisible=true
              this.formData.cycle=this.$route.query.period_name+''
            }else{
              this.head_title='考核制度添加'
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
                  let url=''
                  let obj={}
                  if(_this.head_title=='考核制度添加'){
                    url='/api/v1/assessment/period/add'
                    obj={
                      begin_date:_this.formData.startTime,
                      end_date:_this.formData.endTime,
                      year:_this.formData.year,
                      period_name:_this.formData.cycle,
                      system_name:_this.formData.systemName,
                      state:'0'
                    }
                  }else{
                    url='/api/v1/assessment/period/copy'
                    obj={
                      begin_date:_this.formData.startTime,
                      end_date:_this.formData.endTime,
                      year:_this.formData.year,
                      period_name:_this.formData.cycle,
                      system_name:_this.formData.systemName,
                      state:'0',
                      period_id:_this.$route.query.period_id
                    }
                  }
                  axios.post(url, obj)
                  .then(function (response) {
                    _this.$router.push({ path: 'inspectionConfig'})
                    _this.$message({
                      type: 'success',
                      message: '保存成功!'
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
          this.yearData()
          this.inspectionData()
        },

    }
</script>
<style scoped>

</style>
