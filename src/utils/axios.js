import axios from "axios";
import { Toast } from "zarm";
const MODE = import.meta.env.MODE; // 环境变量

axios.defaults.baseURL = MODE == 'development' ? 'http://127.0.0.1:8066' : 'http://116.204.107.20:8066'
axios.defaults.withCredentials = true; //允许跨域请求携带cookie
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest"; //设置请求头 为了让后端知道是ajax请求 从而不跳转登录页面 也不会报错 也可以不设置 但是后端要做处理 例如设置响应头 Access-Control-Allow-Origin 为* 但是这样会有安全隐患 会导致跨域请求伪造 从而导致安全问题 所以最好还是设置请求头 X-Requested-With 为 XMLHttpRequest 从而让后端知道是ajax请求 
axios.defaults.headers["Authorization"] = `${localStorage.getItem("token") || null}`; // 从本地存储中获取token
axios.defaults.headers.post["Content-Type"] = "application/json"; // 设置请求头为json格式
// X-Requested-With: XMLHttpRequest是给服务器用的，用于区别 AJAX 请求(异步)还是普通（同步）的请求（一般指表单提交）的
// x-requested-with 赋予 ‘XMLHttpRequest’ 值表示这是一个ajax请求，而如果值为null的话 表示一个普通的请求，服务器用来检测是否为异步 
// 如果服务器没做任何针对的反馈那么都一样。

axios.interceptors.response.use(res => {
    if(typeof res.data !== 'object') { // 服务端异常
        Toast.show('服务端异常！')
        return Promise.reject(res)
    }
    if(res.data.code != 200) { // 服务端返回的状态码不是200
        if(res.data.msg) Toast.show(res.data.msg)
        if(res.data.code == 401) { // 未登录
            window.location.href = '/login'
        }
        if(res.data.code == 413) { // 图片不得超过 50kb
            Toast.show('图片不得超过 50kb')
        }
        return Promise.reject(res.data) // 返回错误信息
    }
    return res.data // 返回正确信息
});

export default axios;