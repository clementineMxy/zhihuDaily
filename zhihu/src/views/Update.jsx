import React, { useState } from "react";
import NavBarAgain from '../components/NavBarAgain';
import ButtonAgain from '../components/ButtonAgain';
import styled from "styled-components";
import { ImageUploader, Input, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import action from '../store/action';
import api from '../api';

/* 样式 */
const UpdateBox = styled.div`
    .formBox {
        padding: 30px;

        .item {
            display: flex;
            align-items: center;
            height: 110px;
            line-height: 110px;
            font-size: 28px;

            .label {
                width: 20%;
                text-align: center;
            }

            .input {
                width: 80%;
            }
        }
    }

    .submit {
        display: block;
        margin: 0 auto;
        width: 60%;
        height: 70px;
        font-size: 28px;
    }
`;

const Update = function Update(props) {
    let { info, queryUserInfoAsync, navigate } = props;
    /* 定义状态 */
    let [pic, setPic] = useState([{ url: info.pic }]),
        [username, setUserName] = useState(info.name);

    /* 图片上传 */
    const limitImage = (file) => {
        let limit = 1024 * 1024;
        if (file.size > limit) {
            Toast.show({
                icon: 'fail',
                content: '图片须在1MB内'
            });
            return null;
        }
        return file;
    };
    const uploadImage = async (file) => {
        let temp;
        try {
            let { code, pic } = await api.upload(file);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: '上传失败'
                });
                return;
            }
            temp = pic;
            setPic([{
                url: pic
            }]);
        } catch (_) { }
        // 必须返回一个Promise对象作为上传结果，这里一个包含url属性的对象
        return { url: temp };
    };

    /* 提交信息 */
    const submit = async () => {
        // 表单校验
        if (pic.length === 0) {
            Toast.show({
                icon: 'fail',
                content: '请先上传图片'
            });
            return;
        }
        if (username.trim() === "") {
            Toast.show({
                icon: 'fail',
                content: '请先输入账号'
            });
            return;
        }
        // 获取信息，发送请求
        let [{ url }] = pic;
        try {
            let { code } = await api.userUpdate(username.trim(), url);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: '修改信息失败'
                });
                return;
            }
            Toast.show({
                icon: 'success',
                content: '修改信息成功'
            });
            queryUserInfoAsync();//同步redux中的信息
            // 回到个人中心
            navigate(-1);
        } catch (_) { }
    };

    return <UpdateBox>
        <NavBarAgain title="修改信息" />
        <div className="formBox">
            <div className="item">
                <div className="label">头像</div>
                <div className="input">
                    {/* 如果上传多张图片，value的值是对象数组，每个对象为{url:"..."} */}
                    {/* maxCoun设定允许上传图片数量 */}
                    {/* onDelete删除已上传成功的图片时触发，如果返回false表示阻止删除，可以返回Promise */}
                    <ImageUploader
                        value={pic}
                        maxCount={1}
                        onDelete={() => {
                            setPic([]);
                        }}
                        beforeUpload={limitImage}
                        upload={uploadImage}
                    />
                </div>
            </div>
            <div className="item">
                <div className="label">姓名</div>
                <div className="input">
                    {/* 为了实现一进入就显示当前用户名，value需要绑定状态中用户名变量 */}
                    {/* 和原生input不同，onChange回调函数的参数不是事件源event，不能通过event.target.value获取 */}
                    {/* 官网中可以看到onChange回调函数的参数就是输入内容value */}
                    {/* 如果使用Form表单组件，如果绑定了状态，组件内部会自动赋值，并且会更新最新输入的内容 */}
                    <Input placeholder='请输入账号名称'
                        value={username}
                        onChange={val => {
                            setUserName(val);
                        }} />
                </div>
            </div>
            <ButtonAgain color='primary' className="submit"
                onClick={submit}>
                提交
            </ButtonAgain>
        </div>
    </UpdateBox>;
};
export default connect(
    state => state.base,
    action.base
)(Update);