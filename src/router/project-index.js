const ProjectIndex = () => import('../pages/project-index/ProjectIndex.vue');
const Overview = () => import('../pages/project-index/overview/Overview.vue');
const Application = () => import('../pages/project-index/overview/monitor/application/Application.vue');
const Server = () => import('../pages/project-index/overview/monitor/server/Server.vue')
const Tendency = () => import('../pages/project-index/overview/tendency/Tendency.vue')
const Database = () => import('../pages/project-index/overview/monitor/database/Database.vue')
const ErrorLog = () => import('../pages/project-index/overview/service-log/error-log/ErrorLog.vue')
const SlowLog = () => import('../pages/project-index/overview/service-log/slow-log/SlowLog.vue')
const SmartDevice = () => import('../pages/project-index/overview/monitor/smartdevice/SmartDevice.vue')
const WarningEvent =() => import('../pages/project-index/overview/warning/warning-event/WarningEvent.vue')
const WarningLog =() => import('../pages/project-index/overview/warning/warning-log/WarningLog.vue')
const Property =() => import('../pages/sys-manage/property/Property.vue')
const WarningTrigger = () => import('../pages/sys-manage/warning-trigger/WarningTrigger.vue')
const RoleManagement = () => import("../pages/sys-manage/role-management/RoleManagement.vue")
const UserManagement = () => import('../pages/sys-manage/user-management/UserManagement.vue')
const NotificationManagement = () => import("../pages/sys-manage/notification-management/NotificationManagement.vue")
const NotificationSetting = () => import("../pages/sys-manage/notification-setting/NotificationSetting.vue")
const OperationLog = () => import("../pages/sys-manage/operation-log/OperationLog.vue")
const ProjectManagement = () => import("../pages/sys-manage/project-management/ProjectManagement.vue")
const Notfound = () => import("../pages/notfound/Notfound.vue")
export default [
  {
    path: '/project-index/:id',
    component: ProjectIndex,
    children: [
      {
        path:'',
        redirect:'overview'
      },
      {
        path: 'overview',
        component: Overview
      },
      {
        path: 'application',
        component: Application
      },
      {
        path:'server/:serverId',
        component:Server
      },
      {
        path:'tendency',
        component:Tendency
      },
      {
        path:'database/:databaseId',
        component:Database
      },
      {
        path:'errorLog',
        component:ErrorLog
      },
      {
        path:'slowlog',
        component:SlowLog
      },
      {
        path:'smartdevice',
        component:SmartDevice
      },
      {
        path:'warningevent',
        component:WarningEvent
      },
      {
        path:'warninglog',
        component:WarningLog
      },
      {
        path:'/property',
        component:Property
      },
      {
        path:'/warningtrigger',
        component:WarningTrigger
      },
      {
        path:'/rolemanagement',
        component:RoleManagement
      },
      {
        path:'/usermanagement',
        component:UserManagement
      },
      {
        path:'/notification',
        component:NotificationManagement
      },
      {
        path:'/notificationsetting',
        component:NotificationSetting
      },
      {
        path:'/operationlog',
        component:OperationLog
      },
      {
        path:'/projectmanagement',
        component:ProjectManagement
      },
      {
        path:'/notfound',
        component:Notfound
      }
    ]
  }
]
