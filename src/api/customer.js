import request from '@/utils/request'

export function getCustomerList(params) {
  return request({
    url: '/customer/findall',
    method: 'get',
    params
  })
}

