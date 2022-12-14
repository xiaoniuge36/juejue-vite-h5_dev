// App.jsx
import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from "react-router-dom"
import routes from '@/router'
import 'zarm/dist/zarm.css'
import NavBar from '@/components/NavBar'

function App() { //更新
    const location = useLocation();
    const { pathname } = location // 获取当前路径
    const needNav = ['/', '/data', '/user'] // 需要底部导航栏的路径
    const [showNav, setShowNav] = useState(false) // 是否展示 Nav
    useEffect(() => {
        setShowNav(needNav.includes(pathname))
    }, [pathname]) // [] 内的参数若是变化，便会执行上述回调函数
    return <>
        <Routes>
            {routes.map(route => <Route key={route.path} path={route.path} element={<route.component />} />)}
        </Routes>
        <NavBar showNav={showNav} />
    </>
}

export default App