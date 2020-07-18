import Mock from 'mockjs2'
import { builder } from '../util'

const info = (options) => {
  console.log('options', options)
  const userInfo = {

  }
  // role
  userInfo.role = {
    'permissions': [{
      'permissionId': 'dashboard',
      'permissionName': '仪表盘'
    }, {
      'permissionId': 'exception',
      'permissionName': '异常页面权限'
    }, {
      'permissionId': 'result',
      'permissionName': '结果权限'
    }, {
      'permissionId': 'table',
      'permissionName': '表格权限'
    }, {
      'permissionId': 'support',
      'permissionName': '超级模块'
    }, {
      'permissionId': 'form'
    }
    ]
  }
  return builder(userInfo)
}

Mock.mock(/\/api\/user\/info/, 'get', info)
