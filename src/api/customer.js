import request from '@/utils/request'

export function getCustomerList(params) {
  return request({
    url: '/customer/findAll',
    method: 'get',
    params
  })
}

export function findByPage(params) {
  return request({
    url: '/customer/findByPage',
    method: 'post',
    data: params
  })
}
export function setTrueName(params) {
  return request({
    url: '/customer/setTrueName',
    method: 'post',
    data: params
  })
}

