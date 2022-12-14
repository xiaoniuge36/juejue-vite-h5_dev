import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'zarm'
import 'lib-flexible/flexible' //移动端适配/大屏幕适配
import './index.less'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   // 严格模式开发环境会执行两次
//   <React.StrictMode>
//     <ConfigProvider primaryColor={'#007fff'}>
//     <BrowserRouter>
//     <App />
//     </BrowserRouter>
//     </ConfigProvider> 
//   </React.StrictMode>
// )

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider primaryColor={'#007fff'}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
