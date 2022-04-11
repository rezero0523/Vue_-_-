import request from '@/utils/request'

export function login(data) {
  console.log('这是api里面的data',data);
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    // contentType:"application/json",
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
