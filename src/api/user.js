import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取微信unionid
 * @export
 * @param {*} data
 * @returns
 */
export function getUnionid(data) {
  return request.get('/unionid', { params: data })
}

/**
 * 获取微信uuid状态
 * @export
 * @param {*} data
 * @returns
 */
export function getUUid(data) {
  return request.get('/uuid', { params: data })
}

/**
 * 绑定unionid
 * @export
 * @param {*} data
 * @returns
 */
export function bindUnionid(data) {
  return request.post('/bind_unionid', qs.stringify(data))
}

/**
 * 通过uuid存放unionid
 * @export
 * @param {*} data
 * @returns
 */
export function addUnionid(data) {
  return request.post('/unionid/add', qs.stringify(data))
}

/**
 * 登录
 * @export
 * @param {*} data
 * @returns
 */
export function login(data) {
  return request.post('/login', qs.stringify(data))
}
