import React, { useState, useEffect,useRef } from 'react';
import { Icon, Pull } from 'zarm';
import dayjs from 'dayjs'; // 日期处理
import s from './style.module.less';
import BillItem from '@/components/BillItem';
import Empty from '@/components/Empty';
import PopupType from '@/components/PopupType';
import PopupDate from '@/components/PopupDate';
import { get, REFRESH_STATE, LOAD_STATE } from '@/utils';  //pull组件的下拉刷新
import CustomIcon from '@/components/CustomIcon';
import PopupAddBill from '@/components/PopupAddBill';

function Home() {
  const typeRef = useRef(); // 账单类型 ref 调用子组件的方法
  const monthRef = useRef(); // 月份筛选 ref
  const addRef = useRef(); // 添加账单 ref
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [currentSelect, setCurrentSelect] = useState({}); // 当前筛选类型
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM')); // 当前筛选时间
  const [page, setPage] = useState(1); // 分页
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [list, setList] = useState([]); // 账单列表

  // 初始化
  useEffect(() => {
    getBillList() // 初始化
  }, [page, currentSelect, currentTime]) // 依赖项 依赖于page, currentSelect, currentTime变化时，执行getBillList

  const getBillList = async () => {
    const { data } = await get(`/api/bill/list?date=${currentTime}&type_id=${currentSelect.id || 'all'}&page=${page}&page_size=5`);
    // 下拉刷新 重置数据
    if (page === 1) { // page === 1 时，重置数据
      setList(data.list); // 重置数据
    } else {
      setList(list.concat(data.list)); // 合并数据
    }
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
    setTotalPage(data.totalPage);
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    // 下拉加载
    setRefreshing(REFRESH_STATE.success);
  }

  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading); // 下拉刷新状态
    if (page != 1) { // page != 1 时，重置page
      setPage(1); // 重置page 回到第一页
    } else {
      getBillList(); // 请求数据
    };
  };

  // 加载data
  const loadData = () => {
    if (page < totalPage) { // page < totalPage 时，page++
      setLoading(LOAD_STATE.loading); // 上滑加载状态
      setPage(page + 1); // page++ 请求下一页数据
    }
  };

  // 添加账单弹窗
  const toggle = () => {
    typeRef.current && typeRef.current.show()
  };
  // 选择月份弹窗
  const monthToggle = () => {
    monthRef.current && monthRef.current.show()
  };
  // 添加账单弹窗
  const addToggle = () => {
    addRef.current && addRef.current.show()
  }

  // 筛选类型
  const select = (item) => {
    console.log(item)
    setRefreshing(REFRESH_STATE.loading);
    setPage(1); //页码重置
    setCurrentSelect(item); //改变后再请求接口
  }
  // 筛选月份
  const selectMonth = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item);
  }

  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.dataWrap}>
          <div className={s.in} >总收入：<b>¥ {totalExpense}</b></div>
          <div className={s.out} >总支出：<b>¥ {totalIncome}</b></div>
        </div>
        <div className={s.typeWrap}>
          <div className={s.left} onClick={toggle} >
            <span>{currentSelect.name || '全部类型'}<Icon className={s.arrow} type="arrow-bottom" /></span>
          </div>
          <div className={s.right} onClick={monthToggle} >
            <span>{currentTime}<Icon className={s.arrow} type="arrow-bottom" /></span>
          </div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {
          list.length ? <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData
            }}
          >
            {
              list.map((item, index) => <BillItem
                bill={item}
                key={index}
              />)
            }
          </Pull> : <Empty />
        }
      </div>
      <div className={s.add} onClick={addToggle}><CustomIcon type='tianjia' /></div>
      <PopupType ref={typeRef} onSelect={select} /> {/* 筛选类型弹窗 */}
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} /> {/* 筛选月份弹窗 */}
      <PopupAddBill ref={addRef} onReload={refreshData} /> {/* 弹窗添加账单 */}
    </div>
  )
};

export default Home;
