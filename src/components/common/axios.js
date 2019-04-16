import axios from 'axios'
import Qs from 'qs'

let loginUrl='http://192.168.2.106:8080'
let self = this
axios.defaults.withCredentials=true
const instance =  axios.create({
  headers: {'Authorization': 'Basic Y2hlbmh1YW5faG9tZV9wYzpjaGVuaHVhbl9zZWNyZXQ='},
  // 192.168.2.203:6080 http://localhost:8878/taskCollectionCenterWeb/
  // prefix前缀 http://192.168.3.206:8008/client_lg/ http://192.168.3.206:8008/client_lg/
  baseURL: loginUrl,
  transformRequest: [function (data) {
  // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）

      return data;
  }],
  transformResponse: [function (data) {

      // let comfirm_code = JSON.parse(data)
      // if(data && comfirm_code.code ){

      //   if(comfirm_code.code ==='1000'||comfirm_code.code ===1000) {
      //     Bus.$emit('errMessage', comfirm_code)
      //   }
      // }
      return data
    }]
})

export default instance
