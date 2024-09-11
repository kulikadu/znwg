/*
 * @Author: wangyilin
 * @Date: 2024-09-05 08:49:05
 * @LastEditors: wangyilin
 * @LastEditTime: 2024-09-11 13:55:57
 *
 */
//原始格点数据，参数：time=6,elementId=1
export const getSourceUrl = 'http://10.111.101.243:8083/znwg-api/grid/gridElementData'

//查询要素可用时间，参数：elementId=1
export const getSourceTimeUrl = 'http://10.111.101.243:8083/znwg-api/grid/ElementData'

//要素订正更新地址
export const getUpdateUrl = 'http://10.111.101.243:8083/znwg-api/grid/gridupdates'
//fetch的get请求
export const fetchGet = (url: string, params: string) => {
  return new Promise((resolve, reject) => {
    fetch(url + params)
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err))
  })
}

//fetch的post请求
export const fetchPost = (url: string, params: any) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err))
  })
}
