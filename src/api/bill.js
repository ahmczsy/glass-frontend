import request from '@/utils/request'
import fileService from '@/utils/file-request'

export function createByExcel(formData) {
  return request({
    url: '/bill/createByExcel',
    method: 'post',
    data: formData
  })
}

export function createByManual(formData) {
  return request({
    url: '/bill/createByManual',
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

export function downloadBillExcel(param) {
  return fileService({
    url: '/bill/downloadBillExcel',
    method: 'get',
    params: param,
    responseType: 'arraybuffer'
  })
}
