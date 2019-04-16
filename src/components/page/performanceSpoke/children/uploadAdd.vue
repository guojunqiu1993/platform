<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i>绩效考核</el-breadcrumb-item>
                <el-breadcrumb-item>文件上传</el-breadcrumb-item>
                <el-breadcrumb-item>上传</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form class="commonForm"   label-width="80px" :model="formData" ref="formData" :rules="formrules">
              <el-form-item label="考核周期" prop="cycle">
                <el-select v-model="formData.cycle" placeholder="请选择">
                    <el-option
                      v-for="item in cycleOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="考核项" prop="inspectionItem">
                <el-select v-model="formData.inspectionItem" placeholder="请选择">
                    <el-option
                      v-for="item in inspectionOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="资料项" prop="informationItem">
                <el-select v-model="formData.informationItem" placeholder="请选择">
                    <el-option
                      v-for="item in informationOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分值" prop="score">
                <el-input v-model="formData.score"></el-input>
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
        name: 'uploadAdd',
        data: function(){
            return {
              formData: {
                cycle:'',
                inspectionItem:'',
                informationItem:'',
                score:'',
              },
              cycleOptions: [{
                'label':'请选择考核周期',
                'value':''
              }],
              inspectionOptions: [{
                'label':'请选择考核项',
                'value':''
              }],
              informationOptions: [{
                'label':'请选择资料项',
                'value':''
              }],
              formrules: {
                  cycle:{ required: true, message: '请输入考核周期', trigger: 'change' },
                  inspectionItem:{ required: true, message: '请输入考核项', trigger: 'change' },
                  informationItem:{ required: true, message: '请输入资料项', trigger: 'change' },
                  score:{ required: true, message: '请输入分值', trigger: 'blur' }
              }
            }
        },
        methods: {
          editCancel(){
            this.$router.push({ path: 'filesUpload', query: {

              }})
          },
          saveCancel(formData){
            let _this=this
            this.$refs[formData].validate((valid) => {
                if (valid) {

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
