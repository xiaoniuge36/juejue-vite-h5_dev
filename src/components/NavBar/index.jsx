import React, { useState } from 'react';
import PropTypes from 'prop-types' //导入PropTypes
import { TabBar } from 'zarm'; //导入TabBar
import { useNavigate } from 'react-router-dom'; //导入useNavigate
import CustomIcon from '../CustomIcon'; //导入CustomIcon图标组件
import s from './style.module.less'; //导入样式
import { useEffect } from 'react';

function NavBar({ showNav }) {
    const [activeKey, setActiveKey] = useState('/'); //设置默认选中的TabBar
    const [fristin, setFirstin] = useState(0); //设置TabBar是否显示
    const navigateTo = useNavigate() //导航

    const chnageTab = (path) => {
        setActiveKey(path) //设置选中的TabBar
        navigateTo(path) //跳转到对应的路由
        if(path){
            setFirstin(1) //设置TabBar显示
        }
    }

    // useEffect(() => {
    //     console.log("useEffect");
    //     chnageTab('/') //设置TabBar是否显示
    // }, [])

    return (
        <TabBar visible={showNav} className={s.tab} activeKey={activeKey} onChange={chnageTab}>
            <TabBar.Item
                itemKey="/"
                title="账单"
                icon={<CustomIcon type="zhangdan" />}
            />
            <TabBar.Item
                itemKey="/data"
                title="统计"
                icon={<CustomIcon type="tongji" />}
            />
            <TabBar.Item
                itemKey="/user"
                title="我的"
                icon={<CustomIcon type="wode" />}
            />
        </TabBar>   
    );
};

//限制传入的参数类型
NavBar.propTypes = {
    showNav: PropTypes.bool
}

export default NavBar;