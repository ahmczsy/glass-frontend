import request from '@/utils/request'

export function createByExcel(formData) {
  return request({
    url: '/bill/createbyexcel',
    method: 'post',
    data: formData
  })
}

export function findAll(data) {
  return request({
    url: '/bill/findall',
    method: 'post',
    data: data
  })
}

export function findDetailByBillId(param) {
  return request({
    url: '/bill/finddetailbybillid',
    method: 'get',
    params: param
  })
}
