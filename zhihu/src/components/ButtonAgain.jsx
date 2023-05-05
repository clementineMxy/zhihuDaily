import React, { useState } from "react";
import { Button } from 'antd-mobile';

// 向服务器发请求，loading效果出现到消失的<Button>按钮
// 异步操作中的一种函数防抖，避免重复点击提交请求
// 使用：调用<ButtonAgain>不用传递loading属性
const ButtonAgain = function ButtonAgain(props) {
    /* 将其他页面调用<ButtonAgain>传递的props传递给<Button> */
    let options = { ...props };
    let { children, onClick: handle } = options;
    delete options.children;

    /* 状态 */
    let [loading, setLoading] = useState(false);
    const clickHandle = async () => {
        setLoading(true);
        //try catch包裹，失败也不会阻塞下面代码执行
        try {
            await handle();
        } catch (_) { }
        setLoading(false);
    };
    // 有点击事件回调再绑定
    if (handle) {
        options.onClick = clickHandle;
    }

    return <Button {...options} loading={loading}>
        {children}
    </Button>;
};
export default ButtonAgain;