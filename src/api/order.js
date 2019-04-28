import request from '@/utils/request'

export function getOrderList(params) {
  return request({
    url: '/order/findall',
    method: 'get',
    params
  })
}
