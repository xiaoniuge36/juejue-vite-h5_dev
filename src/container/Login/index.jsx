import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Cell, Input, Button, Checkbox, Toast } from 'zarm'
import s from './style.module.less'
import cx from 'classnames';
import Captcha from "react-captcha-code";
import CustomIcon from '@/components/CustomIcon'
import { post } from '@/utils'

function Login() {
  const captchaRef = useRef(); // 获取验证码 ref
  const [type, setType] = useState('login'); // 登录注册类型
  const [captcha, setCaptcha] = useState(''); // 验证码变化后存储值
  const [username, setUsername] = useState(''); // 账号
  const [password, setPassword] = useState(''); // 密码
  const [verify, setVerify] = useState(''); // 验证码
  const [check, setCheck] = useState(false); // 选中状态
  //  验证码变化，回调方法
  const handleChange = useCallback((captcha) => {
    setCaptcha(captcha)
  }, []);

  //表单提交方法
  const onSubmit = async () => {
    //校验
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }
    //调用接口
    try {
      if (type == 'login') {
        const { data } = await post('/api/user/login', {
          username,
          password
        });
        console.log('data', data);
        //退出登录优化
        window.location.href = '/'
        localStorage.setItem('token', data.token);
        //这里之所以用 window.location.href 的原因是，utils/axios.js 内部需要再次被执行，才能通过 localStorage.getItem 拿到最新的 token。如果只是用 navigateTo 跳转页面的话，页面是不会被刷新，那么 axios.js 的 token 就无法设置。
      } else {
        if (!verify) {
          Toast.show('请输入验证码')
          return
        };
        if (verify != captcha) {
          Toast.show('验证码错误')
          return
        };
        if (!check) {
          Toast.show('请勾选协议')
          return
        };
        const { data } = await post('/api/user/register', {
          username,
          password
        });
        Toast.show('注册成功');
        setType('login'); //切换到登录
      }
    } catch (err) {
      Toast.show(err.msg);
    }
  };

  useEffect(() => {
    document.title = type == 'login' ? '登录' : '注册';
  }, [type])

  return (
    <div className={s.auth}>
      <div className={s.head} />
      <div className={s.tab}>
        <span className={cx({ [s.active]: type == 'login' })} onClick={() => setType('login')}>登录</span>
        <span className={cx({ [s.active]: type == 'register' })} onClick={() => setType('register')}>注册</span>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(value) => setUsername(value)}
          />
        </Cell>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={(value) => setPassword(value)}
          />
        </Cell>
        {
          type == 'register' ? <Cell icon={<CustomIcon type="mima" />}>
            <Input
              clearable
              type="text"
              placeholder="请输入验证码"
              onChange={(value) => setVerify(value)}
            />
            <Captcha ref={captchaRef} charNum={4} onChange={handleChange} />
          </Cell> : null
        }
      </div>
      <div className={s.operation}>
        {
          type == 'register' ? <div className={s.agree}>
            <Checkbox onChange={() => setCheck(!check)} />
            <label className="text-light">阅读并同意<a>《掘掘手札条款》</a></label>
          </div> : null
        }
        <Button onClick={onSubmit} block theme="primary">{type == 'login' ? '登录' : '注册'}</Button>
      </div>
    </div>
  )
};

export default Login;
