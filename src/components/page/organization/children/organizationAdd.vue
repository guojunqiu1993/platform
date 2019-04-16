<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="iconfont icon-shouye"></i> 组织管理</el-breadcrumb-item>
                <el-breadcrumb-item>基本信息新建</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <el-form class="commonForm"   label-width="110px" :model="formData" ref="formData" :rules="formrules">
            <el-form-item label="客户标识" prop="clientsign">
              <el-select v-model="formData.clientsign" placeholder="请选择">
                  <el-option
                    v-for="item in legalOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户名称" prop="customer_name">
              <el-input v-model="formData.customer_name"></el-input>
            </el-form-item>
            <el-form-item label="客户类型" prop="customer_type">
              <el-select v-model="formData.customer_type" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标识类型" prop="sign_type">
              <el-select v-model="formData.sign_type" placeholder="请选择">
                  <el-option
                    v-for="item in signOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="系统标识" prop="sys_sign">
              <el-input v-model="formData.sys_sign"></el-input>
            </el-form-item>
            <el-form-item label="账号标识" prop="account_sign">
              <el-input v-model="formData.account_sign"></el-input>
            </el-form-item>
            <!-- <el-form-item label="所在地域(省)" prop="province">
              <el-select v-model="formData.province" placeholder="请选择">
                  <el-option
                    v-for="item in province0ptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所在地域(市)" prop="city">
              <el-select v-model="formData.city" placeholder="请选择">
                  <el-option
                    v-for="item in areaOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="所在地域(省)" prop='province'>
              <el-select size="small"
                         v-model="formData.province"
                         placeholder="请选择省份"
                         v-on:change="getProv($event)">
                  <el-option
                          v-for="item in provs"
                          :key="item.index"
                          :label="item.label"
                          :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所在地域(市)" prop='city'>
              <el-select size="small"
                         v-model="formData.city"
                         placeholder="请选择城市"
                         v-on:change="getCity($event)">
                  <el-option
                          v-for="item in citys"
                          :key="item.index"
                          :label="item.label"
                          :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系人" prop='contact'>
              <el-input v-model="formData.contact"></el-input>
            </el-form-item>
            <el-form-item label="部门身份" prop="dept">
              <el-input v-model="formData.dept"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入座机或11位手机号码"></el-input>
            </el-form-item>
            <el-form-item label="电子邮件" prop="email">
              <el-input v-model="formData.email"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" type="textarea"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="common-btns">
          <el-button type="primary" @click="saveCancel('formData')">保存</el-button>
          <el-button @click="addCancel()">取消</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    // import instance1 from '../../../common/axiosv1'
    export default {
        name: 'productAdd',
        data: function(){
            var validateEmail = (rule, value, callback) => {
                if (value !== '') {
                  var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                  if(!reg.test(value)){
                    callback(new Error('请输入有效的邮箱'));
                  }else{
                    callback();
                  }

                }else{
                  callback();
                }

            }
            var validatePhone = (rule, value, callback) => {
                if (value !== '') {
                  var reg=/^1[3456789]\d{9}$/
                  var isPhone = /^(\d3,4|\d{3,4}-)?\d{7,8}$/
                  if(isPhone.test(value) || reg.test(value) ){
                    callback()
                  }else{
                    callback(new Error('请输入有效的手机号码或固话'))
                  }
                }else{
                  callback();
                }

            }
            var validatecusName = (rule, value, callback) => {
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
                    callback(new Error('请输入20个字符以内的客户名称'))
                  }
                }else{
                  callback(new Error('请输入客户名称'))
                }
            }
            var validateAccountSign = (rule, value, callback) => {
                if (value !== '') {
                  let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                  let mat = value.match(cnReg);
                  let lengths
                  if(mat){
                     lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                  }else{
                    lengths=value.length
                  }
                  if(lengths>0&&lengths<11 ){
                    callback()
                  }else{
                    callback(new Error('请输入10个字符以内的账号标识'))
                  }
                }else{
                  callback(new Error('请输入账号标识'))
                }
            }
            var validateContact = (rule, value, callback) => {
                if (value !== '') {
                  let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                  let mat = value.match(cnReg);
                  let lengths
                  if(mat){
                     lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                  }else{
                    lengths=value.length
                  }
                  if(lengths>0&&lengths<11 ){
                    callback()
                  }else{
                    callback(new Error('请输入10个字符以内的联系人'))
                  }
                }else{
                  callback()
                }
            }
            var validatedept = (rule, value, callback) => {
                if (value !== '') {
                  let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
                  let mat = value.match(cnReg);
                  let lengths
                  if(mat){
                     lengths=(mat.length + (value.length - mat.length) * 0.5)*2
                  }else{
                    lengths=value.length
                  }
                  if(lengths>0&&lengths<11 ){
                    callback()
                  }else{
                    callback(new Error('请输入10个字符以内的部门身份'))
                  }
                }else{
                  callback()
                }
            }
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
                customer_name: '',
                customer_type: '',
                sys_sign: '',
                account_sign:'',
                province:'',
                city:'',
                contact:'',
                dept:'',
                phone:'',
                email:'',
                remark:'',
                sign_type:'',
                clientsign:''
              },
              formrules: {
                  clientsign: [
                    { required: true, message: '请输入客户标识', trigger: 'change' }
                  ],
        		      customer_name: [
        						{ required: true, validator: validatecusName, trigger: 'blur' }
        					],
                  customer_type: [
        						{ required: true, message: '请输入客户类型', trigger: 'change' }
        					],
                  sys_sign: [
        						{ required: true, message: '请输入系统标识', trigger: 'blur' }
        					],
                  account_sign: [
        						{ required: true, validator: validateAccountSign, trigger: 'blur' }
        					],
                  province: [
        						{ required: true, message: '请输入所在地域(省)', trigger: 'change' }
        					],
                  city: [
        						{ required: true, message: '请输入所在地域(市)', trigger: 'change' }
        					],
                  sign_type: [
        						{ required: true, message: '请输入标识类型', trigger: 'change' }
        					],
                  email: [
        						{required: false, validator: validateEmail, trigger: 'blur' }
        					],
                  phone: [
        						{required: false, validator: validatePhone, trigger: 'blur' }
        					],
                  contact:{ required: false, validator: validateContact, trigger: 'blur' },
                  dept:{ required: false, validator: validatedept, trigger: 'blur' },
                  remark:{ required: false, validator: validateremark, trigger: 'blur' }
        		  },
              options: [{
                label:'请选择',
                value:''
              },{
                label:'正式',
                value:'1'
              },{
                label:'试用',
                value:'0'
              }],
              signOptions:[{
                label:'请选择',
                value:''
              },{
                label:'标准',
                value:'标准'
              },{
                label:'个性',
                value:'个性'
              }],
              // province0ptions: [],
              // areaOptions:[],
              legalOptions:[],
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
                citys: []

            }
        },
        created() {
          // this.provinceData()
          // this.cityData()
          this.legalData()
        },
        methods: {
          /*二级联动选择地区*/
            getProv: function (prov) {
                let tempCity=[];             
                this.citys=[];
                this.formData.city='';               
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
          saveCancel(formName){
            let _this=this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  axios.post('/api/v1/org/add', {
                    customer_name: _this.formData.customer_name,
                    customer_type: _this.formData.customer_type,
                    sys_sign: _this.formData.sys_sign,
                    account_sign:_this.formData.account_sign,
                    province:_this.formData.province,
                    city:_this.formData.city,
                    contact:_this.formData.contact,
                    dept:_this.formData.dept,
                    phone:_this.formData.phone,
                    email:_this.formData.email,
                    remark:_this.formData.remark,
                    sign_type:_this.formData.sign_type,
                    clientsign:_this.formData.clientsign
                  })
                  .then(function (response) {
                    _this.$refs[formName].resetFields();
                    _this.$router.push({ path: 'organizationManagement'})
                    _this.$message({
                      type: 'success',
                      message: '添加成功!'
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

          addCancel(){
            this.$router.push({ path: 'organizationManagement'})
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
          //客户标识
          legalData(){
            let _this=this
            axios.get('/api/v1/account/clientsign/list',{
                params:{

                }
              }).then(function (response) {
                 let arr=response.data.data
                 //console.log(arr)
                 let newArr=[{'value':'','label':'请选择客户标识'}]
                 if(arr.length>0){
                   for(var i=0;i<arr.length;i++){
                     let obj={}
                     obj.value=arr[i].clientSign
                     obj.label=arr[i].clientSign
                     newArr.push(obj)
                   }
                 }
                 _this.legalOptions=newArr
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

        }

    }
</script>
<style scoped>

</style>
