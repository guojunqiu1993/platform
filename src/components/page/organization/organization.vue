<template>
    <div>
        <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 组织管理</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="handle-exportDownload mr10" @click="exportDownload()"><i class="iconfont icon-xiafa"></i><span class="span">导入模板下载</span></el-button>
          <el-button type="primary" class="handle-export mr10" @click="exportAll()"><i class="iconfont icon-export"></i><span class="span">导入</span></el-button>
          <el-button type="primary" class="handle-new mr10" @click="newSingle()"><i class="iconfont icon-create-orders"></i><span class="span">新建</span></el-button>
          <el-button type="primary" class="handle-del mr10" @click="delAll()"><i class="iconfont icon-shanchu2"></i><span class="span">删除</span></el-button>
        </div>
        <div class="container">
              <div class="handle-box">
                  <!-- <el-select v-model="provinceValue" placeholder="请选择">
                      <el-option
                        v-for="item in province0ptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                  <el-select v-model="areaValue" placeholder="请选择">
                      <el-option
                        v-for="item in areaOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select> -->
                  <el-select size="small" class="handle-select"
                             v-model="selectProv"
                             placeholder="请选择省份"
                             v-on:change="getProv($event)">
                      <el-option
                              v-for="item in provs"
                              :key="item.index"
                              :label="item.label"
                              :value="item.value">
                      </el-option>
                  </el-select>
                  <el-select size="small" class="handle-select"
                             v-model="selectCity"
                             placeholder="请选择城市"
                             v-on:change="getCity($event)">
                      <el-option
                              v-for="item in citys"
                              :key="item.index"
                              :label="item.label"
                              :value="item.value">
                      </el-option>
                  </el-select>

                  <el-select v-model="typeValue" placeholder="请选择" class="handle-select">
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>





                  <el-input v-model="type_word" placeholder="请输入组织名称" class="handle-input mr10"></el-input>
                  <el-button type="primary" class="handle-search" icon="search" @click="search"><i class="iconfont icon-chazhao"></i></el-button>
              </div>
              <div class="table-content">
                <el-table ref="singleTable" border  :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentChange" style="width: 100%">
                  <el-table-column type="selection" align="center"  width="50" fixed>
                  </el-table-column>
                  <el-table-column type="index" align="center" width="70" label="序号">
                  </el-table-column>
                  <el-table-column property="clientsign" align="center" label="客户标识" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="province" align="center" label="地域(省)" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="city" align="center" label="地域(市)" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="customer_name" align="center" label="客户名称" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="customer_type" align="center" label="客户类型" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column property="create_time" align="center" label="创建时间" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="300px">
                    <template slot-scope="scope">
                      <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                      <el-button size="small" @click="handleMenu(scope.$index, scope.row)">产品授权</el-button>
                      <el-button size="small" @click="handleDepart(scope.$index, scope.row)">部门管理</el-button>
                      <el-button size="small" @click="handlePageSet(scope.$index, scope.row)">页面设置</el-button>
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
        </div>


        <!-- 导出模态框 -->
        <el-dialog title="导入" :visible.sync="exportVisible">
            <input type="file" @change="getFile($event)" ref="pathClear">
            <div slot="footer" class="dialog-footer">
              <el-button @click="exportCancel()">取 消</el-button>
              <el-button type="primary" @click="exportConfirm($event)">确 定</el-button>
            </div>
          </el-dialog>

    </div>
</template>

