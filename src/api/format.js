import request from '@/utils/request'

export function create(formData) {
  return request({
    url: '/format/create',
    method: 'post',
    data: formData
  })
}

export function findAll(data) {
  return request({
    url: '/format/findAll',
    method: 'get',
    data: data
  })
}
