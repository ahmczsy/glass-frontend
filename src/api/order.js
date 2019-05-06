import request from '@/utils/request'

export function getOrderList(params) {
  return request({
    url: '/order/findAll',
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
    url: '/orderDetail/findByOrderId',
    method: 'get',
    params
  })
}

export function detailExcelInput(formData) {
  return request({
    url: '/orderDetail/excelInput',
    method: 'post',
    data: formData
  })
}

