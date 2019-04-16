<template>
    <div class="table" style="postion:relative;">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>系统设置</el-breadcrumb-item>
              <el-breadcrumb-item>考核配置</el-breadcrumb-item>
              <el-breadcrumb-item>考核项</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" v-show="states==0" @click="newGroup('itemGroupData')" class="handle-new mr10" style="right:195px;"><i class="iconfont icon-create-orders"></i><span class="span">新建分组</span></el-button>
          <el-button type="primary" v-show="states==0" @click="newAssess('itemAssessData')" class="handle-del mr10" style="right:100px;"><i class="iconfont icon-create-orders"></i><span class="span">新建考核项</span></el-button>
          <el-button type="primary" class="handle-del mr10" @click="getBack()"><i class="iconfont icon-fanhui1"></i><span class="span">返回</span></el-button>
        </div>
        <div class="container">

          <div class="department-tree">
            <!-- <span style="color:#888;font-size:12px;">(点击一级菜单可以手动修改分组)</span> -->
            <el-tree :data="treeData" node-key="id" default-expand-all :props="defaultProps" :expand-on-click-node="false" @node-click="treeTick" style="margin-bottom:20px;"></el-tree>
          </div>
          <div class="table-div">
            <div class="handle-box" style="margin-bottom:0px;">
                <el-input v-model="inspection_word" placeholder="请输入考核项名称" class="handle-input mr10"></el-input>
                <el-select v-model="inspectionStateValue" placeholder="请选择">
                    <el-option
                      v-for="item in inspectionStateOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" class="handle-search" icon="search" @click="inspectionSearch"><i class="iconfont icon-chazhao"></i></el-button>
            </div>
            <el-table ref="inspectionData" border  :data="inspectionData" style="width: 100%">
              <el-table-column type="index" align="center" width="70" label="序号">
              </el-table-column>
              <el-table-column property="item_group_name" align="center" label="所属分组" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="item_name" align="center" label="考核项名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="highest_score" align="center" label="最高分值" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="lowest_score" align="center" label="最低分值" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="default_score" align="center" label="默认分值" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="center" label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-show="scope.row.state=='1'">启用</span>
                  <span v-show="scope.row.state=='0'">禁用</span>
                </template>
              </el-table-column>
              <el-table-column property="sort" align="center" label="排序" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="small" @click="inspectionEdit(scope.$index, scope.row)" v-show="states!=0">查看</el-button>
                  <el-button size="small" @click="inspectionEdit(scope.$index, scope.row)" v-show="states==0">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                  @size-change="peoplehandleSizeChange"
                  @current-change="peoplehandleCurrentChange"
                  :current-page="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next,jumper"
                  :total="peopleCount">
                </el-pagination>
            </div>
          </div>

        <!-- 考核项设置 新建分组 -->
        <el-dialog v-bind:title="itemGroupWord" :visible.sync="itemGroupVisible" @close="itemCloseDialog('itemGroupData')">
          <el-form class="commonForm" label-width="130px" :rules="itemGroupRules" :model="itemGroupData" ref="itemGroupData" style="width:85%;margin-top:0px;">
            <el-form-item label="分组名称" prop="group_name">
              <el-input v-model="itemGroupData.group_name" :disabled="states==0?false:true"></el-input>
            </el-form-item>
            <el-form-item label="分组排序" prop="sort">
              <el-input-number style="width:220px;" :min="0" :max="999" v-model='itemGroupData.sort' :disabled="states==0?false:true"></el-input-number>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="itemGroupCancel()">取 消</el-button>
            <el-button type="primary" @click="itemGroupConfirm('itemGroupData')" v-show="states==0">确 定</el-button>
          </div>
        </el-dialog>


        <!-- 考核项设置 新建考核项 -->
        <el-dialog v-bind:title="itemAssessWord" :visible.sync="itemAssessVisible" @close="assessCloseDialog('itemAssessData')">
          <el-form class="commonForm" label-width="110px" :rules="itemAssessRules" :model="itemAssessData" ref="itemAssessData" style="width:85%;margin-top:0px;">
            <el-form-item label="考核项名称" prop="assess_name">
              <el-input v-model="itemAssessData.assess_name" :disabled="states==0?false:true"></el-input>
            </el-form-item>
            <el-form-item label="所属分组" prop="group_item">
              <el-select v-model="itemAssessData.group_item" placeholder="请选择" :disabled="states==0?false:true">
                  <el-option
                    v-for="item in groupArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number style="width:220px;" :min="0" :max="999" v-model='itemAssessData.sort' :disabled="states==0?false:true"></el-input-number>
            </el-form-item>
            <el-form-item label="最高分值" prop="highest_score">
              <el-input-number v-model="itemAssessData.highest_score" :precision="1" :step="1" :min="0" style="width:220px;" :disabled="states==0?false:true"></el-input-number>
            </el-form-item>
            <el-form-item label="最低分值" prop="lowest_score">
              <el-input-number v-model="itemAssessData.lowest_score" :precision="1" :step="1" :min="0" style="width:220px;" :disabled="states==0?false:true"></el-input-number>
            </el-form-item>
            <el-form-item label="默认分值" prop="default_score">
              <el-input-number v-model="itemAssessData.default_score" :precision="1" :step="1" :min="0" style="width:220px;" :disabled="states==0?false:true"></el-input-number>
            </el-form-item>
            <el-form-item label="关联规则" prop="rule_type">
              <el-select v-model="itemAssessData.rule_type" placeholder="请选择" @change="ruleOneSel()" style="margin-right:10px;" :disabled="states==0?false:true">
                  <el-option
                    v-for="item in associateArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-select v-model="itemAssessData.process_item_id" placeholder="请选择" v-show="processTwoVisible" :disabled="states==0?false:true">
                  <el-option
                    v-for="item in associateArrTwoOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-select v-model="itemAssessData.state" placeholder="请选择" :disabled="states==0?false:true">
                  <el-option
                    v-for="item in stateArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="itemAssessCancel()">取 消</el-button>
            <el-button type="primary" @click="itemAssessConfirm('itemAssessData')" v-show="states==0">确 定</el-button>
          </div>
        </el-dialog>

    </div>
