import request from '@/utils/request'
import qs from 'qs'
const api = {
  SearchOrder: '/smUserManage/getDataPersonal',
  ExportOrder: '/smUserManage/excelExport',
  // role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

export function SearchOrder (parameter) {
  return request({
    url: api.SearchOrder,
    method: 'post',
    data: qs.stringify(parameter)
  })
}
// export function getRoleList (parameter) {
//   return request({
//     url: api.role,
//     method: 'get',
//     params: parameter
//   })
// }
export function ExportOrder (parameter) {
  return request({
    url: api.ExportOrder,
    method: 'get',
    params: parameter,
    responseType: 'blob'
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}
