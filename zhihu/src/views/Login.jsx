import React, { useState, useEffect } from 'react';
import { Form, Input, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import action from '../store/action';
import './Login.less';
import ButtonAgain from '../components/ButtonAgain';
import NavBarAgain from '../components/NavBarAgain';
import api from '../api';
import _ from '../assets/utils';

/* 自定义表单校验规则 */
const validate = {
    phone(_, value) {
        value = value.trim();
        let reg = /^(?:(?:\+|00)86)?1\d{10}$/;
        if (value.length === 0) return Promise.reject(new Error('手机号是必填项!'));
        if (!reg.test(value)) return Promise.reject(new Error('手机号格式有误!'));
        return Promise.resolve();
    },
    code(_, value) {
        value = value.trim();
        let reg = /^\d{6}$/;
        if (value.length === 0) return Promise.reject(new Error('验证码是必填项!'));
        if (!reg.test(value)) return Promise.reject(new Error('验证码格式有误!'));
        return Promise.resolve();
    }
};

const Login = function Login(props) {
    let { queryUserInfoAsync, navigate, usp } = props;

    /* 状态 */
    // 取出表单DOM元素
    const [formIns] = Form.useForm(),
        [disabled, setDisabled] = useState(false),
        [sendText, setSendText] = useState('发送验证码');

    /* 表单提交 */
    // 表单校验并向服务器请求验证码
    const submit = async () => {
        try {
            await formIns.validateFields();
            let { phone, code } = formIns.getFieldsValue();
            // code同名报错，重命名为codeHttp
            let { code: codeHttp, token } = await api.login(phone, code);
            if (+codeHttp !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: '登录失败'
                });
                // 清空验证码域
                formIns.resetFields(['code']);
                return;
            }
            // 登录成功:存储Token、存储登录者信息到redux、提示、跳转
            _.storage.set('tk', token);
            await queryUserInfoAsync(); //派发任务,同步redux中的状态信息
            Toast.show({
                icon: 'success',
                content: '登录/注册成功'
            });
            let to = usp.get('to');
            to ? navigate(to, { replace: true }) : navigate(-1);
        } catch (_) { }
    };

    /* 发送验证码 */
    let timer = null,
        num = 31;
    const countdown = () => {
        num--;
        if (num === 0) {
            clearInterval(timer);
            timer = null;
            setSendText(`发送验证码`);
            setDisabled(false);
            return;
        }
        setSendText(`${num}秒后重发`);
    };
    const send = async () => {
        try {
            // validateFields参数是name字段值的数组
            await formIns.validateFields(['phone']);
            let phone = formIns.getFieldValue('phone');
            let { code } = await api.sendPhoneCode(phone);
            // code不为0，请求验证码失败
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: '发送失败'
                });
                return;
            }
            // 发送成功 
            setDisabled(true);
            countdown();
            if (!timer) timer = setInterval(countdown, 1000);
        } catch (_) { }
    };
    // 组件销毁的时候:把没有清除的定时器干掉
    useEffect(() => {
        return () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }
    }, []);

    return <div className='login-box'>
        <NavBarAgain title="登录/注册" />
        <Form
            layout='horizontal'
            style={{ '--border-top': 'none' }}
            footer={
                <ButtonAgain color='primary'
                    onClick={submit}>
                    提交
                </ButtonAgain>
            }
            // 为了实现ButtonAgain的loading，不使用Form的onFinish事件回调，也不能设置Button的htmlType(原生的type)值为submit
            // onFinish={submit}
            form={formIns}
            initialValues={{ phone: '', code: '' }}
        >
            <Form.Item name='phone' label='手机号' rules={[{ validator: validate.phone }]}>
                <Input placeholder='请输入手机号' />
            </Form.Item>

            <Form.Item name='code' label='验证码'
                rules={[{ validator: validate.code }]}
                // 另一种写法
                // 要在整个表单Form标签上加requiredMarkStyle={false} 去掉必填项前面的*
                // rules={[
                //     {required:true, message: '验证码是必填项'},
                //     {pattern: /^d{6}$/, message: '验证码格式错误'}
                // ]}

                // extra指定表单右侧内容
                extra={
                    <ButtonAgain size='small' color='primary'
                        disabled={disabled}
                        onClick={send}>
                        {sendText}
                    </ButtonAgain>
                }
            >
                <Input />
            </Form.Item>
        </Form>
    </div>;
};

// action.base的值是baseAction对象，包含queryUserInfoAsync和clearUserInfo两个方法
// queryUserInfoAsync和clearUserInfo都在Login组件的props中
export default connect(
    null,
    action.base
)(Login);