</div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
    export default {
        name: 'inspectionItem',
        data() {
            var validateAssess = (rule, value, callback) => {
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
                    callback(new Error('请输入20个字符以内的考核项'))
                  }
                }else{
                  callback(new Error('请输入考核项'))
                }
            }
            return {
              states:'',
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              // 考核项设置
              treeData: [],
               defaultProps: {
                 children: 'children',
                 label: 'item_group_name'
               },
              inspectionData:[],
              inspection_word:'',
              inspectionStateValue:'',
              inspectionStateOptions:[
                {'label':'全部','value':''},
                {'label':'启用','value':'1'},
                {'label':'禁用','value':'0'}
              ],
              itemGroupVisible:false,
              itemGroupData:{
                'group_name':'',
                'sort':'0',
                'item_group_id':''
              },
              itemGroupRules:{
                group_name: [
                  { required: true, message: '请输入分组名称', trigger: 'blur' }
                ],
                sort: [
                  { required: false, trigger: 'change' }
                ]
              },
              itemGroupWord:'',
              itemAssessVisible:false,
              itemAssessWord:'',
              processTwoVisible:false,
              itemAssessData:{
                'assess_name':'',
                'group_item':'',
                'sort':0,
                'rule_type':'0',
                'state':'1',
                'highest_score':0,
                'lowest_score':0,
                'default_score':0,
                'process_item_id':'',
                'item_id':'',
                'item_rule_id':''
              },

              itemAssessRules:{
                assess_name: [
                  { required: true, validator:validateAssess, trigger: 'blur' }
                ],
                sort: [
                  { required: false, trigger: 'change' }
                ],
                group_item: [
                  { required: true, message: '请输入所属分组', trigger: 'change' }
                ],
                highest_score: [
                  { required: true, message: '请输入最高分值', trigger: 'change' }
                ],
                lowest_score: [
                  { required: true, message: '请输入最低分值', trigger: 'change' }
                ],
                default_score: [
                  { required: true, message: '请输入默认分值', trigger: 'change' }
                ]
              },
              groupArrOptions:[],
              associateArrTwoOptions:[],
              associateArrOptions:[{
                label:'处置流程',
                value:'0'
              },{
                label:'特定规则',
                value:'2'
              },{
                label:'上传资料',
                value:'6'
              }],

              stateArrOptions:[{
                label:'启用',
                value:1
              },{
                label:'禁用',
                value:0
              }],
            }
        },
        created() {
          this.itemGroupTree()
          this.itemGroupSelect()
          this.assessList()
        },
        mounted(){
          //未生效才能编辑  生效和过期只能查看
          this.states=this.$route.query.state

          $(".department-tree").height(Number($(".content-box").height())-52)
        },
        methods: {

          //考核规则编辑


          //返回按钮
          getBack(){
            this.$router.push({ path: 'inspectionConfig',query:{

              }
            })
          },
          peoplehandleSizeChange(val) {

          },
          peoplehandleCurrentChange(val) {
              this.currentPage = val
              this.assessList()
          },

          //所属分组-树点击事件 编辑分组
          treeTick(data){
            if(data.children){
              this.itemGroupVisible=true
              if(this.states==0){
                this.itemGroupWord='编辑分组'
              }else{
                this.itemGroupWord='查看分组'
              }
              this.itemGroupData.group_name=data.item_group_name
              this.itemGroupData.sort=data.sort
              this.itemGroupData.item_group_id=data.item_group_id
            }
          },
          //返回按钮
          returnPrev(){
            this.$router.push({ path: 'yearDetails',query:{
                year_id:this.$route.query.year_id
              }
            })
          },
          //考核项设置-树图
          itemGroupTree(){
            let _this=this
            axios.get('/api/v1/assessment/item/group/list',{
                params:{
                  period_id:this.$route.query.period_id
                }
              }).then(function (response) {
                _this.treeData=response.data.data
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
          //新建分组-模态框重置
          itemCloseDialog(formData){
            this.itemGroupVisible=false
            this.$refs[formData].clearValidate()
          },
          //新建分组-模态框   取消按钮
          itemGroupCancel(){
            this.itemGroupVisible=false
          },
          //新建分组-模态框   保存钮
          itemGroupConfirm(formName){
            let _this=this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let url=''
                    if(_this.itemGroupWord=='新建分组'){
                      url='/api/v1/assessment/item/group/add'
                    }else{
                      url='/api/v1/assessment/item/group/upd'
                    }
                    axios.post(url, {
                      period_id:_this.$route.query.period_id,
                      item_group_name:_this.itemGroupData.group_name,
                      sort:_this.itemGroupData.sort,
                      item_group_id:_this.itemGroupData.item_group_id
                    })
                    .then(function (response) {
                      _this.$message({
                        type: 'success',
                        message:"保存成功!"
                      });
                      _this.itemGroupVisible=false
                      _this.itemGroupTree()
                      _this.itemGroupSelect()
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
                    })
                }
            })
          },

          //点击 新建分组按钮
          newGroup(formName){
            let _this=this
            this.itemGroupVisible=true
            setTimeout(function(){
              _this.$refs[formName].resetFields()
              _this.itemGroupData.group_name=''
              _this.itemGroupData.sort='0'
              _this.itemGroupData.item_group_id=''
              _this.itemGroupWord='新建分组'
            },100)
          },
          //新建考核项模态框 取消按钮
          itemAssessCancel(){
            this.itemAssessVisible=false
          },
          //新建考核项模态框-分组下拉框
          itemGroupSelect(){
            let _this=this;
            axios.get('/api/v1/assessment/item/add/group/list',{
                params:{
                  period_id:_this.$route.query.period_id
                }
              }).then(function (response) {
                let arr=response.data.data
                let newArr=[{'value':'','label':'所属分组选择'}]
                if(arr.length>0){
                  for(var i=0;i<arr.length;i++){
                    let obj={}
                    obj.value=arr[i].item_group_id
                    obj.label=arr[i].item_group_name
                    newArr.push(obj)
                  }
                }
                _this.groupArrOptions=newArr
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
          //新建考核项-重置
          assessCloseDialog(formData){
            this.itemAssessVisible=false
            this.$refs[formData].clearValidate()
          },
          //新建考核项-关联规则  下拉框勾选事件
          ruleOneSel(oneType,twoId){
            let type=''
            let _this=this
            type=this.itemAssessData.rule_type
            if(type=='0'||type=='2' ||type=='6'){
              this.processTwoVisible=true
              axios.post('/api/v1/assessment/item/rule/two/level', {
                rule_type:type
              })
              .then(function (response) {
                let arr=response.data.data
                let newArr=[]
                if(arr.length>0){
                  for(var i=0;i<arr.length;i++){
                    let obj={}
                    obj.value=arr[i].process_item_id
                    obj.label=arr[i].two_level_name
                    newArr.push(obj)
                  }

                  if(oneType&&oneType!=''){
                    _this.itemAssessData.process_item_id=twoId
                    _this.itemAssessData.rule_type=oneType
                  }else{
                    _this.itemAssessData.process_item_id=newArr[0].value
                  }

                }else{
                  _this.itemAssessData.process_item_id=''
                }
                _this.associateArrTwoOptions=newArr

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
            }else{
              _this.processTwoVisible=false
              if(oneType&&oneType!=''){
                _this.itemAssessData.process_item_id=twoId
                _this.itemAssessData.rule_type=oneType
              }else{
                _this.itemAssessData.process_item_id=''
              }

            }
          },
          //新建考核项模态框 确认按钮
          itemAssessConfirm(formName){
            let _this=this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  let obj={}
                  let url=''
                  if(_this.itemAssessWord=='新建考核项'){
                    url='/api/v1/assessment/item/add'
                    obj={
                      period_id:_this.$route.query.period_id,
                      item_name:_this.itemAssessData.assess_name,
                      item_group_id:_this.itemAssessData.group_item,
                      sort:_this.itemAssessData.sort,
                      state:_this.itemAssessData.state,
                      highest_score:_this.itemAssessData.highest_score,
                      lowest_score:_this.itemAssessData.lowest_score,
                      default_score:_this.itemAssessData.default_score,
                      rule_type:_this.itemAssessData.rule_type,
                      process_item_id:_this.itemAssessData.process_item_id
                    }
                  }else{
                    url='/api/v1/assessment/item/upd'
                    obj={
                      period_id:_this.$route.query.period_id,
                      item_name:_this.itemAssessData.assess_name,
                      item_group_id:_this.itemAssessData.group_item,
                      sort:_this.itemAssessData.sort,
                      state:_this.itemAssessData.state,
                      highest_score:_this.itemAssessData.highest_score,
                      lowest_score:_this.itemAssessData.lowest_score,
                      default_score:_this.itemAssessData.default_score,
                      rule_type:_this.itemAssessData.rule_type,
                      process_item_id:_this.itemAssessData.process_item_id,
                      item_rule_id:_this.itemAssessData.item_rule_id,
                      item_id:_this.itemAssessData.item_id
                    }
                  }

                  axios.post(url,obj)
                  .then(function (response) {
                    _this.$message({
                      type: 'success',
                      message:"保存成功!"
                    });
                    _this.itemAssessVisible=false
                    _this.inspection_word=''
                    _this.inspectionStateValue=''
                    _this.currentPage=1
                    _this.itemGroupTree()
                    _this.assessList()
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

          //点击新建考核项按钮
          newAssess(formName){
            let _this=this
            this.itemAssessVisible=true
            this.itemAssessWord='新建考核项'
            setTimeout(function(){
              _this.$refs[formName].resetFields()
              _this.itemAssessData.assess_name=''
              _this.itemAssessData.group_item=''
              _this.itemAssessData.sort=0
              _this.itemAssessData.rule_type='0'
              _this.itemAssessData.state=1
              _this.itemAssessData.highest_score=0
              _this.itemAssessData.lowest_score=0
              _this.itemAssessData.default_score=0
              _this.itemAssessData.process_item_id=''
              _this.ruleOneSel()
            },50)
          },
          //考核项列表
          assessList(){
            let _this=this
            axios.get('/api/v1/assessment/item/list',{
                params:{
                  period_id:this.$route.query.period_id,
                  item_name:this.inspection_word,
                  state:this.inspectionStateValue,
                  pageNumber:this.currentPage,
                  pageSize:this.pageSize,
                }
              }).then(function (response) {
                 let arr=response.data.data.itemList
                 if(arr.length>0){
                   _this.inspectionData=[]
                   arr.forEach(item => {
                     let tableObj={}
                     tableObj.default_score=item.default_score
                     tableObj.highest_score=item.highest_score
                     tableObj.item_group_id=item.item_group_id
                     tableObj.item_group_name=item.item_group_name
                     tableObj.item_id=item.item_id
                     tableObj.item_name=item.item_name
                     tableObj.lowest_score=item.lowest_score
                     tableObj.sort=item.sort
                     tableObj.state=item.state
                     tableObj.rule_type=item.rule_type
                     tableObj.item_rule_id=item.item_rule_id
                     tableObj.item_id=item.item_id
                     tableObj.process_item_id=item.process_item_id
                     _this.inspectionData.push(tableObj)
                   })
                   _this.peopleCount=response.data.data.total
                 }else{
                   _this.inspectionData=[]
                   _this.peopleCount=0
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
          //考核项配置- 编辑按钮
          inspectionEdit(index,row){
            this.itemAssessVisible=true
            if(this.states==0){
              this.itemAssessWord='编辑考核项'
            }else{
              this.itemAssessWord='查看考核项'
            }
            this.itemAssessData.assess_name=row.item_name
            this.itemAssessData.group_item=row.item_group_id
            this.itemAssessData.sort=row.sort
            this.itemAssessData.rule_type=row.rule_type+''
            this.itemAssessData.state=row.state
            this.itemAssessData.highest_score=row.highest_score
            this.itemAssessData.lowest_score=row.lowest_score
            this.itemAssessData.default_score=row.default_score
            this.itemAssessData.process_item_id=row.process_item_id
            this.ruleOneSel(row.rule_type+'',row.process_item_id)
            this.itemAssessData.item_id=row.item_id
            this.itemAssessData.item_rule_id=row.item_rule_id
          },
          //考核项配置-查询
          inspectionSearch(){
            this.currentPage=1
            this.assessList()
          }



        }
    }
</script>

<style scoped>
.department-tree{
  width:22%;
  margin-right:1.5%;
  height:auto;
  float:left;
  padding-left:1.5%;
  border-right:solid 1px #dedde2;
  overflow:auto;
  padding-top:10px;
}
.table-div{
  width:73%;
  float:left;
  padding-top:10px;
}
</style>
