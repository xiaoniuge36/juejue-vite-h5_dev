import React, { useEffect, useRef, useState } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Toast } from 'zarm';
import qs from 'query-string'; //qs.parse(location.search) 用于解析url中的参数 例如：http://localhost:3000/detail?id=1 会解析出id=1 
import cx from 'classnames';
import dayjs from 'dayjs';
import Header from '@/components/Header';
import CustomIcon from '@/components/CustomIcon';
import PopupAddBill from '@/components/PopupAddBill'
import { get, post, typeMap } from '@/utils';

import s from './style.module.less'

const Detail = () => {
  const addRef = useRef(); // 新增账单弹窗
  const location = useLocation(); // 获取路由信息
  const navigateTo = useNavigate(); // 路由跳转
  const { id } = qs.parse(location.search); // 获取路由参数
  const [detail, setDetail] = useState({}); // 账单详情
  
  useEffect(() => { // 初始化
    getDetail();
  }, []);

  const getDetail = async () => { // 获取账单详情
    const { data } = await get(`/api/bill/detail?id=${id}`); // 获取账单详情
    setDetail(data); // 设置账单详情
  }

  // 删除方法
  const deleteDetail = () => { // 删除账单
    Modal.confirm({ // 弹窗确认
      title: '删除', // 弹窗标题
      content: '确认删除账单？',
      onOk: async () => { // 确认删除
        const { data } = await post('/api/bill/delete', { id }) // 删除账单
        Toast.show('删除成功') // 提示删除成功
        navigateTo(-1) // 返回上一页
      },
    });
  }

  // 打开编辑弹窗方法
  const openModal = () => { // 打开编辑弹窗
    addRef.current && addRef.current.show() // 打开弹窗
  }

  return <div className={s.detail}>
    <Header title='账单详情' />
    <div className={s.card}>
      <div className={s.type}>
        <span className={cx({ [s.expense]: detail.pay_type == 1, [s.income]: detail.pay_type == 2 })}>
          <CustomIcon className={s.iconfont} type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
        </span>
        <span>{ detail.type_name || '' }</span>
      </div>
      {
        detail.pay_type == 1
          ? <div className={cx(s.amount, s.expense)}>-{ detail.amount }</div>
          : <div className={cx(s.amount, s.incom)}>+{ detail.amount }</div>
      }
      <div className={s.info}>
        <div className={s.time}>
          <span>记录时间</span>
          <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
        </div>
        <div className={s.remark}>
          <span>备注</span>
          <span>{ detail.remark || '-' }</span>
        </div>
      </div>
      <div className={s.operation}>
        <span onClick={deleteDetail}><CustomIcon type='shanchu' />删除</span>
        <span onClick={openModal}><CustomIcon type='tianjia' />编辑</span>
      </div>
    </div>
    <PopupAddBill ref={addRef} detail={detail} onReload={getDetail} />
  </div>
};

export default Detail;