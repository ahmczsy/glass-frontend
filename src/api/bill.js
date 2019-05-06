import request from '@/utils/request'

export function createByExcel(formData) {
  return request({
    url: '/bill/createByExcel',
    method: 'post',
    data: formData
  })
}

export function findAll(data) {
  return request({
    url: '/bill/findAll',
    method: 'post',
    data: data
  })
}

export function findDetailByBillId(param) {
  return request({
    url: '/bill/findDetailByBillId',
    method: 'get',
    params: param
  })
}
