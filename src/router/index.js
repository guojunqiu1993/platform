import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/menus/menu'
        },
        {
          path: '/useChoose',
          component: resolve => require(['../components/common/useChoose.vue'], resolve),
          meta: { title: '统一平台选择' },
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[

                {
                    path: '/menuManagement',
                    component: resolve => require(['../components/page/menus/menu.vue'], resolve),
                    meta: { title: '菜单管理' }
                },
                {
                    path: '/productManagement',
                    component: resolve => require(['../components/page/product/product.vue'], resolve),
                    meta: { title: '产品管理' }
                },
                {
                    path: '/productAdd',
                    component: resolve => require(['../components/page/product/children/productAdd.vue'], resolve),
                    meta: { title: '产品管理新建' }
                },
                {
                    path: '/productEdit',
                    component: resolve => require(['../components/page/product/children/productEdit.vue'], resolve),
                    meta: { title: '产品管理编辑' }
                },
                {
                    path: '/menuSet',
                    component: resolve => require(['../components/page/product/children/menuSet.vue'], resolve),
                    meta: { title: '产品管理-菜单设置' }
                },
                {
                    path: '/dictionaryManagement',
                    component: resolve => require(['../components/page/dictionary/dictionary.vue'], resolve),
                    meta: { title: '字典管理' }
                },
                {
                    path: '/dictionaryEdit',
                    component: resolve => require(['../components/page/dictionary/children/dictionaryEdit.vue'], resolve),
                    meta: { title: '字典管理编辑' }
                },
                {
                    path: '/dictionaryAdd',
                    component: resolve => require(['../components/page/dictionary/children/dictionaryAdd.vue'], resolve),
                    meta: { title: '字典管理添加' }
                },
                {
                    path: '/maintainList',
                    component: resolve => require(['../components/page/dictionary/children/maintainList.vue'], resolve),
                    meta: { title: '字典维护列表' }
                },
                {
                    path: '/maintainAdd',
                    component: resolve => require(['../components/page/dictionary/children/maintainAdd.vue'], resolve),
                    meta: { title: '字典维护添加' }
                },
                {
                    path: '/maintainEdit',
                    component: resolve => require(['../components/page/dictionary/children/maintainEdit.vue'], resolve),
                    meta: { title: '字典维护编辑' }
                },
                {
                    path: '/organizationManagement',
                    component: resolve => require(['../components/page/organization/organization.vue'], resolve),
                    meta: { title: '组织管理' }
                },
                {
                    path: '/organizationAdd',
                    component: resolve => require(['../components/page/organization/children/organizationAdd.vue'], resolve),
                    meta: { title: '组织添加' }
                },
                {
                    path: '/organizationEdit',
                    component: resolve => require(['../components/page/organization/children/organizationEdit.vue'], resolve),
                    meta: { title: '组织编辑' }
                },
                {
                    path: '/productImpower',
                    component: resolve => require(['../components/page/organization/children/productImpower.vue'], resolve),
                    meta: { title: '产品授权' }
                },
                {
                    path: '/pageSet',
                    component: resolve => require(['../components/page/organization/children/pageSet.vue'], resolve),
                    meta: { title: '页面设置' }
                },
                {
                    path: '/departmentList',
                    component: resolve => require(['../components/page/organization/children/departmentList.vue'], resolve),
                    meta: { title: '部门管理' }
                },
                {
                    path: '/departmentAdd',
                    component: resolve => require(['../components/page/organization/children/departmentAdd.vue'], resolve),
                    meta: { title: '部门管理-新建' }
                },
                {
                    path: '/departmentEdit',
                    component: resolve => require(['../components/page/organization/children/departmentEdit.vue'], resolve),
                    meta: { title: '部门管理-编辑' }
                },
                {
                    path: '/impowerAdd',
                    component: resolve => require(['../components/page/organization/children/impowerAdd.vue'], resolve),
                    meta: { title: '产品授权添加' }
                },
                {
                    path: '/impowerEdit',
                    component: resolve => require(['../components/page/organization/children/impowerEdit.vue'], resolve),
                    meta: { title: '产品授权编辑' }
                },
                {
                    path: '/dictionaryList',
                    component: resolve => require(['../components/page/organization/children/dictionaryList.vue'], resolve),
                    meta: { title: '产品授权-字典管理' }
                },
                {
                    path: '/dictionaryOrlAdd',
                    component: resolve => require(['../components/page/organization/children/dictionaryOrlAdd.vue'], resolve),
                    meta: { title: '组织管理-字典管理-添加' }
                },
                {
                    path: '/roleManagement',
                    component: resolve => require(['../components/page/role/role.vue'], resolve),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/roleMenu',
                    component: resolve => require(['../components/page/role/children/roleMenu.vue'], resolve),
                    meta: { title: '菜单授权' }
                },
                {
                    path: '/roleAdd',
                    component: resolve => require(['../components/page/role/children/roleAdd.vue'], resolve),
                    meta: { title: '角色添加' }
                },
                {
                    path: '/roleEdit',
                    component: resolve => require(['../components/page/role/children/roleEdit.vue'], resolve),
                    meta: { title: '角色编辑' }
                },
                {
                    path: '/accountManagement',
                    component: resolve => require(['../components/page/account/account.vue'], resolve),
                    meta: { title: '账号管理' }
                },
                {
                    path: '/accountAdd',
                    component: resolve => require(['../components/page/account/children/accountAdd.vue'], resolve),
                    meta: { title: '账号添加' }
                },
                {
                    path: '/accountEdit',
                    component: resolve => require(['../components/page/account/children/accountEdit.vue'], resolve),
                    meta: { title: '账号编辑' }
                },

                {
                    path: '/operateLog',
                    component: resolve => require(['../components/page/operate/operateLog.vue'], resolve),
                    meta: { title: '操作行为日志' }
                },
                {
                    path: '/messageLog',
                    component: resolve => require(['../components/page/message/messageLog.vue'], resolve),
                    meta: { title: '消息发送日志' }
                },
                {
                    path: '/passwordSet',
                    component: resolve => require(['../components/common/passwordSet.vue'], resolve),
                    meta: { title: '个人中心' }
                },

                // dms
                {
                    path: '/newPublic',
                    component: resolve => require(['../components/page/newPublic/newPublic.vue'], resolve),
                    meta: { title: '最新舆情' }
                },
                {
                    path: '/newPublicAdd',
                    component: resolve => require(['../components/page/newPublic/children/newPublicAdd.vue'], resolve),
                    meta: { title: '最新舆情-添加' }
                },
                {
                    path: '/newPublicDetails',
                    component: resolve => require(['../components/page/newPublic/children/newPublicDetails.vue'], resolve),
                    meta: { title: '最新舆情-详情' }
                },
                {
                    path: '/performanceTest',
                    component: resolve => require(['../components/page/newPublic/children/performanceTest.vue'], resolve),
                    meta: { title: '最新舆情-绩效考核demo' }
                },
                {
                    path: '/publicOpinion',
                    component: resolve => require(['../components/page/publicOpinion/publicOpinion.vue'], resolve),
                    meta: { title: '舆情处置' }
                },
                {
                    path: '/publicOpinionDetails',
                    component: resolve => require(['../components/page/publicOpinion/children/publicOpinionDetails.vue'], resolve),
                    meta: { title: '舆情处置-详情' }
                },
                {
                    path: '/publicOpinionEdit',
                    component: resolve => require(['../components/page/publicOpinion/children/publicOpinionEdit.vue'], resolve),
                    meta: { title: '舆情处置-编辑' }
                },
                {
                    path: '/publicOpinionAddtion',
                    component: resolve => require(['../components/page/publicOpinion/children/publicOpinionAddtion.vue'], resolve),
                    meta: { title: '舆情处置-追加' }
                },
                {
                    path: '/auditReport',
                    component: resolve => require(['../components/page/auditReport/auditReport.vue'], resolve),
                    meta: { title: '舆情交流-审核上报' }
                },
                {
                    path: '/auditReportDetails',
                    component: resolve => require(['../components/page/auditReport/children/auditReportDetails.vue'], resolve),
                    meta: { title: '审核上报-上报详情' }
                },
                {
                    path: '/publicReport',
                    component: resolve => require(['../components/page/publicReport/publicReport.vue'], resolve),
                    meta: { title: '舆情交流-上报舆情' }
                },
                {
                    path: '/publicReportAdd',
                    component: resolve => require(['../components/page/publicReport/children/publicReportAdd.vue'], resolve),
                    meta: { title: '上报舆情-新增上报' }
                },
                {
                    path: '/publicReportDetails',
                    component: resolve => require(['../components/page/publicReport/children/publicReportDetails.vue'], resolve),
                    meta: { title: '上报舆情-上报详情' }
                },
                {
                    path: '/publicDispose',
                    component: resolve => require(['../components/page/publicDispose/publicDispose.vue'], resolve),
                    meta: { title: '舆情处理' }
                },
                {
                    path: '/publicDisposeDetails',
                    component: resolve => require(['../components/page/publicDispose/children/publicDisposeDetails.vue'], resolve),
                    meta: { title: '舆情处理-处理详情' }
                },
                {
                    path: '/performanceAdmin',
                    component: resolve => require(['../components/page/performanceAdmin/performanceAdmin.vue'], resolve),
                    meta: { title: '绩效考核-管理员' }
                },
                {
                    path: '/standingAdmin',
                    component: resolve => require(['../components/page/performanceAdmin/children/standingAdmin.vue'], resolve),
                    meta: { title: '绩效考核-管理员(考核台账)' }
                },
                {
                    path: '/informationAudition',
                    component: resolve => require(['../components/page/performanceAdmin/children/informationAudition.vue'], resolve),
                    meta: { title: '绩效考核-管理员(资料审核)' }
                },
                {
                    path: '/informationAuditionEdit',
                    component: resolve => require(['../components/page/performanceAdmin/children/informationAuditionEdit.vue'], resolve),
                    meta: { title: '绩效考核-管理员(资料审核-审核)' }
                },
                {
                    path: '/assessEdit',
                    component: resolve => require(['../components/page/performanceAdmin/children/assessEdit.vue'], resolve),
                    meta: { title: '绩效考核-管理员(考核表修改)' }
                },
                {
                    path: '/performanceSpoke',
                    component: resolve => require(['../components/page/performanceSpoke/performanceSpoke.vue'], resolve),
                    meta: { title: '绩效考核-发言人' }
                },
                {
                    path: '/standingSpoke',
                    component: resolve => require(['../components/page/performanceSpoke/children/standingSpoke.vue'], resolve),
                    meta: { title: '绩效考核-发言人(考核台账)' }
                },
                {
                    path: '/filesUpload',
                    component: resolve => require(['../components/page/performanceSpoke/children/filesUpload.vue'], resolve),
                    meta: { title: '绩效考核-发言人(文件上传)' }
                },
                {
                    path: '/uploadAdd',
                    component: resolve => require(['../components/page/performanceSpoke/children/uploadAdd.vue'], resolve),
                    meta: { title: '绩效考核-发言人(文件上传-上传)' }
                },
                {
                    path: '/uploadOpinion',
                    component: resolve => require(['../components/page/performanceSpoke/children/uploadOpinion.vue'], resolve),
                    meta: { title: '绩效考核-发言人(文件上传-操作)' }
                },
                {
                    path: '/inspectionConfig',
                    component: resolve => require(['../components/page/inspectionConfig/inspectionConfig.vue'], resolve),
                    meta: { title: '考核配置' }
                },
                {
                    path: '/inspectionConfigAdd',
                    component: resolve => require(['../components/page/inspectionConfig/children/inspectionConfigAdd.vue'], resolve),
                    meta: { title: '考核配置-制度名称添加' }
                },
                {
                    path: '/inspectionConfigEdit',
                    component: resolve => require(['../components/page/inspectionConfig/children/inspectionConfigEdit.vue'], resolve),
                    meta: { title: '考核配置-制度名称编辑' }
                },
                {
                    path: '/inspectionPreview',
                    component: resolve => require(['../components/page/inspectionConfig/children/inspectionPreview.vue'], resolve),
                    meta: { title: '考核配置-预览' }
                },
                {
                    path: '/inspectionItem',
                    component: resolve => require(['../components/page/inspectionConfig/children/inspectionItem.vue'], resolve),
                    meta: { title: '考核配置-考核项' }
                },
                {
                    path: '/inspectionRules',
                    component: resolve => require(['../components/page/inspectionConfig/children/inspectionRules.vue'], resolve),
                    meta: { title: '考核配置-考核规则' }
                },
                {
                    path: '/statisticAnalysis',
                    component: resolve => require(['../components/page/statisticAnalysis/statisticAnalysis.vue'], resolve),
                    meta: { title: '统计分析'}
                },
                {
                    path: '/statisticChart',
                    component: resolve => require(['../components/page/statisticAnalysis/children/statisticChart.vue'], resolve),
                    meta: { title: '统计分析-表格'}
                }

            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        }
    ]
})
