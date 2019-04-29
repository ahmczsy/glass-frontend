import request from '@/utils/request'

export function getOrderList(params) {
  return request({
    url: '/order/findall',
    method: 'get',
    params
  })
}

export function createOrder(params) {
  return request({
    url: '/order/create',
    method: 'post',
    data: params
  })
}
export function getDetail(params) {
  return request({
    url: '/orderdetail/findorderdetailbyorderid',
    method: 'get',
    params
  })
}