<script>
import Vue from 'vue'
Vue.prototype.$http = axios
// import instance1 from '../../common/axiosv1'
import axios from 'axios'
    export default {
        name: 'organization',
        data() {
            return {
              peopleCount: 0,
              currentPage: 1,
              pageSize:10,
              type_word:'',
              tableData: [],
              multipleSelection:[],
              currentRow:null,
              // province0ptions: [],
              // provinceValue: '',
              // areaOptions:[],
              // areaValue:'',
              typeOptions:[{
                value:'',
                label:'客户类型选择'
              },{
                value:'1',
                label:'正式'
              },{
                value:'0',
                label:'试用'
              }],
              typeValue:'',
              file:'',
              exportVisible:false,
              provs:[{label:'请选择省',value:''},
                    {label:"北京市",value:"北京市"},
                    {label:"天津市",value:"天津市"},
                    {label:"河北省",value:"河北省"},
                    {label:"山西省",value:"山西省"},
                    {label:"内蒙古自治区",value:"内蒙古自治区"},
                    {label:"辽宁省",value:"辽宁省"},
                    {label:"吉林省",value:"吉林省"},
                    {label:"黑龙江省",value:"黑龙江省"},
                    {label:"上海市",value:"上海市"},
                    {label:"江苏省",value:"江苏省"},
                    {label:"浙江省",value:"浙江省"},
                    {label:"安徽省",value:"安徽省"},
                    {label:"福建省",value:"福建省"},
                    {label:"江西省",value:"江西省"},
                    {label:"山东省",value:"山东省"},
                    {label:"河南省",value:"河南省"},
                    {label:"湖北省",value:"湖北省"},
                    {label:"湖南省",value:"湖南省"},
                    {label:"广东省",value:"广东省"},
                    {label:"广西壮族自治区",value:"广西壮族自治区"},
                    {label:"海南省",value:"海南省"},
                    {label:"重庆市",value:"重庆市"},
                    {label:"四川省",value:"四川省"},
                    {label:"贵州省",value:"贵州省"},
                    {label:"云南省",value:"云南省"},
                    {label:"西藏自治区",value:"西藏自治区"},
                    {label:"陕西省",value:"陕西省"},
                    {label:"甘肃省",value:"甘肃省"},
                    {label:"青海省",value:"青海省"},
                    {label:"宁夏回族自治区",value:"宁夏回族自治区"},
                    {label:"新疆维吾尔自治区",value:"新疆维吾尔自治区"},
                    {label:"台湾省",value:"台湾省"},
                    {label:"香港特别行政区",value:"香港特别行政区"},
                    {label:"澳门特别行政区",value:"澳门特别行政区"}] ,
                citys: [],
                selectProv: '',
                selectCity: ''


            }
        },
        created() {
          // this.provinceData()
          // this.cityData()
          this.getTableData()
        },
        computed: {

        },
        methods: {
          /*二级联动选择地区*/
            getProv: function (prov) {
                let tempCity=[];             
                this.citys=[];
                this.selectCity='';               
                let allCity=[{
                    prov: "北京市",
                    label: "北京市"
                }, {
                    prov: "天津市",
                    label: "天津市"
                }, {
                    prov: "河北省",
                    label: "石家庄市"
                }, {
                    prov: "河北省",
                    label: "唐山市"
                }, {
                    prov: "河北省",
                    label: "秦皇岛市"
                }, {
                    prov: "河北省",
                    label: "邯郸市"
                }, {
                    prov: "河北省",
                    label: "邢台市"
                }, {
                    prov: "河北省",
                    label: "保定市"
                }, {
                    prov: "河北省",
                    label: "张家口市"
                }, {
                    prov: "河北省",
                    label: "承德市"
                }, {
                    prov: "河北省",
                    label: "沧州市"
                }, {
                    prov: "河北省",
                    label: "廊坊市"
                }, {
                    prov: "河北省",
                    label: "衡水市"
                }, {
                    prov: "山西省",
                    label: "太原市"
                }, {
                    prov: "山西省",
                    label: "大同市"
                }, {
                    prov: "山西省",
                    label: "阳泉市"
                }, {
                    prov: "山西省",
                    label: "长治市"
                }, {
                    prov: "山西省",
                    label: "晋城市"
                }, {
                    prov: "山西省",
                    label: "朔州市"
                }, {
                    prov: "山西省",
                    label: "晋中市"
                }, {
                    prov: "山西省",
                    label: "运城市"
                }, {
                    prov: "山西省",
                    label: "忻州市"
                }, {
                    prov: "山西省",
                    label: "临汾市"
                }, {
                    prov: "山西省",
                    label: "吕梁市"
                }, {
                    prov: "内蒙古自治区",
                    label: "呼和浩特市"
                }, {
                    prov: "内蒙古自治区",
                    label: "包头市"
                }, {
                    prov: "内蒙古自治区",
                    label: "乌海市"
                }, {
                    prov: "内蒙古自治区",
                    label: "赤峰市"
                }, {
                    prov: "内蒙古自治区",
                    label: "通辽市"
                }, {
                    prov: "内蒙古自治区",
                    label: "鄂尔多斯市"
                }, {
                    prov: "内蒙古自治区",
                    label: "呼伦贝尔市"
                }, {
                    prov: "内蒙古自治区",
                    label: "巴彦淖尔市"
                }, {
                    prov: "内蒙古自治区",
                    label: "乌兰察布市"
                }, {
                    prov: "内蒙古自治区",
                    label: "兴安盟"
                }, {
                    prov: "内蒙古自治区",
                    label: "锡林郭勒盟"
                }, {
                    prov: "内蒙古自治区",
                    label: "阿拉善盟"
                }, {
                    prov: "辽宁省",
                    label: "沈阳市"
                }, {
                    prov: "辽宁省",
                    label: "大连市"
                }, {
                    prov: "辽宁省",
                    label: "鞍山市"
                }, {
                    prov: "辽宁省",
                    label: "抚顺市"
                }, {
                    prov: "辽宁省",
                    label: "本溪市"
                }, {
                    prov: "辽宁省",
                    label: "丹东市"
                }, {
                    prov: "辽宁省",
                    label: "锦州市"
                }, {
                    prov: "辽宁省",
                    label: "营口市"
                }, {
                    prov: "辽宁省",
                    label: "阜新市"
                }, {
                    prov: "辽宁省",
                    label: "辽阳市"
                }, {
                    prov: "辽宁省",
                    label: "盘锦市"
                }, {
                    prov: "辽宁省",
                    label: "铁岭市"
                }, {
                    prov: "辽宁省",
                    label: "朝阳市"
                }, {
                    prov: "辽宁省",
                    label: "葫芦岛市"
                }, {
                    prov: "吉林省",
                    label: "长春市"
                }, {
                    prov: "吉林省",
                    label: "吉林市"
                }, {
                    prov: "吉林省",
                    label: "四平市"
                }, {
                    prov: "吉林省",
                    label: "辽源市"
                }, {
                    prov: "吉林省",
                    label: "通化市"
                }, {
                    prov: "吉林省",
                    label: "白山市"
                }, {
                    prov: "吉林省",
                    label: "松原市"
                }, {
                    prov: "吉林省",
                    label: "白城市"
                }, {
                    prov: "吉林省",
                    label: "延边朝鲜族自治州"
                }, {
                    prov: "黑龙江省",
                    label: "哈尔滨市"
                }, {
                    prov: "黑龙江省",
                    label: "齐齐哈尔市"
                }, {
                    prov: "黑龙江省",
                    label: "鸡西市"
                }, {
                    prov: "黑龙江省",
                    label: "鹤岗市"
                }, {
                    prov: "黑龙江省",
                    label: "双鸭山市"
                }, {
                    prov: "黑龙江省",
                    label: "大庆市"
                }, {
                    prov: "黑龙江省",
                    label: "伊春市"
                }, {
                    prov: "黑龙江省",
                    label: "佳木斯市"
                }, {
                    prov: "黑龙江省",
                    label: "七台河市"
                }, {
                    prov: "黑龙江省",
                    label: "牡丹江市"
                }, {
                    prov: "黑龙江省",
                    label: "黑河市"
                }, {
                    prov: "黑龙江省",
                    label: "绥化市"
                }, {
                    prov: "黑龙江省",
                    label: "大兴安岭地区"
                }, {
                    prov: "上海市",
                    label: "上海市"
                }, {
                    prov: "江苏省",
                    label: "南京市"
                }, {
                    prov: "江苏省",
                    label: "无锡市"
                }, {
                    prov: "江苏省",
                    label: "徐州市"
                }, {
                    prov: "江苏省",
                    label: "常州市"
                }, {
                    prov: "江苏省",
                    label: "苏州市"
                }, {
                    prov: "江苏省",
                    label: "南通市"
                }, {
                    prov: "江苏省",
                    label: "连云港市"
                }, {
                    prov: "江苏省",
                    label: "淮安市"
                }, {
                    prov: "江苏省",
                    label: "盐城市"
                }, {
                    prov: "江苏省",
                    label: "扬州市"
                }, {
                    prov: "江苏省",
                    label: "镇江市"
                }, {
                    prov: "江苏省",
                    label: "泰州市"
                }, {
                    prov: "江苏省",
                    label: "宿迁市"
                }, {
                    prov: "浙江省",
                    label: "杭州市"
                }, {
                    prov: "浙江省",
                    label: "宁波市"
                }, {
                    prov: "浙江省",
                    label: "温州市"
                }, {
                    prov: "浙江省",
                    label: "嘉兴市"
                }, {
                    prov: "浙江省",
                    label: "湖州市"
                }, {
                    prov: "浙江省",
                    label: "绍兴市"
                }, {
                    prov: "浙江省",
                    label: "金华市"
                }, {
                    prov: "浙江省",
                    label: "衢州市"
                }, {
                    prov: "浙江省",
                    label: "舟山市"
                }, {
                    prov: "浙江省",
                    label: "台州市"
                }, {
                    prov: "浙江省",
                    label: "丽水市"
                }, {
                    prov: "安徽省",
                    label: "合肥市"
                }, {
                    prov: "安徽省",
                    label: "芜湖市"
                }, {
                    prov: "安徽省",
                    label: "蚌埠市"
                }, {
                    prov: "安徽省",
                    label: "淮南市"
                }, {
                    prov: "安徽省",
                    label: "马鞍山市"
                }, {
                    prov: "安徽省",
                    label: "淮北市"
                }, {
                    prov: "安徽省",
                    label: "铜陵市"
                }, {
                    prov: "安徽省",
                    label: "安庆市"
                }, {
                    prov: "安徽省",
                    label: "黄山市"
                }, {
                    prov: "安徽省",
                    label: "滁州市"
                }, {
                    prov: "安徽省",
                    label: "阜阳市"
                }, {
                    prov: "安徽省",
                    label: "宿州市"
                }, {
                    prov: "安徽省",
                    label: "六安市"
                }, {
                    prov: "安徽省",
                    label: "亳州市"
                }, {
                    prov: "安徽省",
                    label: "池州市"
                }, {
                    prov: "安徽省",
                    label: "宣城市"
                }, {
                    prov: "福建省",
                    label: "福州市"
                }, {
                    prov: "福建省",
                    label: "厦门市"
                }, {
                    prov: "福建省",
                    label: "莆田市"
                }, {
                    prov: "福建省",
                    label: "三明市"
                }, {
                    prov: "福建省",
                    label: "泉州市"
                }, {
                    prov: "福建省",
                    label: "漳州市"
                }, {
                    prov: "福建省",
                    label: "南平市"
                }, {
                    prov: "福建省",
                    label: "龙岩市"
                }, {
                    prov: "福建省",
                    label: "宁德市"
                }, {
                    prov: "江西省",
                    label: "南昌市"
                }, {
                    prov: "江西省",
                    label: "景德镇市"
                }, {
                    prov: "江西省",
                    label: "萍乡市"
                }, {
                    prov: "江西省",
                    label: "九江市"
                }, {
                    prov: "江西省",
                    label: "新余市"
                }, {
                    prov: "江西省",
                    label: "鹰潭市"
                }, {
                    prov: "江西省",
                    label: "赣州市"
                }, {
                    prov: "江西省",
                    label: "吉安市"
                }, {
                    prov: "江西省",
                    label: "宜春市"
                }, {
                    prov: "江西省",
                    label: "抚州市"
                }, {
                    prov: "江西省",
                    label: "上饶市"
                }, {
                    prov: "山东省",
                    label: "济南市"
                }, {
                    prov: "山东省",
                    label: "青岛市"
                }, {
                    prov: "山东省",
                    label: "淄博市"
                }, {
                    prov: "山东省",
                    label: "枣庄市"
                }, {
                    prov: "山东省",
                    label: "东营市"
                }, {
                    prov: "山东省",
                    label: "烟台市"
                }, {
                    prov: "山东省",
                    label: "潍坊市"
                }, {
                    prov: "山东省",
                    label: "济宁市"
                }, {
                    prov: "山东省",
                    label: "泰安市"
                }, {
                    prov: "山东省",
                    label: "威海市"
                }, {
                    prov: "山东省",
                    label: "日照市"
                }, {
                    prov: "山东省",
                    label: "莱芜市"
                }, {
                    prov: "山东省",
                    label: "临沂市"
                }, {
                    prov: "山东省",
                    label: "德州市"
                }, {
                    prov: "山东省",
                    label: "聊城市"
                }, {
                    prov: "山东省",
                    label: "滨州市"
                }, {
                    prov: "山东省",
                    label: "菏泽市"
                }, {
                    prov: "河南省",
                    label: "郑州市"
                }, {
                    prov: "河南省",
                    label: "开封市"
                }, {
                    prov: "河南省",
                    label: "洛阳市"
                }, {
                    prov: "河南省",
                    label: "平顶山市"
                }, {
                    prov: "河南省",
                    label: "安阳市"
                }, {
                    prov: "河南省",
                    label: "鹤壁市"
                }, {
                    prov: "河南省",
                    label: "新乡市"
                }, {
                    prov: "河南省",
                    label: "焦作市"
                }, {
                    prov: "河南省",
                    label: "濮阳市"
                }, {
                    prov: "河南省",
                    label: "许昌市"
                }, {
                    prov: "河南省",
                    label: "漯河市"
                }, {
                    prov: "河南省",
                    label: "三门峡市"
                }, {
                    prov: "河南省",
                    label: "南阳市"
                }, {
                    prov: "河南省",
                    label: "商丘市"
                }, {
                    prov: "河南省",
                    label: "信阳市"
                }, {
                    prov: "河南省",
                    label: "周口市"
                }, {
                    prov: "河南省",
                    label: "驻马店市"
                }, {
                    prov: "河南省",
                    label: "省直辖县级行政区划"
                }, {
                    prov: "湖北省",
                    label: "武汉市"
                }, {
                    prov: "湖北省",
                    label: "黄石市"
                }, {
                    prov: "湖北省",
                    label: "十堰市"
                }, {
                    prov: "湖北省",
                    label: "宜昌市"
                }, {
                    prov: "湖北省",
                    label: "襄阳市"
                }, {
                    prov: "湖北省",
                    label: "鄂州市"
                }, {
                    prov: "湖北省",
                    label: "荆门市"
                }, {
                    prov: "湖北省",
                    label: "孝感市"
                }, {
                    prov: "湖北省",
                    label: "荆州市"
                }, {
                    prov: "湖北省",
                    label: "黄冈市"
                }, {
                    prov: "湖北省",
                    label: "咸宁市"
                }, {
                    prov: "湖北省",
                    label: "随州市"
                }, {
                    prov: "湖北省",
                    label: "恩施土家族苗族自治州"
                }, {
                    prov: "湖北省",
                    label: "省直辖县级行政区划"
                }, {
                    prov: "湖北省",
                    label: "仙桃市"
                }, {
                    prov: "湖北省",
                    label: "潜江市"
                }, {
                    prov: "湖北省",
                    label: "天门市"
                }, {
                    prov: "湖北省",
                    label: "神农架林区"
                }, {
                    prov: "湖南省",
                    label: "长沙市"
                }, {
                    prov: "湖南省",
                    label: "株洲市"
                }, {
                    prov: "湖南省",
                    label: "湘潭市"
                }, {
                    prov: "湖南省",
                    label: "衡阳市"
                }, {
                    prov: "湖南省",
                    label: "邵阳市"
                }, {
                    prov: "湖南省",
                    label: "岳阳市"
                }, {
                    prov: "湖南省",
                    label: "常德市"
                }, {
                    prov: "湖南省",
                    label: "张家界市"
                }, {
                    prov: "湖南省",
                    label: "益阳市"
                }, {
                    prov: "湖南省",
                    label: "郴州市"
                }, {
                    prov: "湖南省",
                    label: "永州市"
                }, {
                    prov: "湖南省",
                    label: "怀化市"
                }, {
                    prov: "湖南省",
                    label: "娄底市"
                }, {
                    prov: "湖南省",
                    label: "湘西土家族苗族自治州"
                }, {
                    prov: "广东省",
                    label: "广州市"
                }, {
                    prov: "广东省",
                    label: "韶关市"
                }, {
                    prov: "广东省",
                    label: "深圳市"
                }, {
                    prov: "广东省",
                    label: "珠海市"
                }, {
                    prov: "广东省",
                    label: "汕头市"
                }, {
                    prov: "广东省",
                    label: "佛山市"
                }, {
                    prov: "广东省",
                    label: "江门市"
                }, {
                    prov: "广东省",
                    label: "湛江市"
                }, {
                    prov: "广东省",
                    label: "茂名市"
                }, {
                    prov: "广东省",
                    label: "肇庆市"
                }, {
                    prov: "广东省",
                    label: "惠州市"
                }, {
                    prov: "广东省",
                    label: "梅州市"
                }, {
                    prov: "广东省",
                    label: "汕尾市"
                }, {
                    prov: "广东省",
                    label: "河源市"
                }, {
                    prov: "广东省",
                    label: "阳江市"
                }, {
                    prov: "广东省",
                    label: "清远市"
                }, {
                    prov: "广东省",
                    label: "东莞市"
                }, {
                    prov: "广东省",
                    label: "中山市"
                }, {
                    prov: "广东省",
                    label: "潮州市"
                }, {
                    prov: "广东省",
                    label: "揭阳市"
                }, {
                    prov: "广东省",
                    label: "云浮市"
                }, {
                    prov: "广西壮族自治区",
                    label: "南宁市"
                }, {
                    prov: "广西壮族自治区",
                    label: "柳州市"
                }, {
                    prov: "广西壮族自治区",
                    label: "桂林市"
                }, {
                    prov: "广西壮族自治区",
                    label: "梧州市"
                }, {
                    prov: "广西壮族自治区",
                    label: "北海市"
                }, {
                    prov: "广西壮族自治区",
                    label: "防城港市"
                }, {
                    prov: "广西壮族自治区",
                    label: "钦州市"
                }, {
                    prov: "广西壮族自治区",
                    label: "贵港市"
                }, {
                    prov: "广西壮族自治区",
                    label: "玉林市"
                }, {
                    prov: "广西壮族自治区",
                    label: "百色市"
                }, {
                    prov: "广西壮族自治区",
                    label: "贺州市"
                }, {
                    prov: "广西壮族自治区",
                    label: "河池市"
                }, {
                    prov: "广西壮族自治区",
                    label: "来宾市"
                }, {
                    prov: "广西壮族自治区",
                    label: "崇左市"
                }, {
                    prov: "海南省",
                    label: "海口市"
                }, {
                    prov: "海南省",
                    label: "三亚市"
                }, {
                    prov: "海南省",
                    label: "三沙市"
                }, {
                    prov: "海南省",
                    label: "省直辖县级行政区划"
                }, {
                    prov: "海南省",
                    label: "五指山市"
                }, {
                    prov: "海南省",
                    label: "琼海市"
                }, {
                    prov: "海南省",
                    label: "儋州市"
                }, {
                    prov: "海南省",
                    label: "文昌市"
                }, {
                    prov: "海南省",
                    label: "万宁市"
                }, {
                    prov: "海南省",
                    label: "东方市"
                }, {
                    prov: "海南省",
                    label: "定安县"
                }, {
                    prov: "海南省",
                    label: "屯昌县"
                }, {
                    prov: "海南省",
                    label: "澄迈县"
                }, {
                    prov: "海南省",
                    label: "临高县"
                }, {
                    prov: "海南省",
                    label: "白沙黎族自治县"
                }, {
                    prov: "海南省",
                    label: "昌江黎族自治县"
                }, {
                    prov: "海南省",
                    label: "乐东黎族自治县"
                }, {
                    prov: "海南省",
                    label: "陵水黎族自治县"
                }, {
                    prov: "海南省",
                    label: "保亭黎族苗族自治县"
                }, {
                    prov: "海南省",
                    label: "琼中黎族苗族自治县"
                }, {
                    prov: "重庆市",
                    label: "重庆市"
                }, {
                    prov: "四川省",
                    label: "成都市"
                }, {
                    prov: "四川省",
                    label: "自贡市"
                }, {
                    prov: "四川省",
                    label: "攀枝花市"
                }, {
                    prov: "四川省",
                    label: "泸州市"
                }, {
                    prov: "四川省",
                    label: "德阳市"
                }, {
                    prov: "四川省",
                    label: "绵阳市"
                }, {
                    prov: "四川省",
                    label: "广元市"
                }, {
                    prov: "四川省",
                    label: "遂宁市"
                }, {
                    prov: "四川省",
                    label: "内江市"
                }, {
                    prov: "四川省",
                    label: "乐山市"
                }, {
                    prov: "四川省",
                    label: "南充市"
                }, {
                    prov: "四川省",
                    label: "眉山市"
                }, {
                    prov: "四川省",
                    label: "宜宾市"
                }, {
                    prov: "四川省",
                    label: "广安市"
                }, {
                    prov: "四川省",
                    label: "达州市"
                }, {
                    prov: "四川省",
                    label: "雅安市"
                }, {
                    prov: "四川省",
                    label: "巴中市"
                }, {
                    prov: "四川省",
                    label: "资阳市"
                }, {
                    prov: "四川省",
                    label: "阿坝藏族羌族自治州"
                }, {
                    prov: "四川省",
                    label: "甘孜藏族自治州"
                }, {
                    prov: "四川省",
                    label: "凉山彝族自治州"
                }, {
                    prov: "贵州省",
                    label: "贵阳市"
                }, {
                    prov: "贵州省",
                    label: "六盘水市"
                }, {
                    prov: "贵州省",
                    label: "遵义市"
                }, {
                    prov: "贵州省",
                    label: "安顺市"
                }, {
                    prov: "贵州省",
                    label: "毕节市"
                }, {
                    prov: "贵州省",
                    label: "铜仁市"
                }, {
                    prov: "贵州省",
                    label: "黔西南布依族苗族自治州"
                }, {
                    prov: "贵州省",
                    label: "黔东南苗族侗族自治州"
                }, {
                    prov: "贵州省",
                    label: "黔南布依族苗族自治州"
                }, {
                    prov: "云南省",
                    label: "昆明市"
                }, {
                    prov: "云南省",
                    label: "曲靖市"
                }, {
                    prov: "云南省",
                    label: "玉溪市"
                }, {
                    prov: "云南省",
                    label: "保山市"
                }, {
                    prov: "云南省",
                    label: "昭通市"
                }, {
                    prov: "云南省",
                    label: "丽江市"
                }, {
                    prov: "云南省",
                    label: "普洱市"
                }, {
                    prov: "云南省",
                    label: "临沧市"
                }, {
                    prov: "云南省",
                    label: "楚雄彝族自治州"
                }, {
                    prov: "云南省",
                    label: "红河哈尼族彝族自治州"
                }, {
                    prov: "云南省",
                    label: "文山壮族苗族自治州"
                }, {
                    prov: "云南省",
                    label: "西双版纳傣族自治州"
                }, {
                    prov: "云南省",
                    label: "大理白族自治州"
                }, {
                    prov: "云南省",
                    label: "德宏傣族景颇族自治州"
                }, {
                    prov: "云南省",
                    label: "怒江傈僳族自治州"
                }, {
                    prov: "云南省",
                    label: "迪庆藏族自治州"
                }, {
                    prov: "西藏自治区",
                    label: "拉萨市"
                }, {
                    prov: "西藏自治区",
                    label: "昌都地区"
                }, {
                    prov: "西藏自治区",
                    label: "山南地区"
                }, {
                    prov: "西藏自治区",
                    label: "日喀则地区"
                }, {
                    prov: "西藏自治区",
                    label: "那曲地区"
                }, {
                    prov: "西藏自治区",
                    label: "阿里地区"
                }, {
                    prov: "西藏自治区",
                    label: "林芝地区"
                }, {
                    prov: "陕西省",
                    label: "西安市"
                }, {
                    prov: "陕西省",
                    label: "铜川市"
                }, {
                    prov: "陕西省",
                    label: "宝鸡市"
                }, {
                    prov: "陕西省",
                    label: "咸阳市"
                }, {
                    prov: "陕西省",
                    label: "渭南市"
                }, {
                    prov: "陕西省",
                    label: "延安市"
                }, {
                    prov: "陕西省",
                    label: "汉中市"
                }, {
                    prov: "陕西省",
                    label: "榆林市"
                }, {
                    prov: "陕西省",
                    label: "安康市"
                }, {
                    prov: "陕西省",
                    label: "商洛市"
                }, {
                    prov: "甘肃省",
                    label: "兰州市"
                }, {
                    prov: "甘肃省",
                    label: "嘉峪关市"
                }, {
                    prov: "甘肃省",
                    label: "金昌市"
                }, {
                    prov: "甘肃省",
                    label: "白银市"
                }, {
                    prov: "甘肃省",
                    label: "天水市"
                }, {
                    prov: "甘肃省",
                    label: "武威市"
                }, {
                    prov: "甘肃省",
                    label: "张掖市"
                }, {
                    prov: "甘肃省",
                    label: "平凉市"
                }, {
                    prov: "甘肃省",
                    label: "酒泉市"
                }, {
                    prov: "甘肃省",
                    label: "庆阳市"
                }, {
                    prov: "甘肃省",
                    label: "定西市"
                }, {
                    prov: "甘肃省",
                    label: "陇南市"
                }, {
                    prov: "甘肃省",
                    label: "临夏回族自治州"
                }, {
                    prov: "甘肃省",
                    label: "甘南藏族自治州"
                }, {
                    prov: "青海省",
                    label: "西宁市"
                }, {
                    prov: "青海省",
                    label: "海东市"
                }, {
                    prov: "青海省",
                    label: "海北藏族自治州"
                }, {
                    prov: "青海省",
                    label: "黄南藏族自治州"
                }, {
                    prov: "青海省",
                    label: "海南藏族自治州"
                }, {
                    prov: "青海省",
                    label: "果洛藏族自治州"
                }, {
                    prov: "青海省",
                    label: "玉树藏族自治州"
                }, {
                    prov: "青海省",
                    label: "海西蒙古族藏族自治州"
                }, {
                    prov: "宁夏回族自治区",
                    label: "银川市"
                }, {
                    prov: "宁夏回族自治区",
                    label: "石嘴山市"
                }, {
                    prov: "宁夏回族自治区",
                    label: "吴忠市"
                }, {
                    prov: "宁夏回族自治区",
                    label: "固原市"
                }, {
                    prov: "宁夏回族自治区",
                    label: "中卫市"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "乌鲁木齐市"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "克拉玛依市"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "吐鲁番地区"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "哈密地区"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "昌吉回族自治州"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "博尔塔拉蒙古自治州"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "巴音郭楞蒙古自治州"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "阿克苏地区"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "克孜勒苏柯尔克孜自治州"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "喀什地区"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "和田地区"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "伊犁哈萨克自治州"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "塔城地区"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "阿勒泰地区"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "自治区直辖县级行政区划"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "石河子市"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "阿拉尔市"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "图木舒克市"
                }, {
                    prov: "新疆维吾尔自治区",
                    label: "五家渠市"
                }, {
                    prov: "台湾省",
                    label: "台北市"
                }, {
                    prov: "台湾省",
                    label: "高雄市"
                }, {
                    prov: "台湾省",
                    label: "基隆市"
                }, {
                    prov: "台湾省",
                    label: "台中市"
                }, {
                    prov: "台湾省",
                    label: "台南市"
                }, {
                    prov: "台湾省",
                    label: "新竹市"
                }, {
                    prov: "台湾省",
                    label: "嘉义市"
                }, {
                    prov: "台湾省",
                    label: "省直辖"
                }, {
                    prov: "香港特别行政区",
                    label: "香港岛"
                }, {
                    prov: "香港特别行政区",
                    label: "九龙"
                }, {
                    prov: "香港特别行政区",
                    label: "新界"
                }, {
                    prov: "澳门特别行政区",
                    label: "澳门半岛"
                }, {
                    prov: "澳门特别行政区",
                    label: "澳门离岛"
                }, {
                    prov: "澳门特别行政区",
                    label: "无堂区划分区域"
                }];
                for (var val of allCity){
                    if (prov == val.prov){
                        //console.log(val);
                        tempCity.push({label: val.label, value: val.label})
                    }
                }
                this.citys = tempCity;
            },
            getCity: function (city) {
                //console.log(city);
                //console.log(this.selectCity)
            },
            getTableData(){
                let _this=this;
                axios.get('/api/v1/org/list',{
                    params:{
                      pageNumber:this.currentPage,
                      pageSize:this.pageSize,
                      province:this.selectProv,
                      city:this.selectCity,
                      customer_name:this.type_word,
                      customer_type:this.typeValue
                    }
                  }).then(function (response) {
                     let arr=response.data.data.orgList
                     //console.log(arr)
                     _this.tableData=[]
                     if(arr.length>0){
                       arr.forEach(item => {
                         let tableObj={}
                         tableObj.account_sign=item.account_sign
                         tableObj.city=item.city
                         tableObj.contact=item.contact
                         tableObj.create_time=item.create_time
                         tableObj.customer_name=item.customer_name
                         if(item.customer_type==1){
                            tableObj.customer_type='正式'
                         }else{
                           tableObj.customer_type='试用'
                         }
                         tableObj.dept=item.dept
                         tableObj.email=item.email
                         tableObj.id=item.id
                         tableObj.phone=item.phone
                         tableObj.province=item.province
                         tableObj.remark=item.remark
                         tableObj.sign_type=item.sign_type
                         tableObj.sys_sign=item.sys_sign
                         tableObj.clientsign=item.clientsign
                         _this.tableData.push(tableObj)
                       })
                       _this.peopleCount=response.data.data.total
                     }else{
                       _this.tableData=[]
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
            //省 下拉框
            provinceData(){
              let _this=this;
              axios.get('/api/v1/org/province/list',{
                  params:{

                  }
                }).then(function (response) {
                  let arr=response.data.data
                  let newArr=[{'value':'','label':'地域(省)选择'}]
                  if(arr.length>0){
                    for(var i=0;i<arr.length;i++){
                      let obj={}
                      obj.value=arr[i]
                      obj.label=arr[i]
                      newArr.push(obj)
                    }
                  }
                  _this.province0ptions=newArr
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
            //市 下拉框
            cityData(){
              let _this=this;
              axios.get('/api/v1/org/city/list',{
                  params:{

                  }
                }).then(function (response) {
                  let arr=response.data.data
                  let newArr=[{'value':'','label':'地域(市)选择'}]
                  if(arr.length>0){
                    for(var i=0;i<arr.length;i++){
                      let obj={}
                      obj.value=arr[i]
                      obj.label=arr[i]
                      newArr.push(obj)
                    }
                  }
                  _this.areaOptions=newArr
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
            peoplehandleSizeChange(val) {

            },
            peoplehandleCurrentChange(val) {
                this.currentPage = val
                this.getTableData()
            },
            search() {
              this.currentPage=1
              this.getTableData()
            },
            //新建单个
            newSingle(formName){
              this.$router.push({ path: 'organizationAdd'})
            },
            //点击导入
            exportAll(index, row){
              this.exportVisible=true
            },
            //导入模态框-取消
            exportCancel(){
              this.exportVisible=false
              this.file=''
            },

            getFile(event) {
              this.file = event.target.files[0];
              //console.log(this.file);
            },
            //导出模态框-确定
            exportConfirm(event) {
              let _this=this
              event.preventDefault();
              let formData = new FormData();
              formData.append('file', this.file);

              let config = {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }

              axios.post('/api/v1/org/import', formData, config).then(function (res) {
                //console.log(res.data.errorCode)
                if(res.data.errorCode=='0'){
                  _this.currentPage=1
                  _this.typeValue=''
                  _this.selectCity=''
                  _this.selectProv=''
                  _this.type_word=''
                  _this.getTableData()
                  _this.$refs.pathClear.value =''
                  _this.exportVisible=false
                  _this.$message({
                    type: 'success',
                    message: '导入成功!'
                  })

                }else{
                  _this.$refs.pathClear.value =''
                  _this.exportVisible=false
                  _this.$message.error(res.data.errorMessage)
                }

              })
            },
            //导入模板下载
            exportDownload(){
              let _this=this
              this.$confirm('此操作将会下载组织管理模板, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                axios({
                    method: 'post',
                    url: '/api/v1/org/excel/download',
                    responseType: 'blob'
                }).then(response => {
                    this.download(response.data)
                }).catch((error) => {
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

            // 下载文件
            download (data) {
                if (!data) {
                    return
                }
                let url = window.URL.createObjectURL(new Blob([data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', '组织管理模板.xlsx')

                document.body.appendChild(link)
                link.click()
            },
            //批量删除
            delAll(){
              let _this=this
              let ids=''
              for(var obj of this.multipleSelection){
                ids+=obj.id+','
              }
              if(ids.length>0){
                  this.$confirm('请确认是否删除组织?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    axios.get('/api/v1/org/del',{
                        params:{
                          ids:ids.substr(0,ids.length-1)
                        }
                      }).then(function (response) {
                            _this.currentPage=1
                            _this.typeValue=''
                            _this.selectCity=''
                            _this.selectProv=''
                            _this.type_word=''
                            _this.getTableData()
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
              }else{
                this.$message({
                  showClose: true,
                  message: '请选择一个组织进行操作',
                  type: 'error'
                });
              }
            },
            handleSelectionChange(val) {
              this.multipleSelection = val
            },
            handleCurrentChange(val) {

            },
            //编辑单个
            handleEdit(index, row){
              this.$router.push({ path: 'organizationEdit', query: {
                  id:row.id,
                  customer_name: row.customer_name,
                  customer_type: row.customer_type,
                  sys_sign: row.sys_sign,
                  account_sign:row.account_sign,
                  province:row.province,
                  city:row.city,
                  contact:row.contact,
                  dept:row.dept,
                  phone:row.phone,
                  email:row.email,
                  remark:row.remark,
                  sign_type:row.sign_type,
                  clientsign:row.clientsign
                }
              })

            },
            //点击产品授权
            handleMenu(index, row){
              this.$router.push({ path: 'productImpower', query: {
                  'clientName': row.customer_name,
                  'clientId':row.id
                }
              })
            },
            //点击部门管理
            handleDepart(index, row){
              this.$router.push({ path: 'departmentList', query: {
                  'id':row.id
                }
              })
            },
            //页面设置
            handlePageSet(index, row){
              this.$router.push({ path: 'pageSet', query: {
                  'id':row.id
                }
              })
            }
        }
    }

</script>

<style scoped>
  .handle-export{
    position:absolute;
    right:160px;
    top:6px;
    padding: 4px 6px;
  }
  .handle-exportDownload{
    position:absolute;
    right:220px;
    top:6px;
    padding: 4px 6px;
  }
</style>
