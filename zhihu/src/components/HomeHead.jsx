import React, { useMemo, useEffect } from "react";
// 导入图片 使用时src={timg} 打包后img src直接是base64码
import timg from '../assets/images/timg.jpg';
import './HomeHead.less';
import { connect } from 'react-redux';
import action from '../store/action';
import { useNavigate } from 'react-router-dom';

const HomeHead = function HomeHead(props) {
    // 不是通过路由匹配的组件，我们没有将navigate封装进props
    const navigate = useNavigate();

    /* 计算时间中的月和日 */
    let { today, info, queryUserInfoAsync } = props;
    // useCallback缓存的是一个函数
    // useCallback第一个参数是一个回调函数，useCallback会缓存这个函数，返回缓存的回调函数
    // useCallback第二个参数是依赖项，只有当依赖项改变时，才会重新创建这个函数
    // 例子：向子组件传递一个函数，在父组件每次re-render的时候，函数会重新创建新的，这会导致使用这个函数的子组件也re-render，但这是不必要的，可以用useCallback来解决。
    // useMemo 缓存的是计算结果
    // useMemo 第一个参数是一个函数，返回值用于产生保存值。 
    // useMemo 第二个参数是一个数组，作为 dep 依赖项，数组里面的依赖项发生变化，重新执行第一个函数，产生新的值。
    // 例子：减少不必要的 DOM 循环，限定当且仅当items改变的时候才更新此items，避免items重新循环
    let time = useMemo(() => {
        let [, month, day] = today.match(/^\d{4}(\d{2})(\d{2})$/),
            area = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
        return {
            // 单元运算符 + 可以把数字字符串转换成数值
            month: area[+month] + '月',
            day
        };
    }, [today]);

    // 第一次渲染完:如果info中没有信息,我们尝试派发一次,获取到登陆者信息
    // queryUserInfoAsync是映射为props的dispatch一个action对象的函数，会更新state，触发组件更新，所以不需要强制更新
    useEffect(() => {
        if (!info) {
            queryUserInfoAsync();
        }
    }, []);

    return <header className="home-head-box">
        <div className="info">
            <div className="time">
                <span>{time.day}</span>
                <span>{time.month}</span>
            </div>
            <h2 className="title">知乎日报</h2>
        </div>

        <div className="picture"
            onClick={() => {
                navigate('/personal');
            }}>
                {/* jsx中img路径不能直接写相对地址，因为渲染完路径会改变 （但是css样式中使用图片可以写相对地址），解决方式之一是基于ES6Module模块方式导入图片*/}
            <img src={info ? info.pic : timg} alt="" />
        </div>
    </header>;
};
export default connect(
    state => state.base,
    // 一个对象，正好是{key:function}的形式，可以从props直接获取函数名
    action.base
)(HomeHead);