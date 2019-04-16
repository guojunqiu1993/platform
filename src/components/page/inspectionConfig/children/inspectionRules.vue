<template>
    <div class="table" style="postion:relative;">
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i>系统设置</el-breadcrumb-item>
              <el-breadcrumb-item>考核配置</el-breadcrumb-item>
              <el-breadcrumb-item>考核规则</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" v-show="ruleTabBoolean3 && states==0" @click="newMeans('meansData')" class="handle-del mr10" style="right:100px;"><i class="iconfont icon-create-orders"></i><span class="span">新建资料项</span></el-button>
          <el-button type="primary" v-show="ruleTabBoolean1 && states==0" @click="newRules('rulesData')" class="handle-del mr10" style="right:100px;"><i class="iconfont icon-create-orders"></i><span class="span">新建规则</span></el-button>
          <el-button type="primary" class="handle-del mr10" @click="getBack()"><i class="iconfont icon-fanhui1"></i><span class="span">返回</span></el-button>
        </div>
        <div class="container">
          <div class="tab-change">
              <span @click="flowShow()" :class="ruleTabBoolean1 ? 'active' : '' " style="cursor:pointer;">处置流程</span>
              <span @click="fixationShow()" :class="ruleTabBoolean2 ? 'active' : '' " style="cursor:pointer;">特定规则</span>
              <span @click="uploadingShow()" :class="ruleTabBoolean3 ? 'active' : '' " style="cursor:pointer;">上传文件</span>
          </div>

          <div class="handle-box" v-show='ruleTabBoolean1'>
              <el-select v-model="ruleStateValue" placeholder="请选择">
                  <el-option
                    v-for="item in ruleStateOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-select v-model="disposeStateValue" placeholder="请选择">
                  <el-option
                    v-for="item in disposeStateOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-input v-model="rule_word" placeholder="请输入规则名称" class="handle-input mr10"></el-input>
              <el-button type="primary" class="handle-search" icon="search" @click="disposeSearch"><i class="iconfont icon-chazhao"></i></el-button>
          </div>


          <div class="handle-box" v-show='ruleTabBoolean3'>
              <el-input v-model="means_word" placeholder="请输入资料项名称" class="handle-input mr10"></el-input>
              <el-button type="primary" class="handle-search" icon="search" @click="meansSearch"><i class="iconfont icon-chazhao"></i></el-button>
          </div>

          <div class="table-content">
            <el-table ref="disposeData" border v-show='ruleTabBoolean1'  :data="disposeData" style="width: 100%">
              <el-table-column type="index" align="center" width="70" label="序号">
              </el-table-column>
              <el-table-column property="process_item_name" align="center" label="规则名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="center" label="规则类型" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-show="scope.row.process_item_type=='1'">可选处置项</span>
                  <span v-show="scope.row.process_item_type=='0'">处置流程</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="关联处置流程" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-show="scope.row.process_item_type=='0'&&scope.row.deal_process=='1'">响应</span>
                  <span v-show="scope.row.process_item_type=='0'&&scope.row.deal_process=='2'">预案</span>
                  <span v-show="scope.row.process_item_type=='0'&&scope.row.deal_process=='3'">调查</span>
                  <span v-show="scope.row.process_item_type=='0'&&scope.row.deal_process=='4'">措施</span>
                  <span v-show="scope.row.process_item_type=='0'&&scope.row.deal_process=='5'">办结</span>
                  <span v-show="scope.row.process_item_type=='1'">无</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-show="scope.row.state=='1'">启用</span>
                  <span v-show="scope.row.state=='0'">禁用</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="small" @click="disposeEdit(scope.$index, scope.row)" v-show="states!=0">查看</el-button>
                  <el-button size="small" @click="disposeEdit(scope.$index, scope.row)" v-show="states==0">编辑</el-button>
                  <el-button size="small" @click="disposeDelete(scope.$index, scope.row)" v-show="states==0">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;" v-show='ruleTabBoolean1'>
                <el-pagination
                  @size-change="disposehandleSizeChange"
                  @current-change="disposehandleCurrentChange"
                  :current-page="disposeCurrentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next,jumper"
                  :total="disposeCount">
                </el-pagination>
            </div>


            <div v-show='ruleTabBoolean2'>
              <p style="margin:20px 0 10px 0;">舆情数量加分<el-button type="primary" v-show="ruleTabBoolean2" @click="newPublicNum('publicNumForm')" class="mr10" style="float:right;"><i class="iconfont icon-create-orders"></i><span class="span">新建舆情数量</span></el-button></p>
              <el-table ref="publicNumData" border :data="publicNumData" style="width: 100%">
                <el-table-column type="index" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column property="lowest_number" align="center" label="最低数量" show-overflow-tooltip width="240">
                </el-table-column>
                <el-table-column property="highest_number" align="center" label="最高数量" show-overflow-tooltip width="240">
                </el-table-column>
                <el-table-column property="score" align="center" label="分值" show-overflow-tooltip width="240">
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button size="small" @click="publicNumEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" @click="publicNumDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <p style="margin:20px 0 10px 0;">舆情上报加分<el-button type="primary" v-show="ruleTabBoolean2&&reportButton_visible" @click="newPublicReport('publicReportForm')" class="mr10" style="float:right;"><i class="iconfont icon-create-orders"></i><span class="span">新建舆情上报</span></el-button></p>
              <el-table ref="publicReportData" border :data="publicReportData" style="width: 100%">
                <el-table-column type="index" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column align="center" label="加分场景" show-overflow-tooltip width="360">
                  <template slot-scope="scope">
                    <span v-show="scope.row.bonus_condition_type==0">上报舆情</span>
                    <span v-show="scope.row.bonus_condition_type==1">转为舆情</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="加分分值" show-overflow-tooltip width="360">
                  <template slot-scope="scope">
                    <span>{{scope.row.score}}分/次</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button size="small" @click="publicReportEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" @click="publicReportDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <p style="margin:20px 0 10px 0;">次生舆情扣分<el-button type="primary" v-show="ruleTabBoolean2&&secondaryButton_visible" @click="newSecondary('secondaryForm')" class="mr10" style="float:right;"><i class="iconfont icon-create-orders"></i><span class="span">新建次生舆情</span></el-button></p>
              <el-table ref="publicSecondaryData" border :data="publicSecondaryData" style="width: 100%">
                <el-table-column type="index" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column property="score_type" align="center" label="扣分单位" show-overflow-tooltip width="360">
                  <template slot-scope="scope">
                    <span v-show="scope.row.score_type==1">按事件</span>
                    <span v-show="scope.row.score_type==2">按次数</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="扣分分值" show-overflow-tooltip width="360">
                  <template slot-scope="scope">
                    <span>{{scope.row.score}}分</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button size="small" @click="publicSecondaryEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" @click="secondaryDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <p style="margin:20px 0 10px 0;">签到规则设定<el-button type="primary" v-show="ruleTabBoolean2" @click="newsignRule('signRuleForm')" class=" mr10" style="float:right;"><i class="iconfont icon-create-orders"></i><span class="span">新建签到规则</span></el-button></p>
              <el-table ref="signRuleData" border :data="signRuleData" style="width: 100%">
                <el-table-column type="index" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column align="center" label="部门类型" show-overflow-tooltip width="180">
                  <template slot-scope="scope">
                    <span v-show="scope.row.dept_type==1">管理员部门</span>
                    <span v-show="scope.row.dept_type==2">发言人部门</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="签到次数" show-overflow-tooltip width="180">
                  <template slot-scope="scope">
                    <span>{{scope.row.sign_time}}次</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="签到周期" show-overflow-tooltip width="180">
                  <template slot-scope="scope">
                    <span v-show="scope.row.sign_period==1">周</span>
                    <span v-show="scope.row.sign_period==2">月</span>
                  </template>
                </el-table-column>
                <el-table-column property="score" align="center" label="扣分分值" show-overflow-tooltip width="180">
                  <template slot-scope="scope">
                    <span v-show="scope.row.score_type==1">{{scope.row.score}}分/次</span>
                    <span v-show="scope.row.score_type==2">{{scope.row.score}}分/周</span>
                    <span v-show="scope.row.score_type==3">{{scope.row.score}}分/月</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button size="small" @click="signRuleEdit(scope.$index, scope.row)" >编辑</el-button>
                    <el-button size="small" @click="signRuleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <el-table ref="filesData" border v-show='ruleTabBoolean3'  :data="filesData" style="width: 100%">
              <el-table-column type="index" align="center" width="70" label="序号">
              </el-table-column>
              <el-table-column property="data_name" align="center" label="资料项名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="center" label="计分类型" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-show="scope.row.score_type=='1'">加分</span>
                  <span v-show="scope.row.score_type=='2'">扣分</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="审核类型" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-show="scope.row.check_type=='1'">自动审核</span>
                  <span v-show="scope.row.check_type=='2'">手动审核</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="重复上传" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-show="scope.row.can_repeat_upload=='1'">支持</span>
                  <span v-show="scope.row.can_repeat_upload=='0'">不支持</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="small" @click="meansEdit(scope.$index, scope.row)" v-show="states!=0">查看</el-button>
                  <el-button size="small" @click="meansEdit(scope.$index, scope.row)" v-show="states==0">编辑</el-button>
                  <el-button size="small" @click="meansDelete(scope.$index, scope.row)" v-show="states==0">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;" v-show='ruleTabBoolean3'>
                <el-pagination
                  @size-change="fileshandleSizeChange"
                  @current-change="fileshandleCurrentChange"
                  :current-page="filesCurrentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next,jumper"
                  :total="filesCount">
                </el-pagination>
            </div>

          </div>
        </div>

        <!-- 处置流程-新建规则 -->
        <el-dialog v-bind:title="ruleDialog_word" :visible.sync="ruleVisible" @close="ruleCloseDialog('rulesData')">
          <el-form class="commonForm" label-width="130px" :rules="ruleFormRules" :model="rulesData" ref="rulesData" style="width:95%;margin-top:0px;">
            <el-form-item label="规则名称" prop="process_item_name">
              <el-input v-model="rulesData.process_item_name" :disabled="states==0?false:true"></el-input>
            </el-form-item>
            <el-form-item label="规则类型" prop="process_item_type">
              <el-select v-model="rulesData.process_item_type" placeholder="请选择" @change="ruleTypeSel()" :disabled="states==0?false:true">
                  <el-option
                    v-for="item in ruleTypeArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="处置流程" prop="deal_process" v-show="flowItemVisible">
              <el-select v-model="rulesData.deal_process" placeholder="请选择" :disabled="states==0?false:true">
                  <el-option
                    v-for="item in flowItemArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="默认选中" prop="choose" v-show="chooseVisible">
              <el-radio v-model="rulesData.choose" label="1" :disabled="states==0?false:true">是</el-radio>
              <el-radio v-model="rulesData.choose" label="0" :disabled="states==0?false:true">否</el-radio>
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-select v-model="rulesData.state" placeholder="请选择" :disabled="states==0?false:true">
                  <el-option
                    v-for="item in regularStateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="触发时间" prop="trigger_type">
              <el-select v-model="rulesData.trigger_type" placeholder="请选择" :disabled="states==0?false:true">
                  <el-option
                    v-for="item in triggerArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规则编辑">
              <el-table :data="ruleEditData" style="width: 100%" align="center">
              <el-table-column label="舆情性质" width="80">
                <template slot-scope="scope">
                  <span v-show="scope.row.pubopn_nature==6">一般舆情</span>
                  <span v-show="scope.row.pubopn_nature==7">较大舆情</span>
                  <span v-show="scope.row.pubopn_nature==8">重大舆情</span>
                </template>
              </el-table-column>
              <el-table-column label="时间要求" align="center">
                <el-table-column label="时间类型" width="120" align="center">
                  <template slot-scope="scope">
                      <el-select v-model="scope.row.time_type" placeholder="请选择" :disabled="states==0?false:true">
                          <el-option
                            v-for="item in timeTypeArrOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="时限要求" align="center">
                  <template slot-scope="scope">
                      <el-input :disabled="states==0?false:true" v-if="scope.row.time_type!=4" v-model="scope.row.time_limit_number" style="width:40%;" onkeyup="if(value.length>4)value=value.slice(0,4);if(value==0)value='';value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
                      <el-input v-else-if="scope.row.time_type==4" style="width:40%;" :disabled="true"></el-input>
                      <el-select :disabled="(scope.row.time_type==4||states!=0)?true:false"  v-model="scope.row.time_limit_type" placeholder="请选择" style="width:46%;margin-left:3%;" >
                          <el-option
                            v-for="item in limitTypeArrOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="未达标扣分" align="center" width="110px">
                <template slot-scope="scope">
                    <el-input :disabled="states==0?false:true" v-model="scope.row.score" style="width:70px;" onkeyup="if(value.length>4)value=value.slice(0,4);if(value==0)value='';value= value.match(/\d+(\.\d{0,1})?/) ? value.match(/\d+(\.\d{0,1})?/)[0]  : ''"></el-input>
                    <span>分</span>
                </template>
              </el-table-column>
            </el-table>
            </el-form-item>
            <el-form-item label="考核提示" prop="deal_tip">
              <el-input v-model="rulesData.deal_tip" type="textarea" :disabled="states==0?false:true"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="ruleCancel()">取 消</el-button>
            <el-button type="primary" @click="ruleConfirm('rulesData')" v-show="states==0">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 上传文件-新建资料项 -->
        <el-dialog v-bind:title="meanDialog_word" :visible.sync="meanVisible" @close="meanCloseDialog('meansData')">
          <el-form class="commonForm" label-width="130px" :rules="meanFormRules" :model="meansData" ref="meansData" style="width:95%;margin-top:0px;">
            <el-form-item label="资料项名称" prop="mean_name">
              <el-input v-model="meansData.mean_name" :disabled="states==0?false:true"></el-input>
            </el-form-item>
            <el-form-item label="审核类型" prop="audit_type">
              <el-select v-model="meansData.audit_type" placeholder="请选择" :disabled="states==0?false:true">
                  <el-option
                    v-for="item in auditTypeArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计分类型" prop="score_type">
              <el-select v-model="meansData.score_type" placeholder="请选择" :disabled="states==0?false:true">
                  <el-option
                    v-for="item in scoreTypeArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="重复上传" prop="upload_repeat">
              <el-select v-model="meansData.upload_repeat" placeholder="请选择" :disabled="states==0?false:true">
                  <el-option
                    v-for="item in uploadRepeatArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规则编辑">
              <el-table :data="uploadEditData" style="width: 100%" align="center">
                <el-table-column label="部门类型" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-show="scope.row.dept_type==1">管理员部门</span>
                    <span v-show="scope.row.dept_type==2">发言人部门</span>
                  </template>
                </el-table-column>
                <el-table-column label="计分规则" align="center">
                  <el-table-column label="单次分值" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-input :disabled="states==0?false:true" v-model="scope.row.single_score" style="width:60px;" onkeyup="if(value.length>4)value=value.slice(0,4);if(value==0)value='';value= value.match(/\d+(\.\d{0,1})?/) ? value.match(/\d+(\.\d{0,1})?/)[0]  : ''"></el-input>
                        <span>分</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="计分上限" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-input :disabled="states==0?false:true" v-model="scope.row.score_up_limit" style="width:60px;" onkeyup="if(value.length>4)value=value.slice(0,4);if(value==0)value='';value= value.match(/\d+(\.\d{0,1})?/) ? value.match(/\d+(\.\d{0,1})?/)[0]  : ''"></el-input>
                        <span>分</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="计分周期" align="center">
                      <template slot-scope="scope">
                          <el-select v-model="scope.row.score_cycle_type" placeholder="请选择" :disabled="states==0?false:true">
                              <el-option
                                v-for="item in scoreCircleArrOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                          </el-select>
                      </template>
                  </el-table-column>
                  <el-table-column label="计分延期" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-input :disabled="states==0?false:true" v-model="scope.row.score_delay" style="width:60px;" onkeyup="if(value.length>3)value=value.slice(0,3);value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
                        <span>日</span>
                    </template>
                  </el-table-column>
                </el-table-column>
            </el-table>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="meanCancel()">取 消</el-button>
            <el-button type="primary" @click="meanConfirm('meansData')" v-show="states==0">确 定</el-button>
          </div>
        </el-dialog>


        <!-- 固定规则-舆情数量 -->
        <el-dialog v-bind:title="numDialog_word" :visible.sync="numVisible" @close="numCloseDialog('publicNumForm')">
          <el-form class="commonForm" label-width="130px" :rules="numFormRules" :model="publicNumForm" ref="publicNumForm" style="width:85%;margin-top:0px;">
            <el-form-item label="最低数量" prop="lowest_number">
              <el-input v-model='publicNumForm.lowest_number' style="width:50%;"  onkeyup="value=value.replace(/^0(0+)|[^\d]+/g,'')"></el-input>
              <!-- <span class="form_hint">提示:0和正整数,1到3个字符</span> -->
            </el-form-item>
            <el-form-item label="最高数量" prop="highest_number">
              <el-input v-model='publicNumForm.highest_number' style="width:50%;"  onkeyup="value=value.replace(/^0(0+)|[^\d]+/g,'')"></el-input>
              <!-- <span class="form_hint">提示:0和正整数,1到3个字符</span> -->
            </el-form-item>
            <el-form-item label="分值" prop="score">
              <el-input v-model='publicNumForm.score' style="width:50%;" onkeyup="if(value==0)value='';value= value.match(/\d+(\.\d{0,1})?/) ? value.match(/\d+(\.\d{0,1})?/)[0] : ''"></el-input>
              <!-- <span class="form_hint">提示:正数含一位小数,1到4个字符</span> -->
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="numCancel()">取 消</el-button>
            <el-button type="primary" @click="numConfirm('publicNumForm')">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 固定规则-舆情上报加分 -->
        <el-dialog v-bind:title="reportDialog_word" :visible.sync="reportVisible" @close="reportCloseDialog('publicReportForm')">
          <el-form class="commonForm"  :rules="reportFormrules" label-width="80px" :model="publicReportForm" ref="publicReportForm" style="width:85%;margin-top:0px;">
            <el-form-item label="加分分值" prop="score">
              <el-input v-model="publicReportForm.score" style="width:40%;" onkeyup="if(value==0)value='';value= value.match(/\d+(\.\d{0,1})?/) ? value.match(/\d+(\.\d{0,1})?/)[0] : ''"></el-input>
              <span>分/条</span>
              <!-- <span class="form_hint">&nbsp;提示:正数含一位小数,1到4个字符</span> -->
            </el-form-item>
            <el-form-item label="加分场景" prop="condition">
              <el-radio v-model="publicReportForm.condition" label="0">上报加分</el-radio>
              <el-radio v-model="publicReportForm.condition" label="1">转为舆情</el-radio>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="reportCancel()">取 消</el-button>
            <el-button type="primary" @click="reportConfirm('publicReportForm')">确 定</el-button>
          </div>
        </el-dialog>


        <!-- 固定规则-次生舆情 -->
        <el-dialog v-bind:title="secondaryDialog_word" :visible.sync="secondaryVisible" @close="secondaryCloseDialog('secondaryForm')">
          <el-form class="commonForm"  :rules="secondaryFormrules" label-width="80px" :model="secondaryForm" ref="secondaryForm" style="width:85%;margin-top:0px;">
            <el-form-item label="扣分单位" prop="unit">
              <el-select v-model="secondaryForm.unit" placeholder="请选择">
                  <el-option
                    v-for="item in secondaryUnitArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="扣分分值" prop="score">
              <el-input v-model="secondaryForm.score" style="width:40%;" onkeyup="if(value==0)value='';value= value.match(/\d+(\.\d{0,1})?/) ? value.match(/\d+(\.\d{0,1})?/)[0] : ''"></el-input>
              <span>分</span>
              <!-- <span class="form_hint">&nbsp;提示:正数含一位小数,1到4个字符</span> -->
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="secondaryCancel()">取 消</el-button>
            <el-button type="primary" @click="secondaryConfirm('secondaryForm')">确 定</el-button>
          </div>
        </el-dialog>


        <!-- 固定规则-签到规则 -->
        <el-dialog v-bind:title="signDialog_word" :visible.sync="signVisible" @close="signCloseDialog('signForm')">
          <el-form class="commonForm"  :rules="signFormrules" label-width="80px" :model="signForm" ref="signForm" style="width:85%;margin-top:0px;">
            <el-form-item label="签到次数" prop="num">
              <el-input v-model="signForm.num" style="width:200px;" onkeyup="if(value==0)value='';value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
              <!-- <span class="form_hint" style="display:block;">&nbsp;提示:正整数,1到3个字符</span> -->
            </el-form-item>
            <el-form-item label="签到周期" prop="circle">
              <el-select v-model="signForm.circle" placeholder="请选择" style="width:200px;" >
                  <el-option
                    v-for="item in signCircleArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="扣分分值" prop="score">
              <el-input v-model="signForm.score" style="width:200px;" onkeyup="if(value==0)value='';value= value.match(/\d+(\.\d{0,1})?/) ? value.match(/\d+(\.\d{0,1})?/)[0] : ''"></el-input>
              <el-select v-model="signForm.dedect" placeholder="请选择" style="width:200px;">
                  <el-option
                    v-for="item in signDedectArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <!-- <span class="form_hint" style="display:block;">&nbsp;提示:正数含一位小数,1到4个字符</span> -->
            </el-form-item>
            <el-form-item label="部门类型" prop="department_type">
              <el-select v-model="signForm.department_type" placeholder="请选择" style="width:200px;" >
                  <el-option
                    v-for="item in signDepartArrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="signCancel()">取 消</el-button>
            <el-button type="primary" @click="signConfirm('signForm')" >确 定</el-button>
          </div>
        </el-dialog>

    </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
