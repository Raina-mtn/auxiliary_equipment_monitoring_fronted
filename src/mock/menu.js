export default [
    {
        alwaysShow: true,
        label: "首页",
        path: "index",
        component: "/views/home/home.vue",
    },
    {
        alwaysShow: true,
        icon: "el-icon-my-robot",
        label: "智能辅助",
        path: "intelliAuxiliary",
        component: "/views/Parent.vue",
        children: [
            {
                alwaysShow: true,
                label: "动环监控",
                path: "dynamicEnviMonitor",
                component: "/views/intelliAuxiliary/dynamicEnviMonitor/index.vue"
            }, {
                alwaysShow: true,
                label: "流媒体管理",
                path: "streamManage",
                component: "/views/intelliAuxiliary/streamManage/index.vue"
            }, {
                alwaysShow: true,
                label: "实时视频",
                path: "realtimeMonitor",
                component: "/views/intelliAuxiliary/realtimeMonitor/index.vue"
            }, {
                alwaysShow: true,
                label: "历史回放",
                path: "historyMonitor",
                component: "/views/intelliAuxiliary/historyMonitor/index.vue"
            },
        ]
    },
    {
        alwaysShow: true,
        icon: "el-icon-my-robot",
        label: "运行监测",
        path: "runMonitor",
        component: "/views/Parent.vue",
        children: [{
            alwaysShow: true,
            label: "三维展示",
            path: "display3D",
            component: "/views/realTimeMonitor/display3D/index.vue"
        }, {
            alwaysShow: true,
            label: "在线监测",
            path: "onlineMonitor",
            component: "/views/realTimeMonitor/onlineMonitor/index.vue"
        },]
    },
    {
        alwaysShow: true,
        icon: "el-icon-my-robot",
        label: "告警中心",
        path: "taskCenter",
        component: "/views/Parent.vue",
        children: [{
            alwaysShow: true,
            label: "告警列表",
            path: "warningList",
            component: "/views/taskCenter/index.vue"
        },]
    },
    {
        alwaysShow: true,
        icon: "el-icon-my-robot",
        label: "安全防范",
        path: "patrolResult",
        component: "/views/Parent.vue",
        children: [{
            alwaysShow: true,
            label: "消防",
            path: "fireFight",
            component: "/views/patrolResult/fireFight/index.vue"
        }, {
            alwaysShow: true,
            label: "锁控",
            path: "lockControl",
            component: "/views/patrolResult/lockControl/index.vue"
        }, {
            alwaysShow: true,
            label: "门禁",
            path: "accessControl",
            component: "/views/patrolResult/accessControl/index.vue"
        }, {
            alwaysShow: true,
            label: "电子围栏",
            path: "Fence",
            component: "/views/patrolResult/Fence/index.vue"
        }, {
            alwaysShow: true,
            label: "防盗报警主机",
            path: "alarmHost",
            component: "/views/patrolResult/alarmHost/index.vue"
        }, {
            alwaysShow: true,
            label: "红外对射",
            path: "Correlation",
            component: "/views/patrolResult/Correlation/index.vue"
        }, {
            alwaysShow: true,
            label: "红外双鉴",
            path: "Differentiate",
            component: "/views/patrolResult/Differentiate/index.vue"
        }, {
            alwaysShow: true,
            label: "反无人机防御",
            path: "antiDrone",
            component: "/views/patrolResult/antiDrone/index.vue"
        },]
    },
    {
        alwaysShow: true,
        icon: "el-icon-my-robot",
        label: "智能联动",
        path: "historyData",
        component: "/views/Parent.vue",
        children: [{
            alwaysShow: true,
            label: "联动列表",
            path: "linkList",
            component: "/views/historyData/linkList/index.vue"
        }
        ]
    },
    {
        alwaysShow: true,
        icon: "el-icon-my-robot",
        label: "设备管理",
        path: "equipmentManage",
        component: "/views/Parent.vue",
        children: [{
            alwaysShow: true,
            label: "主设备管理",
            path: "main",
            component: "/views/equipmentManage/mainManage/index.vue"
        }, {
            alwaysShow: true,
            label: "传感器管理",
            path: "sensor",
            component: "/views/equipmentManage/sensor/index.vue"
        }, {
            alwaysShow: true,
            label: "设备平面图 ",
            path: "equipmentPlan",
            component: "/views/equipmentManage/equipmentPlan/index.vue"
        },]
    },
    {
        alwaysShow: true,
        icon: "el-icon-my-robot",
        label: "数据分析",
        path: "dataAnalyse",
        component: "/views/Parent.vue",
        children: [{
            alwaysShow: true,
            label: "告警分析",
            path: "warnAnalyse",
            component: "/views/dataAnalyse/index.vue"
        },]
    },
    {
        alwaysShow: true,
        icon: "el-icon-my-robot",
        label: "系统设置",
        path: "systemManage",
        component: "/views/Parent.vue",
        children: [{
            alwaysShow: true,
            label: "系统设置",
            path: "system",
            component: "/views/system/index.vue"
        }, {
            alwaysShow: false,
            hidden: true,
            label: "站点设置",
            path: "site",
            component: "/views/system/pages/site/index.vue"
        }, {
            alwaysShow: true,
            hidden: true,
            label: "区域设置",
            path: "area",
            component: "/views/system/pages/area/index.vue"
        }, {
            alwaysShow: true,
            hidden: true,
            label: "点位设置",
            path: "point",
            component: "/views/system/pages/point/index.vue"
        }, {
            alwaysShow: true,
            hidden: true,
            label: "对时设置",
            path: "time",
            component: "/views/system/pages/time/index.vue"
        }, {
            alwaysShow: true,
            hidden: true,
            label: "告警管理",
            path: "alarm",
            component: "/views/system/pages/alarm/index.vue"
        }, {
            alwaysShow: true,
            hidden: true,
            label: "告警设置",
            path: "alarm-setting",
            component: "/views/system/pages/alarm-setting/index.vue"
        }, {
            alwaysShow: true,
            hidden: true,
            label: "告警设置详情",
            path: "alarm-detail",
            component: "/views/system/pages/alarm-detail/index.vue"
        }, {
            alwaysShow: true,
            hidden: true,
            label: "联动设置",
            path: "linkage",
            component: "/views/system/pages/linkage/index.vue"
        }, {
            alwaysShow: true,
            hidden: true,
            label: "其他设置",
            path: "other-setting",
            component: "/views/system/pages/other-setting/index.vue"
        }, {
            alwaysShow: true,
            hidden: true,
            label: "数据导出",
            path: "export",
            component: "/views/system/pages/data-export/index.vue"
        },]
    },
    {
        alwaysShow: true,
        icon: "el-icon-my-robot",
        label: "权限管理",
        path: "authManage",
        component: "/views/Parent.vue",
        children: [{
            alwaysShow: true,
            label: "用户管理",
            path: "userManage",
            component: "/views/authManage/userManage/index.vue"
        }, {
            alwaysShow: true,
            label: "角色管理",
            path: "roleManage",
            component: "/views/authManage/roleManage/index.vue"
        }, {
            alwaysShow: true,
            label: "日志查询",
            path: "logManage",
            component: "/views/authManage/logManage/index.vue"
        },]
    }
]
