import React, { useEffect, useRef, useState } from 'react';
import { Icon, Progress } from 'zarm';
import cx from 'classnames';
import dayjs from 'dayjs';
import { get, typeMap } from '@/utils';
import CustomIcon from '@/components/CustomIcon';
import PopupDate from '@/components/PopupDate';
import s from './style.module.less';

let proportionChart = null;

function Data() {
  const monthRef = useRef(); // 月份选择器的 ref
  const [totalType, setTotalType] = useState('expense'); // 总收支类型
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM')); // 当前月份
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [expenseData, setExpenseData] = useState([]); // 支出数据
  const [incomeData, setIncomeData] = useState([]); // 收入数据
  const [pieType, setPieType] = useState('expense'); // 饼图类型

  useEffect(() => {
    getData(); // 获取数据
    return () => {
      // 每次组件卸载的时候，需要释放图表实例。clear 只是将其清空不会释放。
      proportionChart.dispose();
    };
  }, [currentMonth]); //currentMonth变化时重新获取数据

  const getData = async () => {
    const { data } = await get(`/api/bill/data?date=${currentMonth}`);
    // 总收支
    setTotalExpense(data.total_expense); // 总支出
    setTotalIncome(data.total_expense); // 总收入
    // 过滤支出和收入
    const expense_data = data.total_data.filter(item => item.pay_type == 1).sort((a, b) => b.number - a.number); // 过滤出账单类型为支出的项 并按照金额从大到小排序
    const income_data = data.total_data.filter(item => item.pay_type == 2).sort((a, b) => b.number - a.number); // 过滤出账单类型为收入的项 并按照金额从大到小排序
    setExpenseData(expense_data); // 设置支出数据
    setIncomeData(income_data); // 设置收入数据
    // 设置饼图数据
    setPieChart(pieType == 'expense' ? expense_data : income_data); // 设置饼图数据
  };

  // 切换收支构成类型
  const changeTotalType = (type) => {
    setTotalType(type)
  }

  // 切换饼图类型
  const changePieType = (type) => {
    setPieType(type);
    setPieChart(type == 'expense' ? expenseData : incomeData); // 设置饼图数据
  }

  // 绘制饼图
  const setPieChart = (data) => {
    if (window.echarts) { // 防止echarts未加载完成
      proportionChart = echarts.init(document.getElementById('proportion')); // 初始化饼图实例
      proportionChart.setOption({ // 设置饼图配置
        tooltip: { // 鼠标悬浮提示框
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: { // 图例
          data: data.map(item => item.type_name)
        },
        series: [
          {
            name: '支出',
            type: 'pie',
            radius: '55%',
            data: data.map(item => {
              return {
                value: item.number,
                name: item.type_name
              }
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }

  // 月份弹窗开关
  const monthShow = () => {
    monthRef.current && monthRef.current.show()
  }

  // 月份选择回调
  const selectMonth = (item) => {
    setCurrentMonth(item)
  }

  return (
    <div className={s.data} >
      <div className={s.total}>
        <div className={s.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon className={s.date} type="date" />
        </div>
        <div className={s.title}>共支出</div>
        <div className={s.expense}>¥{totalExpense}</div>
        <div className={s.income}>共收入¥{totalIncome}</div>
      </div>
      <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span onClick={() => changeTotalType('expense')} className={cx({ [s.expense]: true, [s.active]: totalType == 'expense' })}>支出</span>
            <span onClick={() => changeTotalType('income')} className={cx({ [s.income]: true, [s.active]: totalType == 'income' })}>收入</span>
          </div>
        </div>
        <div className={s.content}>
        {
          (totalType == 'expense' ? expenseData : incomeData).map(item => <div key={item.type_id} className={s.item}>
            <div className={s.left}>
              <div className={s.type}>
                <span className={cx({ [s.expense]: totalType == 'expense', [s.income]: totalType == 'income' })}>
                  <CustomIcon
                    type={item.type_id ? typeMap[item.type_id].icon : 1}
                  />
                </span>
                <span className={s.name}>{ item.type_name }</span>
              </div>
              <div className={s.progress}>¥{ Number(item.number).toFixed(2) || 0 }</div>
            </div>
            <div className={s.right}>
              <div className={s.percent}>
                <Progress
                  shape="line"
                  percent={Number((item.number / Number(totalType == 'expense' ? totalExpense : totalIncome)) * 100).toFixed(2)}
                  theme='primary'
                />
              </div>
            </div>
          </div>)
        }
        </div>
        <div className={s.proportion}>
          <div className={s.head}>
            <span className={s.title}>收支构成</span>
            <div className={s.tab}>
              <span onClick={() => changePieType('expense')} className={cx({ [s.expense]: true, [s.active]: pieType == 'expense' })}>支出</span>
              <span onClick={() => changePieType('income')} className={cx({ [s.income]: true, [s.active]: pieType == 'income' })}>收入</span>
            </div>
          </div>
          <div id="proportion"></div>
        </div>
      </div>
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    </div>
  )
}

export default Data;