export default {
    name: 'inspectionRules',
    data() {
        var validateLowestNum = (rule, value, callback) => {
            if (value !== '') {
              if(value>-1&&value<1000 ){
                callback()
              }else{
                callback(new Error('请输入正整数或0,字符长度1-3位'))
              }

            }else{
              callback(new Error('请输入最低数量'))
            }
        }
        var validateHighestNum= (rule, value, callback) => {
            if (value !== '') {
              if(value>-1&&value<1000){
                callback()
              }else{
                callback(new Error('请输入正整数或0,字符长度1-3位'))
              }
            }else{
              callback(new Error('请输入最高数量'))
            }
        }
        var validateScoreNum=(rule, value, callback) => {
            if (value !== '') {
              if(value>0&&value<10000 ){
                callback()
              }else{
                callback(new Error('请输入正数含一位小数,字符长度1-4位'))
              }
            }else{
              callback(new Error('请输入加分分值'))
            }
        }

        var validateReportScore=(rule, value, callback) => {
            if (value !== '') {
              if(value>0&&value<10000 ){
                callback()
              }else{
                callback(new Error('请输入正数含一位小数,字符长度1-4位'))
              }
            }else{
              callback(new Error('请输入加分分值'))
            }
        }

        var validateSecondaryScore=(rule, value, callback) => {
            if (value !== '') {
              if(value>0&&value<10000 ){
                callback()
              }else{
                callback(new Error('请输入正数含一位小数,字符长度1-4位'))
              }
            }else{
              callback(new Error('请输入扣分分值'))
            }
        }

        var validateSignScore=(rule, value, callback) => {
            if (value !== '') {
              if(value>0 && value<10000){
                callback()
              }else{
                callback(new Error('请输入正数含一位小数,字符长度1-4位'))
              }
            }else{
              callback(new Error('请输入扣分分值'))
            }
        }
        var validateSignNum=(rule, value, callback) => {
            if (value !== '') {
              if(value>0 && value<1000){
                callback()
              }else{
                callback(new Error('请输入正整数,字符长度1-3位'))
              }
            }else{
              callback(new Error('请输入签到次数'))
            }
        }

        var validateRuleName=(rule, value, callback) => {
            if (value !== '') {
              let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
              let mat = value.match(cnReg)
              let lengths
              if(mat){
                 lengths=(mat.length + (value.length - mat.length) * 0.5)*2
              }else{
                lengths=value.length
              }
              if(lengths>3&&lengths<21 ){
                callback()
              }else{
                callback(new Error('字符长度为4-20位'))
              }
            }else{
              callback(new Error('请输入规则名称'))
            }
        }
        var validateRulePrompt=(rule, value, callback) => {
            if (value !== '') {
              let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
              let mat = value.match(cnReg)
              let lengths
              if(mat){
                 lengths=(mat.length + (value.length - mat.length) * 0.5)*2
              }else{
                lengths=value.length
              }
              if(lengths>0&&lengths<201 ){
                callback()
              }else{
                callback(new Error('字符长度为0-200位'))
              }
            }else{
              callback()
            }
        }
        var validateMeanName=(rule, value, callback) => {
            if (value !== '') {
              let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
              let mat = value.match(cnReg)
              let lengths
              if(mat){
                 lengths=(mat.length + (value.length - mat.length) * 0.5)*2
              }else{
                lengths=value.length
              }
              if(lengths>3&&lengths<21 ){
                callback()
              }else{
                callback(new Error('字符长度为4-20位'))
              }
            }else{
              callback(new Error('请输入资料项名称'))
            }
        }


        return {
          states:'',
          ruleTabBoolean1:true,
          ruleTabBoolean2:false,
          ruleTabBoolean3:false,
          disposeCount: 0,
          disposeCurrentPage: 1,
          filesCount: 0,
          filesCurrentPage: 1,
          pageSize:10,


          //处置流程
          ruleStateValue:'',
          ruleStateOptions:[{
            'label':'全部',
            'value':''
          },{
            'label':'可选处置项',
            'value':'1'
          },{
            'label':'处置流程',
            'value':'0'
          }],
          disposeStateValue:'',
          disposeStateOptions:[
            {'label':'全部','value':''},
            {'label':'启用','value':'1'},
            {'label':'禁用','value':'0'}
          ],
          rule_word:'',
          disposeData:[],
          ruleDialog_word:'',
          ruleVisible:false,
          ruleFormRules:{
            process_item_name:[
              { required: true,validator:validateRuleName, trigger: 'blur' }
            ],
            deal_tip:[
              { required: false,validator:validateRulePrompt, trigger: 'blur' }
            ]
          },
          rulesData:{
            process_item_name:'',
            process_item_type:0,
            deal_process:1,
            choose:"0",
            state:1,
            trigger_type:0,
            deal_tip:'',
            process_item_id:''
          },
          flowItemVisible:true,
          chooseVisible:false,
          ruleTypeArrOptions:[{
            'label':'处置流程',
            'value':0
          },{
            'label':'可选处置项',
            'value':1
          }],
          flowItemArrOptions:[{
            'label':'响应',
            'value':1
          },{
            'label':'预案',
            'value':2
          },{
            'label':'调查',
            'value':3
          },{
            'label':'措施',
            'value':4
          },{
            'label':'办结',
            'value':5
          }],
          regularStateOptions:[
            {'label':'启用','value':1},
            {'label':'禁用','value':0}
          ],
          triggerArrOptions:[
            {'label':'舆情下发时间','value':0},
            {'label':'处置阶段启动时间','value':1}
          ],
          ruleEditData:[{
            pubopn_nature:6,
            time_type:1,
            time_limit_type:1,
            time_limit_number:'',
            score:''
          },{
            pubopn_nature:7,
            time_type:1,
            time_limit_type:1,
            time_limit_number:'',
            score:''
          },{
            pubopn_nature:8,
            time_type:1,
            time_limit_type:1,
            time_limit_number:'',
            score:''
          }],
          limitTypeArrOptions:[
            {'label':'日','value':1},
            {'label':'时','value':2},
            {'label':'分','value':3}
          ],
          timeTypeArrOptions:[
            {'label':'工作日','value':1},
            {'label':'日历日','value':2},
            {'label':'工作时间','value':3},
            {'label':'无要求','value':4}
          ],



          //特定规则
          //舆情数量加分
          publicNumData:[],
          numDialog_word:'',
          numVisible:false,
          publicNumForm:{
            lowest_number:'',
            highest_number:'',
            score:''
          },
          numFormRules:{
            lowest_number: [
              { required: true,validator:validateLowestNum, trigger: 'blur' }
            ],
            highest_number: [
              { required: true,validator:validateHighestNum, trigger: 'blur' }
            ],
            score: [
              { required: true, validator:validateScoreNum, trigger: 'blur' }
            ],
          },

          //舆情上报加分
          publicReportData:[],
          reportButton_visible:true,
          reportVisible:false,
          reportDialog_word:'',
          publicReportForm:{
            'score':'',
            'condition':'0',
            'report_pubopn_id':''
          },
          reportFormrules: {
              score: [
                { required: true,validator:validateReportScore, trigger: 'blur' }
              ],
              condition: [
                { required: true,message: '请输入加分场景', trigger: 'change' }
              ]
          },
          //次生舆情扣分
          publicSecondaryData:[],
          secondaryDialog_word:'',
          secondaryButton_visible:true,
          secondaryVisible:false,
          secondaryForm:{
            unit:'1',
            score:'',
            secondary_id:''
          },
          secondaryUnitArrOptions:[
            {'label':'按事件','value':'1'},
            {'label':'按次数','value':'2'}
          ],
          secondaryFormrules:{
            score: [
              { required: true,validator:validateSecondaryScore, trigger: 'blur' }
            ]
          },

          //签到规则设定
          signRuleData:[],
          signDialog_word:'',
          signVisible:false,
          signForm:{
            num:'',
            circle:'1',
            score:'',
            dedect:'1',
            department_type:'1',
            idt_assessment_rule_signin:''
          },
          signDepartArrOptions:[
            {'label':'管理员部门','value':'1'},
            {'label':'发言人部门','value':'2'}
          ],
          signCircleArrOptions:[
            {'label':'周','value':'1'},
            {'label':'月','value':'2'}
          ],
          signDedectArrOptions:[
            {'label':'按次','value':'1'},
            {'label':'按周','value':'2'},
            {'label':'按月','value':'3'}
          ],
          signFormrules: {
            num: [
              { required: true,validator: validateSignNum, trigger: 'blur' }
            ],
            score: [
              { required: true,validator:validateSignScore, trigger: 'blur' }
            ]
          },


          //资料项
          means_word:'',
          filesData:[],
          meanDialog_word:'',
          meanVisible:false,
          meanFormRules:{
            mean_name:[
              { required: true,validator:validateMeanName, trigger: 'blur' }
            ]
          },
          meansData:{
            mean_name:'',
            audit_type:'1',
            score_type:'1',
            upload_repeat:'1',
            upload_data_id:''
          },
          auditTypeArrOptions:[
            {'label':'自动审核','value':'1'},
            {'label':'手动审核','value':'2'}
          ],
          scoreTypeArrOptions:[
            {'label':'加分','value':'1'},
            {'label':'扣分','value':'2'}
          ],
          uploadRepeatArrOptions:[
            {'label':'支持','value':'1'},
            {'label':'不支持','value':'0'}
          ],
          uploadEditData:[
            {
              dept_type:'1',
              single_score:'',
              score_up_limit:'',
              score_cycle_type:1,
              score_delay:''
            },
            {
              dept_type:'2',
              single_score:'',
              score_up_limit:'',
              score_cycle_type:1,
              score_delay:''
            }],
          scoreCircleArrOptions:[
            {'label':'按周','value':1},
            {'label':'按两周','value':2},
            {'label':'按月','value':3},
            {'label':'按当前考核期','value':4}
          ],

        }
    },
    created() {
      this.disposeList()
      this.filesList()
      this.publicNumList()
      this.publicReportList()
      this.publicSignList()
      this.secondaryList()
    },
    mounted(){
      //未生效才能编辑  生效和过期只能查看
      this.states=this.$route.query.state
    },
    methods: {
      //返回
      getBack(){
        this.$router.push({ path: 'inspectionConfig',query:{

          }
        })
      },

      disposehandleSizeChange(val) {

      },
      disposehandleCurrentChange(val) {
          this.disposeCurrentPage = val
          this.disposeList()
      },
      fileshandleSizeChange(val) {

      },
      fileshandleCurrentChange(val) {
          this.filesCurrentPage = val
          this.filesList()
      },

      //点击处置流程
      flowShow(){
        this.ruleTabBoolean1=true
        this.ruleTabBoolean2=false
        this.ruleTabBoolean3=false
        this.ruleStateValue=''
        this.disposeStateValue=''
        this.rule_word=''
        this.disposeCurrentPage=1
        this.disposeList()
      },
      //点击特定规则
      fixationShow(){
        this.ruleTabBoolean1=false
        this.ruleTabBoolean2=true
        this.ruleTabBoolean3=false
        this.publicNumList()
        this.publicReportList()
        this.publicSignList()
        this.secondaryList()
      },
      //点击上传文件
      uploadingShow(){
        this.ruleTabBoolean1=false
        this.ruleTabBoolean2=false
        this.ruleTabBoolean3=true
        this.means_word=''
        this.filesCurrentPage=1
        this.filesList()
      },


      //处置流程-列表
      disposeList(){
        let _this=this
        axios.get('/api/v1/assessment/rule/process/list',{
            params:{
              process_item_name:_this.rule_word,
              process_item_type:_this.ruleStateValue,
              state:_this.disposeStateValue,
              pageSize:_this.pageSize,
              pageNumber:_this.disposeCurrentPage,
              period_id:_this.$route.query.period_id
            }
          }).then(function (response) {
            let arr=response.data.data.processList
            if(arr.length>0){
              _this.disposeData=[]
              arr.forEach(item => {
                let tableObj={}
                tableObj.deal_process=item.deal_process
                tableObj.deal_tip=item.deal_tip
                tableObj.period_id=item.period_id
                tableObj.process_item_id=item.process_item_id
                tableObj.process_item_name=item.process_item_name
                tableObj.process_item_type=item.process_item_type
                tableObj.rule_type=item.rule_type
                tableObj.state=item.state
                tableObj.trigger_type=item.trigger_type
                tableObj.choose=item.choose
                _this.disposeData.push(tableObj)
              })
              _this.disposeCount=response.data.data.total
            }else{
              _this.disposeData=[]
              _this.disposeCount=0
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
      //处置流程-搜索
      disposeSearch(){
        this.disposeCurrentPage=1
        this.disposeList()
      },
      //处置流程-新建规则(模态框)-规则类型下拉框
      ruleTypeSel(){
        let type=''
        type=this.rulesData.process_item_type
        if(type=='0'){
          this.flowItemVisible=true
          this.chooseVisible=false
          this.rulesData.deal_process=1
        }else if(type=='1'){
          this.flowItemVisible=false
          this.chooseVisible=true
          this.rulesData.choose="0"
        }
      },
      //处置流程-新建规则(模态框)-重置
      ruleCloseDialog(formData){
        this.ruleVisible=false
        this.flowItemVisible=false
        this.chooseVisible=false
        this.$refs[formData].clearValidate()
      },
      //处置流程-新建规则(模态框)
      newRules(formData){
        let _this=this
        this.ruleVisible=true
        this.flowItemVisible=true
        this.chooseVisible=false
        this.ruleDialog_word='新建规则'
        setTimeout(function(){
          _this.$refs[formData].resetFields()
          _this.rulesData.process_item_name=''
          _this.rulesData.process_item_type=0
          _this.rulesData.deal_process=1
          _this.rulesData.choose="0"
          _this.rulesData.state=1
          _this.rulesData.trigger_type=0
          _this.rulesData.deal_tip=''
          _this.ruleEditData=[{
            pubopn_nature:6,
            time_type:1,
            time_limit_type:1,
            time_limit_number:'',
            score:''
          },{
            pubopn_nature:7,
            time_type:1,
            time_limit_type:1,
            time_limit_number:'',
            score:''
          },{
            pubopn_nature:8,
            time_type:1,
            time_limit_type:1,
            time_limit_number:'',
            score:''
          }]
        },50)
      },
      //处置流程-编辑规则(模态框)
      disposeEdit(index,row){
        this.ruleVisible=true
        if(this.states==0){
          this.ruleDialog_word='编辑规则'
        }else{
          this.ruleDialog_word='查看规则'
        }
        this.rulesData.process_item_name=row.process_item_name
        this.rulesData.process_item_type=row.process_item_type
        this.ruleTypeSel()
        this.rulesData.deal_process=Number(row.deal_process)
        let chooses=row.choose
        if(chooses==0){
          this.rulesData.choose="0"
        }else if(chooses==1){
          this.rulesData.choose="1"
        }
        this.rulesData.state=row.state
        this.rulesData.trigger_type=row.trigger_type
        this.rulesData.deal_tip=row.deal_tip
        this.rulesData.process_item_id=row.process_item_id
        this.ruleEditList(row.process_item_id)

      },
      //处置流程-编辑-规则编辑
      ruleEditList(process_id){
        let _this=this
        axios.get('/api/v1/assessment/rule/process/req/list',{
            params:{
              process_item_id:process_id
            }
          }).then(function (response) {
            let arr=response.data.data
            _this.ruleEditData=arr
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
      //处置流程-新建规则(模态框)-取消
      ruleCancel(){
        this.ruleVisible=false
      },
      //处置流程-新建规则(模态框)-确认
      ruleConfirm(formData){
        let _this=this
        this.$refs[formData].validate((valid) => {
            if (valid) {
              let url=''
              let obj={}
              if(_this.ruleDialog_word=='新建规则'){
                url='/api/v1/assessment/rule/process/add'
                if(_this.rulesData.process_item_type==0){
                  obj={
                    rule_type:_this.rulesData.process_item_type,
                    period_id:_this.$route.query.period_id,
                    process_item_name:_this.rulesData.process_item_name,
                    process_item_type:_this.rulesData.process_item_type,
                    deal_process:_this.rulesData.deal_process,
                    deal_tip:_this.rulesData.deal_tip,
                    state:_this.rulesData.state,
                    trigger_type:_this.rulesData.trigger_type,
                    ruleJson:JSON.stringify(this.ruleEditData)
                  }
                }else if(_this.rulesData.process_item_type==1){
                  obj={
                    rule_type:_this.rulesData.process_item_type,
                    period_id:_this.$route.query.period_id,
                    process_item_name:_this.rulesData.process_item_name,
                    process_item_type:_this.rulesData.process_item_type,
                    deal_tip:_this.rulesData.deal_tip,
                    state:_this.rulesData.state,
                    trigger_type:_this.rulesData.trigger_type,
                    choose:_this.rulesData.choose,
                    ruleJson:JSON.stringify(this.ruleEditData)
                  }
                }

              }else{
                url='/api/v1/assessment/rule/process/upd'
                if(_this.rulesData.process_item_type==0){
                  obj={
                    process_item_id:_this.rulesData.process_item_id,
                    process_item_name:_this.rulesData.process_item_name,
                    process_item_type:_this.rulesData.process_item_type,
                    deal_process:_this.rulesData.deal_process,
                    deal_tip:_this.rulesData.deal_tip,
                    state:_this.rulesData.state,
                    trigger_type:_this.rulesData.trigger_type,
                    ruleJson:JSON.stringify(this.ruleEditData)
                  }
                }else if(_this.rulesData.process_item_type==1){
                  obj={
                    process_item_id:_this.rulesData.process_item_id,
                    process_item_name:_this.rulesData.process_item_name,
                    process_item_type:_this.rulesData.process_item_type,
                    deal_tip:_this.rulesData.deal_tip,
                    state:_this.rulesData.state,
                    trigger_type:_this.rulesData.trigger_type,
                    choose:_this.rulesData.choose,
                    ruleJson:JSON.stringify(this.ruleEditData)
                  }
                }
              }
              axios.post(url, obj)
              .then(function (response) {
                _this.$message({
                  type: 'success',
                  message:"保存成功!"
                });
                _this.ruleVisible=false
                _this.ruleStateValue=''
                _this.disposeStateValue=''
                _this.rule_word=''
                _this.disposeCurrentPage=1
                _this.disposeList()
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
      //处置流程-删除
      disposeDelete(index,row){
        let _this=this
        this.$confirm('请确认是否删除该处置流程项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/v1/assessment/rule/process/del',{
              params:{
                process_item_id:row.process_item_id
              }
            }).then(function (response) {
                  _this.ruleStateValue=''
                  _this.disposeStateValue=''
                  _this.rule_word=''
                  _this.disposeCurrentPage=1
                  _this.disposeList()
                  _this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
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

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },



      //特定规则

      //舆情数量加分-新建
      newPublicNum(formData){
        let _this=this
        this.numVisible=true
        this.numDialog_word='新建舆情数量'
        setTimeout(function(){
          _this.$refs[formData].resetFields()
          _this.publicNumForm.lowest_number=''
          _this.publicNumForm.highest_number=''
          _this.publicNumForm.score=''
        },50)
      },
      //舆情数量加分-编辑
      publicNumEdit(index,row){
        this.numVisible=true
        this.numDialog_word='编辑舆情数量'
        this.publicNumForm.lowest_number=row.lowest_number
        this.publicNumForm.highest_number=row.highest_number
        this.publicNumForm.score=row.score
        this.publicNumForm.pubopn_number_id=row.pubopn_number_id
      },
      //舆情数量模态框-取消按钮
      numCancel(){
        this.numVisible=false
      },
      //舆情数量模态框-保存
      numConfirm(formName){
        let _this=this
        this.$refs[formName].validate((valid) => {
            if (valid) {
              if(Number(_this.publicNumForm.lowest_number)<Number(_this.publicNumForm.highest_number)){
                let url=''
                let obj={}
                if(_this.numDialog_word=='新建舆情数量'){
                  url='/api/v1/assessment/rule/number/add'
                  obj={
                    period_id:_this.$route.query.period_id,
                    rule_type:2,
                    lowest_number:_this.publicNumForm.lowest_number,
                    highest_number:_this.publicNumForm.highest_number,
                    score:_this.publicNumForm.score
                  }
                }else{
                  url='/api/v1/assessment/rule/number/upd'
                  obj={
                    rule_type:2,
                    lowest_number:_this.publicNumForm.lowest_number,
                    highest_number:_this.publicNumForm.highest_number,
                    score:_this.publicNumForm.score,
                    pubopn_number_id:_this.publicNumForm.pubopn_number_id
                  }
                }
                axios.post(url, obj)
                .then(function (response) {
                  _this.$message({
                    type: 'success',
                    message:"保存成功!"
                  });
                  _this.numVisible=false
                  _this.publicNumList()
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
                _this.$message({
                  type: 'error',
                  message: '最低数量要小于最高数量!'
                });
              }

            }
        })
      },
      //舆情数量模态框-重置
      numCloseDialog(formData){
        this.numVisible=false
        this.$refs[formData].clearValidate()
      },
      //舆情数量加分-删除
      publicNumDelete(index,row){
        let _this=this
        this.$confirm('请确认是否删除该舆情数量?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/v1/assessment/rule/number/del',{
              params:{
                pubopn_number_id:row.pubopn_number_id
              }
            }).then(function (response) {
                  _this.publicNumList()
                  _this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });

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

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      //舆情数量列表
      publicNumList(){
        let _this=this
        axios.get('/api/v1/assessment/rule/number/list',{
            params:{
              period_id:this.$route.query.period_id
            }
          }).then(function (response) {
             let arr=response.data.data
             if(arr.length>0){
               _this.publicNumData=[]
               arr.forEach(item => {
                 let tableObj={}
                 tableObj.highest_number=item.highest_number
                 tableObj.lowest_number=item.lowest_number
                 tableObj.pubopn_number_id=item.pubopn_number_id
                 tableObj.rule_type=item.rule_type
                 tableObj.score=item.score
                 tableObj.period_id=item.period_id
                 _this.publicNumData.push(tableObj)
               })
             }else{
               _this.publicNumData=[]
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

      //舆情上报加分-新建
      newPublicReport(formData){
        let _this=this
        this.reportVisible=true
        this.reportDialog_word='新建舆情上报'
        setTimeout(function(){
          _this.$refs[formData].resetFields()
          _this.publicReportForm.score=''
          _this.publicReportForm.condition='0'
        },50)
      },
      //舆情上报加分-编辑
      publicReportEdit(index,row){
        this.reportVisible=true
        this.reportDialog_word='编辑舆情上报'
        this.publicReportForm.score=row.score
        this.publicReportForm.condition=row.bonus_condition_type+''
        this.publicReportForm.report_pubopn_id=row.report_pubopn_id
      },
      //舆情上报加分-删除
      publicReportDelete(index,row){
        let _this=this
        this.$confirm('请确认是否删除该舆情上报?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/v1/assessment/rule/report/del',{
              params:{
                report_pubopn_id:row.report_pubopn_id
              }
            }).then(function (response) {
                  _this.publicReportList()
                  _this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });

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

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      //舆情上报加分模态框-取消按钮
      reportCancel(){
        this.reportVisible=false
      },
      //舆情上报加分模态框-保存
      reportConfirm(formName){
        let _this=this
        this.$refs[formName].validate((valid) => {
            if (valid) {
              let url=''
              let obj={}
              if(_this.reportDialog_word=='新建舆情上报'){
                url='/api/v1/assessment/rule/report/add'
                obj={
                  period_id:_this.$route.query.period_id,
                  rule_type:3,
                  bonus_condition_type:_this.publicReportForm.condition,
                  score:_this.publicReportForm.score
                }
              }else{
                url='/api/v1/assessment/rule/report/upd'
                obj={
                  report_pubopn_id:_this.publicReportForm.report_pubopn_id,
                  rule_type:3,
                  bonus_condition_type:_this.publicReportForm.condition,
                  score:_this.publicReportForm.score
                }
              }
              axios.post(url, obj)
              .then(function (response) {
                _this.$message({
                  type: 'success',
                  message:"保存成功!"
                });
                _this.reportVisible=false
                _this.publicReportList()
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
      //舆情上报加分模态框-重置
      reportCloseDialog(formData){
        this.reportVisible=false
        this.$refs[formData].clearValidate()
      },
      //舆情上报加分 列表
      publicReportList(){
        let _this=this
        axios.get('/api/v1/assessment/rule/report/list',{
            params:{
              period_id:this.$route.query.period_id
            }
          }).then(function (response) {
             _this.publicReportData=[]
             let arr=[]
             arr=response.data.data
             if(arr.length>0){
                 let tableObj={}
                 tableObj.bonus_condition_type=arr[0].bonus_condition_type
                 tableObj.score=arr[0].score
                 tableObj.report_pubopn_id=arr[0].report_pubopn_id
                 tableObj.period_id=arr[0].period_id
                 _this.publicReportData.push(tableObj)
                 _this.reportButton_visible=false
             }else{
               _this.publicReportData=[]
               _this.reportButton_visible=true
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




      //次生舆情扣分-新建
      newSecondary(formData){
        let _this=this
        this.secondaryVisible=true
        this.secondaryDialog_word='新建次生舆情'
        setTimeout(function(){
          _this.$refs[formData].resetFields()
          _this.secondaryForm.score=''
          _this.secondaryForm.unit='1'
        },50)
      },
      //次生舆情扣分-编辑
      publicSecondaryEdit(index,row){
        this.secondaryVisible=true
        this.secondaryDialog_word='编辑次生舆情'
        this.secondaryForm.score=row.score
        this.secondaryForm.unit=row.score_type+''
        this.secondaryForm.secondary_id=row.secondary_id
      },
      //次生舆情扣分-删除
      secondaryDelete(index,row){
        let _this=this
        this.$confirm('请确认是否删除该次生舆情?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/v1/assessment/rule/second/del',{
              params:{
                secondary_id:row.secondary_id
              }
            }).then(function (response) {
                  _this.secondaryList()
                  _this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });

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

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      //次生舆情扣分-取消按钮
      secondaryCancel(){
        this.secondaryVisible=false
      },
      //次生舆情扣分-保存
      secondaryConfirm(formName){
        let _this=this
        this.$refs[formName].validate((valid) => {
            if (valid) {
              let _this=this
              this.$refs[formName].validate((valid) => {
                  if (valid) {
                    let url=''
                    let obj={}
                    if(_this.secondaryDialog_word=='新建次生舆情'){
                      url='/api/v1/assessment/rule/second/add'
                      obj={
                        period_id:_this.$route.query.period_id,
                        rule_type:4,
                        score:_this.secondaryForm.score,
                        score_type:_this.secondaryForm.unit
                      }
                    }else{
                      url='/api/v1/assessment/rule/second/upd'
                      obj={
                        score:_this.secondaryForm.score,
                        score_type:_this.secondaryForm.unit,
                        secondary_id:_this.secondaryForm.secondary_id
                      }
                    }
                    axios.post(url, obj)
                    .then(function (response) {
                      _this.$message({
                        type: 'success',
                        message:"保存成功!"
                      });
                      _this.secondaryVisible=false
                      _this.secondaryList()
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
        })
      },
      //次生舆情扣分-重置
      secondaryCloseDialog(formData){
        this.secondaryVisible=false
        this.$refs[formData].clearValidate()
      },
      //次生舆情扣分 列表
      secondaryList(){
        let _this=this
        axios.get('/api/v1/assessment/rule/second/list',{
            params:{
              period_id:this.$route.query.period_id
            }
          }).then(function (response) {
            _this.publicSecondaryData=[]
            let arr=[]
            arr=response.data.data
            if(arr.length>0){
                let tableObj={}
                tableObj.score=arr[0].score
                tableObj.score_type=arr[0].score_type
                tableObj.secondary_id=arr[0].secondary_id
                _this.publicSecondaryData.push(tableObj)
                _this.secondaryButton_visible=false
            }else{
              _this.publicSecondaryData=[]
              _this.secondaryButton_visible=true
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

      //签到规则设定-新建
      newsignRule(formData){
        let _this=this
        this.signVisible=true
        this.signDialog_word='新建签到规则'
        setTimeout(function(){
          _this.signForm.department_type='1'
          _this.signForm.score=''
          _this.signForm.num=''
          _this.signForm.circle='1'
          _this.signForm.dedect='1'
        },50)
      },
      //签到规则设定-编辑
      signRuleEdit(index,row){
        this.signVisible=true
        this.signDialog_word='编辑签到规则'
        this.signForm.department_type=row.dept_type
        this.signForm.idt_assessment_rule_signin=row.idt_assessment_rule_signin
        this.signForm.score=row.score
        this.signForm.num=row.sign_time
        this.signForm.circle=row.sign_period
        this.signForm.dedect=row.score_type+''
      },
      //签到规则设定-删除
      signRuleDelete(index,row){
        let _this=this
        this.$confirm('请确认是否删除该部门的签到规则?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/v1/assessment/rule/sign/del',{
              params:{
                idt_assessment_rule_signin:row.idt_assessment_rule_signin
              }
            }).then(function (response) {
                  _this.publicSignList()
                  _this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });

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

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      //签到规则模态框-取消按钮
      signCancel(){
        this.signVisible=false
      },
      //签到规则模态框-保存
      signConfirm(formName){
        let _this=this
        this.$refs[formName].validate((valid) => {
            if (valid) {
              let url=''
              let obj={}
              if(_this.signDialog_word=='新建签到规则'){
                url='/api/v1/assessment/rule/sign/add'
                obj={
                  rule_type:5,
                  period_id:_this.$route.query.period_id,
                  dept_type:_this.signForm.department_type,
                  sign_time:_this.signForm.num,
                  sign_period:_this.signForm.circle,
                  score:_this.signForm.score,
                  score_type:_this.signForm.dedect
                }
              }else{
                url='/api/v1/assessment/rule/sign/upd'
                obj={
                  dept_type:_this.signForm.department_type,
                  sign_time:_this.signForm.num,
                  sign_period:_this.signForm.circle,
                  score:_this.signForm.score,
                  score_type:_this.signForm.dedect,
                  idt_assessment_rule_signin:_this.signForm.idt_assessment_rule_signin
                }
              }
              axios.post(url, obj)
              .then(function (response) {
                _this.$message({
                  type: 'success',
                  message:"保存成功!"
                });
                _this.signVisible=false
                _this.publicSignList()
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
      //签到规则模态框-重置
      signCloseDialog(formData){
        this.signVisible=false
        this.$refs[formData].clearValidate()
      },
      //签到规则 列表
      publicSignList(){
        let _this=this
        axios.get('/api/v1/assessment/rule/sign/list',{
            params:{
              period_id:this.$route.query.period_id
            }
          }).then(function (response) {
            let arr=response.data.data
            if(arr.length>0){
              _this.signRuleData=[]
              arr.forEach(item => {
                let tableObj={}
                tableObj.dept_type=item.dept_type
                tableObj.idt_assessment_rule_signin=item.idt_assessment_rule_signin
                tableObj.period_id=item.period_id
                tableObj.rule_type=item.rule_type
                tableObj.score=item.score
                tableObj.score_type=item.score_type
                tableObj.sign_period=item.sign_period
                tableObj.sign_time=item.sign_time
                _this.signRuleData.push(tableObj)
              })
            }else{
              _this.signRuleData=[]
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



      //上传文件-列表
      filesList(){
        let _this=this
        axios.get('/api/v1/assessment/rule/upload/list',{
            params:{
              data_name:_this.means_word,
              pageNumber:_this.filesCurrentPage,
              pageSize:_this.pageSize,
              period_id:_this.$route.query.period_id
            }
          }).then(function (response) {
            let arr=response.data.data.uploadList
            if(arr.length>0){
              _this.filesData=[]
              arr.forEach(item => {
                let tableObj={}
                tableObj.can_repeat_upload=item.can_repeat_upload
                tableObj.check_type=item.check_type
                tableObj.data_name=item.data_name
                tableObj.rule_type=item.rule_type
                tableObj.score_type=item.score_type
                tableObj.period_id=item.period_id
                tableObj.upload_data_id=item.upload_data_id
                _this.filesData.push(tableObj)
              })
              _this.filesCount=response.data.data.total
            }else{
              _this.filesData=[]
              _this.filesCount=0
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
      //上传文件-搜索
      meansSearch(){
        this.filesCurrentPage=1
        this.filesList()
      },
      //上传文件-新建资料项(模态框)-重置
      meanCloseDialog(formData){
        this.meanVisible=false
        this.$refs[formData].clearValidate()
      },
      //上传文件-新建资料项(模态框)
      newMeans(formData){
        let _this=this
        this.meanVisible=true
        this.meanDialog_word='新建资料项'
        setTimeout(function(){
          _this.$refs[formData].resetFields()
          _this.uploadEditData=[
            {
              dept_type:'1',
              single_score:'',
              score_up_limit:'',
              score_cycle_type:1,
              score_delay:''
            },
            {
              dept_type:'2',
              single_score:'',
              score_up_limit:'',
              score_cycle_type:1,
              score_delay:''
            }]
          _this.meansData.mean_name=''
          _this.meansData.audit_type='1'
          _this.meansData.score_type='1'
          _this.meansData.upload_repeat='1'
        },50)
      },
      //上传文件-编辑资料项(模态框)
      meansEdit(index,row){
        this.meanVisible=true
        if(this.states==0){
          this.meanDialog_word='编辑资料项'
        }else{
          this.meanDialog_word='查看资料项'
        }
        this.meansData.mean_name=row.data_name
        this.meansData.audit_type=row.check_type+''
        this.meansData.score_type=row.score_type+''
        this.meansData.upload_repeat=row.can_repeat_upload+''
        this.meansData.upload_data_id=row.upload_data_id
        this.meansRuleList(row.upload_data_id)
      },
      //点击编辑 拿到规则编辑数据
      meansRuleList(data_id){
        let _this=this
        axios.get('/api/v1/assessment/rule/upload/score/list',{
            params:{
              upload_data_id:data_id
            }
          }).then(function (response) {
            let arr=response.data.data
            _this.uploadEditData=arr
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
      //上传文件-新建规则(模态框)-取消
      meanCancel(){
        this.meanVisible=false
      },
      //上传文件-新建规则(模态框)-确认
      meanConfirm(formData){
        let _this=this
        this.$refs[formData].validate((valid) => {
            if (valid) {
              let url=''
              let obj={}
              if(_this.meanDialog_word=='新建资料项'){
                url='/api/v1/assessment/rule/upload/add'
                obj={
                  rule_type:6,
                  period_id:_this.$route.query.period_id,
                  data_name:_this.meansData.mean_name,
                  check_type:_this.meansData.audit_type,
                  score_type:_this.meansData.score_type,
                  can_repeat_upload:_this.meansData.upload_repeat,
                  dataJson:JSON.stringify(this.uploadEditData)
                }
              }else{
                url='/api/v1/assessment/rule/upload/upd'
                obj={
                  data_name:_this.meansData.mean_name,
                  check_type:_this.meansData.audit_type,
                  score_type:_this.meansData.score_type,
                  can_repeat_upload:_this.meansData.upload_repeat,
                  upload_data_id:_this.meansData.upload_data_id,
                  dataJson:JSON.stringify(this.uploadEditData)
                }
              }
              axios.post(url, obj)
              .then(function (response) {
                _this.$message({
                  type: 'success',
                  message:"保存成功!"
                });
                _this.meanVisible=false
                _this.means_word=''
                _this.filesCurrentPage=1
                _this.filesList()
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
      //上传资料-删除
      meansDelete(index,row){
        let _this=this
        this.$confirm('请确认是否删除该资料项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/v1/assessment/rule/upload/del',{
              params:{
                upload_data_id:row.upload_data_id
              }
            }).then(function (response) {
                  _this.filesCurrentPage=1
                  _this.means_word=''
                  _this.filesList()
                  _this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });

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

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },


    }
}
</script>
<style scoped>
.tab-change{
  height:40px;
  border-bottom:solid 1px #dedde2;
  background:#f1f2f3;
  padding-left:20px;
}
.tab-change span{
  display: inline-block;
  height:30px;
  line-height:30px;
  margin-top:9px;
  padding:0 10px;
  font-size:14px;
  border-bottom:none;
  margin-right:10px;
  border-radius:5px 5px 0 0;
}
</style>
